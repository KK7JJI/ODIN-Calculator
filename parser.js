export const shuntingYardParser = { 
    // ** shunting yard algorithm **
    
    infix_array: [],

    precedence: {
        '+': 1, 
        '-': 1, 
        '*': 2, 
        '/': 2, 
        '^': 3,
        '\u221A':3, //square root
        'sin': 5,
        'cos': 5,
        'tan': 5,
        'asin': 5,
        'acos': 5,
        'atan': 5,
        'log': 5,
        'ln': 5,
        '!' : 4,
    },

    associativity: {
        '+': 'L', 
        '-': 'L', 
        '*': 'L', 
        '/': 'L', 
        '^': 'R',
        'sin': 'L',
        'cos': 'L',
        'tan': 'L',
        'asin': 'L',
        'acos': 'L',
        'atan': 'L',
        'log': 'L',
        'ln': 'L',
        '\u221A': 'R', // square root
        '!': 'L',
    },

    operatorKeys: ["+","-","*","/","^"],
    operatorUnicode: ["+","\u2212","\u00D7","\u00F7","^"],

    postfixQueue: [],    // postfix notation  
    operatorStack: [],  // temporary storage
    temp_stack: [],

    degrees_or_radians: "rad", 


    resetParser(){
        this.infix_array.length = 0;
        this.postfixQueue.length = 0;
        this.operatorStack.length = 0;
    },

    convertUnicodeOperator(token) {

        if (this.operatorUnicode.includes(token)) { 
            token = this.operatorKeys[this.operatorUnicode.findIndex( (item) => item === token)];
        }
        return token;
    },

    processInfixExpression(expr) {
        this.infix_array = expr;
        this.processAllTokens();
        console.log("postfix: ");
        console.table(this.postfixQueue);        
    },

    processAllTokens() {
        this.infix_array.forEach( (token) => {
            token = this.convertUnicodeOperator(token);
            let classifyAs = this.classifyThisToken(token);
            console.log(`processAllTokens -> ${token}`);
            console.log(`classified as -> ${classifyAs}`);

            switch(classifyAs) {
                case "Number":
                    this.postfixQueue.push(token);
                    break;
                
                case "Operator":
                    this.processOperatorToken(token);
                    break;
                
                case "(":
                    this.operatorStack.push(token);
                    break;
                
                case ")":
                    this.processRightParentheses(token);
                    break;
                
                default:
                    // this is an error condition.
                    break;
            }
        });

        while (this.operatorStack.length > 0) {
            this.postfixQueue.push(this.operatorStack.pop());
        }

    },

    classifyThisToken(token) {

        let classifyAs;
        if (parseFloat(token)) {
            classifyAs = "Number";
        } else if (parseFloat(token) === 0) {
            classifyAs = "Number";
        } else if (token === "\u03C0") { // Pi
            classifyAs = "Number"
        } else if (token === "e") { // natural log base
            classifyAs = "Number"
        } else if (Object.keys(this.precedence).includes(token)) {
            classifyAs = "Operator";
        } else if (token === "(") {
            classifyAs = "(";
        } else if (token === ")") {
            classifyAs = ")";
        } else {
            classifyAs = "Value Error.";
        }
        return classifyAs;
    },

    processOperatorToken(token) {

        this.convertUnicodeOperator(token);

        let lastToken;
        while (this.operatorStack.length > 0) {
            lastToken = this.operatorStack.at(-1);
            if (Object.keys(this.precedence).includes(lastToken)) {
                if (this.associativity[token] === "L" && this.precedence[token] <= this.precedence[lastToken]) {
                    this.postfixQueue.push(this.operatorStack.pop());
                } else if (this.associativity[token] === "R" && this.precedence[token] < this.precedence[lastToken]) {
                    this.postfixQueue.push(this.operatorStack.pop());
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        this.operatorStack.push(token);
    },


    processRightParentheses(token) {
        // if I get to the end of the operatorStack without finding the closing parentheses
        // then I should be handling an error condition.
        
        while ( (this.operatorStack.length > 0) && (this.operatorStack.at(-1) != "(") ) {
            this.postfixQueue.push(this.operatorStack.pop());
        }
        this.operatorStack.pop() // the "(" token.
    },

    evaluatePostFix() {
        this.temp_stack.length = 0;
        let a, b;

        this.postfixQueue.forEach( (token) => {

            token = this.convertUnicodeOperator(token);
            token = this.removeHTMLTags(token);

            if (this.classifyThisToken(token) === "Number") {
                token = this.expandPiandE(token);
                this.temp_stack.push(parseFloat(token));
            } else {
                switch(token) {
                    case "+":
                        b = parseFloat(this.temp_stack.pop());
                        a = parseFloat(this.temp_stack.pop());
                        this.temp_stack.push(a+b);
                        break;
                    case "-":
                        b = parseFloat(this.temp_stack.pop());
                        a = parseFloat(this.temp_stack.pop());
                        this.temp_stack.push(a-b);
                        break;
                    case "*":
                        b = parseFloat(this.temp_stack.pop());
                        a = parseFloat(this.temp_stack.pop());
                        this.temp_stack.push(a*b);
                        break;
                    case "/":
                        b = parseFloat(this.temp_stack.pop());
                        a = parseFloat(this.temp_stack.pop());
                        this.temp_stack.push(a/b);
                        break;
                    case "^":
                        b = parseFloat(this.temp_stack.pop());
                        a = parseFloat(this.temp_stack.pop());
                        this.temp_stack.push(a ** b);
                        break;
                    case "!":
                        a = parseFloat(this.temp_stack.pop());
                        this.temp_stack.push(this.factorial(a));
                        break;
                    case "sin":
                        console.log(this.degrees_or_radians);
                        a = parseFloat(this.temp_stack.pop());
                        if (this.degrees_or_radians === "deg") a = (a * (2*Math.PI)/360.0);
                        this.temp_stack.push(Math.sin(a));
                        break;
                    case "cos":
                        a = parseFloat(this.temp_stack.pop());
                        if (this.degrees_or_radians === "deg") a = (a * (2*Math.PI)/360.0);
                        this.temp_stack.push(Math.cos(a));
                        break;
                    case "tan":
                        a = parseFloat(this.temp_stack.pop());
                        if (this.degree_or_radians === "deg") a = (a * (2*Math.PI)/360.0);
                        this.temp_stack.push(Math.tan(a));
                        break;
                    case "asin":
                        a = parseFloat(this.temp_stack.pop());
                        if (this.degrees_or_radians === "deg") {
                            this.temp_stack.push(360 / (2*Math.PI) * Math.asin(a));
                        } else {
                            this.temp_stack.push(Math.asin(a));
                        }
                        break;
                    case "acos":
                        a = parseFloat(this.temp_stack.pop());
                        if (this.degrees_or_radians === "deg") {
                            this.temp_stack.push(360 / (2*Math.PI) * Math.acos(a));
                        } else {
                            this.temp_stack.push(Math.acos(a));
                        }
                        break;
                    case "atan":
                        a = parseFloat(this.temp_stack.pop());
                        if (this.degrees_or_radians === "deg") {
                            this.temp_stack.push(360 / (2*Math.PI) * Math.atan(a));
                        } else {
                            this.temp_stack.push(Math.atan(a));
                        }
                        break;
                    case "log":
                        a = parseFloat(this.temp_stack.pop());
                        this.temp_stack.push(Math.log10(a)); // base 10
                        break;
                    case "ln":
                        a = parseFloat(this.temp_stack.pop());
                        this.temp_stack.push(Math.log(a)); // base e
                        break;
                    case "\u221A":
                        a = parseFloat(this.temp_stack.pop());
                        this.temp_stack.push(Math.sqrt(a));
                        break;

                    default:
                        // error condition.
                        break;
                };
            }
        });
        console.log("temp_stack");
        console.table(this.temp_stack);
        console.log(`Result: ${this.temp_stack.at(0)}`);
        return this.temp_stack.at(0);
    },

    expandPiandE(token) {
        console.log(`Operand = ${token}`);
        if (token === "\u03C0") { // pi symbol
            console.log(`Converting ${"\u03C0"} to ${Math.PI}`);
            return Math.PI;
        } else if (token === "e") {
            console.log(`Converting ${"e"} to ${Math.E}`);
            return Math.E;
        } else {
            return token;
        }
    },

    removeHTMLTags(stringValue) {
        const re_findHTMLTag = /\<.+?\>/;
        let textValue = stringValue;
        while (re_findHTMLTag.test(textValue)) {
            textValue = textValue.replace( textValue.match(this.re_findHTMLTag), "" );   
        }
        return textValue;
    },

    factorial(n) {

        if (n === 0 || n === 1) {
            return 1;
        } else {
            return n * this.factorial(n - 1);
        }
    },

}

