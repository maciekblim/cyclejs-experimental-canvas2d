import Cycle from '@cycle/core';
import {Observable} from 'rx';
import {makeCanvas2DDriver, stage, rect, filled} from './drivers/2d';


function main(/*{canvas2D}*/) {
    // just to test
    const r1$ = Observable
        .interval(1000)
        .take(10)
        .map(x => x * 10)
        .map(length => rect(0, 0, length, length))
        .map(rect => filled('#6C0', rect));

    const r2$ = Observable
        .interval(200)
        .take(30)
        .map(x => x * 5)
        .map(length => rect(100, 150, length, length))
        .map(rect => filled('#F30', rect));

    const stage$ = Observable.combineLatest(r1$, r2$, (r1, r2) =>
        stage([
            r1,
            r2
        ])
    );
    return {
        canvas2D: stage$
    }
}

const drivers = {
    canvas2D: makeCanvas2DDriver('#stage', 300, 300)
};

Cycle.run(main, drivers);
