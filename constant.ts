/**
 * URLS used in the application
 */
const URLs = {
  FileBin: 'https://filebin.net/',
  PDFJSWorker:
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js',
  PDFJSLib: 'pdfjs-dist/build/pdf',
  GoFile: 'https://{}.gofile.io',
};

/**
 * Misc constants used in the application
 */
const Misc = {
  Bin: 'stampedee',
  Danger: 'danger',
  Success: 'success',
};

interface Context {
  PDF?: string;
  Stamp?: string;
  PDFName?: string;
  StampName?: string;
  CollectorLoad?: number;
  Folder?: string;
  Server?: string;
}

/**
 * Context used in the application
 */
let Context: Context = {};
