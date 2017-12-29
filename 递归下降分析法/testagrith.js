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
var fundamental = (function () {
    function fundamental(expstr) {
        this.m_expStr = expstr;
        this.m_IndexToken = 0;
        this.m_IndexReadOld = 0;
    }
    fundamental.prototype.exp = function () {
        var tempResult = this.term();
        while (this.getToken() == "+" || this.getToken() == "-") {
            var token = this.getToken();
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
    };
    fundamental.prototype.term = function () {
        var tempResult = this.factor();
        while (this.getToken() == "*" || this.getToken() == "/") {
            var token = this.getToken();
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
    };
    fundamental.prototype.factor = function () {
        var token = this.getToken();
        var tempResult;
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
    };
    fundamental.prototype.getToken = function () {
        return this.m_expStr.substr(this.m_IndexToken, 1);
    };
    fundamental.prototype.match = function (charInput) {
        var token = this.m_expStr.substr(this.m_IndexToken, 1);
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
    };
    fundamental.prototype.isDigit = function (charInput) {
        var charCode = charInput.charCodeAt(0);
        if (charCode >= 48 && charCode <= 57) {
            return true;
        }
        return false;
    };
    return fundamental;
}());
var fundamental2 = (function () {
    function fundamental2(expstr) {
        this.m_expStr = expstr;
        this.m_IndexToken = 0;
        this.m_IndexReadOld = 0;
        this.m_kuohao = 0;
    }
    fundamental2.prototype.exp = function () {
        return this.binaryOpResultOrHigh(0);
    };
    fundamental2.prototype.getOpPrecedence = function (strOp) {
        var nPrecedence = -1;
        switch (strOp) {
            case "+":
            case "-":
                nPrecedence = 2;
                break;
            case "*":
            case "/":
                nPrecedence = 4;
                break;
            default:
                break;
        }
        return nPrecedence;
    };
    fundamental2.prototype.binaryOpResult = function (precedence, leftOperant) {
        while (true) {
            var strOp = this.getToken();
            var newPrecedence = this.getOpPrecedence(strOp);
            //console.log(newPrecedence);
            console.log(strOp);
            if (newPrecedence > precedence) {
                this.match(strOp);
                leftOperant = this.makeBinaryOpResult(leftOperant, strOp, this.binaryOpResultOrHigh(newPrecedence));
            }
            else {
                break;
            }
        }
        return leftOperant;
    };
    fundamental2.prototype.binaryOpResultOrHigh = function (precedence) {
        var tempResult = this.factor();
        return this.binaryOpResult(precedence, tempResult);
    };
    fundamental2.prototype.makeBinaryOpResult = function (leftOperant, op, rightOperant) {
        var nResult = 0;
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
    };
    fundamental2.prototype.factor = function () {
        var token = this.getToken();
        var tempResult;
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
    };
    fundamental2.prototype.getToken = function () {
        return this.m_expStr.substr(this.m_IndexToken, 1);
    };
    fundamental2.prototype.match = function (charInput) {
        var token = this.m_expStr.substr(this.m_IndexToken, 1);
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
    };
    fundamental2.prototype.isDigit = function (charInput) {
        var charCode = charInput.charCodeAt(0);
        if (charCode >= 48 && charCode <= 57) {
            return true;
        }
        return false;
    };
    return fundamental2;
}());
//////////////
var scaner = (function () {
    function scaner(expstr) {
        this.m_expStr = expstr;
        this.m_indexedTokenExpect = 0;
        this.m_pattenNum = /\s*[0-9]+\.{0,1}[0-9]{0,}\s*/g;
        this.m_pattenBinary = /[+-]|\*|\/|>=|<=|==|>|<|\)/g;
        this.m_pattenLeftBracket = /\s*\(/g;
        this.m_pattenRightBracket = /\)\*s/g;
        this.m_pattenLeftFactor = /(\s*\()|(\s*[0-9]+\.{0,1}[0-9]{0,}\s*)/g;
        this.m_strToken = '';
    }
    scaner.prototype.checkIsLegal = function (index) {
        return index === this.m_indexedTokenExpect;
    };
    scaner.prototype.GetCurrentToken = function () {
        return this.m_strToken;
    };
    scaner.prototype.getNextOp = function () {
        var match = this.m_pattenBinary.exec(this.m_expStr);
        if (match) {
            var strOp = match[0];
            //console.log(match);
            if (!this.checkIsLegal(match.index)) {
                console.log(this.m_indexedTokenExpect);
                console.log('op Error parse!!!!!!!');
            }
            this.m_strToken = strOp;
            this.m_indexedTokenExpect += strOp.length;
            return strOp;
        }
        else {
            if (this.m_indexedTokenExpect != this.m_expStr.length) {
                console.log('error！！！！！！');
            }
        }
        return '';
    };
    scaner.prototype.getNextOpNumber = function () {
        var match = this.m_pattenNum.exec(this.m_expStr);
        if (match) {
            var strOp = match[0];
            if (!this.checkIsLegal(match.index)) {
                console.log('Error parse!!!!!!!');
            }
            this.m_strToken = strOp;
            this.m_indexedTokenExpect += strOp.length;
            return parseInt(strOp);
        }
        else {
            console.log('error,illegal number！！！！！！');
        }
        return 0;
    };
    scaner.prototype.getNextOpFactor = function () {
        var match = this.m_pattenLeftFactor.exec(this.m_expStr);
        //console.log(match);
        if (match) {
            var strOp = match[0];
            if (!this.checkIsLegal(match.index)) {
                console.log(this.m_indexedTokenExpect);
                console.log('xxxError parse!!!!!!!');
            }
            this.m_strToken = strOp;
            this.m_indexedTokenExpect += strOp.length;
            return strOp;
        }
        else {
            console.log('error,illegal number！！！！！！');
        }
        return '';
    };
    scaner.prototype.getNextLeftBracket = function () {
        var match = this.m_pattenLeftBracket.exec(this.m_expStr);
        if (match) {
            var strOp = match[0];
            if (!this.checkIsLegal(match.index)) {
                console.log('Error parse!!!!!!!');
            }
            this.m_strToken = strOp;
            this.m_indexedTokenExpect += strOp.length;
            return strOp;
        }
        else {
            console.log('error,illegal number！！！！！！');
        }
    };
    scaner.prototype.getNextRightBracket = function () {
        var match = this.m_pattenRightBracket.exec(this.m_expStr);
        if (match) {
            var strOp = match[0];
            if (!this.checkIsLegal(match.index)) {
                console.log('Error parse!!!!!!!');
            }
            this.m_strToken = strOp;
            this.m_indexedTokenExpect += strOp.length;
            return strOp;
        }
        else {
            console.log('error,illegal number！！！！！！');
        }
    };
    return scaner;
}());
var fundamental3 = (function () {
    function fundamental3(expstr) {
        this.m_expStr = expstr;
        this.m_scaner = new scaner(expstr);
    }
    fundamental3.prototype.exp = function () {
        return this.binaryOpResultOrHigh(0);
    };
    fundamental3.prototype.getOpPrecedence = function (strOp) {
        var nPrecedence = -1;
        switch (strOp) {
            case "+":
            case "-":
                nPrecedence = 2;
                break;
            case "*":
            case "/":
                nPrecedence = 4;
                break;
            default:
                break;
        }
        return nPrecedence;
    };
    fundamental3.prototype.binaryOpResult = function (precedence, leftOperant) {
        while (true) {
            var strOp = this.m_scaner.GetCurrentToken();
            var newPrecedence = this.getOpPrecedence(strOp);
            console.log(strOp);
            if (newPrecedence > precedence) {
                leftOperant = this.makeBinaryOpResult(leftOperant, strOp, this.binaryOpResultOrHigh(newPrecedence));
            }
            else {
                break;
            }
        }
        return leftOperant;
    };
    fundamental3.prototype.binaryOpResultOrHigh = function (precedence) {
        var tempResult = this.factor();
        return this.binaryOpResult(precedence, tempResult);
    };
    fundamental3.prototype.makeBinaryOpResult = function (leftOperant, op, rightOperant) {
        var nResult = 0;
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
    };
    fundamental3.prototype.factor = function () {
        var token = this.m_scaner.getNextOpFactor();
        var tempResult;
        if (token.indexOf("(") !== -1) {
            tempResult = this.exp();
            if (this.m_scaner.GetCurrentToken().indexOf(')') === -1) {
                console.log('error dtttt');
            }
        }
        else {
            tempResult = parseFloat(token);
        }
        this.m_scaner.getNextOp();
        return tempResult;
    };
    return fundamental3;
}());
// 创建语法树：
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Type_token"] = 1] = "Type_token";
    NodeType[NodeType["Type_number"] = 2] = "Type_number";
})(NodeType || (NodeType = {}));
var fundamental4 = (function () {
    function fundamental4(expstr) {
        this.m_expStr = expstr;
        this.m_scaner = new scaner(expstr);
        this.m_expNode = this.exp();
    }
    fundamental4.prototype.exp = function () {
        return this.binaryOpResultOrHigh(0);
    };
    fundamental4.prototype.getResult = function () {
        //return this.m_expNode;
        return this.getResultNode(this.m_expNode);
    };
    fundamental4.prototype.getResultNode = function (nodeTemp) {
        if (nodeTemp.kind === NodeType.Type_number) {
            return nodeTemp.value;
        }
        else if (nodeTemp.kind === NodeType.Type_token) {
            var tempNode = nodeTemp;
            return this.makeBinaryOpResult2(this.getResultNode(tempNode.leftNode), tempNode.token, this.getResultNode(tempNode.rightNode));
        }
        return 0;
    };
    fundamental4.prototype.makeBinaryOpResult2 = function (leftOperant, op, rightOperant) {
        var nResult = 0;
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
    };
    fundamental4.prototype.getOpPrecedence = function (strOp) {
        var nPrecedence = -1;
        switch (strOp) {
            case "+":
            case "-":
                nPrecedence = 2;
                break;
            case "*":
            case "/":
                nPrecedence = 4;
                break;
            default:
                break;
        }
        return nPrecedence;
    };
    fundamental4.prototype.binaryOpResult = function (precedence, leftOperant) {
        while (true) {
            var strOp = this.m_scaner.GetCurrentToken();
            var newPrecedence = this.getOpPrecedence(strOp);
            console.log('fdsfa ', strOp, leftOperant);
            if (newPrecedence > precedence) {
                leftOperant = this.makeBinaryOpResult(leftOperant, strOp, this.binaryOpResultOrHigh(newPrecedence));
            }
            else {
                break;
            }
        }
        return leftOperant;
    };
    fundamental4.prototype.binaryOpResultOrHigh = function (precedence) {
        var tempResult = this.factor();
        return this.binaryOpResult(precedence, tempResult);
    };
    fundamental4.prototype.makeBinaryOpResult = function (leftOperant, op, rightOperant) {
        var tempResult = {
            kind: NodeType.Type_token,
            token: op,
            leftNode: leftOperant,
            rightNode: rightOperant
        };
        return tempResult;
    };
    fundamental4.prototype.factor = function () {
        var token = this.m_scaner.getNextOpFactor();
        var tempResult;
        if (token.indexOf("(") !== -1) {
            tempResult = this.exp();
            if (this.m_scaner.GetCurrentToken().indexOf(')') === -1) {
                console.log('error dtttt');
            }
        }
        else {
            tempResult = {
                kind: NodeType.Type_number,
                value: parseFloat(token)
            };
        }
        this.m_scaner.getNextOp();
        return tempResult;
    };
    return fundamental4;
}());
//let tem2 = new fundamental3("((34 - 23)* (12-45)+ 16/4)/25+23*2");
//let tem2 = new fundamental2("(1-4)*(5-2)-4");
var tem3 = new fundamental4("((34 - 23)* (12-45)+ 16/4)/25+23*2-5+68*7-91");
console.log(tem3.getResult());
//console.log(tem2.exp());
