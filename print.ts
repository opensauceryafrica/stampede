interface PDFLib {
  PDFDocument: PDFDocument;
}

interface PDFDocument {
  load: (arrayBuffer: ArrayBuffer) => Promise<PDFDocument>;
  embedPng: (arrayBuffer: ArrayBuffer) => Promise<PDFImage>;
  getPages: () => PDFPage[];
  save: () => Promise<BlobPart>;
}

interface PDFPage {
  drawImage: (image: PDFImage, options: PDFImageOptions) => void;
  getSize: () => PDFSize;
}

interface PDFImage {
  width: number;
  height: number;
}

interface PDFImageOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PDFSize {
  width: number;
  height: number;
}

declare var PDFLib: PDFLib;

/** 
 * printPDF creates a stateful version of the PDF containing the stamp(s)
and downloads it
*/
async function printPDF() {
  if (!Context.PDF) {
    toast('No PDF found!');
    return;
  }

  if (!Context.Stamp) {
    toast('No stamp found!');
    return;
  }

  const existingPdfBytes = await fetch(Context.PDF)
    .then((res) => res.arrayBuffer())
    .catch((err: Error) => {
      toast(err.message);
    });

  // if we couldn't get the PDF, return
  if (!existingPdfBytes || !(existingPdfBytes instanceof ArrayBuffer)) {
    return;
  }

  const stamp = await fetch(Context.Stamp)
    .then((res: Response) => res.arrayBuffer())
    .catch((err: Error) => {
      toast(err.message);
    });

  // if we couldn't get the stamp, return
  if (!stamp || !(stamp instanceof ArrayBuffer)) {
    return;
  }

  const pdf = await PDFLib.PDFDocument.load(existingPdfBytes);

  const pdfStamp = await pdf.embedPng(stamp);

  const pages = pdf.getPages();

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const drawings = getDrawings(i);

    for (const drawing of drawings) {
      console.log(drawing);
      const currPage = pages[i - 1];
      const currSize = currPage.getSize();

      currPage.drawImage(pdfStamp, {
        x: drawing.x,
        y: currSize.height - drawing.y,
        width: drawing.w,
        height: drawing.h,
      });
    }
  }

  saveByteArrayToPDF(Context.PDFName, await pdf.save());

  toast('PDF downloaded.', Misc.Success);
}

/**
 * saveByteArrayToPDF saves the PDF to the user's computer
 */
function saveByteArrayToPDF(name: string, byte: BlobPart) {
  var blob = new Blob([byte], { type: 'application/pdf' });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  var fileName = name;
  link.download = fileName;
  link.click();
}
document.getElementById('download').addEventListener('click', printPDF);
