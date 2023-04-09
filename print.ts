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

async function printPDF() {
  const url =
    'https://juripassmediaservice.onrender.com/v1/file/download/avatar/claim_1680977804933.pdf?downloadToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2Q1ODkwMWE3M2UzNDlhN2I5YjU2NWQiLCJlbWFpbCI6ImNoZWZAb3BlbnNhdWNlcmVyLmNvbSIsImlhdCI6MTY4MDk2NzMzMywiZXhwIjoxNjgxMDUzNzMzfQ.BM92fz3bXn8J5xCmtJKmnOAUkCEJTHm1qE3YaVQld5c';
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  const stamp = await fetch(
    'https://juripassmediaservice.onrender.com/v1/file/preview/avatar/stamp_1680993958285.png'
  ).then((res) => res.arrayBuffer());

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

  const pdfBytes = await pdf.save();
  saveByteArrayToPDF(pdfName, pdfBytes);
}

function saveByteArrayToPDF(name: string, byte: BlobPart) {
  var blob = new Blob([byte], { type: 'application/pdf' });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  var fileName = name;
  link.download = fileName;
  link.click();
}

document.getElementById('download').addEventListener('click', printPDF);
