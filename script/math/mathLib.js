

export { keisu } from "./MJvalue.js";
export { SQcomplete } from "./quadraticFunction.js";



let zMath = new (class zMath {


    constructor() {
        // 基本設定
        // 素数列
        this.primes = [2, 3, 5];
        this.primeMax = 5;  //素数チェックした最大値（最大の素数ではない）
    }

    // 汎用算術メソッド

    //丸め誤差除去
    fixRoundingError(val) {
        // 小数点以下の有効桁数（ここで微調整して、認識制度を良い感じにする）
        let precision = 5;
        return Math.round(val * Math.pow(10, precision)) / Math.pow(10, precision);
    }

    //素数列（解析範囲2～max）
    getPrime(max = 1023) {
        //十分に求めてあれば、計算しない
        if (this.primesMax >= max) {
            return this.primes;
        }
        //巨大数チェック
        if (max >= 65536) {
            if (!window.confirm("大きな値は、処理に時間がかかります。\n" +
                "フリーズするかも知れませんが、本当に実行しますか？\n\n" +
                "OK = そのままの値で実行する\n" +
                "キャンセル = 素数判定を" + Math.max(this.primeMax, 65536) + "以下のみで行なう（値が不正確／バグる場合があります）")
            ) {
                max = Math.max(this.primeMax, 65536);
            }
        }
        this.primeMax = max;
        for (let a = this.primes[this.primes.length - 1]; a <= this.primeMax; a += 2) {
            let flag = true;
            for (let i = 0; i < this.primes.length; i++) {
                if (a % this.primes[i] == 0) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                this.primes.push(a);
            }
        }
        zDebug.addLog(
            "zMath.js - 素数更新 max prime = " +
            this.primes[this.primes.length - 1] +
            " (length = " + this.primes.length + ")"
        );
        return this.primes;
    }


    //素因数分解（出力モード：数式表示true／指数列false）
    primeFactorization(val, mode = true) {
        if ((!Number.isInteger(val)) || (val <= 0) || (val == 1)) {
            return null;
        }
        this.getPrime(Math.abs(val));          //素数範囲確認
        let p = new Array();    //出力用素数列
        let exp = new Array();  //出力用指数列
        for (let i = 0; i < this.primes.length; i++) {
            p[i] = this.primes[i];
            exp[i] = 0;
            while (true) {
                //debugMsg(val + "%" + p[i] + "=" + val % p[i]);
                if (val % p[i] == 0) {
                    val = Math.round(val / p[i]);
                    exp[i]++;
                } else {
                    break;
                }
            }
            if (val == 1) {
                break;
            }
        }
        if (mode) {
            let formula = "";
            let flag = false;
            for (let i = 0; i < p.length; i++) {
                if (exp[i] != 0) {
                    formula = formula + (flag ? "\\times" : "") + "{" + p[i] + "}^{" + exp[i] + "}";
                    flag = true;
                }
            }
            return formula;
        } else {
            return [p, exp];
        }
    }

    //共通因数取得
    getCommonFactor(a, b) {
        if (
            (!Number.isInteger(a)) || (!Number.isInteger(b)) ||
            (a * b == 0) || ((a - 1) * (a + 1) * (b - 1) * (b + 1) == 0)
        ) {
            //整数でない or いずれかが0 or いずれかが1 のとき
            return 1;
        } else if (a == b) {
            return a;
        }

        a = Math.abs(a);
        b = Math.abs(b);
        let a_ = this.primeFactorization(a, false);
        let b_ = this.primeFactorization(b, false);
        if (a_ == null || b_ == null) {
            return null;
        }
        let cf = 1;
        for (let i = 0; i < Math.min(a_[0].length, b_[0].length); i++) {
            if (a_[1][i] > 0 && b_[1][i] > 0) {
                cf *= Math.pow(a_[0][i], Math.min(a_[1][i], b_[1][i]));
            }
        }
        return cf;
    }

    // 線形代数
    //行列の積（行列数free）
    productMatrix(A, B) {
        // 積が定義できない行列
        if (A[0].length != B.length) {
            return null;
        }
        let P = new Array(A.length);
        for (let i = 0; i < P.length; i++) {
            P[i] = new Array(B[0].length);
            for (let j = 0; j < P[0].length; j++) {
                P[i][j] = 0;
                for (let k = 0; k < A[0].length; k++) {
                    P[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return P;
    }

    // 行列式（2x2）
    determinant2x2(A) {
        return A[0][0] * A[1][1] - A[0][1] * A[1][0];
    }

    // 逆行列（2x2）
    inverseMatrix2x2(A) {
        let d = this.determinant2x2(A)
        return [
            [A[1][1] / d, -A[0][1] / d],
            [-A[1][0] / d, A[0][0] / d]
        ];
    }

    //連立2元1次方程式
    simultaneousEQsolver(a, b, c, d, p, q, id) {
        let A = [[a, b], [c, d]];
        let B = [[p], [q]];

        // 係数表示の調整
        a = (a == 1 ? "" : a);
        c = (c == 1 ? "" : c);

        let eq = "\\begin{cases}" +
            this.keisu(a, false) + "x &" + this.keisu(b, true) + "y &=" + p + "\\\\" +
            this.keisu(c, false) + "x &" + this.keisu(d, true) + "y &=" + q +
            "\\end{cases}";


        if (this.determinant2x2(A) == 0) {
            return [eq, [null, null]];
        } else {
            let ans = this.productMatrix(this.inverseMatrix2x2(A), B);
            return [eq,
                [ans[0][0], ans[1][0]]
            ];
        }
    }


    // MathJax 表示ソース関係処理




    // 小数値の規約分数化（誤差含む可能性あり…）
    // 分数化できなければ、そのまま返す。
    estimateFrac(val) {
        if (Number.isInteger(val)) {
            return val;
        }
        let sign = "";
        if (val < 0) {
            sign = "-";
            val = -val;
        }
        // 1桁／1桁 のみ判定
        for (let bunbo = 2; bunbo < 10; bunbo++) {
            for (let bunsi = 1; bunsi < 10; bunsi++) {
                if (this.fixRoundingError(val) == this.fixRoundingError(bunsi / bunbo)) {
                    if (bunsi == 1) {
                        return sign + "\\dfrac{" + bunsi + "}{" + bunbo + "}";
                    } else if (this.getCommonFactor(bunsi, bunbo)) {
                        return sign + "\\dfrac{" + bunsi + "}{" + bunbo + "}";
                    }
                }
            }
        }
        return Number(sign + val);
    }

})();
