/**
 * 这个是在网上看到的一个有趣的题目，
 * 输入一个字符串，获取其最连续无重复字符的子串
 * @param str 
 */
function getMaxNoSameSubStr(str:string) :number{
    let obj ={

    }
    let nCurrentMax = 0;
    let nMax = 0;
    let nStartIndex = 0
    for(let i = 0; i< str.length; ++i){
        let nNum = obj[str.charAt(i)];
        if( nNum === undefined) {
            
            nCurrentMax++;
        } else if(nNum < nStartIndex) {
            
            ++nCurrentMax;
        } else {
            if(nCurrentMax > nMax) {
                nMax = nCurrentMax;
            }
            nCurrentMax = nCurrentMax - (nNum - nStartIndex);
            nStartIndex = nNum + 1;
            
        }
        obj[str.charAt(i)] = i;
    }
    if(nCurrentMax > nMax) {
        nMax = nCurrentMax;
    }
    return nMax;
}
console.log(getMaxNoSameSubStr("abcabcddabadaa"))