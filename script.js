import myCalc from './calculator.js';

const main = function () {

    document.addEventListener('keydown', (e) => {
        e.preventDefault();
        myCalc.capture_keyboard_input(e);
    });

    document.addEventListener('click',(e) => {
        if (e.target.classList.contains("calculator-button")) {
            myCalc.capture_mouse_click_input(e);
        }
    });
}

main();

