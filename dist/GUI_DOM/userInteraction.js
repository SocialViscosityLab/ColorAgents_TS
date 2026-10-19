"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpUserInteractions = setUpUserInteractions;
function setUpUserInteractions() {
    const floatingDivs = document.querySelectorAll(".floating-div");
    const dragHandles = document.querySelectorAll(".drag-handle");
    // Trigger when user presses mouse down on the handle
    dragHandles.forEach((handle) => {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        handle.addEventListener("mousedown", (e) => {
            if (!handle.classList.contains("drag-handle"))
                return;
            const floatingDiv = handle.closest(".floating-div");
            if (!floatingDiv)
                return;
            if (isDragging)
                return; // Prevent starting a new drag if one is already in progress
            isDragging = true;
            floatingDiv.style.position = "fixed";
            // Calculate cursor offset relative to the upper-left corner of the div
            offsetX = e.clientX - floatingDiv.getBoundingClientRect().left;
            offsetY = e.clientY - floatingDiv.getBoundingClientRect().top;
            let offsetHandleX = e.pageX - handle.getBoundingClientRect().left;
            let offsetHandleY = e.pageY - handle.getBoundingClientRect().top;
            // Apply coordinates to element styles
            floatingDiv.style.left = `${e.clientX - offsetHandleX}px`;
            floatingDiv.style.top = `${e.clientY - offsetHandleY}px`;
            // Add listeners to document so dragging doesn't break if cursor leaves the element temporarily
            document.addEventListener("mousemove", (event) => handleMouseMove(event, handle, floatingDiv));
            document.addEventListener("mouseup", handleMouseUp);
        });
        function handleMouseMove(e, dragHandle = null, floatingDiv = null) {
            if (!isDragging)
                return;
            // Calculate new position coordinates
            let newX = e.clientX - offsetX;
            let newY = e.clientY;
            // Screen bounds restriction (keeps the div inside the visible viewport)
            const minX = 0;
            const minY = 0;
            const maxX = window.innerWidth - floatingDiv.offsetWidth;
            const maxY = window.innerHeight - dragHandle.offsetHeight;
            // Clamp values so div stays on screen
            newX = Math.max(minX, Math.min(newX, maxX));
            newY = Math.max(minY, Math.min(newY, maxY));
            // Apply coordinates to element styles
            floatingDiv.style.left = `${newX}px`;
            floatingDiv.style.top = `${newY}px`;
        }
        function handleMouseUp() {
            isDragging = false;
            offsetX = 0;
            offsetY = 0;
            // Clear document events to optimize performance
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
    });
}
//# sourceMappingURL=userInteraction.js.map