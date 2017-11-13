"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs/Rx");
let data = new Rx.Subject();
// data.subscribe(data2 => {
//     console.log(data2);
// });
const rxob = new Rx.Observable(observer => {
    setTimeout(() => {
        observer.next(10);
        observer.complete();
    }, 2000);
});
let tempxx;
function testSingle() {
    if (tempxx) {
        tempxx.concatMap(data => {
            return rxob;
        });
    }
    else {
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
