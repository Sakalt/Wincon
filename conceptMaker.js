// conceptMaker.js

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let layers = [];
let currentColor = '#000000';

function initCanvas() {
    canvas.addEventListener('mousedown', startDrag);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', endDrag);
}

class Layer {
    constructor(name, drawFunction, x = 0, y = 0) {
        this.name = name;
        this.drawFunction = drawFunction;
        this.visible = true;
        this.x = x;
        this.y = y;
        this.width = 100; // Default width
        this.height = 100; // Default height
    }

    draw() {
        if (this.visible) {
            ctx.save();
            ctx.translate(this.x, this.y);
            this.drawFunction();
            ctx.restore();
        }
    }
}

function addLayer(name, drawFunction) {
    const layer = new Layer(name, drawFunction);
    layers.push(layer);
    updateLayerList();
    redrawCanvas();
}

function updateLayerList() {
    const layerControl = document.getElementById('layerControl');
    layerControl.innerHTML = '';
    layers.forEach((layer, index) => {
        const div = document.createElement('div');
        div.className = 'layerItem';
        div.textContent = layer.name;
        div.addEventListener('click', () => toggleLayerVisibility(index));
        layerControl.appendChild(div);
    });
}

function toggleLayerVisibility(index) {
    layers[index].visible = !layers[index].visible;
    redrawCanvas();
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    layers.forEach(layer => layer.draw());
}

function addWindow() {
    const drawWindow = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(100, 100, 600, 400);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(100, 100, 600, 400);
    };
    addLayer('ウィンドウ', drawWindow);
}

function addTaskbar() {
    const drawTaskbar = () => {
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 550, 800, 50);
    };
    addLayer('タスクバー', drawTaskbar);
}

function addShape() {
    const drawShape = () => {
        ctx.fillStyle = currentColor;
        ctx.fillRect(200, 200, 100, 100);
    };
    addLayer('図形', drawShape);
}

function addLogo() {
    const drawLogo = () => {
        ctx.fillStyle = currentColor;
        ctx.font = '48px Arial';
        ctx.fillText('Logo', 300, 300);
    };
    addLayer('ロゴ', drawLogo);
}

function exportCanvas() {
    const link = document.createElement('a');
    link.download = 'concept.png';
    link.href = canvas.toDataURL();
    link.click();
}

document.getElementById('addWindowBtn').addEventListener('click', addWindow);
document.getElementById('addTaskbarBtn').addEventListener('click', addTaskbar);
document.getElementById('addShapeBtn').addEventListener('click', addShape);
document.getElementById('addLogoBtn').addEventListener('click', addLogo);
document.getElementById('exportBtn').addEventListener('click', exportCanvas);
document.getElementById('colorPicker').addEventListener('input', (event) => {
    currentColor = event.target.value;
});

let isDragging = false;
let dragLayerIndex = null;
let offsetX, offsetY;

function startDrag(event) {
    const { offsetX, offsetY } = event;
    layers.forEach((layer, index) => {
        if (isPointInLayer(event.offsetX, event.offsetY, layer)) {
            isDragging = true;
            dragLayerIndex = index;
            offsetX = event.offsetX - layer.x;
            offsetY = event.offsetY - layer.y;
        }
    });
}

function drag(event) {
    if (isDragging && dragLayerIndex !== null) {
        const layer = layers[dragLayerIndex];
        layer.x = event.offsetX - offsetX;
        layer.y = event.offsetY - offsetY;
        redrawCanvas();
    }
}

function endDrag() {
    isDragging = false;
    dragLayerIndex = null;
}

function isPointInLayer(x, y, layer) {
    return x >= layer.x && x <= layer.x + layer.width &&
           y >= layer.y && y <= layer.y + layer.height;
}

initCanvas();
