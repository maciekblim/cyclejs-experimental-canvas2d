import {RENDERABLE_TYPE, RENDERABLE_ARGS, RENDERABLE_MATRIX, RENDERABLE_STYLE} from './graphics';

// pack everything inside ctx.save(), ctx.restore()
function transaction(next) {
    return (ctx => {
        ctx.save();
        next(ctx);
        ctx.restore();
    });
}

function applyFill(style, next) {
    return (ctx => {
        if ('string' === typeof style) {
            // fill color
            ctx.fillStyle = style;
        } else {
            // fill gradient
            const gradient = style.linear ?
                ctx.createLinearGradient(
                    style.start[0],
                    style.start[1],
                    style.end[0],
                    style.end[1])
                : ctx.createRadialGradient(
                    style.start[0],
                    style.start[1],
                    style.innerr,
                    style.end[0],
                    style.end[1],
                    style.outterr);

            style.stops.forEach(stop => {
                gradient.addColorStop.apply(gradient, stop);
            });
            ctx.fillStyle = gradient;
        }
        next(ctx);
        ctx.fill();
    })
}

function applyStroke(color, next) {
    return (ctx => {
        ctx.strokeStyle = color;
        next(ctx);
        ctx.stroke();
    })
}

function applyStyles(style, next) {
    if (style.fill) return applyFill(style.fill, next);
    if (style.stroke) return applyStroke(style.stroke, next);
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
        // TODO draw with (0,0) in the center
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        // TODO what to return from here ?
    });
}

function drawOval(args) {
    // TODO
    // taken from http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
    //
    const w = args[0];
    const h = args[1];

    const kappa = 0.5522848;
    const w2 = w * 2;
    const h2 = h * 2;
    // because we want to draw relative to (0, 0)
    const x = -w; // 0 ??
    const y = -h; // 0 ??

    const ox = w * kappa; // control point offset horizontal
    const oy = h * kappa; // control point offset vertical
    const xe = x + w2;    // x-end
    const ye = y + h2;    // y-end
    const xm = x + w;     // x-middle
    const ym = y + h;     // y-middle

    return (ctx => {
        // TODO
        ctx.beginPath();
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        ctx.closePath();
    });
}

function drawNgon (args) {
    const n = args[0];
    const r = args[1];

    // because we want have (0,0) in the center
    const x = 0;
    const y = 0;

    return (ctx => {
        // TODO
        // from http://scienceprimer.com/drawing-regular-polygons-javascript-canvas
        ctx.beginPath();
        ctx.moveTo(x + r * Math.cos(0), y + r * Math.sin(0));

        // build array -> [1, 2, ..., n]
        (Array.apply(null, {length: n}).map(Number.call, Number))
            .map((v, i) => [x + r * Math.cos(i * 2 * Math.PI / n), y + r * Math.sin(i * 2 * Math.PI / n)])
            .forEach(xy => ctx.lineTo(xy[0], xy[1]));
        ctx.closePath();
    });
}

function drawPolygon (args) {
    const head = [].concat.apply([], args.slice(0, 1)); // get 1st element and flatten list
    const tail = args.slice(1);
    return (ctx => {
        ctx.beginPath();
        ctx.moveTo(head[0], head[1]);
        tail.forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.closePath();
    });
}

function draw(type) {
    // TODO I don't like that switch
    switch (type) {
        case 'rect':
            return drawRect;
        case 'oval':
            return drawOval;
        case 'ngon':
            return drawNgon;
        case 'polygon':
            return drawPolygon;
        default:
            return;
    }
}

function renderShape (ctx, renderable) {
    // TODO render shapes
    transaction(ctx => {
        applyStyles(renderable[RENDERABLE_STYLE], ctx => {
            applyTransform(renderable[RENDERABLE_MATRIX], ctx => {
                draw(renderable[RENDERABLE_TYPE])
                    (renderable[RENDERABLE_ARGS])
                    (ctx);
            })(ctx);
        })(ctx);
    })(ctx);
}

export function render (ctx, stage, width, height) {
    // TODO should ctx be reseted here ?
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
    ctx.globalAlpha = 1;

    stage.forEach(child => renderShape(ctx, child()));
}
