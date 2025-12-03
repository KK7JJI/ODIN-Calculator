import myCalc from './calculator.js';
import { shuntingYardParser } from './parser.js';

const main = function () {

    document.addEventListener('keydown', (e) => {
        myCalc.capture_keyboard_input(e);
    });

    document.addEventListener('click',(e) => {
        if (e.target.classList.contains("calculator-button")) {
            myCalc.capture_mouse_click_input(e);
        }
    });
}

myCalc.testParser();

main();

