// Tool variables.
var brushSize = 1;
var brushType = "pencil";
var brushColor = "#000000";

// HTML elements.
const brushSizeButton = document.getElementById("set-brush-size");
const eraserButton = document.getElementById("set-eraser");
const pencilButton = document.getElementById("set-pencil");
const paintBucketButton = document.getElementById("set-paint-bucket");
const sprayPaintButton = document.getElementById("set-spray-paint");
const colorPickerButton = document.getElementById("set-color-picker");
const ColorInput = document.getElementById("color-input");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");

const OptionContainer = document.getElementById("option-container");
const ButtonCount = OptionContainer.childElementCount;
const ButtonSize = 64;
// Start-up settings.
window.addEventListener("DOMContentLoaded", (event) => {
    ColorInput.value = brushColor;
    if (ButtonCount*ButtonSize > screen.height) {
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
brushSizeButton.addEventListener("click", () => {
    console.log("Clicked brush-size button.");
    changeBrushSize();
    brushType = "brushSize";
});
// Eraser button.
eraserButton.addEventListener("click", () => {
    console.log("Clicked set-eraser button.");
    brushType = "eraser";
});
// Pencil button.
pencilButton.addEventListener("click", () => {
    console.log("Clicked set-pencil button.");
    brushType = "pencil";
});
// Paint bucket button.
paintBucketButton.addEventListener("click", () => {
    console.log("Clicked set-paint-bucket button.");
    brushType = "paintBucket";
});
// Spray Paint button.
sprayPaintButton.addEventListener("click", () => {
    console.log("Clicked set-spray-paint button.");
    brushType = "sprayPaint";
});
// Color picker button.
colorPickerButton.addEventListener("click", () => {
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
undoButton.addEventListener("click", () => {
    console.log("Clicked undo button.");
    brushType = "undo";
    undo();
});
// Redo button.
redoButton.addEventListener("click", () => {
    console.log("Clicked redo button.");
    brushType = "redo";
    redo();
});
