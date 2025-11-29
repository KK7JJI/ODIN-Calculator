import myCalc from './calculator.js';

const main = function () {

    document.addEventListener('keydown', (e) => {
        myCalc.captureKeyboardInput(e);
    });

    document.addEventListener('click',(e) => {
        if (e.target.classList.contains("calculator-button")) {
            myCalc.captureMouseClickInput(e);
        }
    });
}

main();

