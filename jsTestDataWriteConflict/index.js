"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}
const ArrayOrgin = [];
function initArrayOgrin() {
    ArrayOrgin.push({
        id: '12',
        name: 'jim'
    });
    ArrayOrgin.push({
        id: '13',
        name: 'jim1'
    });
    ArrayOrgin.push({
        id: '14',
        name: 'jim3'
    });
    ArrayOrgin.push({
        id: '15',
        name: 'jim5'
    });
    ArrayOrgin.push({
        id: '16',
        name: 'jim6'
    });
    ArrayOrgin.push({
        id: '17',
        name: 'jim7'
    });
    ArrayOrgin.push({
        id: '18',
        name: 'jim8'
    });
    ArrayOrgin.push({
        id: '19',
        name: 'jim9'
    });
    ArrayOrgin.push({
        id: '20',
        name: 'jim20'
    });
    ArrayOrgin.push({
        id: '21',
        name: 'jim21'
    });
}
function getArrayInput() {
    const num1 = randomNum(0, ArrayOrgin.length - 1);
    const num2 = randomNum(0, ArrayOrgin.length - 1);
    let indexStart = num2;
    let indexEnd = num1;
    if (num1 < num2) {
        indexStart = num1;
        indexEnd = num2;
    }
    console.log(`start is ${indexStart} , end is ${indexEnd}`);
    const ArrayOut = [];
    for (let i = indexStart; i <= indexEnd; ++i) {
        ArrayOut.push({
            id: ArrayOrgin[i].id,
            name: ArrayOrgin[i].name
        });
    }
    return ArrayOut;
}
class MyClassTest {
    getRandomRunTime() {
        return randomNum(1000, 3000);
    }
    constructor() {
        this.m_mapBuffer = new Map();
        this.m_bUpating = false;
        //  this.m_eventUpating = new events.EventEmitter();
        this.m_mapUpatCatchInfo = {
            mapToUpte: new Map(),
            //mapUpating: new Map<string, ObjTypeTest>(),
            arrayNotify: [],
            arrayNotifyUpating: []
        };
    }
    insertObjArray(ArrayInput, callback) {
        setTimeout(() => {
            let bExisted = false;
            ArrayInput.forEach((value, index) => {
                if (this.m_mapBuffer.get(value.id)) {
                    bExisted = true;
                }
            });
            if (bExisted) {
                console.log('error!!!!!!!!');
                callback(new Error('error,data existed'));
            }
            else {
                ArrayInput.forEach((value, index) => {
                    this.m_mapBuffer.set(value.id, value);
                    callback(null, ArrayInput.length);
                });
            }
        }, this.getRandomRunTime());
    }
    removeObjsByArrayId(ArrayIdInput, callback) {
        setTimeout(() => {
            let numDelete = 0;
            ArrayIdInput.forEach((value, index) => {
                let bExisted = this.m_mapBuffer.delete(value);
                if (bExisted) {
                    ++numDelete;
                }
            });
            callback(null, numDelete);
        }, this.getRandomRunTime());
    }
    updateCatchData() {
        const ArrayId = [];
        const ArrayInput = [];
        this.m_bUpating = true;
        if (this.m_mapUpatCatchInfo.mapToUpte.size === 0) {
            this.m_bUpating = false;
            return;
        }
        this.m_mapUpatCatchInfo.mapToUpte.forEach((value, key) => {
            ArrayId.push(value.id);
            // this.m_mapUpatCatchInfo.mapUpating.set(key,value);
        });
        this.m_mapUpatCatchInfo.arrayNotify.forEach((value, index) => {
            this.m_mapUpatCatchInfo.arrayNotifyUpating.push(value);
        });
        this.m_mapUpatCatchInfo.arrayNotify.slice(0, this.m_mapUpatCatchInfo.arrayNotify.length);
        this.m_mapUpatCatchInfo.mapToUpte.clear();
        this.removeObjsByArrayId(ArrayId, (err, numdelete) => {
            if (err) {
                this.m_mapUpatCatchInfo.arrayNotifyUpating.forEach((value, index) => {
                    value.reject(err);
                });
            }
            else {
                this.insertObjArray(ArrayInput, (err2, numChange) => {
                    this.m_bUpating = false;
                    if (err2) {
                        console.log(err2);
                        this.m_mapUpatCatchInfo.arrayNotifyUpating.forEach((value, index) => {
                            value.reject(err);
                        });
                    }
                    else {
                        this.m_mapUpatCatchInfo.arrayNotifyUpating.forEach((value, index) => {
                            value.resolve(numChange);
                        });
                    }
                    this.m_mapUpatCatchInfo.arrayNotifyUpating.splice(0, this.m_mapUpatCatchInfo.arrayNotifyUpating.length);
                    this.updateCatchData();
                });
            }
        });
    }
    updateDataArray(ArrayInput) {
        return new Promise((resolve, reject) => {
            if (this.m_bUpating) {
                this.m_mapUpatCatchInfo.arrayNotify.push({
                    resolve: resolve,
                    reject: reject
                });
                ArrayInput.forEach((value, index) => {
                    this.m_mapUpatCatchInfo.mapToUpte.set(value.id, value);
                });
            }
            else {
                this.m_bUpating = true;
                const ArrayId = [];
                ArrayInput.forEach((value, index) => {
                    ArrayId.push(value.id);
                });
                this.removeObjsByArrayId(ArrayId, (err, numdelete) => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        this.insertObjArray(ArrayInput, (err2, numChange) => {
                            this.m_bUpating = false;
                            this.updateCatchData();
                            if (err2) {
                                console.log(err2);
                                reject(err2);
                            }
                            else {
                                resolve(numChange);
                            }
                        });
                    }
                });
            }
        });
    }
    testCase(num) {
        for (let i = 0; i < num; ++i) {
            this.updateDataArray(getArrayInput()).then(data => {
            }).catch(err => {
                console.log(err);
            });
        }
    }
}
initArrayOgrin();
const runTest = new MyClassTest();
runTest.testCase(10);
