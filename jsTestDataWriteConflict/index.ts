import * as events from 'events';
import * as Rx from 'rxjs/Rx';
interface ObjTypeTest {
    id: string;
    name: string;
}
//生成从minNum到maxNum的随机数
function randomNum(minNum: any, maxNum: any) {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}
const ArrayOrgin: Array<ObjTypeTest> = [];
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
class MyClassTest {
    private m_mapBuffer: Map<string, ObjTypeTest>;
   // private m_eventUpating: events.EventEmitter;
    private m_bUpating: boolean;
    private m_mapUpatCatchInfo: UpateDataCatcheInfo;
    private m_subjectUpdateMgr :Rx.Subject<Array<ObjTypeTest>>;
    private m_subjectTest :Rx.Subject<number>;
    private m_subjectUpdateTest :Rx.Subject<number>;
    private getRandomRunTime() {
        return randomNum(1000, 3000);
    }
    constructor() {
        this.m_mapBuffer = new Map<string, ObjTypeTest>();
        this.m_bUpating = false;
      //  this.m_eventUpating = new events.EventEmitter();
        this.m_mapUpatCatchInfo = {
            mapToUpte: new Map<string, ObjTypeTest>(),
            //mapUpating: new Map<string, ObjTypeTest>(),
            arrayNotify: [],
            arrayNotifyUpating: []
        }
        this.m_subjectUpdateMgr = new Rx.Subject<Array<ObjTypeTest>>();
        this.m_subjectTest = new Rx.Subject<number>();
        this.m_subjectUpdateTest = new Rx.Subject<number>();
        this.getResult().subscribe(data => {
            this.m_subjectUpdateTest.next(data);
         });
    }
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
    updateDataRxWrap(ArrayIdInput: Array<ObjTypeTest>) {
        const ArrayId: Array<string> = [];
        ArrayIdInput.forEach((value, index) => {
            ArrayId.push(value.id);
        });
        return this.removeArrayDataRxWrap(ArrayId).concatMap((data:any) => {
           return this.insertArrayRxWrap(ArrayIdInput);
        });
    }
    addUpdataRequest(ArrayIdInput: Array<ObjTypeTest>) {
        // console.log(ArrayIdInput);
        this.m_subjectUpdateMgr.next(ArrayIdInput);
    }
    updateDataRxWrap2() {
        
        return this.m_subjectUpdateMgr.concatMap(data => {
            return this.updateDataRxWrap(data);
        });
      
        //return result;
    }
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
    testCase(num: number) {
        for (let i = 0; i < num; ++i) {
            this.updateDataArray2(getArrayInput()).then(data => {

            }).catch(err => {
                console.log(err);
            })

        }
    }
    testCase2(num: number) {
        for (let i = 0; i < num; ++i) {
            this.updateDataRxWrap(getArrayInput()).subscribe((data :any) =>{
                console.log(data);
            });

        }
    }
    testCase3(num: number) {
        this.updateDataRxWrap2().subscribe(data =>{
            console.log(data);
        })
        for (let i = 0; i < num; ++i) {
            this.addUpdataRequest(getArrayInput());

        }
    }
    testConcatMap(id: number):Rx.Observable<number>{
        return Rx.Observable.create((observer: any) => {
            setTimeout(() =>{
                observer.next(id);
                console.log( `work id ${id} ending`);
                observer.complete(id);
            },this.getRandomRunTime());
        });
    }
    getResult()
    {
        const result =  this.m_subjectTest.concatMap(data => {
            return this.testConcatMap(data);
        });
        return result;
    }
    testRxWrap (num: number) {
        this.m_subjectTest.next(num);
        
    }
    testCase4(num: number) {
      
        for (let i = 0; i < num; ++i) {
            this.testRxWrap(i);
        }
    }
    testCase5(num: number) {
        for (let i = 0; i < num; ++i) {
            this.testRxWrap2(i).subscribe((data:number) => {
                console.log('test work id complete!!!!',data);

            });
        }
    }
    testRxWrap2(num:number) {
        this.m_subjectTest.next(num);
        return this.m_subjectUpdateTest.filter(data => {
            if(data === num) {
                return true;
            }
            return false;
        });
        //return this.getResult().
        // const result =  this.m_subjectTest.concatMap(data => {
        //     return this.testConcatMap(data);
        // });
        // // result.subscribeOn(Rx.Scheduler.animationFrame)
        // this.m_subjectTest.next(num);
        // return result;
    }
}
initArrayOgrin();
const runTest = new MyClassTest();
runTest.testCase5(20);
