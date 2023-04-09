var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function printPDF() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://juripassmediaservice.onrender.com/v1/file/download/avatar/claim_1680977804933.pdf?downloadToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2Q1ODkwMWE3M2UzNDlhN2I5YjU2NWQiLCJlbWFpbCI6ImNoZWZAb3BlbnNhdWNlcmVyLmNvbSIsImlhdCI6MTY4MDk2NzMzMywiZXhwIjoxNjgxMDUzNzMzfQ.BM92fz3bXn8J5xCmtJKmnOAUkCEJTHm1qE3YaVQld5c';
        const existingPdfBytes = yield fetch(url).then((res) => res.arrayBuffer());
        const stamp = yield fetch('https://juripassmediaservice.onrender.com/v1/file/preview/avatar/stamp_1680993958285.png').then((res) => res.arrayBuffer());
        const pdf = yield PDFLib.PDFDocument.load(existingPdfBytes);
        const pdfStamp = yield pdf.embedPng(stamp);
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
        const pdfBytes = yield pdf.save();
        saveByteArrayToPDF(pdfName, pdfBytes);
    });
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
