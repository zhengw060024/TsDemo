import * as events from 'events';
import * as Rx from 'rxjs/Rx';
import { timeout } from 'rxjs/operator/timeout';
// 模拟仿真测试数据
interface ObjTypeTest {
    id: string;
    name: string;
}
//生成从minNum到maxNum的随机数
function randomNum(minNum: any, maxNum: any) {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}
// 模拟原始数据
const ArrayOrgin: Array<ObjTypeTest> = [];
/**
 * 初始化原始数据
 */
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
/**
 * 生成一个随机人员序列
 * 模拟可能的更新请求
 */
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
    const ArrayOut: Array<ObjTypeTest> = [];
    for (let i = indexStart; i <= indexEnd; ++i) {
        ArrayOut.push(
            {
                id: ArrayOrgin[i].id,
                name: ArrayOrgin[i].name
            }
        )
    }
    return ArrayOut;
}

// 在不使用rx时一种解决方案临时数据
interface UpdateBuffNotify {
    resolve: any;
    reject: any

}
interface UpateDataCatcheInfo {
    //mapUpating: Map<string,ObjTypeTest>;
    mapToUpte: Map<string, ObjTypeTest>;
    arrayNotify: Array<UpdateBuffNotify>;
    arrayNotifyUpating: Array<UpdateBuffNotify>;
}
///////////////////
////测试类，该类在插入数据时，
////必须保证缓存中的数据没有已存在的项目，否则报错。
///////////////////
class MyClassTest {
    private m_mapBuffer: Map<string, ObjTypeTest>;
    private m_bUpating: boolean;
    private m_mapUpatCatchInfo: UpateDataCatcheInfo;

    private m_subjectUpdateMgr :Rx.Subject<Array<ObjTypeTest>>;
    private m_obersevableUpdate:Rx.Observable<any>;

    private getRandomRunTime() {
        return randomNum(1000, 3000);
    }
    constructor() {

        this.m_mapBuffer = new Map<string, ObjTypeTest>();// 缓存
        //  在不使用rx时保证实现跟新不冲突的一种手段，这种手段引入了大量的状态
        // 造成了很多边际效应，写出来的代码非常不好维护
        this.m_bUpating = false;
        this.m_mapUpatCatchInfo = {
            mapToUpte: new Map<string, ObjTypeTest>(),
            arrayNotify: [],
            arrayNotifyUpating: []
        }
        /////////////////////////////
        // 使用rx的一个解决方案，这个方案在于将输入作为一个流，
        this.m_subjectUpdateMgr = new Rx.Subject<Array<ObjTypeTest>>();
        this.getUpdateObjResult().subscribe(data => {
            console.log(data);
        });

        // 其实使用一个中间状态和FlatMap很容易就解决了这个问题，
        this.m_obersevableUpdate = null; //保存上次请求的状态
    }
    /**
     * 插入过程Rx封装
     * @param ArrayInput 
     */
    private insertArrayRxWrap(ArrayInput: Array<ObjTypeTest>){
        return Rx.Observable.create((observer:any) => {
            this.insertObjArray(ArrayInput,(err:any,data:any) => {
                if(err){
                    observer.error(err);
                } else {
                    observer.next(data);
                }
                observer.complete();
            })
        });
    }
    /**
     * 删除过程rx封装
     * @param ArrayIdInput 
     */
    private removeArrayDataRxWrap(ArrayIdInput: Array<string>){
        return Rx.Observable.create((observer:any) =>{
            this.removeObjsByArrayId(ArrayIdInput, (err:any, data:any) => {
                if(err){
                    observer.error(err);
                } else {
                    observer.next(data);
                }
                observer.complete();
            });
        });
    }
    /**
     * 更新过程rx封装
     * @param ArrayIdInput 
     */
    updateDataRxWrap(ArrayIdInput: Array<ObjTypeTest>) {
        const ArrayId: Array<string> = [];
        ArrayIdInput.forEach((value, index) => {
            ArrayId.push(value.id);
        });
        return this.removeArrayDataRxWrap(ArrayId).concatMap((data:any) => {
           return this.insertArrayRxWrap(ArrayIdInput);
        });
    }

    /**
     * 添加跟新请求，这种方案其实很蠢
     * 1：不方便离散请求
     * 2：给原始库添加了一个不必要的管理请求
     * @param ArrayIdInput 
     */
    addUpdataRequest(ArrayIdInput: Array<ObjTypeTest>) {
        this.m_subjectUpdateMgr.next(ArrayIdInput);
    }

    private getUpdateObjResult() {
        return this.m_subjectUpdateMgr.concatMap(data => {
            return this.updateDataRxWrap(data);
        });
    }
    /**
     * 模拟插入数据过程，如果插入的数据已存在
     * 则报错退出
     * @param ArrayInput 
     * @param callback 
     */
    private insertObjArray(ArrayInput: Array<ObjTypeTest>, callback: any) {
        const nTimerspan = this.getRandomRunTime();
        console.log('insert timer span ', nTimerspan);
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
            } else {
                ArrayInput.forEach((value, index) => {
                    this.m_mapBuffer.set(value.id, value);
                    callback(null, ArrayInput.length);
                })
            }

        }, nTimerspan);
    }
    /**
     * 模拟删除过程
     * @param ArrayIdInput 
     * @param callback 
     */
    private removeObjsByArrayId(ArrayIdInput: Array<string>, callback: any) {
        const nTimerspan = this.getRandomRunTime();
        console.log('remove timer span ', nTimerspan);
        setTimeout(() => {
            let numDelete = 0;
            ArrayIdInput.forEach((value, index) => {
                let bExisted = this.m_mapBuffer.delete(value);
                if (bExisted) {
                    ++numDelete;
                }
            });
            callback(null, numDelete);
        }, nTimerspan);
    }
    /**
     * 不使用Rx的内部管理更新过程
     * 代码相当的复杂，并且难以维护
     * 也很难移植
     */
    private updateCatchData() {
        const ArrayId: Array<string> = [];
        const ArrayInput: Array<ObjTypeTest> = [];
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
        this.removeObjsByArrayId(ArrayId, (err: any, numdelete: number) => {
            if (err) {
                this.m_mapUpatCatchInfo.arrayNotifyUpating.forEach((value, index) => {
                    value.reject(err);
                });
            } else {
                this.insertObjArray(ArrayInput, (err2: any, numChange: number) => {
                    this.m_bUpating = false;
                    if (err2) {
                        console.log(err2);
                        this.m_mapUpatCatchInfo.arrayNotifyUpating.forEach((value, index) => {
                            value.reject(err);
                        });
                    } else {
                        this.m_mapUpatCatchInfo.arrayNotifyUpating.forEach((value, index) => {
                            value.resolve(numChange);
                        });
                    }
                    this.m_mapUpatCatchInfo.arrayNotifyUpating.splice(0, this.m_mapUpatCatchInfo.arrayNotifyUpating.length);
                    this.updateCatchData();
                })
            }
        });
    }
    /**
     * 不使用rx的可以正确更新的过程
     * @param ArrayInput 
     */
    updateDataArray(ArrayInput: Array<ObjTypeTest>) {
        return new Promise((resolve, reject) => {

            if (this.m_bUpating) {
                this.m_mapUpatCatchInfo.arrayNotify.push({
                    resolve: resolve,
                    reject: reject
                });
                ArrayInput.forEach((value, index) => {
                    this.m_mapUpatCatchInfo.mapToUpte.set(value.id, value);
                });
            } else {
                this.m_bUpating = true;
                const ArrayId: Array<string> = [];
                ArrayInput.forEach((value, index) => {
                    ArrayId.push(value.id);
                });
                this.removeObjsByArrayId(ArrayId, (err: any, numdelete: number) => {
                    if (err) {
                        return reject(err);
                    } else {
                        this.insertObjArray(ArrayInput, (err2: any, numChange: number) => {
                            this.m_bUpating = false;
                            this.updateCatchData();
                            if (err2) {
                                console.log(err2);
                                reject(err2);
                            } else {
                                resolve(numChange);
                            }

                        })
                    }
                });
            }
        });
    }
    /**
     * 模拟错误的更新过程
     * @param ArrayInput 
     */
    updateDataArray2(ArrayInput: Array<ObjTypeTest>) {
        return new Promise((resolve, reject) => {
            const ArrayId: Array<string> = [];
            ArrayInput.forEach((value, index) => {
                ArrayId.push(value.id);
            });
            this.removeObjsByArrayId(ArrayId, (err: any, numdelete: number) => {
                if (err) {
                    return reject(err);
                } else {
                    this.insertObjArray(ArrayInput, (err2: any, numChange: number) => {
                        if (err2) {
                            console.log(err2);
                            reject(err2);
                        } else {
                            resolve(numChange);
                        }
                    });
                }
            });
        });
    }
    // 最好的解决方案
    // 要注意hot observalbe 和cold observalble的区别
    updateDataRxPerfect(ArrayInput: Array<ObjTypeTest>) {
        let  temp = null;
        if(this.m_obersevableUpdate) {
          temp=  this.m_obersevableUpdate.concatMap(data =>{
               return this.updateDataRxWrap(ArrayInput).publishReplay(1).refCount();
            }).publishReplay(1).refCount();
        } else {
            temp = this.updateDataRxWrap(ArrayInput).publishReplay(1).refCount();
        }
        this.m_obersevableUpdate = temp;
        return temp;
    }
    /**
     * 错误更新过程模拟测试
     * @param num 
     */
    testCaseError(num: number) {
        for (let i = 0; i < num; ++i) {
            this.updateDataArray2(getArrayInput()).then(data => {

            }).catch(err => {
                console.log(err);
            });
        }
    }
    testCaseCorrect(num: number) {
        for (let i = 0; i < num; ++i) {
            this.updateDataArray(getArrayInput()).then((data :any) =>{
                console.log(data);
            });

        }
    }
    /**
     * 这种方式在于不便跟踪返回状态，
     * 且给原始库中添加了不必要的管理功能
     * @param num 
     */
    testCaseCorrectRx1(num: number) {
        for (let i = 0; i < num; ++i) {
            this.addUpdataRequest(getArrayInput());
        }
    }
    testCaseCorrectRx2(num: number) {
        for (let i = 0; i < num; ++i) {
            this.updateDataRxPerfect(getArrayInput()).subscribe(data =>{
                console.log(`${i} is complete,${data}`);
            });
        }
        for (let i = 0; i < num; ++i) {
            let nTimeOut = randomNum(1000, 7000);
            setTimeout(() => {
                this.updateDataRxPerfect(getArrayInput()).subscribe(data =>{
                    console.log(`${i} timeout is complete,${data},timerOut is ${nTimeOut}`);
                });
            }, nTimeOut);
        }
        setTimeout(() => {
            this.updateDataRxPerfect(getArrayInput()).subscribe(data =>{
                console.log(` timeout is complete,${data},timerOut is 120000`);
            });
        }, 120000);
        
    }
}
initArrayOgrin();
const runTest = new MyClassTest();
runTest.testCaseCorrectRx2(5);
