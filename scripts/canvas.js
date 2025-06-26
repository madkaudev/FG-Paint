// Initialize the canvas.
const canvas = document.getElementById("paint");
const ctx = canvas.getContext("2d");

// Draws a single pixel given an x and y coordinate.
function drawPoint(x, y) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 1, 1);
}
// Draws a line between two points using Bresenham's line algorithm (version that supports all octants).
// (I barely understand the full octant version.)
function drawLine(x0, y0, x1, y1) {
    const dx = Math.abs(x1 - x0);
    const sx = x0 < x1 ? 1 : -1;
    const dy = -Math.abs(y1 - y0);
    const sy = y0 < y1 ? 1 : -1;
    let error = dx + dy;

    while (true) {
        drawPoint(x0, y0);
        let e2 = error * 2;
        if (e2 >= dy) {
            if (x0 === x1) {
                break;
            }
            error += dy;
            x0 += sx;
        }
        if (e2 <= dx) {
            if (y0 === y1) {
                break;
            }
            error += dx;
            y0 += sy;
        }
    }
}

// Boolean to check if the left mouse button is being held down.
var isMouseDown = false;
// Variables that store the previously held x and y coordinates for line drawing.
var prevX = null;
var prevY = null;
// Main draw function.
function draw(event) {
    // Set x and y coordinates of mouse based on canvas location on document
    const bounding = canvas.getBoundingClientRect();
    let x = Math.floor(event.clientX - bounding.left);
    let y = Math.floor(event.clientY - bounding.top);

    // Update the current pixel tracker element
    const headerH3 = document.getElementById("header-h3")
    headerH3.innerText = "Current Pixel: (" + x + "," + y +")";
    
    // If user is drawing, appropriately draw points and lines
    if (isMouseDown) {
        if (prevX === null && prevY === null) {
            drawPoint(x, y);
        }
        else {
            drawLine(prevX, prevY, x, y);
        }
        // Update prevX and prevY to new coordinates
        prevX = x;
        prevY = y;
    }
}

// Event listener to modify isMouseDown boolean.
document.addEventListener("mousedown", (event) => {
    // If left mouse button is held down, set the boolean accordingly
    if (event.button === 0) {
        isMouseDown = true;
    }
});
// Event listener to modify isMouseDown boolean and reset prevX and prevY.
document.addEventListener("mouseup", (event) => {
    isMouseDown = false;
    prevX = null;
    prevY = null;
});
// Event listener specifically for the canvas to call draw() upon mouse movement.
canvas.addEventListener("mousemove", (event) => draw(event))
