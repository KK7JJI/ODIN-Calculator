// Calculator Object
export default {

    inputBuffer: [],
    primaryDisplay: document.querySelector(".primary-display"),

    displayPrecision: 2,
    displayValue: 0.0,
    userInput: "",

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
            if ( !(e.key === "." && this.re_checkForDecimal.test(this.userInput)) ) {
                if (this.userInput.length < 25) {
                    this.updateUserInputValue(e.key);
                    this.updateDisplay();
                }
            }
        };
    },

    captureMouseClickInput(e) {
        if (this.re_testInput.test(e.target.innerText)) {
            if ( !(e.target.innerText === "." && this.re_checkForDecimal.test(this.userInput)) ) {
                if (this.userInput.length < 25) {
                    this.updateUserInputValue(e.target.innerText);
                    this.updateDisplay();
                }
            }
        };
    },

    updateUserInputValue (a) {
        // accept digits and decimals.
        
        this.userInput += a;
    },

    updateDisplay() {
        this.primaryDisplay.textContent = this.userInput;
    },


    updateDisplayValue (a) {
        this.displayValue = parseFloat(a);
    },

    displayThisValue () {
        // I want to use this after a calculation to 
        // show a rounded result.
        return displayValue.toPrecision(this.displayPrecision);
    },

};