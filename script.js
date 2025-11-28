import myCalc from './calculator.js';

const main = function () {
    document.addEventListener('keypress', (e) => {
        console.log(e.key);
        myCalc.captureUserInput(e.key);
    });
    document.addEventListener('click',(e) => {
        if (e.target.classList.contains("digit-button")) {
            myCalc.captureUserInput(e.target.innerText);
        };
    });
    return "done";
}

main();

