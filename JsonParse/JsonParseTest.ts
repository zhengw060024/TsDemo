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
    m_currentData:string|number;
    m_preItem:JsonObj;
    m_nextItem:JsonObj;
    m_type:ObjType;
    m_strItemName:string;
    m_strChild:JsonObj;
}
interface ParseInfo {
    m_currentOffset:number;
    m_currentParseDepth:number;
    m_stringOrigin:string;
}
function skipBlankSpace(currentParseInfo:ParseInfo ) {
   let Temp :String= currentParseInfo.m_stringOrigin.charAt(currentParseInfo.m_currentOffset);
   while(Temp !== " " || Temp != "\t") {
       ++currentParseInfo.m_currentOffset;
   }
   return Temp;
}
function checkIsNotOutOfRange(currentParseInfo:ParseInfo,nIndex:number) {
    return currentParseInfo.m_stringOrigin.length >  currentParseInfo.m_currentOffset + nIndex;
}
function getSubStr(currentParseInfo:ParseInfo,nLenth:number) {
    return currentParseInfo.m_stringOrigin.substr(currentParseInfo.m_currentOffset,nLenth)
}
function parseJsonString(strInput:string) {
    let parseBuf :ParseInfo=  {
        m_currentOffset: 0, m_currentParseDepth:0,m_stringOrigin:strInput
    }
    skipBlankSpace(parseBuf);
    let result :JsonObj = {
        m_currentData:null,
        m_preItem:null,
        m_nextItem:null,
        m_type:null,
        m_strItemName:null,
        m_strChild:null
    }
    parseValue(parseBuf,result);

}
function parseValue(currentParseInfo:ParseInfo,jsonItem:JsonObj) :boolean{
    // 判断是否为null
    
    if(checkIsNotOutOfRange(currentParseInfo,3) && getSubStr(currentParseInfo,4) === 'null') {
        parseNull(currentParseInfo,jsonItem);
        return true;
    }
    // 判断是否为true
    if(checkIsNotOutOfRange(currentParseInfo,3) && getSubStr(currentParseInfo,4) === 'true') {
        jsonItem.m_currentData = null;
        jsonItem.m_type = ObjType.TYPE_BOOL;
        currentParseInfo.m_currentOffset += 4;
        return true;
    }
    // 判断是否为false
    if(checkIsNotOutOfRange(currentParseInfo,4) && getSubStr(currentParseInfo,5) === 'false') {
        jsonItem.m_currentData = null;
        jsonItem.m_type = ObjType.TYPE_BOOL;
        currentParseInfo.m_currentOffset += 5;
        return true;
    }
    if(checkIsNotOutOfRange(currentParseInfo,0) && 
    (getSubStr(currentParseInfo,1) == '-' || 
    (getSubStr(currentParseInfo,1) <= '9' && getSubStr(currentParseInfo,1) >= '0')) ){
        return parseNumber(currentParseInfo,jsonItem);
    }

}
function parseNull(currentParseInfo:ParseInfo,jsonItem:JsonObj) {
    jsonItem.m_currentData = null;
    jsonItem.m_type = ObjType.TYPE_NULL;
    currentParseInfo.m_currentOffset += 4;
    
}


function parseNumber(currentParseInfo:ParseInfo,jsonItem:JsonObj):boolean {
    return true;

}
function parseString(currentParseInfo:ParseInfo,jsonItem:JsonObj){

}
// 这个有子项
function parseArray(currentParseInfo:ParseInfo,jsonItem:JsonObj) {

}
// 这个也有子项
function parseObj(currentParseInfo:ParseInfo,jsonItem:JsonObj) {

}