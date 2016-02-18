import {identity} from './math';

// Renderable
export const RENDERABLE_TYPE = 0;
export const RENDERABLE_ARGS = 1;
export const RENDERABLE_MATRIX = 2;
export const RENDERABLE_STYLE = 3;


// kabum !!!!????!!!!
// shape = RenderableType -> RenderableArgs -> Matrix -> ... Renderable
function shape (type, args, matrix, styles) {
    return (transformation => transformation ? shape(type, args, transformation(matrix), styles) : [type, args, matrix, styles]);
}

// rect = Number -> Number -> Shape
export function rect (width, height) {
    return shape('rect', [width, height], identity(), {});
}

// export function oval (width, height) {}
// export function square (length) {}
// export function ngon (n, radius) {}
// export function polygon(corners) {}

// fill = Color -> Shape
export function filled (color) {
    const style = { fill: color };
    return (primitive => shape.apply(null, primitive().map((v, i) => RENDERABLE_STYLE === i ? Object.assign({}, v, style) : v)));
}
