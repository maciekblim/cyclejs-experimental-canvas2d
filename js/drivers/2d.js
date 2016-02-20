import {Observable} from 'rx';
import {render} from './renderer';

function canvas2DDriver (ctx, width, height) {
    return (stage$ => {
        stage$.subscribe(children => {
            render(ctx, children, width, height);
        });
        return Observable.empty();
    });
}

export function makeCanvas2DDriver (selector, width, height) {
    const canvas = document.querySelector(selector);

    // TODO should width and height be optional?
    canvas.width = width;
    canvas.height = height;
    // // Make a canvas that has a blurry pixelated zoom-in
    // // with each canvas pixel drawn showing as roughly 2x2 on screen
    // canvas.width  = 400;
    // canvas.height = 300; 
    // canvas.style.width  = '800px';
    // canvas.style.height = '600px';

    // TODO check if canvas.getContext is available on `canvas` element
    const ctx = canvas.getContext('2d')
    return canvas2DDriver(ctx, width, height);
}

