// Convert RGB to Hex.
function RGBToHex(r, g, b) {
    const RedHex = r >= 16 ? r.toString(16) : "0" + r.toString(16);
    const GreenHex = g >= 16 ? g.toString(16) : "0" + g.toString(16);
    const BlueHex = b >= 16 ? b.toString(16) : "0" + b.toString(16);
    return "#" + RedHex + GreenHex + BlueHex;
}
// Convert Hex to RGB.
function HexToRGB(hex) {
    const Red = parseInt(hex.substring(1, 3), 16);
    const Green = parseInt(hex.substring(3, 5), 16);
    const Blue = parseInt(hex.substring(5, 7), 16);
    return [Red, Green, Blue];
}
// Check if a pixel is in bounds of the canvas.
function checkInBounds(x, y) {
    return x >= 0 && x < Width && y >= 0 && y < Height;
}

// Pencil function.
function pencil(x, y) {
    // If the brush size is 1 fill with a 1px by 1px brush
    if (brushSize === 1) {
        ctx.fillRect(x, y, brushSize, brushSize);
    }
    // Otherwise, use a circle brush with a diameter of var size
    else {
        const Radius = brushSize/2;
        ctx.beginPath();
        ctx.arc(x, y, Radius, 0, Math.PI*2);
        ctx.fill();
    }
}
// Eraser function.
function eraser(x, y) {
    // Erase in the shape of a square
    ctx.clearRect(x, y, brushSize, brushSize);
}
// Color picker function.
function colorPicker(x, y) {
    // Check if current pixel selected is in range
    if (checkInBounds(x, y)) {
        // Get ImageData for the current pixel
        const Pixel = ctx.getImageData(x, y, 1, 1);
        const Data = Pixel.data;
        // Set the color of the color input element to the current pixel's color
        ColorInput.value = RGBToHex(Data[0], Data[1], Data[2]);
        console.log(ColorInput.value)
        console.log(Data[3]);
    }
    // If the pixel is not in range, write a message to console
    else {
        console.log("You can only pick a color from the canvas!");
    }
}
// Paint bucket function.
function paintBucket(x, y) {
    // Selected pixel's data
    const SelectedPixel = ctx.getImageData(x, y, 1, 1);
    const SelectedData = SelectedPixel.data;

    // Color to flood fill with
    const FillColor = HexToRGB(brushColor);

    // Check if the selected pixel color is the same as the current brush color
    const IsSameColor = brushColor === RGBToHex(SelectedData[0], SelectedData[1], SelectedData[2]) 
                        && SelectedData[3] > 0;
    console.log(IsSameColor);

    // Continue to fill if conditions are met
    if (!IsSameColor && checkInBounds(x, y)) {
        // Get pixel data for the whole canvas
        const PageImageData = ctx.getImageData(0, 0, Width, Height);
        const PageData = PageImageData.data;

        // Function to get the rgba profile of a pixel at (x, y)
        function getRGBA(x, y) {
            // Data is represented as a flattened array. Each pixel's data is 4 integers
            const Idx = (y * Width + x) * 4;
            return [PageData[Idx], PageData[Idx + 1], PageData[Idx + 2], PageData[Idx + 3]];
        }
        // Function to set the rgba profile of a pixel at (x, y)
        function setRGBA(x, y, r, g, b, a = 255) {
            const Idx = (y * Width + x) * 4;
            PageData[Idx] = r;
            PageData[Idx + 1] = g;
            PageData[Idx + 2] = b;
            PageData[Idx + 3] = a;
        }
        // See if a pixel is a similar enough color to fill based on the original selected pixel
        const SelectedColor = getRGBA(x, y);
        function comparePixels(x2, y2) {
            const Pixel = getRGBA(x2, y2);
            // Compare rgb channels of pixels
            const RGBTolerance = 138;
            const SquareError = (SelectedColor[0] - Pixel[0]) ** 2 +
                                (SelectedColor[1] - Pixel[1]) ** 2 +
                                (SelectedColor[2] - Pixel[2]) ** 2;
            // Compare alpha channels
            const AlphaTolerance = 254;
            const AlphaError = Math.abs(SelectedColor[3] - Pixel[3]);
                
            // Return a boolean
            return (SquareError <= RGBTolerance**2) && (AlphaError <= AlphaTolerance);
        }
            
        // Stack to track which pixels must be filled
        const FillStack = [];
        FillStack.push([x, y]);
        // Set to track visited pixels
        const Visited = new Set();
        // Loop through stack and track pixels to fill
        while (FillStack.length > 0) {
            // Get the top pixel on the stack
            const CoordPair = FillStack.pop();
            const CoordX = CoordPair[0];
            const CoordY = CoordPair[1];
            // Fill pixel
            setRGBA(CoordX, CoordY, FillColor[0], FillColor[1], FillColor[2], 255);
            Visited.add(`${CoordX},${CoordY}`);

            // List of the pixel above, below, left, and right of the popped pixel
            const NextCoords = [[CoordX-1, CoordY], [CoordX+1, CoordY], [CoordX, CoordY-1], [CoordX, CoordY+1]];
            // Loop through the next pixels
            for (const [nX, nY] of NextCoords) {
                if (checkInBounds(nX, nY) && comparePixels(nX, nY) && !Visited.has(`${nX},${nY}`)) {
                    // Push pixels to stack for review and set for tracking
                    FillStack.push([nX, nY]);
                }
            }
        }
        // Fill canvas with new paint pixel
        ctx.putImageData(PageImageData, 0, 0);
    }
    else if (IsSameColor) {
        console.log("You're trying to fill in a pixel of the same color!");
    }
    else if (!checkInBounds(x, y)) {
        console.log("This pixel is out of the canvas' bounds.");
    }
}
// Spray paint function.
function sprayPaint(x, y) {
    // Find every possible pixel that exists in a radius of (x,y)
    const Radius = brushSize/2;
    const Pixels = [];
    for (let x2 = x-Radius; x2 <= x+Radius; x2++) {
        for (let y2 = y-Radius; y2 <= y+Radius; y2++) {
            // Make sure pixel is within the canvas
            if (checkInBounds(x2, y2)) {
                // Make sure pixel is within a radius distance of center
                const Distance = Math.sqrt((x2-x)**2 + (y2-y)**2);
                if (Distance <= Radius) {
                    Pixels.push([x2, y2]);
                }
            }
        }
    }

    // Every 5 ms, draw a pixel within the circle of (x,y)
    const IntervalID = setInterval(sprayPixel, 5);
    function sprayPixel() {
        // Break out of interval if mouse is lifted or array is empty
        if (!isMouseDown || Pixels.length === 0) {
            clearInterval(IntervalID);
            // Return statement stops Pixels array from being popped while empty
            return;
        }
        // Break out of array if mouse moves
        if (globalThis.x !== x || globalThis.y !== y) {
            clearInterval(IntervalID);
        }
        // Pick a random coordinate from the empty space remaining and draw it
        const RandomNumber = Math.floor(Math.random() * Pixels.length);
        const CoordPair = Pixels.splice(RandomNumber, 1)[0];    // Remove a coordinate pair from the pixels array
        const CoordX = Math.floor(CoordPair[0]);
        const CoordY = Math.floor(CoordPair[1]);
        ctx.fillRect(CoordX, CoordY, 1, 1);
    }
}

// Draws a single pixel given an x and y coordinate.
function drawPoint(x, y) {
    switch (brushType) {
        case "colorPicker":
            colorPicker(x, y);
            break;
        case "pencil":
            pencil(x, y);
            break;
        case "eraser":
            eraser(x, y);
            break;
        case "paintBucket":
            paintBucket(x, y);
            break;
        case "sprayPaint":
            sprayPaint(x, y);
            break;
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
// Main draw function.
function draw(event) {
    // Appropriately draw points and lines
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
