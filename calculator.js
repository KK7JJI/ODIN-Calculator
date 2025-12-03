import { shuntingYardParser } from "./parser.js";

// Calculator Object
export default {

    inputBuffer: [],
    tempBuffer: [],

    primaryDisplay: document.querySelector(".primary-display"),
    secondaryDisplayRight: document.querySelector(".upperdisplay-rightside"),
    messageDisplayLeft: document.querySelector(".upperdisplay-leftside"),
    altFunctionButton: document.querySelector(".alt-function-button"),
    functionButtons: document.querySelectorAll(".function-button"),

    displayPrecision: 3,
    calculatedValue: 0.0,
    zero: 0.0,

    userInput: "0.00",
    secondaryDisplayRight_value: "",
    messageDisplayLeft_value: "",

    re_testInput: /^\d|^\./,
    re_checkForDecimal: /\./,
    re_checkIfNumber: /^[+-]?\d+(\.\d+)?$/,
    re_findHTMLTag: /\<.+?\>/,

    operatorKeys: ["+","-","*","/","^"],
    operatorUnicode: ["+","\u2212","\u00D7","\u00F7","^"],

    immediateKeys: ["(",")"],
    immediateUnicode: ["\u0028", "\u0029"],

    functionNames: ["sin", "cos", "tan", "ln", "log", "e", "asin", "acos", "atan", "10^x"],
    function_alt_pairs: {
        "sin": "asin",
        "cos": "acos",
        "tan": "atan",
        "log": "10<sup>x<\sup>",
        "ln": "e<sup>x<\sup>",
    },

    //===========
    testParser() {
        // console.log(shuntingYardParser.parseExpression("sin,(,1,+,1,)".split(",")));
        // console.log(shuntingYardParser.evaluatePostFix());
    },

    show_alternate_function_keys() {
        if (this.altFunctionButton.classList.contains("alt-active")) {
            this.functionButtons.forEach( (functionButton) => {
                if (Object.keys(this.function_alt_pairs).includes(functionButton.innerHTML)) {
                    functionButton.innerHTML = this.function_alt_pairs[functionButton.innerText];
                }
            })
        } else {
            this.functionButtons.forEach( (functionButton) => {
                Object.entries(this.function_alt_pairs).map( (item) => {
                    let textValue = item[1];
                    if ( this.re_findHTMLTag.test(textValue) ) {
                        textValue = this.remove_html_tags_from_string(item[1])
                    }
                    if (textValue == functionButton.innerText) {
                        functionButton.innerText = item[0];
                    }
                })
            })
        }
    },

    remove_html_tags_from_string(stringValue) {
        let textValue = stringValue;
        while (this.re_findHTMLTag.test(textValue)) {
            textValue = textValue.replace( textValue.match(this.re_findHTMLTag), "" );   
        }
        return textValue;
    },

    capture_keyboard_input(e) {
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
            if (this.continue_prior_calculation()) {
                this.clear_all();
            }
            this.get_digit_button_presses(keydown);
        }

        if (keydown === "Backspace") {
            this.remove_last_user_input();
        }

        if (keydown === "Delete") {
            this.clear_all();
        }

        if (this.operatorKeys.includes(keydown)) {
            this.getOperatorButtonPresses(
                this.operatorUnicode[this.operatorKeys.findIndex((item) => item == keydown)]
            );
        }

        if (this.immediateKeys.includes(keydown)) {
            this.evaluate_immediate_calculator_functions(
                this.immediateUnicode[this.immediateKeys.findIndex((item) => item == keydown)]
            );
        }
                
        if (keydown === "=") {
            this.evaluate_result();
        }
    },

    capture_mouse_click_input(e) {
        // if a user interacts with the calculator buttons
        // via mouse clicks, this method handles individual
        // button actions.

        if (e.target.classList.contains("digit-button")) {
            if (this.continue_prior_calculation()) {
                this.clear_all();
            }
            this.get_digit_button_presses(e.target.innerText);
        }

        if (e.target.classList.contains("backspace-button")) {
            this.remove_last_user_input();
        }

        if (e.target.classList.contains("clearall-button")) {
            console.log(`click: ${e.target.innerText}`);
            this.clear_all();
        }

        if (e.target.classList.contains("immediate-button")) {
            this.evaluate_immediate_calculator_functions(e.target.innerText);
        }

        if (e.target.classList.contains("operator-button")) {
            this.get_calculator_operator_button_presses(e.target.innerText);
        }        if (e.target.classList.contains("function-button")) {
            this.get_calculator_function_button_presses(e.target.innerText);
        }

        if (e.target.classList.contains("evaluate-button")) {
            this.evaluate_result();
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
            this.show_alternate_function_keys();
        }

    },

    continue_prior_calculation() {
        
        if (this.inputBuffer.at(-1) === "=") {
            return true;
        } else {
            return false;
        }
    },

    get_last_index_of_this_token(token) {  // presumably either "(" or ")""

        const location = this.inputBuffer.reduce( (foundIndex, currentToken, currentIndex) => {
            if (currentToken === token) {
                return currentIndex;
            } else {
                return foundIndex;
            }
        }, -1);

        return location;
    },

    is_unterminated_expression() {

        if (this.get_last_index_of_this_token("(") > this.get_last_index_of_this_token(")") ) {
            return true;
        } else {
            return false;
        }
    },

    load_this_function(funcName) {

        if (this.continue_prior_calculation()) {
            let temp_value = this.calculatedValue;
            this.clear_all();
            this.userInput = temp_value;
            this.update_primary_display();
        }

        if ( this.inputBuffer.at(-1) === ")" && this.is_the_display_blank() ) { 
            // e.g. 2 x (2*Pi), input = 0.00 => 2 x sin(2 * Pi)
            // userInput is not included here since the operand is already
            // part of the prefix expression.

            this.pop_until_opening_parenthesis();

            if (this.update_previous_funcName()) {
                this.inputBuffer.pop(); // sin, cos, tan, log, ln, ...
                this.inputBuffer.push(funcName);
            } else {
                this.inputBuffer.push(funcName);
            }

            this.restore_tempBuffer_to_inputBuffer();

        } else if ( this.is_unterminated_expression() ) { 
            // e.g. 2 x (2*, input = 3.14 => 2 x sin(2 * 3.14)

            this.pop_until_opening_parenthesis();
            this.inputBuffer.push(funcName);

            this.restore_tempBuffer_to_inputBuffer();

            this.inputBuffer.push(this.userInput);
            this.inputBuffer.push(")");

        } else {
            // input = 3.14 => sin(3.14)
            this.inputBuffer.push(funcName);
            this.inputBuffer.push("(");
            this.inputBuffer.push(this.userInput);
            this.inputBuffer.push(")");

        }

        this.clear_primary_displays_update_prefix_display();

    },

    is_the_display_blank() {

        if (this.zero.toPrecision(this.displayPrecision) === this.userInput) {
            return true;
        } else {
            return false;
        }
    },
    
    restore_tempBuffer_to_inputBuffer() {
        while (this.tempBuffer.length > 0) {
            this.inputBuffer.push(this.tempBuffer.pop());
        }
    },

    pop_until_opening_parenthesis() {
        while (this.inputBuffer.length > 0 && this.inputBuffer.at(-1) != "(") {
            this.tempBuffer.push(this.inputBuffer.pop());
        }
        this.tempBuffer.push(this.inputBuffer.pop()); // "("
    },

    update_previous_funcName() {
        
        if (this.functionNames.includes(this.inputBuffer.at(-1))) {
            return true;            
        } else {
            return false;
        }

    },

    get_calculator_function_button_presses(funcName) {

        console.log(funcName);

        switch(funcName) {
            case "sin":
            case "cos":
            case "tan":
            case "log":
            case "ln":
                this.load_this_function(funcName);
                break;

            case "e":
                break;

            case "x!":
                break;
                
        }

    },

    get_calculator_operator_button_presses(a) { // a is +,-,*,^/

        a = (a==="xy") ? "^": a;

        if (this.continue_prior_calculation()) {
            let temp_value = this.calculatedValue;
            this.clear_all();
            this.userInput = temp_value;
            this.update_primary_display();
        }

        if (this.inputBuffer.at(-1) === ")") { // right parentheses ")"
            this.inputBuffer.push(a);
            this.update_prefix_expression_display();
        } else if (this.zero.toPrecision(this.displayPrecision) === this.userInput) {
            this.messageDisplayLeft_value = "Missing input.";
            this.update_user_messsage_display();
        } else {
            this.inputBuffer.push(this.userInput);
            this.inputBuffer.push(a);
            this.clear_primary_displays_update_prefix_display();         
        }

    },

    get_digit_button_presses(a) {

        if (this.re_testInput.test(a)) {

            if (this.zero.toPrecision(this.displayPrecision) === this.userInput) {
                this.userInput = "";
            }

            if ( !(a === "." && this.re_checkForDecimal.test(this.userInput)) ) {
                if (this.userInput.length < 25) {
                    this.update_user_input_value(a);
                    this.update_primary_display();
                }
            }
        }
        this.messageDisplayLeft_value = ""
        this.update_user_messsage_display();

    },

    evaluate_immediate_calculator_functions(funcName) {

        if (this.continue_prior_calculation()) {

            let temp_value = this.calculatedValue;
            switch (funcName) {
                case "Inv":
                case "\u0025": // percent
                case "\u00B1": // plus/minus
                    this.clear_all();
                    this.userInput = String(temp_value);
                    this.update_primary_display();
                    this.update_user_messsage_display();
                    break;

                case "(": // left parentheses
                    this.clear_all();
                    this.inputBuffer.push(funcName);
                    this.update_prefix_expression_display();
                    this.userInput = String(temp_value);
                    this.update_primary_display();
                    this.update_user_messsage_display();
                    a = 0;
                    break;

                case ")": // right parenthesis
                    this.messageDisplayLeft_value = "Error: Missing ')'"
                    this.update_user_messsage_display();
                    a = 0;
                    break;

                default:
                    this.clear_all(); 
            }
        }

        switch (funcName) {
            case "\u03C0": // pi

                this.update_user_input_value(funcName);
                this.update_primary_display();
                this.update_user_messsage_display();
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
                    this.update_primary_display()
                    this.update_user_messsage_display();
                }
                break;
            
            case "Inv": // inverse
                // to do - divide by zero error message in left hand display.

                if (parseFloat(this.userInput) == 0) {
                    this.messageDisplayLeft_value = "Error: Divide by zero.";
                    this.update_user_messsage_display();

                } else {
                    this.userInput = (1.0 / parseFloat(this.userInput)).toString();
                    this.update_primary_display();
                    this.update_user_messsage_display();
                }
                break;

            case "\u0025": // percent

                this.userInput = (parseFloat(this.userInput) / 100.0).toString();
                this.update_primary_display();
                this.update_user_messsage_display();
                break;

            case "(": // left parenthesis

                if ( this.re_checkIfNumber.test(String(this.inputBuffer.at(-1))) ) {
                    this.messageDisplayLeft_value = "Missing operand.";
                    this.update_user_messsage_display();

                } else if (this.inputBuffer.at(-1) === "\u0029") {
                    this.messageDisplayLeft_value = "Missing operand.";
                    this.update_user_messsage_display();

                } else {
                    this.inputBuffer.push(funcName);
                    this.update_user_messsage_display();
                    this.clear_primary_displays_update_prefix_display();
                }
                break;
            
            case ")": // right parenthesis
                if (this.zero.toPrecision(this.displayPrecision) === this.userInput) {
                    this.messageDisplayLeft_value = "Missing operand.";
                    this.update_user_messsage_display();

                } else {
                    this.inputBuffer.push(this.userInput);
                    this.inputBuffer.push(funcName);
                    this.update_user_messsage_display();
                    this.clear_primary_displays_update_prefix_display();

                }
                break;
        }
    },


    update_user_input_value (a) {
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

    remove_last_user_input() {
        // delete the last user input character by character.

        if (!(this.zero.toPrecision(this.displayPrecision) == this.userInput)) {
            this.userInput = this.userInput.slice(0,-1);
            if (this.userInput.length == 0) {
                this.userInput = "";
            }
            if (this.userInput === "-") {
                this.userInput = "";
            }

            this.update_primary_display();
        }
    },

    clear_all () {
        // clear buffers and reset display to 0.00.

        this.calculatedValue = 0;
        this.inputBuffer.length = 0;
        this.messageDisplayLeft_value = "";
        this.update_user_messsage_display();
        this.clear_primary_displays_update_prefix_display();

    },

    clear_primary_displays_update_prefix_display() {
        // principle display is reset to zeros.
        
        this.update_prefix_expression_display();
        this.userInput = "";
        this.update_primary_display();
    },

    update_primary_display() {
        // update the calculator's primary display.
        if (this.userInput == "") {
            this.userInput = this.zero.toPrecision(this.displayPrecision);
        }

        this.primaryDisplay.textContent = this.userInput;
    },

    update_prefix_expression_display() {
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

    update_user_messsage_display() {
        // update the calculator's upper left display.

        if (this.messageDisplayLeft_value === "") {
            this.messageDisplayLeft.textContent = "READY";
        } else {
            this.messageDisplayLeft.textContent = this.messageDisplayLeft_value;
        }
        this.messageDisplayLeft_value = "";
    },

    evaluate_result() {

        if (this.inputBuffer.at(-1) === "\u0029") { // right parenthesis
            this.inputBuffer.push("=");
            this.update_prefix_expression_display();
        } else {
            let inputValueReady = true;
            if (this.zero.toPrecision(this.displayPrecision) === this.userInput) {
                inputValueReady = false;
            }

            if (!(inputValueReady) && this.operatorKeys.includes(this.inputBuffer.at(-1))) {
                this.messageDisplayLeft_value = "Missing operand.";
                this.update_user_messsage_display();
            } else if (!(inputValueReady) && this.operatorUnicode.includes(this.inputBuffer.at(-1))) {
                this.messageDisplayLeft_value = "Missing operand.";
                this.update_user_messsage_display();
            } else if (!this.parentheses_balanced_are_balanced()) {
                this.messageDisplayLeft_value = "Unbalanced parentheses."
                this.update_user_messsage_display();
            } else {
                this.inputBuffer.push(this.userInput);
                this.inputBuffer.push("=");         
                this.clear_primary_displays_update_prefix_display();
            }
        }

        // to do: add evaluation logic.

        if (this.inputBuffer.at(-1) === "=") {
            this.calculatedValue = Math.PI; // I should be a number, not a string.
            this.display_result();
            this.messageDisplayLeft_value = "Answer";
            this.update_user_messsage_display();
        }

    },

    parentheses_balanced_are_balanced() {

        const leftparentheses = this.inputBuffer.filter((currentItem) => currentItem === "(");
        const rightparentheses = this.inputBuffer.filter((currentItem) => currentItem === ")")
        
        return leftparentheses.length === rightparentheses.length

    },

    updateDisplayValue (a) {
        this.displayValue = parseFloat(a);
    },

    display_result () {
         this.primaryDisplay.textContent = this.calculatedValue;
    },

};