function allowDrop(ev) {
  ev.preventDefault();
  // ev.dataTransfer.dropEffect = 'copy';
}

var offsetX = 0,
  offsetY = 0;

function drag(ev) {
  ev.dataTransfer.setData('stamp', ev.target.id);

  // set cordX and cordY as offset
  offsetX = ev.clientX - ev.target.getBoundingClientRect().x;
  offsetY = ev.clientY - ev.target.getBoundingClientRect().y;
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData('stamp');

  // draw image on canvas
  var canvas = ev.target;
  var ctx = canvas.getContext('2d');
  var logo = document.getElementById(data);

  // canvas left and top
  var rect = document.getElementById('the-canvas').getBoundingClientRect();
  var left = rect.left;
  var top = rect.top;

  var cordX = ev.clientX - left - offsetX;
  var cordY = ev.clientY - top - offsetY;

  const w = 150,
    h = 120;

  ctx.drawImage(logo, cordX, cordY, w, h);

  storeDrawing(data, cordX, cordY, pageNum, w, h);
}

function storeDrawing(id, x, y, page, w, h) {
  // get any current data
  const sdata = localStorage.getItem('canyouseemenow') || '{}';
  const data = JSON.parse(sdata);
  const drawings = data[page] || [];
  drawings.push({ id, x, y, w, h });
  data[page] = drawings;
  localStorage.setItem('canyouseemenow', JSON.stringify(data));
}

function removeDrawings(page) {
  // get any current data
  const sdata = localStorage.getItem('canyouseemenow') || '{}';
  const data = JSON.parse(sdata);
  delete data[page];
  localStorage.setItem('canyouseemenow', JSON.stringify(data));
}

function getDrawings(page) {
  // get any current data
  const sdata = localStorage.getItem('canyouseemenow') || '{}';
  const data = JSON.parse(sdata);
  return data[page] || [];
}

function reDraw(drawings) {
  for (drawing of drawings) {
    var canvas = document.getElementById('the-canvas');
    var ctx = canvas.getContext('2d');
    var logo = document.getElementById(drawing.id);
    ctx.drawImage(logo, drawing.x, drawing.y, drawing.w, drawing.h);
    console.log('redrawing');
  }
}

function clear() {
  var canvas = document.getElementById('the-canvas');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log('cleared');
  // remove drawings from local storage
  removeDrawings(pageNum);
  // re-render page
  queueRenderPage(pageNum);
}

document.getElementById('clear').addEventListener('click', clear);

// document.addEventListener(
//   'dragover',
//   function (e) {
//     console.log(e);
//     e = e || window.event;
//     var dragX = e.pageX,
//       dragY = e.pageY;

//     console.log('X: ' + dragX + ' Y: ' + dragY);

//     // // get cartesian coordinates of canvas
//     // var canvas = document.getElementById('the-canvas');
//     // var rect = canvas.getBoundingClientRect();
//     // console.log(rect);
//     // var negX = rect.left;
//     // var negY = rect.top;
//     // var posX = rect.width;
//     // var posY = rect.height;

//     // console.log('logo rect: ', e.toElement.getBoundingClientRect());
//   },
//   false
// );
