// Tool variables.
var brushSize = 1;
var brushType = "pencil";
var brushColor = "#000000";

// HTML elements.
const BrushSizeButton = document.getElementById("set-brush-size");
const EraserButton = document.getElementById("set-eraser");
const PencilButton = document.getElementById("set-pencil");
const PaintBucketButton = document.getElementById("set-paint-bucket");
const SprayPaintButton = document.getElementById("set-spray-paint");
const ColorPickerButton = document.getElementById("set-color-picker");
const ColorInput = document.getElementById("color-input");
const UndoButton = document.getElementById("undo");
const RedoButton = document.getElementById("redo");
const Canvas = document.getElementById("paint");
const OptionContainer = document.getElementById("option-container");

const ButtonCount = OptionContainer.childElementCount;
const ButtonSize = 48;
// Start-up settings.
window.addEventListener("DOMContentLoaded", (event) => {
    ColorInput.value = brushColor;
    // If the buttons would overflow, use a row flex-direction
    if (ButtonCount*ButtonSize > canvas.height) {
        OptionContainer.style.flexDirection = "row";
    }
});

// Function to prompt for a new brush size.
function changeBrushSize() {
    let size = prompt("Enter brush size:");
    while (isNaN(size) || size <= 0) {
        size = prompt("Enter brush size (Must be a number greater than 0):", "1");
    }
    brushSize = parseInt(size);
}

// Change brush size button.
BrushSizeButton.addEventListener("click", () => {
    console.log("Clicked brush-size button.");
    changeBrushSize();
    brushType = "brushSize";
});
// Eraser button.
EraserButton.addEventListener("click", () => {
    console.log("Clicked set-eraser button.");
    brushType = "eraser";
});
// Pencil button.
PencilButton.addEventListener("click", () => {
    console.log("Clicked set-pencil button.");
    brushType = "pencil";
});
// Paint bucket button.
PaintBucketButton.addEventListener("click", () => {
    console.log("Clicked set-paint-bucket button.");
    brushType = "paintBucket";
});
// Spray Paint button.
SprayPaintButton.addEventListener("click", () => {
    console.log("Clicked set-spray-paint button.");
    brushType = "sprayPaint";
});
// Color picker button.
ColorPickerButton.addEventListener("click", () => {
    console.log("Clicked set-color-picker button.");
    brushType = "colorPicker";
});
// Color input button.
ColorInput.addEventListener("change", (event) => {
    console.log("Clicked color-input button.");
    brushColor = event.target.value;
    // Set the color of the canvas brush
    ctx.fillStyle = brushColor;
    console.log("Changed brush color to " + brushColor + ".")
    brushType = "colorInput";
});
// Undo button.
UndoButton.addEventListener("click", () => {
    console.log("Clicked undo button.");
    brushType = "undo";
    undo();
});
// Redo button.
RedoButton.addEventListener("click", () => {
    console.log("Clicked redo button.");
    brushType = "redo";
    redo();
});
