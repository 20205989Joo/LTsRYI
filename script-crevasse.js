document.addEventListener('DOMContentLoaded', () => {
    const memorizeButton = document.querySelector('.enterbutton_memorize');
    const alchemyButton = document.querySelector('.enterbutton_alchemy');

    alchemyButton.addEventListener('click', () => {
        window.location.href = 'CasualWordGuess1.html';

    });

    memorizeButton.addEventListener('click', () => {
        window.location.href = 'CasualWordMem1.html';
    });
});
