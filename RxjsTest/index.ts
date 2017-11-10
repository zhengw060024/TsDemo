
import * as Rx from 'rxjs/Rx';
let data = new Rx.Subject<number>();
data.subscribe(data2 => {
    console.log(data2);
});
Rx.Observable.of(1,2,3,4,6,8,1,12).publishReplay(2).refCount().subscribe(data);

