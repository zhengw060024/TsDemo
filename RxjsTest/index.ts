
import * as Rx from 'rxjs/Rx';
class RxTestSelf {
    constructor() {
        
    }
    testCaseCreate() {
        var delayedRange = Rx.Observable.range(0, 5).delay(1000);
        const subject = new Rx.Subject();
        // const subject = new Rx.Subject();
        delayedRange.subscribe(subject);
        // subject.map((data:any) => {
        //     console.log('dataxxxxxxxxxxxxx',data);
        //     return data *2;
        // });
        delayedRange.subscribe(data => {
            console.log (data);
        })
        setTimeout(() => {
            delayedRange.subscribe(data => {
                console.log (data);
            });
        },1500);
        // .subscribe(
        // function onNext(item) { console.log('Value:', item); },
        // function onError(err) { console.log('Error:', err); },
        // function onCompleted() { console.log('Completed.'); }
        // );
    }
    testCaseReduce(){
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
testReduce();
let data = new Rx.Subject<number>();
// data.subscribe(data2 => {
//     console.log(data2);
// });
const rxob = new Rx.Observable(observer => {
    setTimeout(() => {
        observer.next(10);
        observer.complete();
    }, 2000);
});
const TestCaseAll = new RxTestSelf();
TestCaseAll.testCaseCreate();
// rxob.reduce()
let tempxx: Rx.Observable<any>;
function testSingle() {
    if (tempxx) {
        tempxx.concatMap(data => {
            return rxob;
        });
    } else {
        tempxx = rxob;
    }
    return tempxx;
}
testSingle().subscribe(data => {
    console.log('dfasfdsafdsa', data);
});
setTimeout(() => {
    testSingle().subscribe(data => {
        console.log('xxxxxxxxxxx', data);
    });
}, 4000);
// let data2 = data.map(dataresult => {
//     console.log(`data is ${dataresult}`);
//     return dataresult + 4;
// }).concatMap( (data: any) => {
//     return rxob;
// }).publishReplay(1).refCount();
// data2.subscribe(data => {
//     console.log('first running',data)

// });
// data2.subscribe(data => {
//     console.log('second running',data);
// });
// Rx.Observable.of(1,2,3,4,6,8,1,12).publishReplay(2).refCount().subscribe(data);
// //const state = 1;
// const func = () => (state: any) => Object.assign({
//     test1: state
// });
// console.log(func());

