// Calculator Object
export default {

    inputBuffer: [],

    primaryDisplay: document.querySelector(".primary-display"),
    secondaryDisplayRight: document.querySelector(".upperdisplay-rightside"),
    messageDisplayLeft: document.querySelector(".upperdisplay-leftside"),

    displayPrecision: 3,
    calculatedValue: 0.0,
    zero: 0.0,

    userInput: "0.00",
    secondaryDisplayRight_value: "",
    messageDisplayLeft_value: "",

    re_testInput: /^\d|^\./,
    re_checkForDecimal: /\./,

    operatorKeys: ["+","-","*","/","="],
    operatorUnicode: ["+","\u2212","\u00D7","\u00F7","="],

    immediateKeys: ["(",")"],
    immediateUnicode: ["\u0028", "\u0029"],

    
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
            this.getDigitButtonPresses(e.key);
        }

        if (e.key === "Backspace") {
            this.removeLastUserInput();
        }

        if (e.key === "Delete") {
            this.clearAll();
        }

        if (this.operatorKeys.includes(e.key)) {
            this.getOperatorButtonPresses(
                this.operatorUnicode[this.operatorKeys.findIndex((item) => item == e.key)]
            );
        }

        if (this.immediateKeys.includes(e.key)) {
            this.evaluateImmediateCalculatorFunctions(
                this.immediateUnicode[this.immediateKeys.findIndex((item) => item == e.key)]
            );
        }
        
    },

    captureMouseClickInput(e) {
        // if a user interacts with the calculator buttons
        // via mouse clicks, this method handles individual
        // button actions.

        if (e.target.classList.contains("digit-button")) {
            this.getDigitButtonPresses(e.target.innerText);
        }

        if (e.target.innerText === "<") {
            this.removeLastUserInput();
        }

        if (e.target.innerText === "AC") {
            console.log(`click: ${e.target.innerText}`);
            this.clearAll();
        }

        if (e.target.classList.contains("immediate-button")) {
            this.evaluateImmediateCalculatorFunctions(e.target.innerText);
        }

        if (e.target.classList.contains("operator-button")) {
            this.getOperatorButtonPresses(e.target.innerText);
        }

    },

    getOperatorButtonPresses(a) { // a is +,-,*,/,=

        console.log("operator-button")
        if (!(this.inputBuffer[this.inputBuffer.length - 1] === "\u0029")) { 
            // there is no number between the closing right parenthesis and an operator.
            this.inputBuffer.push(this.userInput);
        }
        this.inputBuffer.push(a); 
        
        this.updateSecondaryDisplayRight();
        this.userInput = this.zero.toPrecision(this.displayPrecision);
        this.updateDisplay();

        //todo: if the operator is "=" then we need to evaluate the result.

    },

    getDigitButtonPresses(a) {

        if (this.re_testInput.test(a)) {

            if (this.zero.toPrecision(this.displayPrecision) === this.userInput) {
                this.userInput = "";
            }

            if ( !(a === "." && this.re_checkForDecimal.test(this.userInput)) ) {
                if (this.userInput.length < 25) {
                    this.updateUserInputValue(a);
                    this.updateDisplay();
                }
            }
        }

    },

    evaluateImmediateCalculatorFunctions(a) {

        switch (a) {
            case "\u03C0": // pi
                this.userInput = (Math.PI).toString();
                this.updateDisplay();
                break;
            
            case "\u00B1": // plus / minus

                if (parseFloat(this.userInput) == 0) {
                    console.log("negative zero");
                } else {
                    if (this.userInput.slice(0,1) === "-") {
                        this.userInput = this.userInput.slice(1);
                    } else {
                        this.userInput = "-" + this.userInput;
                    }
                    this.updateDisplay()
                }
                break;
            
            case "Inv": // inverse
                // to do - divide by zero error message in left hand display.

                if (parseFloat(this.userInput) == 0) {
                    console.log("divide by zero error.");
                } else {
                    this.userInput = (1.0 / parseFloat(this.userInput)).toString();
                    this.updateDisplay();
                }
                break;

            case "\u0025": // percent
                this.userInput = (parseFloat(this.userInput) / 100.0).toString();
                this.updateDisplay();
                break;

            case "\u0028": // left parenthesis
                this.inputBuffer.push(a);
                this.updateSecondaryDisplayRight();
                this.userInput = this.zero.toPrecision(this.displayPrecision);
                this.updateDisplay();
                break;
            
            case "\u0029": // right parenthesis
                this.inputBuffer.push(this.userInput);
                this.inputBuffer.push(a);
                this.updateSecondaryDisplayRight();
                this.userInput = this.zero.toPrecision(this.displayPrecision);
                this.updateDisplay();
                break;
        }
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
            if (this.userInput === "-") {
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
        this.updateSecondaryDisplayRight();
        this.messageDisplayLeft_value = "";
        this.updateMsgDisplayLeft();

    },

    updateDisplay() {
        // update the calculator's primary display.

        this.primaryDisplay.textContent = this.userInput;
    },

    updateSecondaryDisplayRight() {
        // update the calculator's upper right display.

        if (this.inputBuffer.length === 0) {
            this.secondaryDisplayRight_value = "(empty)"    
        } else {
            this.secondaryDisplayRight_value = this.inputBuffer.join(" ");
        }
        this.secondaryDisplayRight.textContent = this.secondaryDisplayRight_value;
    },

    updateMsgDisplayLeft() {
        // update the calculator's upper left display.

        if (this.messageDisplayLeft_value === "") {
            this.messageDisplayLeft.textContent = "READY";
        } else {
            this.messageDisplayLeft.textContent = this.messageDisplayLeft_value;
        }
    },

    updateDisplayValue (a) {
        this.displayValue = parseFloat(a);
    },

    displayCalculatedValue () {
        return calculatedValue.toPrecision(this.displayPrecision);
    },

};