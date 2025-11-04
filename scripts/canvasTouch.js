// Event listener to handle actions when touch starts.
canvas.addEventListener("touchstart", (event) => {
    // Update isMouseDown
    isMouseDown = true;
    // Get x and y coordinates the moment touch starts
    const Bounding = canvas.getBoundingClientRect();
    const Touch = event.touches[0];
    x = Math.floor(Touch.clientX - Bounding.left);
    y = Math.floor(Touch.clientY - Bounding.top);
    // Prevent scrolling and zooming while touch starts
    event.preventDefault()
    // Draw for the event of a single pixel touch without movement
    draw(); // In canvasfunctions.js
});
// Event listener to handle actions when touch ends.
document.addEventListener("touchend", (event) => {
    isMouseDown = false;
    prevX = null;
    prevY = null;
});
// Event listener to handle updating the stateStack.
canvas.addEventListener("touchend", (event) => {
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
// Event listener to handle actions when touch is moving.
canvas.addEventListener("touchmove", (event) => {
    // Set x and y coordinates of touch based on canvas location on document
    const Bounding = canvas.getBoundingClientRect();
    const Touch = event.touches[0];
    x = Math.floor(Touch.clientX - Bounding.left);
    y = Math.floor(Touch.clientY - Bounding.top);
    // Update the current pixel tracker element
    if (checkInBounds(x, y)) {  // In canvasfunctions.js
        const headerH3 = document.getElementById("header-h3");
        headerH3.innerText = "Current Pixel: (" + x + "," + y +")";
    }
    // If touch is active, call the draw function
    if (isMouseDown) {
        draw(); // In canvasfunctions.js
    }
});