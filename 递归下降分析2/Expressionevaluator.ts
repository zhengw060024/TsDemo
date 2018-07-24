let strTemp = '32 *4 -18+5'
const NUM = "\\d+"
const OP = "[\\*+-\\/]"
const WS = "\\s+"
const LPAREN = "\\("
const RPAREN = '\\)'
const reTotal = RegExp(`(${NUM})|(${OP})|(${WS})|(${LPAREN})|(${RPAREN})`, 'g')
// const reTotal = /(\d+)|([\*\+-\*])|(\s+)/g

const PattenNum = RegExp(NUM);
const OPPATTEN = RegExp(OP)
const WSPATTEN = RegExp(WS)
function* generateToke(strTemp1:string) {
    let matchTemp = reTotal.exec(strTemp1);
    while (matchTemp) {
        // console.log(matchTemp[0]);
        if(WSPATTEN.test(matchTemp[0])){
        } else {
            //console.log(matchTemp[0]);
            yield matchTemp[0];
        }
        matchTemp = reTotal.exec(strTemp1);
    }
}

class ExpressionEvaluator {
    constructor() {

    }
    Parse(strExp: string) {
        this.m_tokens = generateToke(strExp);
        this.advance();
        return this.exp();
    }
    private advance() {
        this.m_tok = this.m_nexttoke;
        this.m_nexttoke = this.m_tokens.next();
    }
    private binaryOpOrHigh(opPriority: number) :number{
        const leftValue = this.factor();
        return this.binaryOpEvaluate(opPriority, leftValue)
    }
    private isOp(token: String) {
        if (token === '*' || token === '/' || token === '-' || token === '+') {
            return true;
        }
        return false;
    }
    private getOpPriority(token: String) {
        let opPre = -1;
        switch (token) {
            case '+':
                opPre = 1
                break;
            case '-':
                opPre = 1
                break;
            case '*':
                opPre = 2
                break;
            case '/':
                opPre = 2
                break;
        }
        return opPre;
    }
    private binaryOpEvaluate(opPriority: number, leftValue: number) {
        while (true) {
            const token = this.m_nexttoke.value;
            // 这里要注意处理终结符号
            if (this.m_nexttoke.done||token === ')') {
                if(this.m_nexttoke.done) {
                    console.log('xxxxxxxxx');
                }
                return leftValue
            }
            if (this.isOp(token)) {
                const newopPriority = this.getOpPriority(token);
                if (newopPriority > opPriority) {
                    // 消费掉当前操作符
                    this.advance()
                    leftValue = this.makeBinaryOp(leftValue, this.m_tok.value,
                        this.binaryOpOrHigh(newopPriority))

                } else {
                    break;
                }

            } else {
                throw new Error(`expect toke,but get ${token}`)
            }
        }
        return leftValue;
    }
    private expectToken(tokenName:String) {
        if(tokenName === this.m_nexttoke.value) { 
            this.advance();
            // return true;
        } else {
            throw new Error('expect token )')
        }
        
    }
    private factor() {
        if(RegExp(PattenNum).test(this.m_nexttoke.value)) {
            this.advance();
            return parseInt(this.m_tok.value)
        }
        else if(this.m_nexttoke.value === '(') {
            this.advance();
            const expr = this.exp();
            this.expectToken(')')
            return expr;
        } else {
            throw new Error('illegal input')
        }
        return 0;
    }
    private exp() {

        return this.binaryOpOrHigh(0);
    }
    private makeBinaryOp(leftValue: number, op: string, rightValue: number) {
        console.log(`${leftValue} ${op} ${rightValue}`)
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
    private m_tokens: any
    private m_tok: IteratorResult<string> = {
        done: false,
        value: ''
    };
    private m_nexttoke :IteratorResult<string> = {
        done: false,
        value: ''
    };
}
const nTempEr = new ExpressionEvaluator();
console.log (nTempEr.Parse(strTemp))
console.log(nTempEr.Parse('4/2*3/(4*5)'))
console.log(nTempEr.Parse('2 *(3 - 5) *  ((4-7) - 6 + 63) / 3'))

