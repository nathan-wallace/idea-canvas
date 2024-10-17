// JavaScript to update the span with the input value before printing
function updatePrintValue() {
    const input = document.getElementById('canvas-title-input-field');
    const printValueSpan = document.querySelector('.canvas-title-input .print-value');
    printValueSpan.textContent = input.value;
}

// Update the print value span before the print event
window.addEventListener('beforeprint', updatePrintValue);

// Central configuration for list of fields
const fields = [
    "problem-statement",
    "proposed-solution",
    "value-proposition",
    "implementation-plan",
    "potential-challenges",
    "target-users"
];

// Load saved data from local storage
function loadSavedData() {
    loadSavedCanvases();
    initializeCanvasTitleInput();
}

document.addEventListener("DOMContentLoaded", loadSavedData);

// Save data to local storage on input with debounce
function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

document.querySelectorAll("textarea, input[type='text']").forEach(input => {
    input.addEventListener("input", debounce(function() {
        const selectedCanvas = document.getElementById("canvas-title").value;
        if (selectedCanvas) {
            saveCanvas(selectedCanvas);
        }
    }, 300));
});

// Print the filled-out canvas
function printCanvas() {
    window.print();
}

// Save canvas data
function saveCanvas(canvasTitle = null) {
    if (!canvasTitle) {
        canvasTitle = document.getElementById("canvas-title-input-field").value.trim();
        if (!canvasTitle) {
            alert("Please enter a canvas title before creating.");
            return;
        }
    }

    const canvasData = {};
    fields.forEach(field => {
        canvasData[field] = document.getElementById(field).value;
    });

    localStorage.setItem(canvasTitle, JSON.stringify(canvasData));
    loadSavedCanvases();

    // Update the canvas title input field with the saved title
    document.getElementById("canvas-title-input-field").value = canvasTitle;
}

// Load saved canvases into the select list
function loadSavedCanvases() {
    const canvasTitleSelect = document.getElementById("canvas-title");
    canvasTitleSelect.innerHTML = '<option value="">Select or Enter a Canvas Title</option>';

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
            const canvasData = JSON.parse(localStorage.getItem(key)); // Check if the item is valid JSON
            if (canvasData && typeof canvasData === 'object' && !Array.isArray(canvasData)) {
                const option = document.createElement("option");
                option.value = key;
                option.textContent = key;
                canvasTitleSelect.appendChild(option);
            }
        } catch (e) {
            // Skip invalid items
        }
    }
}

// Initialize canvas title input to be a combination of text input and select list
function initializeCanvasTitleInput() {
    const canvasTitleSelect = document.getElementById("canvas-title");
    const canvasTitleInput = document.getElementById("canvas-title-input-field");

    // Add event listener for selecting existing canvas
    canvasTitleSelect.addEventListener("change", function() {
        const selectedCanvas = this.value;
        if (selectedCanvas) {
            loadSelectedCanvasData(selectedCanvas);
            canvasTitleInput.value = selectedCanvas; // Update title input field with selected title
        } else {
            clearFields();
            canvasTitleInput.value = "";
        }
    });

    // Add event listener to update the title in the select list when the title input field changes
    canvasTitleInput.addEventListener("input", function() {
        const newTitle = this.value.trim();
        if (newTitle) {
            document.getElementById("canvas-title").value = newTitle;
        }
    });
}

// Delete the selected canvas
function deleteCanvas() {
    const canvasTitleSelect = document.getElementById("canvas-title");
    const selectedCanvas = canvasTitleSelect.value;

    if (!selectedCanvas) {
        alert("Please select a canvas to delete.");
        return;
    }

    localStorage.removeItem(selectedCanvas);
    loadSavedCanvases();
    alert("Canvas deleted successfully.");
    clearFields();
    document.getElementById("canvas-title-input-field").value = "";
}

// Load selected canvas data
function loadSelectedCanvasData(selectedCanvas) {
    const canvasData = JSON.parse(localStorage.getItem(selectedCanvas));
    fields.forEach(field => {
        document.getElementById(field).value = canvasData[field] || "";
    });
}

// Clear all input fields
function clearFields() {
    fields.forEach(field => {
        document.getElementById(field).value = "";
    });
}

// Modal functionality
const instructionsButton = document.getElementById('instructions-button');
const modal = document.getElementById('instructions-modal');
const closeModalButton = document.getElementById('close-modal');

instructionsButton.addEventListener('click', function() {
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'block';
});

closeModalButton.addEventListener('click', function() {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
    }
});
