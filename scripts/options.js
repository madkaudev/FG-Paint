// Tool variables.
var brushSize = 1;
var brushType = "pencil"
var brushColor = "#000000";

// HTML buttons.
const BrushSizeButton = document.getElementById("set-brush-size");
const EraserButton = document.getElementById("set-eraser");
const PencilButton = document.getElementById("set-pencil");
const PaintBucketButton = document.getElementById("set-paint-bucket");
const SprayPaintButton = document.getElementById("set-spray-paint");
const ColorPickerButton = document.getElementById("set-color-picker");
const ColorInput = document.getElementById("color-input");
const UndoButton = document.getElementById("undo");
const RedoButton = document.getElementById("redo");

// Track which button should be highlighted.
var previousBrush = brushType;
const HighlightButtons = new Map([
    ["pencil", PencilButton], ["eraser", EraserButton], ["paintBucket", PaintBucketButton], 
    ["sprayPaint", SprayPaintButton], ["colorPicker", ColorPickerButton]
]);
// Highlight the button that is currently in use and reset the previous one.
function highlightButton(current, previous) {
    HighlightButtons.get(current).style.backgroundColor = "rgb(201, 201, 201)";
    HighlightButtons.get(previous).style.backgroundColor = "";
}

// HTML elements for option container direction calculations.
const Canvas = document.getElementById("paint");
const OptionContainer = document.getElementById("option-container");

// Start-up settings.
window.addEventListener("DOMContentLoaded", (event) => {
    // Set pencil button to be highlighted as it is the default selection
    PencilButton.style.backgroundColor = "rgb(201, 201, 201)";
    // Set the color input to the defualt brush color
    ColorInput.value = brushColor;
    // If the buttons would overflow, use a row flex-direction
    if (OptionContainer.offsetHeight > Canvas.offsetHeight) {
        OptionContainer.style.flexDirection = "row";
    }
});

// Function to prompt for a new brush size.
function changeBrushSize() {
    let size = prompt("Enter brush size:");
    while (isNaN(size) || size <= 0) {
        size = prompt("Enter brush size (Must be a number greater than 0):", brushSize.toString());
    }
    brushSize = parseInt(size);
}

// Change brush size button.
BrushSizeButton.addEventListener("click", () => {
    console.log("Clicked brush-size button.");
    changeBrushSize();
});
// Eraser button.
EraserButton.addEventListener("click", () => {
    console.log("Clicked set-eraser button.");
    brushType = "eraser";
    highlightButton(brushType, previousBrush);
    previousBrush = brushType;
});
// Pencil button.
PencilButton.addEventListener("click", () => {
    console.log("Clicked set-pencil button.");
    brushType = "pencil";
    highlightButton(brushType, previousBrush);
    previousBrush = brushType;
});
// Paint bucket button.
PaintBucketButton.addEventListener("click", () => {
    console.log("Clicked set-paint-bucket button.");
    brushType = "paintBucket";
    highlightButton(brushType, previousBrush);
    previousBrush = brushType;
});
// Spray Paint button.
SprayPaintButton.addEventListener("click", () => {
    console.log("Clicked set-spray-paint button.");
    brushType = "sprayPaint";
    highlightButton(brushType, previousBrush);
    previousBrush = brushType;
});
// Color picker button.
ColorPickerButton.addEventListener("click", () => {
    console.log("Clicked set-color-picker button.");
    brushType = "colorPicker";
    highlightButton(brushType, previousBrush);
    previousBrush = brushType;
});
// Color input button.
ColorInput.addEventListener("change", (event) => {
    console.log("Clicked color-input button.");
    brushColor = event.target.value;
    // Set the color of the canvas brush
    ctx.fillStyle = brushColor;
    console.log("Changed brush color to " + brushColor + ".")
});
// Undo button.
UndoButton.addEventListener("click", () => {
    console.log("Clicked undo button.");
    undo(); // In canvasfunctions.js
});
// Redo button.
RedoButton.addEventListener("click", () => {
    console.log("Clicked redo button.");
    redo(); // In canvasfunctions.js
});