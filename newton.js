
/*
    Author: Anthony John Ripa
    Date:   2/10/2018
    Newton: An A.I. for Math
*/

class Newton {
    static getxy() {
        var xy = [];
        for (var i = 0; i < Newton.x[0].length; i++)
            xy.push([Newton.x[0][i], Newton.y[i][0]]);
        return xy;
    }
    static getxsy() {
        if (Newton.x.length == 1) return Newton.getxy();
        var xy = [];
        for (var i = 0; i < Newton.x[0].length; i++)
            xy.push([Newton.x[0][i], Newton.x[1][i], Newton.y[i][0]]);
        return xy;
    }
    static simplify(input, full) {
        var expr, constant;
        [expr, constant] = input.split('|');
        expr = infer(expr)
        if (constant) {
            if (full) expr = evaluate(expr, constant);
            expr = infer(expr)
            if (!full) expr += '|' + constant;
        }
        return expr;
        function evaluate(input, val) {
            return substitute(input, getvars(input).slice(-1)[0], val);
        }
        function substitute(input, vari, val) {
            if (vari === undefined) return input;
            return input.replace(new RegExp(vari, 'g'), '(' + val + ')');
        }
        function getvars(input) {
            var vars = [];
            var alphabet = 'abcdefghijklmnopqrstuvwxyz';
            for (var i = 0; i < input.length; i++) {
                var symbol = input[i];
                if (isin(symbol, alphabet)) {
                    if (!isin(symbol, vars)) vars.push(symbol);
                }
            }
            return vars;
            function isin(needle, haystack) {
                return haystack.indexOf(needle)>-1;
            }
        }
        function infer(input) {
            var vars = getvars(input);
            var input2matrix, toString;
            [input2matrix, toString] = parser22();
            var vect = solve(...input2matrix(input));
            return toString(vect, vars);
            function makexs(vars) {
                var xs = [];
                xs.ones = Array(20).fill(1);
                for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>Math.random() * 10 - 5));
                Newton.x = xs;
                return xs;
            }
            function solve(A, b) {
                var AT = math.transpose(A);
                var ATA = math.multiply(AT, A);
                var ATA = math.multiply(AT, A);
                var ATAinv = math.divide(math.eye(A[0].length), ATA);
                var ATb = math.multiply(AT, b);
                var x = math.multiply(ATAinv, ATb);
                return x.valueOf();
            }
            function round(x) {
                return Math.round(x * 100) / 100;
            }
            function coef(num, vari) {
                if (num == 0) return '';
                if (num == 1) return '+' + vari;
                return '+' + num + (vari == '1' ? '' : '*' + vari);
            }
            function parser22() {
                return [
                    function input2matrix22(input) {
                        var vars = getvars(input);
                        var xs = makexs(vars);
                        var A = makeA(xs);
                        var b = makeb(xs, input);
                        return [A, b];
                        function makeA(xs) {
                            var AT = [];
                            if (xs.length == 0) {
                                AT.push(xs.ones);
                            } else if (xs.length == 1) {
                                AT = AT.concat(makepowercols(xs[0]));
                            } else if (xs.length == 2) {
                                AT = AT.concat(makepowercols(xs[0]));
                                AT = AT.concat(makepowercols(xs[0]).map(x=>coltimescol(x, xs[1])));
                                AT = AT.concat(makepowercols(xs[0]).map(x=>coltimescol(x, xs[1].map(xi=>math.pow(xi, 2)))));
                            }
                            return math.transpose(AT);
                            function coltimescol(col1, col2) {
                                var ret = [];
                                for (var i = 0; i < col1.length; i++)
                                    ret.push(col1[i] * col2[i]);
                                return ret;
                            }
                            function makepowercols(x) {
                                var cols = [];
                                for (var power = 0; power <= 2; power++) cols.push(x.map(xi=>math.pow(xi, power)));
                                return cols;
                            }
                        }
                        function makeb(xs, input) {
                            var ys = [];
                            for (var datai = 0; datai < xs.ones.length; datai++) {
                                var expression = input;
                                for (var varj = 0; varj < vars.length; varj++) {
                                    expression = substitute(expression, vars[varj], xs[varj][datai]);
                                }
                                ys.push(math.eval(expression));
                            }
                            var b = math.transpose([ys]);
                            Newton.y = b;
                            return b;
                        }
                    },
                    function toString22(vect, vars) {
                        //console.log(vect.join('\n'))
                        //console.log(vars)
                        //console.log(vars.length)
                        var varcombo = [];
                        if (vars.length == 0) varcombo.push('1');
                        if (vars.length == 1) {
                            for (var v1 = 0; v1 <= 2; v1++)
                                varcombo.push(term(v1, '1', vars));
                        }
                        if (vars.length == 2) {
                            for (var v2 = 0; v2 <= 2; v2++)
                                for (var v1 = 0; v1 <= 2; v1++)
                                    varcombo.push(term(v1, v2, vars));
                        }
                        vect = vect.map(round);
                        var ret = '';
                        for (var i = 0; i < varcombo.length; i++) {
                            ret += i == 0 ? vect[i] : coef(vect[i], varcombo[i]);
                        }
                        if (ret.length == 1) return ret;
                        if (ret[0] == '0') ret = ret.substr(1);
                        if (ret[0] == '+') ret = ret.substr(1);
                        return ret;
                        function term(i, j, vars) {
                            if (vars.length == 1) return subterm(vars[0], i);
                            if (j == 0) return subterm(vars[0], i);
                            if (i == 0) return subterm(vars[1], j);
                            return subterm(vars[0], i) + '*' + subterm(vars[1], j);
                            function subterm(vari, ind) {
                                if (ind == 0) return '';
                                return vari + (ind == 1 ? '' : '^' + ind);
                            }
                        }
                    }
                ];
            }
            function parser2() {
                return [
                    function input2matrix2(input) {
                        var vars = getvars(input);
                        var xs = makexs(vars);
                        var A = makeA(xs);
                        var b = makeb(xs, input);
                        return [A, b];
                        function makeA(xs) {
                            var ones = Array(xs[0].length).fill(1);
                            var AT = [ones].concat(xs);
                            var A = math.transpose(AT);
                            return A;
                        }
                        function makeb(xs, input) {
                            var ys = [];
                            for (var datai = 0; datai < xs[0].length; datai++) {
                                var expression = input;
                                for (var varj = 0; varj < vars.length; varj++) {
                                    expression = substitute(expression, vars[varj], xs[varj][datai]);
                                }
                                ys.push(math.eval(expression));
                            }
                            var b = math.transpose([ys]);
                            return b;
                        }
                    },
                    function toString2(vect, vars) {
                        vect = vect.map(round);
                        var ret = '';
                        console.log(vars)
                        console.log(vect)
                        for (var i = 0; i < vars.length; i++) {
                            ret += coef(vect[i + 1], vars[i]);
                        }
                        if (vect[0] != 0) ret += '+' + vect[0];
                        return ret.substr(1);
                    }
                ];
            }
            function parser1() {
                return [
                    function input2matrix1(input) {
                        var vars = getvars(input);
                        var xs = makexs(vars);
                        var A = makeA(xs);
                        var b = makeb(xs, input);
                        return [A, b];
                        function makeA(xs) {
                            var AT = [];
                            for (var power = 0; power <= 2; power++) AT.push(xs[0].map(xi=>math.pow(xi, power)));
                            return math.transpose(AT);
                        }
                        function makeb(xs, input) {
                            var ys = [];
                            for (var datai = 0; datai < xs[0].length; datai++) {
                                var expression = input;
                                expression = substitute(expression, vars[0], xs[0][datai]);
                                ys.push(math.eval(expression));
                            }
                            var b = math.transpose([ys]);
                            return b;
                        }
                    },
                    function toString1(vect, vars) {
                        vect = vect.map(round);
                        var ret = '';
                        for (var i = 0; i < vect.length; i++) {
                            ret += coef(vect[i], vars[0] + '^' + i);
                        }
                        return ret.substr(1);
                    }
                ];
            }
        }
    }
}
