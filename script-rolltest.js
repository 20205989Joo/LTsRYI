const roller = document.getElementById('roller');
const container = document.getElementById('container');
const items = Array.from(roller.children).slice(1, -1); // Ignore spacers
const itemHeight = 50;
const totalItems = items.length;
let startY_for_roller = 0; // Changed to prevent conflicts with other startY variables
let isSwiping_for_roller = false; // Changed to ensure swiping logic is isolated
let currentOffset_for_roller = 0; // Changed to avoid conflicts with other offset variables
let boundaryResistance = 15; // Resistance when at boundaries
let restrictBoundary = true; // Toggle for applying boundary logic

function restrictOffset(offset) {
    // Restrict offset for normal scrolling behavior (first item only)
    const minOffset = restrictBoundary ? 0 : -itemHeight;
    const maxOffset = (totalItems - 1) * itemHeight;
    if (offset < minOffset) return minOffset;
    if (offset > maxOffset) return maxOffset;
    return offset;
}

function updateRoller(offset) {
    roller.style.transform = `translateY(${-offset}px)`;

    // Highlight the center item
    const centerIndex = Math.round(offset / itemHeight);
    items.forEach((item, index) => {
        if (index === centerIndex) {
            item.style.fontSize = '1.5rem';
            item.style.color = '#007bff';
            item.style.opacity = '1';
        } else {
            item.style.fontSize = '1rem';
            item.style.color = '#aaa';
            item.style.opacity = '0.5';
        }
    });

    // Toggle restrictBoundary if the first item is highlighted
    restrictBoundary = currentOffset_for_roller !== 0;
}

function finalizeSwipe() {
    const closestIndex = Math.round(currentOffset_for_roller / itemHeight);
    currentOffset_for_roller = closestIndex * itemHeight;

    // Check if highlight is on the spacer above the first item
    if (currentOffset_for_roller === -itemHeight) {
        upButtonPressed();
        return;
    }

    updateRoller(currentOffset_for_roller);
}

container.addEventListener('touchstart', (e) => { if (!e.target.closest('.container')) return;
    startY_for_roller = e.touches[0].clientY; // Use roller-specific startY
    isSwiping_for_roller = true; // Use roller-specific swiping flag
});

document.addEventListener('touchmove', (e) => {
    if (!isSwiping_for_roller) return; // Check roller-specific swiping flag
    const deltaY_for_roller = e.touches[0].clientY - startY_for_roller; // Use roller-specific deltaY

    // Adjust offset and apply restrictOffset only when necessary
    currentOffset_for_roller -= deltaY_for_roller;
    currentOffset_for_roller = restrictOffset(currentOffset_for_roller);

    updateRoller(currentOffset_for_roller);
    startY_for_roller = e.touches[0].clientY; // Update roller-specific startY
});

document.addEventListener('touchend', () => {
    if (isSwiping_for_roller) {
        finalizeSwipe();
    }
    isSwiping_for_roller = false; // Reset roller-specific swiping flag
});

container.addEventListener('mousedown', (e) => { if (!e.target.closest('.container')) return;
    startY_for_roller = e.clientY; // Use roller-specific startY
    isSwiping_for_roller = true; // Use roller-specific swiping flag
});

document.addEventListener('mousemove', (e) => {
    if (!isSwiping_for_roller) return; // Check roller-specific swiping flag
    const deltaY_for_roller = e.clientY - startY_for_roller; // Use roller-specific deltaY

    // Adjust offset and apply restrictOffset only when necessary
    currentOffset_for_roller -= deltaY_for_roller;
    currentOffset_for_roller = restrictOffset(currentOffset_for_roller);

    updateRoller(currentOffset_for_roller);
    startY_for_roller = e.clientY; // Update roller-specific startY
});

document.addEventListener('mouseup', () => {
    if (isSwiping_for_roller) {
        finalizeSwipe();
    }
    isSwiping_for_roller = false; // Reset roller-specific swiping flag
});

function upButtonPressed() {
    if (currentOffset_for_roller > 0) {
        currentOffset_for_roller -= itemHeight;
    } else {
        currentOffset_for_roller = (totalItems - 1) * itemHeight; // Jump to the last item
    }
    updateRoller(currentOffset_for_roller);
}

function downButtonPressed() {
    const maxOffset = (totalItems - 1) * itemHeight;
    if (currentOffset_for_roller < maxOffset) {
        currentOffset_for_roller += itemHeight;
    } else {
        currentOffset_for_roller = 0; // Jump to the first item
    }
    updateRoller(currentOffset_for_roller);
}

updateRoller(currentOffset_for_roller);
