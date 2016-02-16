import {Observable} from 'rx';

function renderShape (ctx, shape) {
    // TODO render shapes
    if ('rect' === shape.type) {
        // do it by recurention
        // TODO currently only filled objects
        ctx.fillStyle = shape.style.fill;
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x + shape.width, shape.y);
        ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
        ctx.lineTo(shape.x, shape.y + shape.height);
        ctx.closePath();
        ctx.fill();
    }
}

function clearCanvas (ctx, width, height) {
    // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Restore the transform
    ctx.restore();
}

function render (ctx, stage) {
    stage.forEach(child => renderShape(ctx, child));
}

function canvas2DDriver (ctx, width, height) {
    return (stage$ => {
        stage$.subscribe(children => {
            clearCanvas(ctx, width, height);
            render(ctx, children);
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

export function stage(children) {
    return children;
}

export function rect (x, y, width, height) {
    const type = 'rect';
    return {x, y, width, height, type};
}
// export function oval (width, height) {}
// export function square (length) {}
// export function ngon (n, radius) {}
// export function polygon(corners) {}

export function filled (color, shape) {
    let copy = Object.assign({}, shape);
    Object.assign(copy.style = copy.style || {}, {fill: color});
    return copy;
}
