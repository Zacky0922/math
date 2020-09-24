import { keisu } from "./mathLib.js";
// 2次関数

//  平方完成 y=ax^2+bx+c
//  MathJaxベースでソースを生成
export function SQcomplete(a, b, c) {
    let mj = '\\alignat{}\n';
    mj += a + "x^2" + keisu(b, true, false) + "x" + keisu(c, true, true) + "\\\\\n";
    mj += a + "\left\{x^2+\frac{"+b+"}{"+a+"} x\right\}" + keisu(c, true, true);
}