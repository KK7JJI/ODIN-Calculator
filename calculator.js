// Calculator Object
export default {

    inputBuffer: [],

    displayPrecision: 2,
    displayValue: 0.0,


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

    toFloat (a) {
        return parseFloat(a)        
    },

    displayText (a) {
        return a.displayValue.toPrecision(this.displayPrecision);
    }
};