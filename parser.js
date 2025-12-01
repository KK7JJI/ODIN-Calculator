export const shuntingYardParser = { 
    // ** shunting yard algorithm **
    
    infix_array: [],

    precedence: {
        '+': 1, 
        '-': 1, 
        '*': 2, 
        '/': 2, 
        '^': 3},

    associativity: {
        '+': 'L', 
        '-': 'L', 
        '*': 'L', 
        '/': 'L', 
        '^': 'R'},

    postfixQueue: [],    // postfix notation  
    operatorStack: [],  // temporary storage


    parseExpression(expr) {
        this.infix_array = expr;
        this.processAllTokens();
        return this.postfixQueue;
    },


    processAllTokens() {
        this.infix_array.forEach( (token) => {

            let classifyAs = this.classifyThisToken(token);
            console.log(classifyAs);

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
        let temp_stack = [];
        let a, b;

        this.postfixQueue.forEach( (token) => {
            if (this.classifyThisToken(token) === "Number") {
                console.log(token);
                temp_stack.push(parseFloat(token));
            } else {
                console.log(`${a} ${token} ${b}`);
                switch(token) {
                    case "+":
                        b = temp_stack.pop();
                        a = temp_stack.pop();
                        temp_stack.push(a+b);
                        break;
                    case "-":
                        b = temp_stack.pop();
                        a = temp_stack.pop();
                        temp_stack.push(a-b);
                        break;
                    case "*":
                        b = temp_stack.pop();
                        a = temp_stack.pop();
                        temp_stack.push(a*b);
                        break;
                    case "/":
                        b = temp_stack.pop();
                        a = temp_stack.pop();
                        temp_stack.push(a/b);
                        break;
                    case "^":
                        b = temp_stack.pop();
                        a = temp_stack.pop();
                        temp_stack.push(a ** b);
                        break;
                    default:
                        // error condition.
                        break;
                };
            }
        });
        return temp_stack.at(0);

    }
}

