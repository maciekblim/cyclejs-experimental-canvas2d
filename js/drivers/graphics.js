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
// Effect = Color ? Gradient
// style = Style ->  Shape -> Shape
function style (effect) {
    return (s => shape.apply(null, s().map((v, i) => RENDERABLE_STYLE === i ? Object.assign({}, v, effect) : v)));
}

// filled = Effect -> Style
export function filled (fstyle) {
    const effect = { fill: fstyle };
    return style(effect);
}

// stroked = Color -> Style
export function stroked (color) {
    const effect = { stroke: color };
    return style(effect);
}
// linear gradient
// linearg = [Float, Float] -> [Float, Float] -> List<Float, Color> -> Gradient
export function linearg (start, end, stops) {
    return {start, end, stops, linear: true};
}
// radial gradient
// radialg= [Float, Float] -> Float -> [Float, Float] -> List<Float, Color> -> Gradient
export function radialg (start, innerr, end, outterr, stops) {
    return { start, end, stops, innerr, outterr, radial: true};
}

// // lineStyle = Color -> Float -> LineCap -> LineJoin -> List<Integer> -> Integer -> Style
// export function lineStyle (color, width, cap, join, dashing, dashOffset) {
// }
