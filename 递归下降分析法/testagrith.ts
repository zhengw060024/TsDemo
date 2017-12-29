/**
 * exp => term {addop  term}
 * addop => +|-
 * term => factor {mulop factor}
 * mulop=> *|/
 * factor => (exp) | number
 * 方法2：
 * exp => factor{binaryop factor}
 * factor =>(exp)|number;
 */
// class Scaner{
//     getNextNodeNumber(){

//     }
//     getNextNodeOperate(){

//     }
// }
// function getOpPrecedence(operate){
//     return -1;
// }
// let scaner = new Scaner();
// function makeBinaryExpresion(leftexpresion,op,rightexpresion){

// }
// function parseBinaryExpresion(precedence,leftOperant){
//     while(true){
//         let op = scaner.getNextNodeOperate();
//         let newprecedence = getOpPrecedence(op);
//         if(newprecedence <= precedence){
//             break;
//         }
//         else{
//            leftOperant =  makeBinaryExpresion(leftOperant,op,parseBinaryExpresionOrHigher(newprecedence))
//         }
//         return leftOperant;
//     }


// }
// function parseBinaryExpresionOrHigher(precedence){
//     let leftoperant = scaner.getNextNodeNumber();
//     return parseBinaryExpresion(precedence,leftoperant);
// }
class fundamental {
    m_expStr: string;
    m_IndexToken: number;
    m_IndexReadOld: number;
    constructor(expstr: string) {
        this.m_expStr = expstr;
        this.m_IndexToken = 0;
        this.m_IndexReadOld = 0;
    }
    exp(): number {
        let tempResult: number = this.term();
        while (this.getToken() == "+" || this.getToken() == "-") {
            let token = this.getToken();
            switch (token) {
                case "+":
                    if (!this.match("+")) {
                        console.log("error");
                        return tempResult;
                    }
                    tempResult += this.term();
                    break;
                case "-":
                    if (!this.match("-")) {
                        console.log("error");
                        return tempResult;
                    }
                    tempResult -= this.term();
                    break;
                default:
                    break;
            }
        }
        return tempResult;
    }
    term(): number {
        let tempResult: number = this.factor();
        while (this.getToken() == "*" || this.getToken() == "/") {
            let token = this.getToken();
            switch (token) {
                case "*":
                    if (!this.match("*")) {
                        console.log("error");
                        //return tempResult;
                        return -1;
                    }
                    tempResult *= this.factor();
                    break;
                case "/":
                    if (!this.match("/")) {
                        console.log("error");
                        //return tempResult;
                        return -1;
                    }
                    tempResult /= this.factor();
                    break;
                default:
                    break;
            }
        }
        return tempResult;
    }
    factor(): number {
        let token = this.getToken();
        let tempResult;
        if (token == "(") {
            if (!this.match("(")) {
                console.log("error");
            }
            tempResult = this.exp();
            if (!this.match(')')) {
                return tempResult;
            }
        }
        else if (this.isDigit(token)) {
            while (this.isDigit(this.getToken()) && this.m_IndexToken < this.m_expStr.length) {
                ++this.m_IndexToken;
            }
            tempResult = parseInt(this.m_expStr.substr(this.m_IndexReadOld, this.m_IndexToken - this.m_IndexReadOld));
            console.log(tempResult);
        }
        else { }
        return tempResult;
    }
    getToken(): string {
        return this.m_expStr.substr(this.m_IndexToken, 1);
    }
    match(charInput: string): boolean {
        let token = this.m_expStr.substr(this.m_IndexToken, 1);
        if (this.m_IndexToken == this.m_expStr.length) {
            return false;
        }

        if (token == charInput) {
            ++this.m_IndexToken;
            if (this.isDigit(token) == true) {

            }
            else {
                ++this.m_IndexReadOld;
                if (this.isDigit(this.getToken())) {
                    this.m_IndexReadOld = this.m_IndexToken;
                }
            }
            return true;
        }
        else { }
        return false;
    }
    isDigit(charInput): boolean {
        let charCode = charInput.charCodeAt(0);
        if (charCode >= 48 && charCode <= 57) {
            return true;
        }
        return false;
    }
}

class fundamental2 {
    m_expStr: string;
    m_IndexToken: number;
    m_IndexReadOld: number;
    m_kuohao: number;
    constructor(expstr: string) {
        this.m_expStr = expstr;
        this.m_IndexToken = 0;
        this.m_IndexReadOld = 0;
        this.m_kuohao = 0;
    }
    exp(): number {
        return this.binaryOpResultOrHigh(0);
    }
    getOpPrecedence(strOp: string): number {
        let nPrecedence = -1;
        switch (strOp) {
            case "+":
            case "-":
                nPrecedence = 2
                break;
            case "*":
            case "/":
                nPrecedence = 4;
                break;
            default:
                break;
        }
        return nPrecedence;
    }
    binaryOpResult(precedence: number, leftOperant: number): number {
        while (true) {
            let strOp: string = this.getToken();
            let newPrecedence = this.getOpPrecedence(strOp);
            //console.log(newPrecedence);
            console.log(strOp);
            if (newPrecedence > precedence) {
                this.match(strOp);
                leftOperant = this.makeBinaryOpResult(leftOperant, strOp, this.binaryOpResultOrHigh(newPrecedence))
            }
            else {
                break;
            }
        }
        return leftOperant;
    }
    binaryOpResultOrHigh(precedence: number) {
        let tempResult: number = this.factor();
        return this.binaryOpResult(precedence, tempResult);
    }
    makeBinaryOpResult(leftOperant: number, op: string, rightOperant: number): number {
        let nResult = 0;
        switch (op) {
            case "+":
                nResult = leftOperant + rightOperant;
                break;
            case "-":
                nResult = leftOperant - rightOperant;
                break;
            case "*":
                nResult = leftOperant * rightOperant;
                break;
            case "/":
                nResult = leftOperant / rightOperant;
                break;
        }
        return nResult;
    }
    factor(): number {
        let token = this.getToken();
        let tempResult;
        if (token == "(") {
            if (!this.match("(")) {
                console.log("error");
            }
            tempResult = this.exp();
            if (!this.match(')')) {
                console.log('error');
                return tempResult;
            }
        }
        else if (this.isDigit(token)) {
            while (this.isDigit(this.getToken()) && this.m_IndexToken < this.m_expStr.length) {
                ++this.m_IndexToken;
            }
            tempResult = parseInt(this.m_expStr.substr(this.m_IndexReadOld, this.m_IndexToken - this.m_IndexReadOld));
            //console.log(tempResult);
        }
        else { }
        return tempResult;
    }
    getToken(): string {
        return this.m_expStr.substr(this.m_IndexToken, 1);
    }
    match(charInput: string): boolean {
        let token = this.m_expStr.substr(this.m_IndexToken, 1);
        if (this.m_IndexToken == this.m_expStr.length) {
            return false;
        }

        if (token == charInput) {
            ++this.m_IndexToken;
            if (this.isDigit(token) == true) {

            }
            else {
                ++this.m_IndexReadOld;
                if (this.isDigit(this.getToken())) {
                    this.m_IndexReadOld = this.m_IndexToken;
                }
            }
            return true;
        }
        else { }
        return false;
    }
    isDigit(charInput): boolean {
        let charCode = charInput.charCodeAt(0);
        if (charCode >= 48 && charCode <= 57) {
            return true;
        }
        return false;
    }
}
//////////////
class scaner {
    m_expStr: string;
    m_indexedTokenExpect: number;
    m_pattenNum: RegExp;
    m_pattenBinary: RegExp;
    m_pattenLeftBracket:RegExp;
    m_pattenRightBracket:RegExp;
    m_pattenLeftFactor:RegExp;
    m_strToken:string;
    constructor(expstr: string) {
        this.m_expStr = expstr;
        this.m_indexedTokenExpect = 0;
        this.m_pattenNum = /\s*[0-9]+\.{0,1}[0-9]{0,}\s*/g;
        this.m_pattenBinary = /[+-]|\*|\/|>=|<=|==|>|<|\)/g;
        this.m_pattenLeftBracket = /\s*\(/g;
        this.m_pattenRightBracket = /\)\*s/g;
        this.m_pattenLeftFactor = /(\s*\()|(\s*[0-9]+\.{0,1}[0-9]{0,}\s*)/g;
        this.m_strToken = '';
    }
    checkIsLegal(index:number):boolean{
        return index === this.m_indexedTokenExpect;
    }
    GetCurrentToken(){
        return this.m_strToken;
    }
    getNextOp() {
        let match = this.m_pattenBinary.exec(this.m_expStr);
        if (match) {
            let strOp =  match[0];
            //console.log(match);
            if(!this.checkIsLegal(match.index)){
                console.log(this.m_indexedTokenExpect);
                console.log('op Error parse!!!!!!!');
            }
            this.m_strToken =strOp;
            this.m_indexedTokenExpect += strOp.length;
            return strOp;
        }
        else{
            if(this.m_indexedTokenExpect != this.m_expStr.length){
                console.log('error！！！！！！');
            }
        }
        return '';
    }
    
    getNextOpNumber() {
        let match = this.m_pattenNum.exec(this.m_expStr);
        if (match) {
            let strOp =  match[0];
            if(!this.checkIsLegal(match.index)){
                console.log('Error parse!!!!!!!');
            }
            this.m_strToken = strOp;
            this.m_indexedTokenExpect += strOp.length;
            return parseInt(strOp);
        }
        else{
            console.log('error,illegal number！！！！！！');
        }
        return 0;
    }
    getNextOpFactor() {
        let match = this.m_pattenLeftFactor.exec(this.m_expStr);
        //console.log(match);
        if (match) {
            let strOp =  match[0];
            if(!this.checkIsLegal(match.index)){
                console.log(this.m_indexedTokenExpect);
                console.log('xxxError parse!!!!!!!');
            }
            this.m_strToken = strOp;
            this.m_indexedTokenExpect += strOp.length;
            return strOp;
        }
        else{
            console.log('error,illegal number！！！！！！');
        }
        return '';
    }
    getNextLeftBracket() {
        let match = this.m_pattenLeftBracket.exec(this.m_expStr);
        if (match) {
            let strOp =  match[0];
            if(!this.checkIsLegal(match.index)){
                console.log('Error parse!!!!!!!');
            }
            this.m_strToken = strOp;
            this.m_indexedTokenExpect += strOp.length;
            return strOp;
        }
        else{
            console.log('error,illegal number！！！！！！');
        }
    }
    getNextRightBracket() {
        let match = this.m_pattenRightBracket.exec(this.m_expStr);
        if (match) {
            let strOp =  match[0];
            if(!this.checkIsLegal(match.index)){
                console.log('Error parse!!!!!!!');
            }
            this.m_strToken = strOp;
            this.m_indexedTokenExpect += strOp.length;
            return strOp;
        }
        else{
            console.log('error,illegal number！！！！！！');
        }
    }
}

class fundamental3 {
    m_expStr: string;
    m_scaner: scaner;
    constructor(expstr: string) {
        this.m_expStr = expstr;
        this.m_scaner = new scaner(expstr);
    }
    exp(): number {
        return this.binaryOpResultOrHigh(0);
    }
    getOpPrecedence(strOp: string): number {
        let nPrecedence = -1;
        switch (strOp) {
            case "+":
            case "-":
                nPrecedence = 2
                break;
            case "*":
            case "/":
                nPrecedence = 4;
                break;
            default:
                break;
        }
        return nPrecedence;
    }
    binaryOpResult(precedence: number, leftOperant: number): number {
        while (true) {
            let strOp: string = this.m_scaner.GetCurrentToken();
            let newPrecedence = this.getOpPrecedence(strOp);
            console.log(strOp);
            if (newPrecedence > precedence) {
                leftOperant = this.makeBinaryOpResult(leftOperant, strOp, this.binaryOpResultOrHigh(newPrecedence))
            }
            else {
                break;
            }
        }
        return leftOperant;
    }
    binaryOpResultOrHigh(precedence: number) {
        let tempResult: number = this.factor();
        return this.binaryOpResult(precedence, tempResult);
    }
    makeBinaryOpResult(leftOperant: number, op: string, rightOperant: number): number {
        let nResult = 0;
        switch (op) {
            case "+":
                nResult = leftOperant + rightOperant;
                break;
            case "-":
                nResult = leftOperant - rightOperant;
                break;
            case "*":
                nResult = leftOperant * rightOperant;
                break;
            case "/":
                nResult = leftOperant / rightOperant;
                break;
        }
        return nResult;
    }
    factor(): number {
        let token = this.m_scaner.getNextOpFactor();
        let tempResult;
        if (token.indexOf("(") !== -1) {
           
            tempResult = this.exp();
            if(this.m_scaner.GetCurrentToken().indexOf(')') === -1)
            {  
                console.log('error dtttt');
            }
        }
        else {
            tempResult = parseFloat(token);
        }
        this.m_scaner.getNextOp();
        return tempResult;
    }
}
// 创建语法树：
enum NodeType
{
    Type_token = 1,
    Type_number = 2,
}
interface expNode
{
    kind :NodeType;
}
interface NodeNumber extends expNode{
    value: number;
}

interface NodeBinaryToken extends expNode{
    token: string;
    leftNode:expNode;
    rightNode:expNode;
}
class fundamental4 {
    m_expStr: string;
    m_scaner: scaner;
    m_expNode: expNode;
    constructor(expstr: string) {
        this.m_expStr = expstr;
        this.m_scaner = new scaner(expstr);
        this.m_expNode = this.exp();
    }
    exp(): expNode {
        return this.binaryOpResultOrHigh(0);
    }
    getResult(){
        //return this.m_expNode;
        return this.getResultNode(this.m_expNode);
    }
    getResultNode(nodeTemp: expNode):number{
        if(nodeTemp.kind === NodeType.Type_number){
            return (<NodeNumber>nodeTemp).value;
        } else if(nodeTemp.kind === NodeType.Type_token){
            const tempNode = <NodeBinaryToken>nodeTemp;
            return this.makeBinaryOpResult2(this.getResultNode(tempNode.leftNode),tempNode.token,this.getResultNode(tempNode.rightNode));
        }
        return 0;
    }
    makeBinaryOpResult2(leftOperant: number, op: string, rightOperant: number): number {
        let nResult = 0;
        switch (op) {
            case "+":
                nResult = leftOperant + rightOperant;
                break;
            case "-":
                nResult = leftOperant - rightOperant;
                break;
            case "*":
                nResult = leftOperant * rightOperant;
                break;
            case "/":
                nResult = leftOperant / rightOperant;
                break;
        }
        return nResult;
    }
    getOpPrecedence(strOp: string): number {
        let nPrecedence = -1;
        switch (strOp) {
            case "+":
            case "-":
                nPrecedence = 2
                break;
            case "*":
            case "/":
                nPrecedence = 4;
                break;
            default:
                break;
        }
        return nPrecedence;
    }
    binaryOpResult(precedence: number, leftOperant: expNode): expNode {
        while (true) {
            let strOp: string = this.m_scaner.GetCurrentToken();
            let newPrecedence = this.getOpPrecedence(strOp);
            console.log('fdsfa ',strOp,leftOperant);
            if (newPrecedence > precedence) {
                leftOperant = this.makeBinaryOpResult(leftOperant, strOp, this.binaryOpResultOrHigh(newPrecedence))
            }
            else {
                break;
            }
        }
        return leftOperant;
    }
    binaryOpResultOrHigh(precedence: number) {
        let tempResult: expNode = this.factor();
        return this.binaryOpResult(precedence, tempResult);
    }
    makeBinaryOpResult(leftOperant: expNode, op: string, rightOperant: expNode):expNode {
        let tempResult :NodeBinaryToken = {
            kind: NodeType.Type_token,
            token: op,
            leftNode:leftOperant,
            rightNode:rightOperant
        };
        return tempResult;
    }
    factor(): expNode {
        let token = this.m_scaner.getNextOpFactor();
        let tempResult;
        if (token.indexOf("(") !== -1) {
           
            tempResult = this.exp();
            if(this.m_scaner.GetCurrentToken().indexOf(')') === -1)
            {  
                console.log('error dtttt');
            }
        }
        else {
            tempResult = {
                kind:NodeType.Type_number,
                value:parseFloat(token)
            };
        }
        this.m_scaner.getNextOp();
        return tempResult;
    }
}
//let tem2 = new fundamental3("((34 - 23)* (12-45)+ 16/4)/25+23*2");
//let tem2 = new fundamental2("(1-4)*(5-2)-4");
let tem3 = new fundamental4("((34 - 23)* (12-45)+ 16/4)/25+23*2-5+68*7-91");
console.log(tem3.getResult());
//console.log(tem2.exp());


