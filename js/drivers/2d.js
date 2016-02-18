import {Observable} from 'rx';
import {RENDERABLE_TYPE, RENDERABLE_ARGS, RENDERABLE_MATRIX, RENDERABLE_STYLE} from './graphics';


function applyStyles(style, next) {
    return (ctx => {
        // TODO currently only fill
        ctx.fillStyle = style.fill;
        next(ctx);
        ctx.fill();
    });
}

function applyTransform(m /* shape transform matrix */, next) {
    return (ctx => {
        // TODO use that a, b, c, ... consts
        ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);
        next(ctx);
    });
}

function drawRect(args) {
    // TODO
    const width = args[0];
    const height = args[1];
    return (ctx => {
        // TODO move it to functions
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        // TODO what to return from here ?
    });
}

function draw(type) {
    // TODO I don't like that switch
    switch (type) {
        case 'rect':
            return drawRect;
        default:
            return;
    }
}

function renderShape (ctx, renderable) {
    // TODO render shapes
    applyStyles(renderable[RENDERABLE_STYLE], ctx => {
        applyTransform(renderable[RENDERABLE_MATRIX], ctx => {
            draw(renderable[RENDERABLE_TYPE])
                (renderable[RENDERABLE_ARGS])
                (ctx);
        })(ctx);
    })(ctx);
    // if ('rect' === renderable[RENDERABLE_TYPE]) {
        // ctx.fillStyle = shape.style.fill;
        // ctx.beginPath();
        // ctx.moveTo(shape.x, shape.y);
        // ctx.lineTo(shape.x + shape.width, shape.y);
        // ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
        // ctx.lineTo(shape.x, shape.y + shape.height);
        // ctx.closePath();
        // ctx.fill();
    // }
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
    // TODO ctx be reseted here ?
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    // ctx.globalAlpha = 1;

    stage.forEach(child => renderShape(ctx, child()));
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

// move([15, 10], rotate(10, scale(2, rect(10, 10))))
// rect(10, 10)
//     (scale(2))
//     (rotate(10))
//     (move([15, 10]))
//     () // just because it is JavaScript

