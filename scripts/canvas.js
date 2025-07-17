// Initialize the canvas.
const canvas = document.getElementById("paint");
const ctx = canvas.getContext("2d", { alpha: false });
const Width = document.getElementById("paint").width;
const Height = document.getElementById("paint").height;

// Convert RGB to Hex.
function RGBToHex(r, g, b) {
    const RedHex = r > 16 ? r.toString(16) : "0"+ r.toString(16)
    const GreenHex = g > 16 ? g.toString(16) : "0"+ g.toString(16)
    const BlueHex = b > 16 ? b.toString(16) : "0"+ b.toString(16)
    return "#" + RedHex + GreenHex + BlueHex;
}
// Convert Hex to RGB.
function HexToRGB(hex) {
    const Red = parseInt(hex.substring(1, 3), 16);
    const Green = parseInt(hex.substring(3, 5), 16);
    const Blue = parseInt(hex.substring(5, 7), 16);
    return [Red, Green, Blue];
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
        if (brushSize === 1) {
            ctx.fillRect(x, y, brushSize, brushSize);
        }
        else {
            const Radius = brushSize/2;
            ctx.beginPath();
            ctx.arc(x, y, Radius, 0, Math.PI*2);
            ctx.fill();
        }
    }
    else if (brushType === "eraser") {
        ctx.clearRect(x, y, brushSize, brushSize);
    }
    else if (brushType === "paintBucket") {
        // Starting pixel's data
        const Pixel = ctx.getImageData(x, y, 1, 1);
        const Data = Pixel.data;

        // Initial color to copy over
        const InitColor = HexToRGB(brushColor);

        // Check if the starting pixel is the same as the current color
        const IsSameColor = brushColor == RGBToHex(Data[0], Data[1], Data[2]);
        console.log(IsSameColor);

        // If the starting color is different than the pixel and the current pixel is in range of canvas, continue to fill
        if (!IsSameColor && (x >= 0 && x < Width && y >= 0 && y < Height)) {
            // Get pixel data for the whole canvas
            const PageImageData = ctx.getImageData(0, 0, Width, Height);
            const PageData = PageImageData.data;

            // Function to get the rgba profile of a pixel at (x, y)
            function getPixelColor(x, y) {
                const Idx = (y * Width + x) * 4;
                return [PageData[Idx], PageData[Idx + 1], PageData[Idx + 2], PageData[Idx + 3]];
            }
            // Function to set the rgba profile of a pixel at (x, y)
            function setPixelColor(x, y, r, g, b, a = 255) {
                const Idx = (y * Width + x) * 4;
                PageData[Idx] = r;
                PageData[Idx + 1] = g;
                PageData[Idx + 2] = b;
                PageData[Idx + 3] = a;
            }
            // Function to compare rbga profiles of a pixel to the starting pixel
            const TargetColor = getPixelColor(x, y);
            function comparePixels(x2, y2) {
                const Tolerance = 96;
                const Pixel2 = getPixelColor(x2, y2);
                const SquareError = (TargetColor[0] - Pixel2[0]) ** 2 +
                                    (TargetColor[1] - Pixel2[1]) ** 2 +
                                    (TargetColor[2] - Pixel2[2]) ** 2;
                return SquareError < Tolerance**2;
            }
            
            // Stack to track which pixels must be filled
            const FillStack = [];
            FillStack.push([x, y]);
            // Set to track visited pixels
            const Visited = new Set();
            Visited.add(`${x},${y}`);

            // Loop through stack and track pixels to fill
            while (FillStack.length > 0) {
                const CoordPair = FillStack.pop();
                const CoordX = CoordPair[0];
                const CoordY = CoordPair[1];
                setPixelColor(CoordX, CoordY, InitColor[0], InitColor[1], InitColor[2], 255);

                const NextCoords = [[CoordX-1, CoordY], [CoordX+1, CoordY], [CoordX, CoordY-1], [CoordX, CoordY+1]];

                for (const [nX, nY] of NextCoords) {
                    if ((nX >= 0 && nX < Width && nY >= 0 && nY < Height) && comparePixels(nX, nY) && !Visited.has(`${nX},${nY}`)) {
                        FillStack.push([nX, nY]);
                        Visited.add(`${nX},${nY}`);
                    }
                }
            }

            // Fill canvas with new paint pixels
            ctx.putImageData(PageImageData, 0, 0);
        }
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
canvas.addEventListener("mousemove", (event) => draw(event));
