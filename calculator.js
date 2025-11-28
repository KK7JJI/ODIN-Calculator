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

    },

    captureMouseClickInput(e) {

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

        if (e.target.innerText === "<") {
            this.removeLastUserInput();
        }
    },

    updateUserInputValue (a) {
        // accept digits and decimals.
        
        this.userInput += a;
    },

    removeLastUserInput() {

        if (!(this.zero.toPrecision(this.displayPrecision) == this.userInput)) {
            this.userInput = this.userInput.slice(0,-1);
            if (this.userInput.length == 0) {
                this.userInput = this.zero.toPrecision(this.displayPrecision);
            }
            this.updateDisplay();
        }

    },


    updateDisplay() {
        this.primaryDisplay.textContent = this.userInput;
    },

    updateDisplayValue (a) {
        this.displayValue = parseFloat(a);
    },

    displayCalculatedValue () {
        // I want to use this after a calculation to 
        // show a rounded result.
        return calculatedValue.toPrecision(this.displayPrecision);
    },


};