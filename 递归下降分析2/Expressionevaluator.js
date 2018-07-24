"use strict";
let strTemp = '32 *4 -18+5';
const NUM = "\\d+";
const OP = "[\\*+-\\/]";
const WS = "\\s+";
const LPAREN = "\\(";
const RPAREN = '\\)';
const reTotal = RegExp(`(${NUM})|(${OP})|(${WS})|(${LPAREN})|(${RPAREN})`, 'g');
// const reTotal = /(\d+)|([\*\+-\*])|(\s+)/g
const PattenNum = RegExp(NUM);
const OPPATTEN = RegExp(OP);
const WSPATTEN = RegExp(WS);
function* generateToke(strTemp1) {
    let matchTemp = reTotal.exec(strTemp1);
    while (matchTemp) {
        // console.log(matchTemp[0]);
        if (WSPATTEN.test(matchTemp[0])) {
        }
        else {
            //console.log(matchTemp[0]);
            yield matchTemp[0];
        }
        matchTemp = reTotal.exec(strTemp1);
    }
}
// const tokenGen = generateToke(strTemp);
// let nTemp = tokenGen.next()
// while (!nTemp.done) {
//     console.log(nTemp.value)
//    // console.log('fdsafsda')
//     nTemp = tokenGen.next()
// }
class ExpressionEvaluator {
    constructor() {
        this.m_tok = {
            done: false,
            value: ''
        };
        this.m_nexttoke = {
            done: false,
            value: ''
        };
    }
    Parse(strExp) {
        this.m_tokens = generateToke(strExp);
        this.advance();
        return this.exp();
    }
    advance() {
        this.m_tok = this.m_nexttoke;
        this.m_nexttoke = this.m_tokens.next();
    }
    binaryOpOrHigh(opPriority) {
        const leftValue = this.factor();
        return this.binaryOpEvaluate(opPriority, leftValue);
    }
    isOp(token) {
        if (token === '*' || token === '/' || token === '-' || token === '+') {
            return true;
        }
        return false;
    }
    getOpPriority(token) {
        let opPre = -1;
        switch (token) {
            case '+':
                opPre = 1;
                break;
            case '-':
                opPre = 1;
                break;
            case '*':
                opPre = 2;
                break;
            case '/':
                opPre = 2;
                break;
        }
        return opPre;
    }
    binaryOpEvaluate(opPriority, leftValue) {
        while (true) {
            const token = this.m_nexttoke.value;
            // 这里要注意处理终结符号
            if (this.m_nexttoke.done || token === ')') {
                if (this.m_nexttoke.done) {
                    console.log('xxxxxxxxx');
                }
                return leftValue;
            }
            if (this.isOp(token)) {
                const newopPriority = this.getOpPriority(token);
                if (newopPriority > opPriority) {
                    // 消费掉当前操作符
                    this.advance();
                    leftValue = this.makeBinaryOp(leftValue, this.m_tok.value, this.binaryOpOrHigh(newopPriority));
                }
                else {
                    break;
                }
            }
            else {
                throw new Error(`expect toke,but get ${token}`);
            }
        }
        return leftValue;
    }
    expectToken(tokenName) {
        if (tokenName === this.m_nexttoke.value) {
            this.advance();
            // return true;
        }
        else {
            throw new Error('expect token )');
        }
    }
    factor() {
        if (RegExp(PattenNum).test(this.m_nexttoke.value)) {
            this.advance();
            return parseInt(this.m_tok.value);
        }
        else if (this.m_nexttoke.value === '(') {
            this.advance();
            const expr = this.exp();
            this.expectToken(')');
            return expr;
        }
        else {
            throw new Error('illegal input');
        }
        return 0;
    }
    exp() {
        return this.binaryOpOrHigh(0);
    }
    makeBinaryOp(leftValue, op, rightValue) {
        console.log(`${leftValue} ${op} ${rightValue}`);
        switch (op) {
            case '+':
                leftValue += rightValue;
                break;
            case '-':
                leftValue -= rightValue;
                break;
            case '*':
                leftValue *= rightValue;
                break;
            case '/':
                leftValue /= rightValue;
                break;
            default:
                break;
        }
        return leftValue;
    }
}
const nTempEr = new ExpressionEvaluator();
console.log(nTempEr.Parse(strTemp));
console.log(nTempEr.Parse('4/2*3/(4*5)'));
console.log(nTempEr.Parse('2 *(3 - 5) *  ((4-7) - 6 + 63) / 3'));
