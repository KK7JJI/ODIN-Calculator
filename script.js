import myCalc from './calculator.js';

const main = function () {

    document.addEventListener('keypress', (e) => {
        myCalc.captureKeyboardInput(e);
    });

    document.addEventListener('click',(e) => {
        if (e.target.classList.contains("digit-button")) {
            myCalc.captureMouseClickInput(e);
        };
    });

}

main();

