import {identity} from './math';

// kabum !!!!????!!!!
// shape = RenderableType -> RenderableArgs -> Matrix -> ... Renderable
function shape (type, args, matrix) {
    return (transformation => transformation ? shape(type, args, transformation(matrix)) : [type, args, matrix]);
}

// rect = Number -> Number -> Shape
export function rect2 (width, height) {
    return shape('rect', [width, height], identity());
}

// export function oval (width, height) {}
// export function square (length) {}
// export function ngon (n, radius) {}
// export function polygon(corners) {}
