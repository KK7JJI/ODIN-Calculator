import { shuntingYardParser } from "./parser.js";

// Calculator Object
export default {

    inputBuffer: [],
    tempBuffer: [],

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
    re_checkIfNumber: /^[+-]?\d+(\.\d+)?$/,

    operatorKeys: ["+","-","*","/","^"],
    operatorUnicode: ["+","\u2212","\u00D7","\u00F7","^"],

    immediateKeys: ["(",")"],
    immediateUnicode: ["\u0028", "\u0029"],

    functionNames: ["sin", "cos", "tan", "ln", "log", "e", "asin", "acos", "atan", "invlog"],

    //===========
    testParser() {
        // console.log(shuntingYardParser.parseExpression("sin,(,1,+,1,)".split(",")));
        // console.log(shuntingYardParser.evaluatePostFix());
    },

    captureKeyboardInput(e) {
        // if a user interacts with the calculator via the keyboard
        // this method handles individual key down actions.

        // not all calculator methods are accessible via the 
        // keyboard.
        
        console.log(e.key);
        console.log(e.keyCode);
        console.log(e.shiftKey);

        let keydown = e.key;
        if (e.keyCode === 57 && e.shiftKey) { // left parentheses shift + 9
            keydown = "(";
        }

        if (e.keyCode === 48 && e.shiftKey) { // right parentheses shift + 0
            keydown = ")";
        }

        if (e.keyCode === 54 && e.shiftKey) { // carrot - exponent operator shift + 6
            keydown = "^";    
        }

        // ============
        if (keydown === "q") {
            this.testParser();
        }

        if (this.re_testInput.test(keydown)) {
            if (this.continuePreviousCalculation()) {
                this.clearAll();
            }
            this.getDigitButtonPresses(keydown);
        }

        if (keydown === "Backspace") {
            this.removeLastUserInput();
        }

        if (keydown === "Delete") {
            this.clearAll();
        }

        if (this.operatorKeys.includes(keydown)) {
            this.getOperatorButtonPresses(
                this.operatorUnicode[this.operatorKeys.findIndex((item) => item == keydown)]
            );
        }

        if (this.immediateKeys.includes(keydown)) {
            this.evaluateImmediateCalculatorFunctions(
                this.immediateUnicode[this.immediateKeys.findIndex((item) => item == keydown)]
            );
        }
                
        if (keydown === "=") {
            this.evaluateResult();
        }
    },

    captureMouseClickInput(e) {
        // if a user interacts with the calculator buttons
        // via mouse clicks, this method handles individual
        // button actions.

        if (e.target.classList.contains("digit-button")) {
            if (this.continuePreviousCalculation()) {
                this.clearAll();
            }
            this.getDigitButtonPresses(e.target.innerText);
        }

        if (e.target.classList.contains("backspace-button")) {
            this.removeLastUserInput();
        }

        if (e.target.classList.contains("clearall-button")) {
            console.log(`click: ${e.target.innerText}`);
            this.clearAll();
        }

        if (e.target.classList.contains("immediate-button")) {
            this.evaluateImmediateCalculatorFunctions(e.target.innerText);
        }

        if (e.target.classList.contains("operator-button")) {
            this.getOperatorButtonPresses(e.target.innerText);
        }

        if (e.target.classList.contains("function-button")) {
            this.getFunctionButtonPresses(e.target.innerText);
        }

        if (e.target.classList.contains("evaluate-button")) {
            this.evaluateResult();
        }

        if (e.target.classList.contains("degree-radian-button")) {
            if (e.target.innerText === "rad") {
                e.target.innerText = "deg";
            } else {
                e.target.innerText = "rad";
            }
            // need code to handle evaluating degrees vs radians
            // for the trig functions.
        }

        if (e.target.classList.contains("alt-function-button")) {
            if (e.target.classList.contains("alt-active")) {
                e.target.classList.remove("alt-active");
            } else {
                e.target.classList.add("alt-active");
            }
            // need code to rename function keys with alt functions.
            // i.e. asin, acos, atan, etc.
        }


    },

    continuePreviousCalculation() {
        
        if (this.inputBuffer.at(-1) === "=") {
            return true;
        } else {
            return false;
        }
    },

    getLastIndexofThisToken(a) {  // presumably either "(" or ")""

        const location = this.inputBuffer.reduce( (foundIndex, currentToken, currentIndex) => {
            if (currentToken === a) {
                return currentIndex;
            } else {
                return foundIndex;
            }
        }, -1);

        return location;
    },

    isUnterminatedExpression() {

        if (this.getLastIndexofThisToken("(") > this.getLastIndexofThisToken(")") ) {
            return true;
        } else {
            return false;
        }
    },

    isTheDisplayBlank() {

        if (this.zero.toPrecision(this.displayPrecision) === this.userInput) {
            return true;
        } else {
            return false;
        }
    },

    loadThisFunction(a) {

        if (this.continuePreviousCalculation()) {
            let temp_value = this.calculatedValue;
            this.clearAll();
            this.userInput = temp_value
            this.updateDisplay();
        }

        if ( this.inputBuffer.at(-1) === ")" && this.isTheDisplayBlank() ) { 
            // e.g. 2 x (2*Pi), input = 0.00 => 2 x sin(2 * Pi) 

            while (this.inputBuffer.at(-1) != "(") {
                this.tempBuffer.push(this.inputBuffer.pop());
            }
            this.tempBuffer.push(this.inputBuffer.pop()); // "("

            if (this.functionNames.includes(this.inputBuffer.at(-1))) {
                this.inputBuffer.pop(); // making a correction, replace this.
            }

            this.inputBuffer.push(a);
            while (this.tempBuffer.length > 0) {
                this.inputBuffer.push(this.tempBuffer.pop());
            }

            this.updateSecondaryDisplayRight();
            this.userInput = "";
            this.updateDisplay();

        } else if ( this.isUnterminatedExpression() ) { 
            // e.g. 2 x (2*, input = 3.14 => 2 x sin(2 * 3.14)

            while (this.inputBuffer.at(-1) != "(") {
                this.tempBuffer.push(this.inputBuffer.pop());
            }
            this.tempBuffer.push(this.inputBuffer.pop()); // "("

            this.inputBuffer.push(a);
            while (this.tempBuffer.length > 0) {
                this.inputBuffer.push(this.tempBuffer.pop());
            }
            this.inputBuffer.push(this.userInput);
            this.inputBuffer.push(")");
            this.updateSecondaryDisplayRight();
            this.userInput = "";
            this.updateDisplay();

        } else {
            // input = 3.14 => sin(3.14)
            this.inputBuffer.push(a);
            this.inputBuffer.push("(");
            this.inputBuffer.push(this.userInput);
            this.inputBuffer.push(")");
            this.updateSecondaryDisplayRight();
            this.userInput = "";
            this.updateDisplay();
        }
    },

    getFunctionButtonPresses(a) {

        console.log(a);

        switch(a) {
            case "sin":
            case "cos":
            case "tan":
            case "log":
            case "ln":
                this.loadThisFunction(a);
                break;

            case "e":
                break;

            case "x!":
                break;
                
        }

    },

    getOperatorButtonPresses(a) { // a is +,-,*,^/

        console.log("operator-button")

        a = (a==="xy") ? "^": a;

        if (this.continuePreviousCalculation()) {
            let temp_value = this.calculatedValue;
            this.clearAll();
            this.userInput = temp_value
            this.updateDisplay();
        }

        if (this.inputBuffer.at(-1) === ")") { // right parentheses ")"
            this.inputBuffer.push(a);
            this.updateSecondaryDisplayRight();
        } else if (this.zero.toPrecision(this.displayPrecision) === this.userInput) {
            this.messageDisplayLeft_value = "Missing input.";
            this.updateMsgDisplayLeft();
        } else {
            this.inputBuffer.push(this.userInput);
            this.inputBuffer.push(a);         
            this.updateSecondaryDisplayRight();
            this.userInput = "";
            this.updateDisplay();
        }

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
        this.messageDisplayLeft_value = ""
        this.updateMsgDisplayLeft();

    },

    evaluateImmediateCalculatorFunctions(a) {

        if (this.continuePreviousCalculation()) {

            let temp_value = this.calculatedValue;
            switch (a) {
                case "Inv":
                case "\u0025": // percent
                case "\u00B1": // plus/minus
                    this.clearAll();
                    this.userInput = String(temp_value);
                    this.updateDisplay();
                    this.updateMsgDisplayLeft();
                    break;

                case "(": // left parentheses
                    this.clearAll();
                    this.inputBuffer.push(a);
                    this.updateSecondaryDisplayRight();
                    this.userInput = String(temp_value);
                    this.updateDisplay();
                    this.updateMsgDisplayLeft();
                    a = 0;
                    break;

                case ")": // right parenthesis
                    this.messageDisplayLeft_value = "Error: Missing ')'"
                    this.updateMsgDisplayLeft();
                    a = 0;
                    break;

                default:
                    this.clearAll(); 
            }
        }

        switch (a) {
            case "\u03C0": // pi

                this.updateUserInputValue(a);
                this.updateDisplay();
                this.updateMsgDisplayLeft();
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
                    this.updateMsgDisplayLeft();
                }
                break;
            
            case "Inv": // inverse
                // to do - divide by zero error message in left hand display.

                if (parseFloat(this.userInput) == 0) {
                    this.messageDisplayLeft_value = "Error: Divide by zero.";
                    this.updateMsgDisplayLeft();

                } else {
                    this.userInput = (1.0 / parseFloat(this.userInput)).toString();
                    this.updateDisplay();
                    this.updateMsgDisplayLeft();
                }
                break;

            case "\u0025": // percent

                this.userInput = (parseFloat(this.userInput) / 100.0).toString();
                this.updateDisplay();
                this.updateMsgDisplayLeft();
                break;

            case "(": // left parenthesis

                if ( this.re_checkIfNumber.test(String(this.inputBuffer.at(-1))) ) {
                    this.messageDisplayLeft_value = "Missing operand.";
                    this.updateMsgDisplayLeft();

                } else if (this.inputBuffer.at(-1) === "\u0029") {
                    this.messageDisplayLeft_value = "Missing operand.";
                    this.updateMsgDisplayLeft();

                } else {
                    this.inputBuffer.push(a);
                    this.updateSecondaryDisplayRight();
                    this.userInput = "";
                    this.updateDisplay();
                    this.updateMsgDisplayLeft();
                }
                break;
            
            case ")": // right parenthesis
                if (this.zero.toPrecision(this.displayPrecision) === this.userInput) {
                    this.messageDisplayLeft_value = "Missing operand.";
                    this.updateMsgDisplayLeft();

                } else {
                    this.inputBuffer.push(this.userInput);
                    this.inputBuffer.push(a);
                    this.updateSecondaryDisplayRight();
                    this.userInput = "";
                    this.updateDisplay();
                    this.updateMsgDisplayLeft();

                }
                break;
        }
    },


    updateUserInputValue (a) {
        // append the user input value with the next 
        // character / digit entered by the user.

        if (this.zero.toPrecision(this.displayPrecision) == this.userInput) {
            this.userInput = "";
        }
        this.userInput += a;

        // the calculator will not assume multiplication on an entry of 2pi.
        if (this.userInput.length > 1 && a === "\u03C0") {
            this.userInput = "";
            this.messageDisplayLeft_value = "ERROR: Missing Operator";
        }

    },

    removeLastUserInput() {
        // delete the last user input character by character.

        if (!(this.zero.toPrecision(this.displayPrecision) == this.userInput)) {
            this.userInput = this.userInput.slice(0,-1);
            if (this.userInput.length == 0) {
                this.userInput = "";
            }
            if (this.userInput === "-") {
                this.userInput = "";
            }

            this.updateDisplay();
        }
    },

    clearAll () {
        // clear buffers and reset display to 0.00.

        this.calculatedValue = 0;
        this.userInput = "";
        this.inputBuffer.length = 0;
        this.updateDisplay();
        this.updateSecondaryDisplayRight();
        this.messageDisplayLeft_value = "";
        this.updateMsgDisplayLeft();

    },

    updateDisplay() {
        // update the calculator's primary display.
        if (this.userInput == "") {
            this.userInput = this.zero.toPrecision(this.displayPrecision);
        }

        this.primaryDisplay.textContent = this.userInput;
    },

    updateSecondaryDisplayRight() {
        // update the calculator's upper right display.

        let local_temp_buffer = this.inputBuffer.map((x) => {
            if (this.re_checkIfNumber.test(x)) {
                return String((parseFloat(x)).toPrecision(this.displayPrecision));
            } else {
                return x;
            }
        })

        if (local_temp_buffer.length === 0) {
            this.secondaryDisplayRight_value = "(empty)"    
        } else {
            this.secondaryDisplayRight_value = local_temp_buffer.join(" ");
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
        this.messageDisplayLeft_value = "";
    },

    evaluateResult() {

        if (this.inputBuffer.at(-1) === "\u0029") { // right parenthesis
            this.inputBuffer.push("=");
            this.updateSecondaryDisplayRight();
        } else {
            let inputValueReady = true;
            if (this.zero.toPrecision(this.displayPrecision) === this.userInput) {
                inputValueReady = false;
            }

            if (!(inputValueReady) && this.operatorKeys.includes(this.inputBuffer.at(-1))) {
                this.messageDisplayLeft_value = "Missing operand.";
                this.updateMsgDisplayLeft();
            } else if (!(inputValueReady) && this.operatorUnicode.includes(this.inputBuffer.at(-1))) {
                this.messageDisplayLeft_value = "Missing operand.";
                this.updateMsgDisplayLeft();
            } else if (!this.checkForBalancedParentheses()) {
                this.messageDisplayLeft_value = "Unbalanced parentheses."
                this.updateMsgDisplayLeft();
            } else {
                this.inputBuffer.push(this.userInput);
                this.inputBuffer.push("=");         
                this.updateSecondaryDisplayRight();
                this.userInput = "";
                this.updateDisplay();
            }
        }

        // to do: add evaluation logic.

        if (this.inputBuffer.at(-1) === "=") {
            this.calculatedValue = Math.PI; // I should be a number, not a string.
            this.displayCalculatedValue();
            this.messageDisplayLeft_value = "Answer";
            this.updateMsgDisplayLeft();
        }

    },

    checkForBalancedParentheses() {

        const leftparentheses = this.inputBuffer.filter((currentItem) => currentItem === "(");
        const rightparentheses = this.inputBuffer.filter((currentItem) => currentItem === ")")
        
        return leftparentheses.length === rightparentheses.length

    },

    updateDisplayValue (a) {
        this.displayValue = parseFloat(a);
    },

    displayCalculatedValue () {
         this.primaryDisplay.textContent = this.calculatedValue;
    },

};