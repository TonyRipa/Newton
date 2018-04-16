
/*
    Author: Anthony John Ripa
    Date:   4/15/2018
    Newton: An A.I. for Math
*/

class Newton {
    static getpoints() {
        //xy.push([Newton.x[0][i], Newton.x[1][i], Newton.y[i][0]]);
        return _.zip(Newton.x[0], _.unzip(Newton.y)[0]);
        //return math.transpose([...Newton.x, math.transpose(Newton.y)[0]]);
    }
    static simplify(input, full) {
        var expr, constant;
        [expr, constant] = input.split('|');
        expr = infer(expr);
        if (constant) {
            if (full) expr = evaluate(expr, constant);
            expr = infer(expr);
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
            var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (let symbol of input) {
                if (alphabet.includes(symbol)) {
                    if (!vars.includes(symbol)) vars.push(symbol);
                }
            }
            return vars;
        }
        function infer(input) {
            var vars = getvars(input);
            if (parser == 'rational') {
                var input2vect, toString;
                [input2vect, toString] = parsernon();
                var vect = input2vect(input);
                console.log(vect)
            } if (parser == 'polynomial') {
                var input2matrix, toString;
                [input2matrix, toString] = parser32();
                var vect = solve(...input2matrix(input));
            }
            console.log(toString(vect, vars))
            return toString(vect, vars);
            function makexs(vars) {
                var xs = [];
                xs.ones = Array(20).fill(1);
                for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>Math.random() * 10 - 5));
                Newton.x = xs;
                return xs;
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
            function parsernon() {
                return [
                    function input2vec(input) {
                        var vars = getvars(input);
                        var xs = makexs(vars);
                        var b = makeb(xs, input);
                        var x = xs[0];
                        var y = math.transpose(b)[0];
                        var param = search(_.zip(x, y));
                        return param;
                        function search(allpoints) {
                            var eye = math.eye([5, 5]);
                            var restartmax = 500
                            for (var restart = 0; restart < restartmax; restart++) {
                                var points = _.sample(allpoints, 9);
                                var param = math.ones([5]).map((v, i) =>Math.round(([2, 2, 2, 1, 1][i] * Math.random() - [.5, .5, .5, 0, 0][i]) * (restart / restartmax) * 10 * [1, 1, .5, .5, .5][i]));
                                var f = (x, p) =>(p[0] + p[1] * x + p[2] * x * x) / (p[3] + p[4] * x);
                                var maxtime = 30;
                                for (var search = 0; search <= maxtime; search++) {
                                    var candidates = [];
                                    for (var i = 0; i < eye.length; i++) {
                                        candidates.push(math.add(param, eye[i]));
                                        candidates.push(math.subtract(param, eye[i]));
                                    }
                                    if (Math.max(...param.map(Math.abs)) > 10) break;
                                    var diffs = candidates.map(v=>diff(f, points, v));
                                    var best = Math.min(...diffs);
                                    var bestindex = diffs.indexOf(best);
                                    var param = candidates[bestindex];
                                    if (typeof (param) == 'undefined') { console.log(candidates, diffs, best); console.trace(); end }
                                    if (diff(f, points, param) < .005) return param;
                                }
                            }
                            return [0, 0, 0, 1, 0];
                            function diff(f, points, p) {
                                var ys = points.map(xy=>[xy[1], f(xy[0], p)])
                                var d0 = ys.map(pair =>1 / pair[0] == 0 && 1 / pair[1] == 0 ? 0 : isNaN(pair[0]) && isNaN(pair[1]) ? 0 : pair[0] - pair[1]);
                                var d = d0.map(x=>x * x);
                                d = d.map(x=>1 / x == 0 ? 1 : x);
                                d = d.map(x=>isNaN(x) ? 1 : x);
                                d = Math.sqrt(math.sum(...d));
                                if (isNaN(d)) { console.log('disNaN', p, d0, y, y1); end }
                                return d;
                            }
                        }
                    },
                    function toString(vect, vars) {
                        if (vect[2] != 0) {
                            var bot = sum(vect[3], vect[4]);
                            var top = (vect[0] || '') + coef(vect[1], vars[0]) + coef(vect[2], vars[0] + '^2');
                            if (top[0] == '+') return top.substr(1);
                            if (bot == '1') return top;
                            return '( ' + top + ' ) / ( ' + vect[3] + ' + ' + vect[4] + '*' + vars[0] + ' ) ';
                        }
                        var top = sum(vect[0], vect[1]);
                        var bot = sum(vect[3], vect[4]);
                        if (bot == '1') return top.toString();
                        if (!top.toString().includes('+')) return top + ' / (' + bot + ')';
                        return '(' + top + ') / (' + bot + ')';
                        function sum(a, b) {
                            if (a == 0) {
                                if (b == 0) return 0;
                                if (b == 1) return vars[0];
                                if (b == -1) return '-' + vars[0];
                                return b + '*' + vars[0];
                            }
                            if (b == 0) return a;
                            if (b == 1) return a + ' + ' + vars[0];
                            if (b == -1) return a + ' - ' + vars[0];
                            return a + ' + ' + b + '*' + vars[0];
                        }
                    }
                ]
            }
            function parser32() {
                var power = 3;
                return [
                    function input2matrix(input) {
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
                                for (var i = 0; i <= power; i++) {
                                    AT = AT.concat(makepowercols(xs[0]).map(x=>coltimescol(x, xs[1].map(xi=>math.pow(xi, i)))));
                                }
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
                                for (var p = 0; p <= power; p++) cols.push(x.map(xi=>math.pow(xi, p)));
                                return cols;
                            }
                        }
                    },
                    function toString(vect, vars) {
                        //console.log(vect.join('\n'))
                        //console.log(vars)
                        var varcombo = [];
                        if (vars.length == 0) varcombo.push('1');
                        if (vars.length == 1) {
                            for (var v1 = 0; v1 <= power; v1++)
                                varcombo.push(term(v1, '1', vars));
                        }
                        if (vars.length == 2) {
                            for (var v2 = 0; v2 <= power; v2++)
                                for (var v1 = 0; v1 <= power; v1++)
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
                    },
                    function toString22(vect, vars) {
                        //console.log(vect.join('\n'))
                        //console.log(vars)
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
                    },
                    function toString1(vect, vars) {
                        vect = vect.map(round);
                        var ret = '';
                        for (var i = 0; i < vect.length; i++) {
                            if (i == 0) ret += coef(vect[i], 1);
                            else ret += coef(vect[i], vars[0] + '^' + i);
                        }
                        return ret.substr(1);
                    }
                ];
            }
        }
    }
}
