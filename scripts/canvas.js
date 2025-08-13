// Initialize the canvas.
const canvas = document.getElementById("paint");
const ctx = canvas.getContext("2d");
//ctx.imageSmoothingEnabled = false;
// Adjust width and height of canvas based on viewport
canvas.width = screen.width * 2 / 3 * window.devicePixelRatio;
canvas.height = screen.height * 2 / 3 * window.devicePixelRatio;
// Get new width and height of canvas
const Width = canvas.width;
const Height = canvas.height;
// Track x and y coordinates of mouse
var x;
var y;

// Boolean to check if the left mouse button is being held down.
var isMouseDown = false;
// Variables that store the previously held x and y coordinates for line drawing.
var prevX = null;
var prevY = null;
// Event listener to handle actions when left-mouse button is held.
document.addEventListener("mousedown", (event) => {
    // If left mouse button is held down, set the boolean accordingly
    if (event.button === 0) {
        isMouseDown = true;
        prevX = x;
        prevY = y;

        // Draw a singular point in the event mouse is not moving
        const Bounding = canvas.getBoundingClientRect();
        x = Math.floor(event.clientX - Bounding.left);
        y = Math.floor(event.clientY - Bounding.top);
        drawPoint(x, y);
    }
});
// Event listener to handle actions when left-mouse button is released.
document.addEventListener("mouseup", (event) => {
    isMouseDown = false;
    prevX = null;
    prevY = null;
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
