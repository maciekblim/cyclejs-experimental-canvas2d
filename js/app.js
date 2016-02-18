import Cycle from '@cycle/core';
import {Observable} from 'rx';
import {makeCanvas2DDriver, stage} from './drivers/2d';

import {scale, translate} from './drivers/math';
import {rect, filled} from './drivers/graphics';

function main(/*{canvas2D}*/) {
    // just to test
    const r1$ = Observable
        .interval(1000)
        .take(10)
        .map(x => x * 10)
        .map(l =>
            filled('#6c0')
                (rect(l, l))
                (translate(15, 15))
                (scale(2, 4))
        )

    const r2$ = Observable
        .interval(200)
        .take(30)
        .map(x => x * 5)
        .map(l =>
            filled('#f30')
                (rect(l, l))
                (translate(110, 150))
        );

    const stage$ = Observable.combineLatest(r1$, r2$, (r1, r2) =>
        stage([r1, r2])
    );
    return {
        canvas2D: stage$
    }
}

const drivers = {
    canvas2D: makeCanvas2DDriver('#stage', 300, 300)
};

Cycle.run(main, drivers);
