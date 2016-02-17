
// | a b c |
// | d e f |
// | 0 0 1 |
const a = 0,
      b = 1,
      c = 2,
      d = 3,
      e = 4,
      f = 5;

// Transformation = Matrix -> Matrix
// Shape = Matrix -> Renderable 

// matrix = Number -> Number -> Number -> Number -> Number -> Number -> Matrix
export function matrix (a, b, c, d, e, f) {
    return [a, b, c, d, e, f, 0, 0, 1];
}

export function identity () {
    return matrix(1, 0, 0, 0, 1, 0);
}

// | a b c |       | a b c |
// | d e f |   x   | d e f |
// | 0 0 1 |       | 0 0 1 |
// multiply = Matrix -> Matrix -> Matrix
function multiply(m1, m2) {
    return matrix(
        m1[a] * m2[a] + m1[b] * m2[d], m1[a] * m2[b] + m1[b] * m2[e], m1[a] * m2[c] + m1[b] * m2[f] + m1[c],
        m1[d] * m2[a] + m1[e] * m2[d], m1[d] * m2[b] + m1[e] * m2[e], m1[d] * m2[c] + m1[e] * m2[f] + m1[f]
    );
}

// translate = Number -> Number -> Transformation
export function translate (x, y) {
    return (m => matrix(
        m[a], m[b], m[c] + x,
        m[d], m[e], m[f] + y
    ));
}

// rotate = Radians -> Transformation
export function rotate (angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return (m => multiply(matrix(cos, -sin, 0, sin, cos, 0), m));
}

// scale = Number -> Number -> Transformation
export function scale (sx, sy) {
    return (m => multiply(matrix(sx, 0, 0, 0, sy, 0), m));
}

// skew = Number -> Number -> Transformation
export function skew (x, y) {
    return (m => multiply(matrix(1, x, 0, y, 1, 0), m));
}
