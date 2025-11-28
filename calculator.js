// Calculator Object
export default {

    inputBuffer: [],
    primaryDisplay: document.querySelector(".primary-display"),

    displayPrecision: 3,
    calculatedValue: 0.0,
    zero: 0.0,

    userInput: "0.00",

    re_testInput: /^\d|^\./,
    re_checkForDecimal: /\./,
    
    add (a,b) {
        return a+b;
    },

    subtract (a,b) {
        return a-b;
    },

    multiply (a,b) {
        return a*b;
    },

    divide (a,b) {
        return a/b;
    },

    captureKeyboardInput(e) {
        // if a user interacts with the calculator via the keyboard
        // this method handles individual key down actions.

        // not all calculator methods are accessible via the 
        // keyboard.
        
        if (this.re_testInput.test(e.key)) {

            if (this.zero.toPrecision(this.displayPrecision) == this.userInput) {
                this.userInput = "";
            }

            if ( !(e.key === "." && this.re_checkForDecimal.test(this.userInput)) ) {
                if (this.userInput.length < 25) {
                    this.updateUserInputValue(e.key);
                    this.updateDisplay();
                }
            }
        };

        if (e.key === "Backspace") {
            this.removeLastUserInput();
        }

        if (e.key === "Delete") {
            this.clearAll();
        }

        if (e.key === "+") {
            console.log(`keydown: ${e.key}`);
        }

        if (e.key === "-") {
            console.log(`keydown: ${e.key}`);
        }

        if (e.key === "*") {
            console.log(`keydown: ${e.key}`);
        }

        if (e.key === "/") {
            console.log(`keydown: ${e.key}`);
        }

        if (e.key === "=") {
            console.log(`keydown: ${e.key}`);
        }

    },

    captureMouseClickInput(e) {
        // if a user interacts with the calculator buttons
        // via mouse clicks, this method handles individual
        // button actions.

        if (e.target.classList.contains("digit-button")) {
            if (this.re_testInput.test(e.target.innerText)) {

                if (this.zero.toPrecision(this.displayPrecision) == this.userInput) {
                    this.userInput = "";
                }

                if ( !(e.target.innerText === "." && this.re_checkForDecimal.test(this.userInput)) ) {
                    if (this.userInput.length < 25) {
                        this.updateUserInputValue(e.target.innerText);
                        this.updateDisplay();
                    }
                }
            }
        };

        console.log(`click: ${e.target.innerText}`);

        if (e.target.innerText === "<") {
            this.removeLastUserInput();
        };

        if (e.target.innerText === "AC") {
            console.log(`click: ${e.target.innerText}`);
            this.clearAll();
        };

        if (e.target.innerText === "+") {
            console.log(`click: ${e.target.innerText}`);
        };

        if (e.target.innerHTML === "\u2212") { // minus
            console.log(`click: ${e.target.innerHTML}`);
        };

        if (e.target.innerText === "\u00D7") { // times
            console.log(`click: ${e.target.innerText}`);
        };

        if (e.target.innerText === "\u00F7") { // divide
            console.log(`click: ${e.target.innerText}`);
        };

        if (e.target.innerText === "\u003D") { // equal
            console.log(`click: ${e.target.innerText}`);
        };

    },

    updateUserInputValue (a) {
        // append the user input value with the next 
        // character / digit entered by the user.
        
        this.userInput += a;
    },

    removeLastUserInput() {
        // delete the last user input character by character.

        if (!(this.zero.toPrecision(this.displayPrecision) == this.userInput)) {
            this.userInput = this.userInput.slice(0,-1);
            if (this.userInput.length == 0) {
                this.userInput = this.zero.toPrecision(this.displayPrecision);
            }
            this.updateDisplay();
        }

    },

    clearAll () {
        // clear buffers and reset display to 0.00.

        this.calculatedValue = 0;
        this.displayCalculatedValue = 0;
        this.userInput = this.zero.toPrecision(this.displayPrecision);
        this.inputBuffer.length = 0;
        this.updateDisplay();
    },

    updateDisplay() {
        // update the calculator's primary display.

        this.primaryDisplay.textContent = this.userInput;
    },

    updateDisplayValue (a) {
        this.displayValue = parseFloat(a);
    },

    displayCalculatedValue () {
        return calculatedValue.toPrecision(this.displayPrecision);
    },


};