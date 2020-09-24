//  MathJax表示用：数値操作系

//  係数処理
export function keisu(val, sign = true, one = false) {
    //符号処理（＋表示：有true／無false）、1の表示（有true／無false）
    return (val >= 0 ? (sign ? "+" : "") : "-") +
        (Math.abs(val) == 1 && !one ? "" : Math.abs(val));
}