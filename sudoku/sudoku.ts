function printSudoku(sudoku: Array<Array<number>>) {
    for(let i = 0; i < 9; ++i) {
        console.log(sudoku[i]);
    }
}
function getSudokuResult(sudoku: Array<Array<number>>) {
    const tempResult = helpSudoku(0, 0, sudoku);
    console.log(tempResult);
    printSudoku(sudoku);
}
function helpSudoku(i: number, j: number, sudoku: Array<Array<number>>): boolean {
    if (i === 9) {
        return true;
    }
    if (j >= 9) {
        return helpSudoku(i + 1, 0, sudoku);
    }
    if (sudoku[i][j] === 0) {
        for (let k = 1; k < 10; ++k) {
            sudoku[i][j] = k;
            // 如果合法做下一次選擇
            if (checkSudolegal(i, j, sudoku)) {
                // 如果找到直接返回正確，如果此節點找不到數據，直接返回上一個節點
                if (helpSudoku(i, j + 1, sudoku)) {
                    // console.log('Get result!!!');
                    // printSudoku(sudoku);
                    return true;
                }
            }
        }
        // 如果沒有找到，在回退到上一個節點之前，需要將數據重置
        sudoku[i][j] = 0;
    } else {
        return helpSudoku(i, j + 1, sudoku);
    }
    return false;
}

function checkSudolegal(k: number, t: number, sudoku: Array<Array<number>>) :boolean{
    const temp = sudoku[k][t];
    for (let i = 0; i < 9; ++i) {
        if (i !== k) {
            if (sudoku[i][t] === temp) {
                return false;
            }
        }
    }
    for(let j = 0; j < 9; ++j) {
        if(j !== t) {
            if(sudoku[k][j] === temp) {
                return false;
            }
        }
    }
    const iRowStart = Math.floor(k / 3) * 3;
    const jColStart = Math.floor(t / 3) * 3;
    for(let i = iRowStart; i < iRowStart + 3; ++i) {
        for(let j = jColStart; j < jColStart + 3; ++j) {
            if((i != k) && (j != t) ) {
                if(sudoku[i][j] === temp) {
                    return false;
                }
            }
        }
    }
    return true;
}

const temp:Array<Array<number>> = [];
temp.push([8, 0, 4, 6, 3, 0, 0, 0, 2]);
temp.push([5, 9, 6, 7, 2, 8, 4, 3, 1]);
temp.push([2, 3, 1, 4, 5, 9, 0, 8, 7]);
temp.push([0, 8, 0, 1, 0, 6, 7, 0, 3]);
temp.push([7, 0, 5, 0, 0, 0, 0, 1, 0]);
temp.push([0, 1, 0, 5, 0, 2, 8, 0, 6]);
temp.push([3, 2, 9, 8, 6, 5, 1, 7, 4]);
temp.push([1, 0, 7, 0, 4, 3, 9, 0, 8]);
temp.push([6, 4, 0, 9, 0, 7, 0, 2, 5]);
console.log(temp[0][1]);
console.time('zhengwei');
getSudokuResult(temp);
console.timeEnd('zhengwei');