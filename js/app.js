import Cycle from '@cycle/core';
import {Observable, Scheduler} from 'rx';
import {makeCanvas2DDriver, stage} from './drivers/2d';

/*eslint-disable no-unused-vars*/
import {scale, translate, rotate, shear} from './drivers/transformations';
import {rect, filled, stroked, oval, ngon} from './drivers/graphics';
/*eslint-enable no-unused-vars*/

function main(/*{canvas2D}*/) {
    // just to test
    // const r1$ = Observable
    //     .interval(1000, Scheduler.requestAnimationFrame)
    //     .take(10)
    //     .map(() =>
    //         stroked('#6c0')
    //             (rect(100, 100))
    //             (scale(1, 2))
    //             (shear(0.5, 0.25))
    //             (translate(100, 0))
    //     );
    // const r1$ = Observable.of(
    //         stroked('#6c0')
    //             (rect(100, 100))
    //             (scale(1, 2))
    //             (shear(0.5, 0.25))
    //             (translate(100, 0))
    //         );
    const r1$ = Observable.of(
            stroked('#6c0')
                (oval(50, 50))
                (translate(100, 100))
            );
    const r2$ = Observable
        .interval(1000 / 35, Scheduler.requestAnimationFrame)
        .take(100)
        .map(x => x + 1)
        .map(x =>
            filled('#f30')
                (rect(30, 30))
                // 2 * Math.PI / 8 = 45 degrees
                (translate(-15, -15))
                (scale(1, 2))
                (rotate(x * ((2 * Math.PI) / 32)))
                (translate(100, 100))
                // (translate(x, 150))
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
