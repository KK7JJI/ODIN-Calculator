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

    captureUserInput(a) {
        if (this.re_testInput.test(a)) {
            if ( !(a === "." && this.re_checkForDecimal.test(this.userInput)) ) {
                this.updateUserInputValue(a);
                this.updateDisplay();
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