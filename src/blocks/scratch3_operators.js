const Cast = require('../util/cast.js');
const MathUtil = require('../util/math-util.js');

class Scratch3OperatorsBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            operator_add: this.add,
            operator_subtract: this.subtract,
            operator_multiply: this.multiply,
            operator_divide: this.divide,
            operator_lt: this.lt,
            operator_equals: this.equals,
            operator_gt: this.gt,
            operator_and: this.and,
            operator_or: this.or,
            operator_not: this.not,
            operator_random: this.random,
            operator_join: this.join,
            operator_letter_of: this.letterOf,
            operator_length: this.length,
            operator_contains: this.contains,
            operator_mod: this.mod,
            operator_round: this.round,
            operator_mathop: this.mathop,
            operator_tb_power: this.power,
            operator_tb_exactEquals: this.exactEquals,
            operator_tb_true: this.true,
            operator_tb_false: this.false,
            operator_tb_newLine: this.newLine,
            operator_tb_pi: this.pi,
            operator_tb_e: this.e,
            operator_tb_infinity: this.infinity,
            operator_tb_inlineIf: this.inlineIf,
            operator_tb_substring: this.substring,
            operator_tb_startsWith: this.startsWith,
            operator_tb_endsWith: this.endsWith,
            operator_tb_gtOrEqual: this.gtOrEqual,
            operator_tb_ltOrEqual: this.ltOrEqual,
            operator_tb_atan2: this.atan2
        };
    }

    newLine() {
        return Cast.toString("\n")
    }

    true() {
        return Cast.toBoolean(true)
    }

    false() {
        return Cast.toBoolean(false)
    }

    inlineIf(args) {
        return Cast.toString(args.CONDITION ? args.IFTRUE : args.IFFALSE)
    }

    pi() {
        return Cast.toString(3.141592653589793238462643383279502884197)
    }

    e() {
        return Cast.toString(2.7182818284590452353602874713527)
    }

    infinity() {
        return Cast.toString("Infinity")
    }

    substring(args) {
        const text = Cast.toString(args.TEXT)
        const start = Math.round(Cast.toNumber(args.START) - 1)
        const end = Math.round(Cast.toNumber(args.END || text.length))
        console.log(text, start, end, args.END)
        if (end < start) return "";
        return Cast.toString(text.substring(start, end))
    }

    startsWith(args) {
        return Cast.toBoolean(Cast.toString(args.TEXT).startsWith(Cast.toString(args.STARTS)))
    }

    endsWith(args) {
        return Cast.toBoolean(Cast.toString(args.TEXT).endsWith(Cast.toString(args.ENDS)))
    }

    exactEquals(args) {
        return Cast.toBoolean(args.ONE == args.TWO)
    }

    power(args) {
        return Cast.toNumber(Math.pow(Cast.toNumber(args.ONE), Cast.toNumber(args.TWO)));
    }

    add (args) {
        return Cast.toNumber(args.NUM1) + Cast.toNumber(args.NUM2);
    }

    subtract (args) {
        return Cast.toNumber(args.NUM1) - Cast.toNumber(args.NUM2);
    }

    multiply (args) {
        return Cast.toNumber(args.NUM1) * Cast.toNumber(args.NUM2);
    }

    divide (args) {
        return Cast.toNumber(args.NUM1) / Cast.toNumber(args.NUM2);
    }

    lt (args) {
        return Cast.compare(args.OPERAND1, args.OPERAND2) < 0;
    }

    equals (args) {
        return Cast.compare(args.OPERAND1, args.OPERAND2) === 0;
    }

    gt (args) {
        return Cast.compare(args.OPERAND1, args.OPERAND2) > 0;
    }

    ltOrEqual (args) {
        return Cast.compare(args.OPERAND1, args.OPERAND2) < 0 || Cast.compare(args.OPERAND1, args.OPERAND2) === 0;
    }

    gtOrEqual (args) {
        return Cast.compare(args.OPERAND1, args.OPERAND2) > 0 || Cast.compare(args.OPERAND1, args.OPERAND2) === 0;
    }

    and (args) {
        return Cast.toBoolean(args.OPERAND1) && Cast.toBoolean(args.OPERAND2);
    }

    or (args) {
        return Cast.toBoolean(args.OPERAND1) || Cast.toBoolean(args.OPERAND2);
    }

    not (args) {
        return !Cast.toBoolean(args.OPERAND);
    }

    random (args) {
        return this._random(args.FROM, args.TO);
    }
    _random (from, to) { // used by compiler
        const nFrom = Cast.toNumber(from);
        const nTo = Cast.toNumber(to);
        const low = nFrom <= nTo ? nFrom : nTo;
        const high = nFrom <= nTo ? nTo : nFrom;
        if (low === high) return low;
        // If both arguments are ints, truncate the result to an int.
        if (Cast.isInt(from) && Cast.isInt(to)) {
            return low + Math.floor(Math.random() * ((high + 1) - low));
        }
        return (Math.random() * (high - low)) + low;
    }

    join (args) {
        return Cast.toString(args.STRING1) + Cast.toString(args.STRING2);
    }

    letterOf (args) {
        const index = Cast.toNumber(args.LETTER) - 1;
        const str = Cast.toString(args.STRING);
        // Out of bounds?
        if (index < 0 || index >= str.length) {
            return '';
        }
        return str.charAt(index);
    }

    length (args) {
        return Cast.toString(args.STRING).length;
    }

    contains (args) {
        const format = function (string) {
            return Cast.toString(string).toLowerCase();
        };
        return format(args.STRING1).includes(format(args.STRING2));
    }

    mod (args) {
        const n = Cast.toNumber(args.NUM1);
        const modulus = Cast.toNumber(args.NUM2);
        let result = n % modulus;
        // Scratch mod uses floored division instead of truncated division.
        if (result / modulus < 0) result += modulus;
        return result;
    }

    round (args) {
        return Math.round(Cast.toNumber(args.NUM));
    }

    mathop (args) {
        const operator = Cast.toString(args.OPERATOR).toLowerCase();
        const n = Cast.toNumber(args.NUM);
        switch (operator) {
        case 'abs': return Math.abs(n);
        case 'floor': return Math.floor(n);
        case 'ceiling': return Math.ceil(n);
        case 'sqrt': return Math.sqrt(n);
        case 'sin': return Math.round(Math.sin((Math.PI * n) / 180) * 1e10) / 1e10;
        case 'cos': return Math.round(Math.cos((Math.PI * n) / 180) * 1e10) / 1e10;
        case 'tan': return MathUtil.tan(n);
        case 'asin': return (Math.asin(n) * 180) / Math.PI;
        case 'acos': return (Math.acos(n) * 180) / Math.PI;
        case 'atan': return (Math.atan(n) * 180) / Math.PI;
        case 'ln': return Math.log(n);
        case 'log': return Math.log(n) / Math.LN10;
        case 'e ^': return Math.exp(n);
        case '10 ^': return Math.pow(10, n);
        }
        return 0;
    }

    atan2(args) {
        return Math.atan2(Cast.toNumber(args.NUM1), Cast.toNumber(args.NUM2)) * (180 / Math.PI);
    }
}

module.exports = Scratch3OperatorsBlocks;
