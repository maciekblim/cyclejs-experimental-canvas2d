import {identity} from './math';

// Renderable
export const RENDERABLE_TYPE = 0;
export const RENDERABLE_ARGS = 1;
export const RENDERABLE_MATRIX = 2;
export const RENDERABLE_STYLE = 3;


// kabum !!!!????!!!!
// shape = RenderableType -> RenderableArgs -> Matrix -> Style -> ... Renderable
function shape (type, args, matrix, styles) {
    return (transformation => transformation ? shape(type, args, transformation(matrix), styles) : [type, args, matrix, styles]);
}

// --------------shapes-------------//
// rect = Number -> Number -> Shape
export function rect (width, height) {
    return shape('rect', [width, height], identity(), {});
}
// square = Number -> Shape
export function square (length) {
    return rect(length, length);
}

// oval = Float -> Float -> Shape
export function oval (width, height) {
    return shape('oval', [width, height], identity(), {});
}

// circle = Float -> Shape
export function circle(radius) {
    return oval(radius, radius);
}

// regular polygon
// ngon = Integer -> Float -> Shape
export function ngon (n, radius) {
    return shape('ngon', [n, radius], identity(), {});
}

// polygon = List<Float, Float> -> Shape
export function polygon(corners) {
    return shape('polygon', corners, identity(), {});
}

//--------------styles-------------//
// style = Style ->  Shape -> Shape
function style (effect) {
    return (s => shape.apply(null, s().map((v, i) => RENDERABLE_STYLE === i ? Object.assign({}, v, effect) : v)));
}

// filled = Color -> Style
export function filled (color) {
    const effect = { fill: color };
    return style(effect);
}

// stroked = Color -> Style
export function stroked (color) {
    const effect = { stroke: color };
    return style(effect);
}
