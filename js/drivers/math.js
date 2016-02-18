
// | a b c |
// | d e f |
// | 0 0 1 |
export const a = 0;
export const b = 1;
export const c = 2;
export const d = 3;
export const e = 4;
export const f = 5;

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
export function multiply(m1, m2) {
    return matrix(
        m1[a] * m2[a] + m1[b] * m2[d], m1[a] * m2[b] + m1[b] * m2[e], m1[a] * m2[c] + m1[b] * m2[f] + m1[c],
        m1[d] * m2[a] + m1[e] * m2[d], m1[d] * m2[b] + m1[e] * m2[e], m1[d] * m2[c] + m1[e] * m2[f] + m1[f]
    );
}
