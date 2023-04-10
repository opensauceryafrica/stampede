// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url =
  'https://bafybeidxca4pkox75mcypdfo5ravb6xuyp6ljdkqtn5jibtjhx5dbmhue4.ipfs.w3s.link/perfection_resume_v0.1.0.pdf';

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

interface PDFDoc {
  numPages: number;
  getPage: (num: number) => Promise<PDFPage>;
}

interface PDFPage {
  getViewport: (options: { scale: number }) => PDFViewport;
  render: (options: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PDFViewport;
  }) => PDFRenderTask;
}

interface PDFViewport {
  height: number;
  width: number;
}

interface PDFRenderTask {
  promise: Promise<void>;
}

var pdfDoc: PDFDoc = null,
  pageNum = 1,
  pageRendering = false,
  pageNumPending = null,
  scale =
    parseInt((document.getElementById('zoom') as HTMLInputElement).value) / 100,
  canvas = document.getElementById('the-canvas') as HTMLCanvasElement,
  ctx = canvas.getContext('2d'),
  pdfName = url.split('/').pop()?.replace(/\?.*/, '');

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num: number) {
  pageRendering = true;
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function (page) {
    var viewport = page.getViewport({ scale: scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function () {
      pageRendering = false;
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
      // re-draw drawings
      reDraw(getDrawings(num));
    });
  });

  // Update page counters
  document.getElementById('page_num').textContent = num.toString();
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num: number) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}
document.getElementById('prev').addEventListener('click', onPrevPage);

/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
document.getElementById('next').addEventListener('click', onNextPage);

function zoom() {
  // get value in input field
  var val = (document.getElementById('zoom') as HTMLInputElement).value;
  // set scale
  scale = parseInt(val) / 100;
  // render page
  queueRenderPage(pageNum);
}

document.getElementById('zoomer').addEventListener('click', zoom);

/**
 * Asynchronously downloads PDF.
 */
pdfjsLib.getDocument(url).promise.then(function (pdfDoc_: PDFDoc) {
  pdfDoc = pdfDoc_;
  document.getElementById('page_count').textContent =
    pdfDoc.numPages.toString();

  // re-render page
  queueRenderPage(pageNum);
});
