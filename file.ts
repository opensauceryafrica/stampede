/**
 * entract loads up the intro modal
 */
const entrance = document.getElementById('entrance');
entrance.click();

/**
 * builder is a list of strings that are used to spice up the loading message
 */
const builders = [
  'Staging...',
  'Building...',
  'Deploying...',
  'Testing...',
  'Cooking...',
  'Serving...',
  'Frying...',
  'Baking...',
];

/**
 * collectorLoad is the main function that is called when the user clicks the
 * "Continue" button after uploading the pdf and stamp files
 */
function collectorLoad(e: Event) {
  if (!validate()) {
    return;
  }

  if (!(e.target as HTMLElement).innerHTML.includes('fa-spinner')) {
    (
      e.target as HTMLElement
    ).innerHTML = `<i class="fa fa-spinner fa-spin collectorload"></i> Loading...`;
    (e.target as HTMLElement).setAttribute('disabled', 'disabled');

    spice();
  }

  upload();
}
document
  .querySelector('#collectorload')
  .addEventListener('click', collectorLoad, false);

/**
 *  spice is a function that is called every 2 seconds to spice up the loading
 */
function spice() {
  Context.CollectorLoad = window.setInterval(() => {
    document.querySelector(
      '#collectorload'
    ).innerHTML = `<i class="fa fa-spinner fa-spin collectorload"></i> ${
      builders[Math.floor(Math.random() * builders.length)]
    }`;
  }, 2000);

  store('context', Context);
}

/**
 * salty stops the loader and reverts the button back to its original state
 */
function salty() {
  document.querySelector('#collectorload').innerHTML = 'Continue';
  document.querySelector('#collectorload').removeAttribute('disabled');
  window.clearInterval(Context.CollectorLoad);
}

/**
 *  validate checks if the user has selected the pdf and stamp files
 */
function validate(e?: Event): boolean {
  const pdffile = ((e && e.target) ||
    document.getElementById('pdffile')) as HTMLInputElement;
  const stampfile = ((e && e.target) ||
    document.getElementById('stampfile')) as HTMLInputElement;

  if (pdffile.files.length == 0) {
    toast('Please select a PDF file');
    pdffile.classList.add('is-invalid');
    return false;
  } else {
    pdffile.classList.remove('is-invalid');
  }

  if (stampfile.files.length == 0) {
    toast('Please select a stamp file');
    stampfile.classList.add('is-invalid');
    return false;
  } else {
    stampfile.classList.remove('is-invalid');
  }

  return true;
}

/**
 * upload pushes the pdf and stamp files to filebin and sets the context
 * with the filebin urls
 */
async function upload() {
  const pdffile = document.getElementById('pdffile') as HTMLInputElement;
  const stampfile = document.getElementById('stampfile') as HTMLInputElement;

  const pdf = pdffile.files[0];
  const stamp = stampfile.files[0];

  // set the context with the file names
  Context.PDFName = pdf.name;
  Context.StampName = stamp.name;

  const pdfUrl = await gofile(pdf);
  if (pdfUrl instanceof Error) {
    return;
  }

  const stampUrl = await gofile(stamp);
  if (stampUrl instanceof Error) {
    return;
  }

  Context.PDF = pdfUrl;
  Context.Stamp = stampUrl;

  store('context', Context);

  salty();
  navigate('/stamp');
}

/**
 * filebin uploads a file to filebin and returns the url
 */
async function filebin(file: File): Promise<string | Error> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const req = await fetch(
      URLs.FileBin + Misc.Bin + '/' + Date.now().toString() + '_' + file.name,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': file.type,
          accept: 'application/json',
          cid: Misc.Bin,
          'content-length': file.size.toString(),
          'user-agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
          //   ':authority': 'filebin.net',
        },
        referrer: URLs.FileBin,
      }
    );

    const res: {
      file: {
        filename: string;
      };
    } = await req.json();

    return URLs.FileBin + Misc.Bin + '/' + res.file.filename;
  } catch (error) {
    salty();
    toast('Error uploading file' + file.name + '! Please try again.');
    return error;
  }
}

/**
 * gofile uploads a file to gofile and returns the url
 */
async function gofile(file: File): Promise<string | Error> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    if (Context.Server == null || Context.Server == '') {
      const sreq = await fetch(URLs.GoFile.replace('{}', 'api') + '/getServer');

      const sres: {
        data: {
          server: string;
        };
      } = await sreq.json();

      Context.Server = sres.data.server;
      store('context', Context);
    }

    const req = await fetch(
      URLs.GoFile.replace('{}', Context.Server) + '/uploadFile',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!req.ok) {
      throw new Error('Network response was not ok!');
    }

    if (req.status >= 400) {
      throw new Error('Upload failed!');
    }

    const res: {
      data: {
        fileId: string;
        fileName: string;
      };
    } = await req.json();

    return (
      URLs.GoFile.replace('{}', Context.Server) +
      '/download/direct/' +
      res.data.fileId +
      '/' +
      res.data.fileName
    );
  } catch (error) {
    salty();
    toast('Error uploading file' + file.name + '! Please try again.');
    return error;
  }
}

document.querySelector('#pdffile').addEventListener('change', validate, false);
document
  .querySelector('#stampfile')
  .addEventListener('change', validate, false);
