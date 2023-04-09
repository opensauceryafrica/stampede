function allowDrop(ev) {
    ev.preventDefault();
    // ev.dataTransfer.dropEffect = 'copy';
}
var offsetX = 0, offsetY = 0;
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
    const w = 150, h = 120;
    ctx.drawImage(logo, cordX, cordY, w, h);
    storeDrawing(data, cordX, cordY, pageNum, w, h);
}
function storeDrawing(id, x, y, page, w, h) {
    // get any current data
    const sdata = localStorage.getItem('stampede') || '{}';
    const data = JSON.parse(sdata);
    const drawings = data[page] || [];
    // add new drawing
    drawings.push({ id, x, y, w, h, page });
    data[page] = drawings;
    localStorage.setItem('stampede', JSON.stringify(data));
}
function removeDrawings(page) {
    // get any current data
    const sdata = localStorage.getItem('stampede') || '{}';
    const data = JSON.parse(sdata);
    // remove drawings for page
    delete data[page];
    localStorage.setItem('stampede', JSON.stringify(data));
}
function getDrawings(page) {
    // get any current data
    const sdata = localStorage.getItem('stampede') || '{}';
    const data = JSON.parse(sdata);
    return data[page] || [];
}
// reDraw iterates over drawings and draws them on the canvas
function reDraw(drawings) {
    for (const drawing of drawings) {
        var canvas = document.getElementById('the-canvas');
        var ctx = canvas.getContext('2d');
        var logo = document.getElementById(drawing.id);
        ctx.drawImage(logo, drawing.x, drawing.y, drawing.w, drawing.h);
    }
}
function clear() {
    var canvas = document.getElementById('the-canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // remove drawings from local storage
    removeDrawings(pageNum);
    // re-render page
    queueRenderPage(pageNum);
}
document.getElementById('clear').addEventListener('click', clear);
