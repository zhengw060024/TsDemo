
import * as Rx from 'rxjs/Rx';
import { ObserveOnOperator } from 'rxjs/operators/observeOn';
import { setTimeout } from 'timers';
import { Observable } from 'rxjs/Observable';
class RxTestSelf {
    constructor() {

    }
    testCasePromise() {
        const Promisetest = new Promise((resolve, reject) => {
            setTimeout(() => {
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
        })
    }
    testForkJoin() {

        const subject1 = new Rx.Subject();
        const subject2 = new Rx.Subject();
        const subject3 = new Rx.BehaviorSubject(4);
        var delayedRange = Rx.Observable.create((observe: any) => {
            observe.next(1);
            observe.next(2);
            observe.next(3);
            observe.next(4);
            // setTimeout(() => {
            //     observe.next(5);
            // }, 4000);
            // setTimeout(() => {
            //     observe.next(6);
            // }, 2000);
            // setTimeout(() => {
            //     observe.next(7);
            //     observe.complete();
            // }, 12000);
            observe.complete();
        }).subscribe(subject1);
        const temp2 = Rx.Observable.create((observe: any) => {
            observe.next(1);
            observe.next(2);
            observe.next(3);
            observe.next(4);
            // setTimeout(() => {
            //     observe.next(8);
            //     observe.complete();
            // }, 4000);
            // setTimeout(() => {
            //     observe.next(6);
            // }, 2000);
            observe.complete();
        }).subscribe(subject2);
        const Source = Observable.forkJoin(subject1.map(data => {
            console.log('tttttttt');
            return data;
        }), subject2.map(data => {
            console.log('sssssssssss');
            return data;
        })).map(data => {
            return <number>data[0] + <number>data[1];
        }).publishReplay(1).refCount();
        Source.subscribe(data => {
            console.log('dfasfsaf', data);
        });
        Source.subscribe(data => {
            console.log('xxxxxxxx', data);
        });
       
        Source.subscribe(data => {
            console.log('xxxxxxxxffffff', data);
        });
        setTimeout(() => {
            Source.subscribe(data => {
                console.log('xxxxxxxxttttt', data);
            });
        }, 3000);
        return Source;
    }
    testFilter() {
        const subject = new Rx.Subject();
        const subject1 = new Rx.Subject();
        const subject2 = new Rx.Subject();
        subject1.complete();
        subject.subscribe(data => {
            console.log('sfsaf');
        });
        subject.filter((data: any) => {
            console.log(data,'xxxxxxxx');
            return data <= 6

        }).subscribe(subject1);
        subject.filter((data: any) => {
            console.log(data, 'ssssssssss');
            return data >= 4

        }).subscribe(subject2);
        var delayedRange = Rx.Observable.create((observe: any) => {
            observe.next(1);
            observe.next(2);
            observe.next(3);
            observe.next(4);
            // setTimeout(() => {
            //     observe.next(5);
            // }, 4000);
            // setTimeout(() => {
            //     observe.next(6);
            // }, 2000);
            // setTimeout(() => {
            //     observe.next(7);
            // }, 12000);
        }).subscribe(subject);

    }
    testCaseTake() {
        const subject = new Rx.Subject();
        let boolok = true;
        setTimeout(() => {
            boolok = false;
        },  4000);
        subject.takeWhile(data => {
            return boolok;
        }).subscribe(data => {
            console.log('takeWhile test!!!',data);
        });
        subject.subscribe(data => {
            console.log('nomal test!!!', data);
        })
        subject.map(data => {
            return <number>data * 2;
        }).take(1).subscribe( data => {
            console.log(data);
        });
        setTimeout(() => {
            subject.map(data => {
                return <number>data * 2;
            }).take(1).subscribe( data => {
                console.log(data);
            });
        }, 2500);
        var delayedRange = Rx.Observable.create((observe: any) => {
            observe.next(1);
            observe.next(2);
            observe.next(3);
            observe.next(4);
            setTimeout(() => {
                observe.next(5);
            }, 4000);
            setTimeout(() => {
                observe.next(6);
            }, 2000);
            setTimeout(() => {
                observe.next(7);
            }, 12000);
        }).subscribe(subject);
        

    }
    testCaseCreate() {
        const subject = new Rx.Subject();
        const tempObserve22 = subject;
        const tempObserve = subject.map(data => {
            console.log('zzzzzzzzzzzzzzzzz', data);
            return data;
        });
        tempObserve22.subscribe(data => {
            console.log('fdfsfdsafdasfdsa');
        });
        tempObserve22.subscribe(data => {
            console.log("444444", data);
        });
        tempObserve.subscribe(data => {
            console.log("3333333", data);
        });
        tempObserve.subscribe(data => {
            console.log("xxxx", data);
        });
        var delayedRange = Rx.Observable.create((observe: any) => {
            observe.next(1);
            observe.next(2);
            observe.next(3);
            observe.next(4);
            setTimeout(() => {
                observe.next(5);
            }, 4000);
            setTimeout(() => {
                observe.next(6);
            }, 2000);
            setTimeout(() => {
                observe.next(7);
            }, 12000);
        });


        // const subject = new Rx.Subject();
        delayedRange.map((data: any) => {
            console.log('dataxxxxxxxxxxxxx', data);
            return data * 2;
        }).subscribe(subject);
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

        const testItem = Rx.Observable.create((observe: any) => {
            observe.next(1);
            observe.next(2);
            observe.next(3);
            observe.next(4);
            setTimeout(() => {
                observe.next(5);
            }, 4000);
            setTimeout(() => {
                observe.next(6);
            }, 2000);
            setTimeout(() => {
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
        })
        var delayedRange = Rx.Observable.create((observe: any) => {
            observe.next(1);
            observe.next(2);
            observe.next(3);
            observe.next(4);
            setTimeout(() => {
                observe.next(5);
            }, 4000);
            setTimeout(() => {
                observe.next(6);
            }, 2000);
            setTimeout(() => {
                observe.next(7);
            }, 12000);
        });
        delayedRange.map((data: any) => {
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
    testCaseForJoin2() {
        const subject = new Rx.Subject<number>();
        setTimeout(() => {
            console.log('subject run');
            subject.next(12);
        }, 1000);
        const Temp = Rx.Observable.create((oberse:any) => {
            oberse.next(1);
            oberse.next(2);
            oberse.complete();
        });
        const Temp2 = Rx.Observable.create((oberse:any) => {
            console.log('Temp2 run !!!');
            oberse.next(3);
            oberse.next(4);
            oberse.complete();
        });
        subject.subscribe(data => {

        });
        subject.subscribe(data => {

        });
        setTimeout(() => {
            Temp2.subscribe((data :any)=> {
                console.log('temp2',data);
            });
        },3000);
        Rx.Observable.forkJoin(Temp,Temp2).subscribe(data => {
            console.log(data);
        })

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
temp.testCaseForJoin2();

// temp.testCaseTake();
// const xxx = temp.testForkJoin();
// setTimeout(() => {
//     xxx.subscribe(data => {
//         console.log(data);
//     })
// }, 20000);
// temp.testFilter();
//temp.testCaseCreate(); 
// temp.testCaseColdHot();
//temp.testCaseCreate();
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


