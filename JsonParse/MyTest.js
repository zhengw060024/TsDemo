function getMaxNoSameSubStr(str) {
    var obj = {};
    var nCurrentMax = 0;
    var nMax = 0;
    var nStartIndex = 0;
    for (var i = 0; i < str.length; ++i) {
        var nNum = obj[str.charAt(i)];
        if (nNum === undefined) {
            nCurrentMax++;
        }
        else if (nNum < nStartIndex) {
            ++nCurrentMax;
        }
        else {
            if (nCurrentMax > nMax) {
                nMax = nCurrentMax;
            }
            nCurrentMax = nCurrentMax - (nNum - nStartIndex);
            nStartIndex = nNum + 1;
        }
        obj[str.charAt(i)] = i;
    }
    if (nCurrentMax > nMax) {
        nMax = nCurrentMax;
    }
    return nMax;
}
console.log(getMaxNoSameSubStr("abcabcddabadaa"));
