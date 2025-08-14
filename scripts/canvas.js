// Initialize the canvas.
const canvas = document.getElementById("paint");
const ctx = canvas.getContext("2d");
// Adjust width and height of canvas based on viewport.
canvas.width = screen.width * 2 / 3;
canvas.height = screen.height * 2 / 3;
// Get new width and height of canvas.
const Width = canvas.width;
const Height = canvas.height;
// Track x and y coordinates of mouse.
var x;
var y;
// Track the states of the canvas for undo and redo.
const stateStack = [];
var statePointer = 0;
const PageImageData = ctx.getImageData(0, 0, Width, Height);
stateStack.push(PageImageData);
// State-altering brush types.
const StateAlteringBrushes = ["pencil", "eraser", "paintBucket", "sprayPaint"];

// Boolean to check if the left mouse button is being held down.
var isMouseDown = false;
// Variables that store the previously held x and y coordinates for line drawing.
var prevX = null;
var prevY = null;
// Event listener to handle actions when left-mouse button is held.
canvas.addEventListener("mousedown", (event) => {
    // If left mouse button is held down, set the boolean accordingly and draw
    if (event.button === 0) {
        isMouseDown = true;
        draw(event);
    }
});
// Event listener to handle actions when left-mouse button is released.
document.addEventListener("mouseup", (event) => {
    isMouseDown = false;
    prevX = null;
    prevY = null;
});
// Event listener to handle updating the stateStack.
canvas.addEventListener("mouseup", (event) => {
    if (!StateAlteringBrushes.includes(brushType)) return;
    // If stack pointer is not at the top, remove all states above it
    if (statePointer < stateStack.length - 1) {
        stateStack.splice(statePointer + 1, stateStack.length - statePointer + 1);
    }
    // Push the newest state
    const PageImageData = ctx.getImageData(0, 0, Width, Height);
    stateStack.push(PageImageData);
    statePointer++;
});
// Event listener to handle actions when mouse is moving.
canvas.addEventListener("mousemove", (event) => {
    // Set x and y coordinates of mouse based on canvas location on document
    const Bounding = canvas.getBoundingClientRect();
    x = Math.floor(event.clientX - Bounding.left);
    y = Math.floor(event.clientY - Bounding.top);
    // Update the current pixel tracker element
    const headerH3 = document.getElementById("header-h3")
    headerH3.innerText = "Current Pixel: (" + x + "," + y +")";

    // If mouse is held down, call the draw function
    if (isMouseDown) {
        draw(event);
    }
});
