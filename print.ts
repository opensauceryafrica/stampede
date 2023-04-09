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

  for (i = 1; i <= pdfDoc.numPages; i++) {
    const drawings = getDrawings(i);

    for (drawing of drawings) {
      console.log(drawing);
      const currPage = pages[i - 1];
      currSize = currPage.getSize();
      console.log(currSize, drawing.x, drawing.y);
      currPage.drawImage(pdfStamp, {
        x: drawing.x,
        y: currSize.height - drawing.y,
        width: drawing.w,
        height: drawing.h,
      });
    }
  }
  // {width: 612, height: 792} 0 0
  // const currPage = pages[1];
  // console.log(currPage.getSize(), currPage.getX(), currPage.getY());
  // currPage.drawImage(pdfStamp, {
  //   x: 302.87109375,
  //   y: 729 - 629.6875 - (729 - 629.6875) * 0.6,
  //   width: 150,
  //   height: 120,
  // });

  const pdfBytes = await pdf.save();
  saveByteArrayToPDF(pdfName, pdfBytes);
}

function saveByteArrayToPDF(name, byte) {
  var blob = new Blob([byte], { type: 'application/pdf' });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  var fileName = name;
  link.download = fileName;
  link.click();
}

document.getElementById('download').addEventListener('click', printPDF);
