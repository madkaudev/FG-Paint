// Tool variables.
var brushSize = 1;
var brushType = "pencil";
var brushColor = "#000000";

// HTML elements.
const brushSizeButton = document.getElementById("brush-size");
const eraserButton = document.getElementById("set-eraser");
const pencilButton = document.getElementById("set-pencil");
const paintBucketButton = document.getElementById("set-paint-bucket");
const colorPickerButton = document.getElementById("set-color-picker");
const ColorInput = document.getElementById("color-input");
const alphaButton = document.getElementById("set-alpha");

// Start-up settings.
window.addEventListener("DOMContentLoaded", (event) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, Width, Height);
    ctx.fillStyle = brushColor;
    ColorInput.value = brushColor;
});

// Function to prompt for a new brush size.
function changeBrushSize() {
    let size = prompt("Enter brush size:");
    while (isNaN(size) || size <= 0) {
        size = prompt("Enter brush size (Must be a number greater than 0):", "1");
    }
    brushSize = parseInt(size);
}
// Function to prompt for a new alpha.
function changeAlpha() {
    let alpha = prompt("Enter alpha:");
    while (alpha < 0 || alpha > 255 || isNaN(alpha)) {
        alpha = prompt("Enter alpha (Must be in between 0 and 255):", "255");
    }
    console.log(`Setting alpha to ${alpha/255}`);
    ctx.globalAlpha = parseInt(alpha) / 255;
}

// Change brush size button.
brushSizeButton.addEventListener("click", () => {
    console.log("Clicked brush-size button.");
    changeBrushSize();
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
// Color picker button.
colorPickerButton.addEventListener("click", () => {
    console.log("Clicked set-color-picker button.");
    brushType = "colorPicker";
});
// Color input.
ColorInput.addEventListener("change", (event) => {
    brushColor = event.target.value;
});
// Change alpha button.
//alphaButton.addEventListener("click", () => {
    //console.log("Clicked set-alpha button.");
    //changeAlpha();
//});
