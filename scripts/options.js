// Tool variables.
var brushSize = 1;
var brushType = "pencil";
var brushColor = "rgb(0 0 0 / 100%)";

// HTML elements.
const ColorInput = document.getElementById("color-input");
const brushSizeButton = document.getElementById("brush-size");
const eraserButton = document.getElementById("set-eraser");
const pencilButton = document.getElementById("set-pencil");
const colorPickerButton = document.getElementById("set-color-picker");

// Start-up settings.
window.addEventListener("DOMContentLoaded", (event) => {
    ColorInput.value = "#000000";
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
// Color picker button.
colorPickerButton.addEventListener("click", () => {
    console.log("Clicked set-color-picker button.");
    brushType = "colorPicker";
});
// Color input.
ColorInput.addEventListener("change", (event) => {
    brushColor = event.target.value;
});
/*
// Change color button.
const colorDialog = document.getElementById("color-dialog");
const colorButton = document.getElementById("set-color");
colorButton.addEventListener("click", () => {
    console.log("Clicked set-color button.");
    colorDialog.showModal();
});
// Close color-dialog button.
const closeColorDialog = document.getElementById("close-color-dialog");
closeColorDialog.addEventListener("click", () => {
    console.log("Clicked set-color button.");
    colorDialog.close();
});
*/
