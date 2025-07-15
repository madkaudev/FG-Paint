// Initialize the canvas.
const canvas = document.getElementById("paint");
const ctx = canvas.getContext("2d");
const Width = document.getElementById("paint").width;
const Height = document.getElementById("paint").height;

// Convert RGB to Hex.
function RGBToHex(r, g, b) {
    const RedHex = r > 16 ? r.toString(16) : "0"+ r.toString(16)
    const GreenHex = g > 16 ? g.toString(16) : "0"+ g.toString(16)
    const BlueHex = b > 16 ? b.toString(16) : "0"+ b.toString(16)
    return "#" + RedHex + GreenHex + BlueHex;
}
// Draws a single pixel given an x and y coordinate.
function drawPoint(x, y) {
    if (brushType === "colorPicker") {
        if (x >= 0 && x < Width && y >= 0 && y < Height) {
            const Pixel = ctx.getImageData(x, y, 1, 1);
            const Data = Pixel.data;
            ColorInput.value = RGBToHex(Data[0], Data[1], Data[2]);
            console.log(ColorInput.value)
        }
        else {
            console.log("You can only pick a color from the canvas!");
        }
    }

    ctx.fillStyle = brushColor;
    if (brushType === "pencil") {
        ctx.fillRect(x, y, brushSize, brushSize);
    }
    else if (brushType === "eraser") {
        ctx.clearRect(x, y, brushSize, brushSize);
    }
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
    const Bounding = canvas.getBoundingClientRect();
    let x = Math.floor(event.clientX - Bounding.left);
    let y = Math.floor(event.clientY - Bounding.top);

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
        // Set x and y coordinates of mouse based on canvas location on document
        const Bounding = canvas.getBoundingClientRect();
        let x = Math.floor(event.clientX - Bounding.left);
        let y = Math.floor(event.clientY - Bounding.top);
        // Draw a singular point for a mouse click
        drawPoint(x, y);
        prevX = x;
        prevY = y;
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
