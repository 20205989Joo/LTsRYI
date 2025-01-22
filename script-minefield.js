// script-minefield.js

document.addEventListener("DOMContentLoaded", () => {
    const wordTestButton = document.querySelector(".enterbutton_wordtest");

    if (wordTestButton) {
        wordTestButton.addEventListener("click", () => {
            window.location.href = "CasualWordTest1.html";
        });
    }
});
