function getMaxNoSameSubStr(str) {
    var obj = {};
    var nCurrentMax = 0;
    var nMax = 0;
    var nStartIndex = 0;
    for (var i = 0; i < str.length; ++i) {
        var nNum = obj[str.charAt(i)];
        if (nNum === undefined) {
            obj[str.charAt(i)] = i;
            nCurrentMax++;
        }
        else if (nNum < nStartIndex) {
            obj[str.charAt(i)] = nStartIndex;
            ++nCurrentMax;
        }
        else {
            console.log(obj);
            console.log(nStartIndex)
            
            if (nCurrentMax > nMax) {
                nMax = nCurrentMax;
            }
            nCurrentMax = nCurrentMax - (nNum - nStartIndex);
            nStartIndex = nNum - nStartIndex + 1 + nStartIndex;
            obj[str.charAt(i)] = i;
            console.log(obj);
            console.log(nStartIndex)
        }
    }
    return nMax;
}
console.log(getMaxNoSameSubStr("abcabcddabadaa"));
