import {matrix, multiply, a, b, c, d, e, f} from './math';

// Transformation = Matrix -> Matrix

//------------------translate--------------------//
// translate = Number -> Number -> Transformation
export function translate (x, y) {
    return (m => matrix(
        m[a], m[b], m[c] + x,
        m[d], m[e], m[f] + y
    ));
}
// translateX = Number -> Transformation
export function translateX (x) {
    return translate(x, 0);
}
// translateY = Number -> Transformation
export function translateY (y) {
    return translate(0, y);
}

//------------------rotate--------------------//
// rotate = Radians -> Transformation
export function rotate (angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return (m => multiply(matrix(cos, -sin, 0, sin, cos, 0), m));
}

//------------------scale--------------------//
// scale = Number -> Number -> Transformation
export function scale (sx, sy) {
    return (m => multiply(matrix(sx, 0, 0, 0, sy, 0), m));
}
// scaleX = Number -> Transformation
export function scaleX (sx) {
    return scale(sx, 1);
}
// scaleY = Number -> Transformation
export function scaleY (sy) {
    return scale(1, sy);
}

//------------------shear--------------------//
// shear = Number -> Number -> Transformation
export function shear (x, y) {
    return (m => multiply(m, matrix(1, y, 0, x, 1, 0)));
}
export function shearX (x) {
    return shear(x, 0);
}
export function shearY (y) {
    return shear(0, y);
}

//------------------reflect--------------------//
export function reflect () {
    return (m => multiply(matrix(-1, 0, 0, 0, -1, 0), m))
}
export function reflectX () {
    return (m => multiply(matrix(1, 0, 0, 0, -1, 0), m))
}
export function reflectY () {
    return (m => multiply(matrix(-1, 0, 0, 0, 1, 0), m))
}
