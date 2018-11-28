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
function checkIsOutOfRange(currentParseInfo:ParseInfo,nIndex:number) {
    return currentParseInfo.m_stringOrigin.length >  currentParseInfo.m_currentOffset + nIndex;
}
function parseJsonString(strInput:String) {

}
function parseValue(currentParseInfo:ParseInfo) {

}
function parseNull(currentParseInfo:ParseInfo,jsonItem:JsonObj) {

}

function parseTrueOrFalse(currentParseInfo:ParseInfo,jsonItem:JsonObj) {
    
}
function parseNumber(currentParseInfo:ParseInfo,jsonItem:JsonObj) {

}
function parseString(currentParseInfo:ParseInfo,jsonItem:JsonObj){

}
// 这个有子项
function parseArray(currentParseInfo:ParseInfo,jsonItem:JsonObj) {

}
// 这个也有子项
function parseObj(currentParseInfo:ParseInfo,jsonItem:JsonObj) {

}