export const shuntingYardParser = { 
    // ** shunting yard algorithm **
    
    infix_array: [],

    precedence: {
        '+': 1, 
        '-': 1, 
        '*': 2, 
        '/': 2, 
        '^': 3,
        'sin': 5,
        'cos': 5,
    },

    associativity: {
        '+': 'L', 
        '-': 'L', 
        '*': 'L', 
        '/': 'L', 
        '^': 'R',
        'sin': "L",
        'cos': "L",
    },

    operatorKeys: ["+","-","*","/","^"],
    operatorUnicode: ["+","\u2212","\u00D7","\u00F7","^"],

    
    postfixQueue: [],    // postfix notation  
    operatorStack: [],  // temporary storage
    temp_stack: [],


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

    parseExpression(expr) {
        this.infix_array = expr;
        this.processAllTokens();
    },

    processAllTokens() {
        this.infix_array.forEach( (token) => {
            token = this.convertUnicodeOperator(token);
            let classifyAs = this.classifyThisToken(token);
            // console.log(classifyAs);
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
        console.log("evaluatePostFix");
        this.temp_stack.length = 0;
        let a, b;

        this.postfixQueue.forEach( (token) => {

            console.log(`Token = ${token}`);
            token = this.convertUnicodeOperator(token);

            if (this.classifyThisToken(token) === "Number") {
                token = this.expandPi(token);
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
                    case "sin":
                        a = parseFloat(this.temp_stack.pop());
                        this.temp_stack.push(Math.sin(a));
                    case "cos":
                        a = parseFloat(this.temp_stack.pop());
                        this.temp_stack.push(Math.cos(a));

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

    expandPi(token) {
        console.log(`Operand = ${token}`);
        if (token === "\u03C0") { // pi symbol
            console.log(`Converting ${"\u03C0"} to ${Math.PI}`);
            return Math.PI;
        } else {
            return parseFloat(token);
        }
    }

}

