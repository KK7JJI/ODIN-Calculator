import myCalc from './calculator.js';

const main = function () {

    document.addEventListener('keydown', (e) => {
        myCalc.captureKeyboardInput(e);
    });

    document.addEventListener('click',(e) => {
        myCalc.captureMouseClickInput(e);
    });

}

main();

