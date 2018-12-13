function getMaxNoSameSubStr(str:string) :number{
    let obj ={

    }
    let nCurrentMax = 0;
    let nMax = 0;
    let nStartIndex = 0
    for(let i = 0; i< str.length; ++i){
        let nNum = obj[str.charAt(i)];
        if( nNum === undefined) {
            obj[str.charAt(i)] = i;
            nCurrentMax++;
        } else if(nNum < nStartIndex) {
            obj[str.charAt(i)] = nStartIndex;
            ++nCurrentMax;
        } else {
            if(nCurrentMax > nMax) {
                nMax = nCurrentMax;
            }
            nCurrentMax = nCurrentMax - (nNum - nStartIndex);
            nStartIndex = nNum - nStartIndex + 1;
        }
    }
    return nMax;
}
console.log(getMaxNoSameSubStr("abcabcddabadaa"))