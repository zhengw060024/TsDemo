// json解析测试，阅读cjson源码，编写测试demo
enum ObjType {
    TYPE_NULL,
    TYPE_BOOL,
    TYPE_NUMBER,
    TYPE_STRING,
    TYPE_ARRAY,
    TYPE_OBJ
}
interface JsonObj {
    m_currentData: string | number;
    m_preItem: JsonObj;
    m_nextItem: JsonObj;
    m_child: JsonObj;
    m_type: ObjType;
    m_strItemName: string;
    m_strChild: JsonObj;
}
interface ParseInfo {
    m_currentOffset: number;
    m_currentParseDepth: number;
    m_stringOrigin: string;
}
function skipBlankSpace(currentParseInfo: ParseInfo) {
    let Temp: String = currentParseInfo.m_stringOrigin.charAt(currentParseInfo.m_currentOffset);
    while (Temp !== " " || Temp != "\t") {
        ++currentParseInfo.m_currentOffset;
    }
    return Temp;
}
function checkIsNotOutOfRange(currentParseInfo: ParseInfo, nIndex: number) {
    return currentParseInfo.m_stringOrigin.length > currentParseInfo.m_currentOffset + nIndex;
}
function getSubStr(currentParseInfo: ParseInfo, nStartIndex: number, nLenth: number) {
    return currentParseInfo.m_stringOrigin.substr(currentParseInfo.m_currentOffset + nStartIndex, nLenth)
}
function parseJsonString(strInput: string) {
    let parseBuf: ParseInfo = {
        m_currentOffset: 0, m_currentParseDepth: 0, m_stringOrigin: strInput
    }
    skipBlankSpace(parseBuf);
    let result: JsonObj = {
        m_currentData: null,
        m_preItem: null,
        m_nextItem: null,
        m_child: null,
        m_type: null,
        m_strItemName: null,
        m_strChild: null
    }
    parseValue(parseBuf, result);

}
function parseValue(currentParseInfo: ParseInfo, jsonItem: JsonObj): boolean {
    // 判断是否为null

    if (checkIsNotOutOfRange(currentParseInfo, 3) && getSubStr(currentParseInfo, 0, 4) === 'null') {
        parseNull(currentParseInfo, jsonItem);
        return true;
    }
    // 判断是否为true
    if (checkIsNotOutOfRange(currentParseInfo, 3) && getSubStr(currentParseInfo, 0, 4) === 'true') {
        jsonItem.m_currentData = null;
        jsonItem.m_type = ObjType.TYPE_BOOL;
        currentParseInfo.m_currentOffset += 4;
        return true;
    }
    // 判断是否为false
    if (checkIsNotOutOfRange(currentParseInfo, 4) && getSubStr(currentParseInfo, 0, 5) === 'false') {
        jsonItem.m_currentData = null;
        jsonItem.m_type = ObjType.TYPE_BOOL;
        currentParseInfo.m_currentOffset += 5;
        return true;
    }
    if (checkIsNotOutOfRange(currentParseInfo, 0) &&
        (getSubStr(currentParseInfo, 0, 1) === '-' ||
            (getSubStr(currentParseInfo, 0, 1) <= '9' && getSubStr(currentParseInfo, 0, 1) >= '0'))) {
        return parseNumber(currentParseInfo, jsonItem);
    }
    if (checkIsNotOutOfRange(currentParseInfo, 0) && getSubStr(currentParseInfo, 0, 1) === '"') {
        return parseString(currentParseInfo, jsonItem);
    }
    if (checkIsNotOutOfRange(currentParseInfo, 0) && getSubStr(currentParseInfo, 0, 1) === '[') {
        return parseArray(currentParseInfo, jsonItem);
    }
    if (checkIsNotOutOfRange(currentParseInfo, 0) && getSubStr(currentParseInfo, 0, 1) === '{') {
        return parseObj(currentParseInfo, jsonItem);
    }

}
function parseNull(currentParseInfo: ParseInfo, jsonItem: JsonObj) {
    jsonItem.m_currentData = null;
    jsonItem.m_type = ObjType.TYPE_NULL;
    currentParseInfo.m_currentOffset += 4;
}


function parseNumber(currentParseInfo: ParseInfo, jsonItem: JsonObj): boolean {
    let subStrNum: string = '';
    let offset = 0;
    while (checkIsNotOutOfRange(currentParseInfo, 0)) {
        let charTemp = getSubStr(currentParseInfo, offset, 1);
        let bGoOutloop: boolean = false;
        switch (charTemp) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '+':
            case '-':
            case 'e':
            case 'E':
            case '.':
                ++offset
                subStrNum += charTemp;
                break;
            default:
                bGoOutloop = true;
                break;
        }
        if (bGoOutloop) {
            break
        }
    }
    let nResult = Number(subStrNum);
    if (nResult !== NaN) {
        jsonItem.m_currentData = nResult;
        jsonItem.m_type = ObjType.TYPE_NUMBER;
        currentParseInfo.m_currentOffset += offset;
        return true;
    } else {
        return false;
    }
}
function parseString(currentParseInfo: ParseInfo, jsonItem: JsonObj) {
    // 需要注意转义字符串的处理
    let nIndexOffSetEnd = 1;
    let nTempChar = ''
    let nSkipWords = 0;
    while (checkIsNotOutOfRange(currentParseInfo, nIndexOffSetEnd)
        && (nTempChar = getSubStr(currentParseInfo, nIndexOffSetEnd, 1)) !== '"') {
        if (nTempChar === '\\') {
            if (checkIsNotOutOfRange(currentParseInfo, nIndexOffSetEnd + 1)) {
                return false;
            }
            ++nSkipWords;
            ++nIndexOffSetEnd;
        }
        ++nIndexOffSetEnd;
    }
    if ((!checkIsNotOutOfRange(currentParseInfo, nIndexOffSetEnd)) || (nTempChar !== '"')) {
        return false;
    }
    let stringOut = '';
    for (let i = 1; i < nIndexOffSetEnd; ++i) {
        nTempChar = getSubStr(currentParseInfo, i, 1)
        if (nTempChar !== '\\') {
            stringOut += nTempChar;
        } else {
            // 判断是否越界
            if (i + 1 >= nIndexOffSetEnd) {
                return false;
            } else {
                let tempCharTrue = getSubStr(currentParseInfo, i + 1, 1);
                switch (tempCharTrue) {
                    case 't':
                        stringOut += '\t'
                        break;
                    case 'n':
                        stringOut += '\n'
                        break;
                    case 'b':
                        stringOut += '\b'
                        break;
                    case 'f':
                        stringOut += '\f'
                        break;
                    case 'r':
                        stringOut += '\r'
                        break;
                    case '\\':
                    case '/':
                    case '\"':
                        stringOut += tempCharTrue;
                    default:
                        break;
                }
            }
        }
    }
    currentParseInfo.m_currentOffset += nIndexOffSetEnd;
    currentParseInfo.m_currentOffset++;
    jsonItem.m_currentData = stringOut;
    jsonItem.m_type = ObjType.TYPE_STRING;
    return true;
}
// 这个有子项
function parseArray(currentParseInfo: ParseInfo, jsonItem: JsonObj) {
    // 判断是否为空：
    currentParseInfo.m_currentOffset++;
    skipBlankSpace(currentParseInfo);
    if (checkIsNotOutOfRange(currentParseInfo, 0) && getSubStr(currentParseInfo, 0, 1) === ']') {
        // 处理空串
        jsonItem.m_currentData = null;
        jsonItem.m_child = null;
        jsonItem.m_type = ObjType.TYPE_ARRAY;
        return true
    }
    if (!checkIsNotOutOfRange(currentParseInfo, 0)) {
        return false
    }
    let currentChar = '';
    let head: JsonObj = null;
    let currentItem: JsonObj = null;
    do {
        let resultChild: JsonObj = {
            m_currentData: null,
            m_preItem: null,
            m_nextItem: null,
            m_child: null,
            m_type: null,
            m_strItemName: null,
            m_strChild: null
        }
        if (parseValue(currentParseInfo, resultChild)) {
            // 解析成功之后的处理
            if (head === null) {
                head = resultChild;
                currentItem = resultChild;
            } else {
                currentItem.m_nextItem = resultChild;
                resultChild.m_preItem = currentItem;
                currentItem = resultChild;
            }

        } else {
            return false;
        }
        skipBlankSpace(currentParseInfo);
        if (checkIsNotOutOfRange(currentParseInfo, 0)) {
            if (getSubStr(currentParseInfo, 0, 1) === ',') {
                currentParseInfo.m_currentOffset++;
                skipBlankSpace(currentParseInfo);
            } else if (getSubStr(currentParseInfo, 0, 1) === ']') {
                currentChar = getSubStr(currentParseInfo, 0, 1);
                break;
            } else {
                return false;
            }

        } else {
            return false;
        }
    } while (checkIsNotOutOfRange(currentParseInfo, 0));
    if (checkIsNotOutOfRange(currentParseInfo, 0) && currentChar === ']') {
        jsonItem.m_child = head;
        jsonItem.m_type = ObjType.TYPE_ARRAY;
        ++currentParseInfo.m_currentOffset;
        return true;
    } else {
        return false;
    }
}
// 这个也有子项
function parseObj(currentParseInfo: ParseInfo, jsonItem: JsonObj) {
    // 
    currentParseInfo.m_currentOffset++;
    skipBlankSpace(currentParseInfo);
    if (checkIsNotOutOfRange(currentParseInfo, 0) && getSubStr(currentParseInfo, 0, 1) === '}') {
        // 处理空串
        jsonItem.m_currentData = null;
        jsonItem.m_child = null;
        jsonItem.m_type = ObjType.TYPE_OBJ;
        return true
    }
    let currentChar = '';
    let head: JsonObj = null;
    let currentItem: JsonObj = null;
    do {
        //
        let resultChild: JsonObj = {
            m_currentData: null,
            m_preItem: null,
            m_nextItem: null,
            m_child: null,
            m_type: null,
            m_strItemName: null,
            m_strChild: null
        }
        if (checkIsNotOutOfRange(currentParseInfo, 0) && getSubStr(currentParseInfo, 0, 1) === '"') {
            if (parseString(currentParseInfo, resultChild)) {
                skipBlankSpace(currentParseInfo);
                if (checkIsNotOutOfRange(currentParseInfo, 0) && getSubStr(currentParseInfo, 0, 1) === ':') {
                    skipBlankSpace(currentParseInfo);
                    if (checkIsNotOutOfRange(currentParseInfo, 0)) {
                        resultChild.m_strItemName = <string>(resultChild.m_currentData);
                        if (parseValue(currentParseInfo, resultChild)) {
                            if (head === null) {
                                head = resultChild;
                                currentItem = resultChild;
                            } else {
                                currentItem.m_nextItem = resultChild;
                                resultChild.m_preItem = currentItem;
                                currentItem = resultChild;
                            }
                            skipBlankSpace(currentParseInfo);
                            if (checkIsNotOutOfRange(currentParseInfo, 0)) {
                                if (getSubStr(currentParseInfo, 0, 1) === ',') {
                                    currentParseInfo.m_currentOffset++;
                                    skipBlankSpace(currentParseInfo);
                                } else if (getSubStr(currentParseInfo, 0, 1) === '}') {
                                    currentChar = getSubStr(currentParseInfo, 0, 1);
                                    break;
                                } else {
                                    return false;
                                }

                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }

                } else {
                    return false;
                }

            } else {
                return false;
            }
        } else {
            return false;
        }

    } while (checkIsNotOutOfRange(currentParseInfo, 0));
    if (checkIsNotOutOfRange(currentParseInfo, 0) && currentChar === ']') {
        jsonItem.m_child = head;
        jsonItem.m_type = ObjType.TYPE_OBJ;
        ++currentParseInfo.m_currentOffset;
        return true;
    } else {
        return false;
    }
    return true;

}