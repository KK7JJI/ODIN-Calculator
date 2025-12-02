import myCalc from './calculator.js';
import { shuntingYardParser } from './parser.js';

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

myCalc.testParser();

main();

