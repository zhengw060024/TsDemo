"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs/Rx");
const timers_1 = require("timers");
class RxTestSelf {
    constructor() {
    }
    testCasePromise() {
        const Promisetest = new Promise((resolve, reject) => {
            timers_1.setTimeout(() => {
                resolve('iskkkkkkkk');
                console.log('dfdsafsdf');
            }, 2000);
        });
        const observableTest = Rx.Observable.fromPromise(Promisetest.then(data => {
            console.log('xxxxxxxxxxxxxx');
            return Promisetest.then(data => {
                console.log('ffffffffffffffffff');
                return Promisetest;
            });
        }));
        observableTest.subscribe(data => {
            console.log('ok!!!!!!!!1');
        });
    }
    testCaseCreate() {
        const subject = new Rx.Subject();
        const tempObserve = subject.map(data => {
            console.log('zzzzzzzzzzzzzzzzz', data);
            return data;
        });
        tempObserve.subscribe(data => {
            console.log("sssss", data);
        });
        tempObserve.subscribe(data => {
            console.log("xxxx", data);
        });
        var delayedRange = Rx.Observable.create((observe) => {
            observe.next(1);
            observe.next(2);
            observe.next(3);
            observe.next(4);
            timers_1.setTimeout(() => {
                observe.next(5);
            }, 4000);
            timers_1.setTimeout(() => {
                observe.next(6);
            }, 2000);
            timers_1.setTimeout(() => {
                observe.next(7);
            }, 12000);
        });
        // const subject = new Rx.Subject();
        delayedRange.map((data) => {
            console.log('dataxxxxxxxxxxxxx', data);
            return data * 2;
        }).subscribe(subject);
        // delayedRange.subscribe(data => {
        //     console.log (data);
        // })
        // setTimeout(() => {
        //     delayedRange.subscribe(data => {
        //         console.log (data);
        //     });
        // },1500);
        // .subscribe(
        // function onNext(item) { console.log('Value:', item); },
        // function onError(err) { console.log('Error:', err); },
        // function onCompleted() { console.log('Completed.'); }
        // );
    }
    testCaseCreate2() {
        const subject = new Rx.Subject();
        const item1 = subject.filter(data => {
            if (data === 2) {
                return true;
            }
            return false;
        }).publishReplay(1).refCount();
        const item2 = subject.filter(data => {
            if (data === 6) {
                return true;
            }
            return false;
        }).publishReplay(1).refCount();
        const item3 = subject.filter(data => {
            if (data === 3) {
                return true;
            }
            return false;
        }).publishReplay(1).refCount();
        item1.subscribe(data => {
            console.log('item1 run', data);
        });
        item2.subscribe(data => {
            console.log('item2 run', data);
        });
        item3.subscribe(data => {
            console.log('item3 run', data);
        });
        const testItem = Rx.Observable.create((observe) => {
            observe.next(1);
            observe.next(2);
            observe.next(3);
            observe.next(4);
            timers_1.setTimeout(() => {
                observe.next(5);
            }, 4000);
            timers_1.setTimeout(() => {
                observe.next(6);
            }, 2000);
            timers_1.setTimeout(() => {
                observe.next(7);
            }, 12000);
        });
        testItem.subscribe(subject);
    }
    testCaseColdHot() {
        const subject = new Rx.Subject();
        const temp1 = subject.filter(data => {
            console.log('filter1 run ', data);
            return true;
        });
        const temp2 = subject.filter(data => {
            console.log('filter2 run ', data);
            return true;
        }).publishReplay(1).refCount();
        temp1.subscribe(data => {
            console.log('temp1 run ', data);
        });
        temp2.subscribe(data => {
            console.log('temp2 run ', data);
        });
        temp2.subscribe(data => {
            console.log('temp2 2 run ', data);
        });
        var delayedRange = Rx.Observable.create((observe) => {
            observe.next(1);
            observe.next(2);
            observe.next(3);
            observe.next(4);
            timers_1.setTimeout(() => {
                observe.next(5);
            }, 4000);
            timers_1.setTimeout(() => {
                observe.next(6);
            }, 2000);
            timers_1.setTimeout(() => {
                observe.next(7);
            }, 12000);
        });
        delayedRange.map((data) => {
            console.log('dataxxxxxxxxxxxxx', data);
            return data * 2;
        }).subscribe(subject);
    }
    testCaseReduce() {
        const observable = Rx.Observable.range(1, 6).reduce((acc, value) => {
            console.log(`acc is ${acc}, value is ${value}`);
            return acc + value;
        });
        observable.subscribe(data => {
            console.log(data);
        });
    }
}
function testReduce() {
    const observable = Rx.Observable.range(1, 6).reduce((acc, value) => {
        console.log(`acc is ${acc}, value is ${value}`);
        return acc + value;
    });
    observable.subscribe(data => {
        console.log(data);
    });
}
const temp = new RxTestSelf();
//temp.testCaseCreate(); 
// temp.testCaseColdHot();
temp.testCaseCreate2();
// testReduce();
// let data = new Rx.Subject<number>();
// // data.subscribe(data2 => {
// //     console.log(data2);
// // });
// const rxob = new Rx.Observable(observer => {
//     setTimeout(() => {
//         observer.next(10);
//         observer.complete();
//     }, 2000);
// });
// const TestCaseAll = new RxTestSelf();
// TestCaseAll.testCasePromise();
