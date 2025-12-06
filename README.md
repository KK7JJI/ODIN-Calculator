# ODIN-Calculator
Capstone project for the ODIN fundamentals course.

The calculator captures user input from a combination of keyboard and mouse clicks.  Some features includes several common calculator functions including

- trig functions (sin, cos, tan)
- inverse trig functions (asin, acos, atan)
- trig calculation can be completed in both degree and radian modes
- log base 'e' and base '10'
- square root
- exponent operator
- factorial

Input is programmed into the calculate using standard infix expression notation. 
Parentheses can be used to group calculations.

[infix expressions] (https://en.wikipedia.org/wiki/Infix_notation)

The calculator allows for minor input corrections on the primary display via 
a keyboard backspace or the "<" button, however no provision is made to allow 
for the infix expression to be corrected once updated.

Calculations will automatically feed into the next entered expression when 
the user enters an operator or function.  It will start over automatically 
if a number is entered or the "AC" button is pressed.

Standardard arithmatic operators are entered as expected:

Examples:

    "2" + "+" + "2" => 2+2
    "3" * "(" + "1" + "2" + ")" + "-" + "5" => 3*(1+2)-5

Functions are generally entered operand first.  (Use of parentheses to 
ensure operand is grouped correctly is recommended.)

Examples:

    "10" + "log" => log(10)
    "(" + "2" + "*" + "Pi" + ")" + sin => sin(2*Pi)
    "(" + "5" + "(" + 5 + "x!" + ")" + "/" + "10" =>  (5+5!)/10

**Notes:**\
Pi and e are stored symbolically and expanded when the expression 
is evaluated to conserve display space.

Evaluation of the infix expression is accomplished by 
first converting to postfix using the Shunting yard algorith.
This allows the expression to be evaluated a step at a time 
while respecting operator precedence.

[Shunting yard algorithm] (https://en.wikipedia.org/wiki/Shunting_yard_algorithm)
[postfix expressions] (https://en.wikipedia.org/wiki/Reverse_Polish_notation)

The calculator will supply some error messages when then can
be caught prior to final evaluation.  These include missing 
operators, missing parentheses, divide by zero, etc.  The 
message will display in the top left corner of the display panel.

The infix expression will display in the top right corner of
the display panel.

User input and calculated results appear in the lower window 
of the primary display panel
