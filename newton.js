
/*
    Author: Anthony John Ripa
    Date:   5/2/2018
    Newton: An A.I. for Math
*/

class Newton {
    static getpoints() {
        //xy.push([Newton.x[0][i], Newton.x[1][i], Newton.y[i][0]]);
        return _.zip(...Newton.x, _.unzip(Newton.y)[0]);
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
            console.log('Trying Polynomial');
            var candidate = inferpolynomial();
            if (validate(input, candidate)) return candidate;
            console.log('Not Polynomial. Trying Rational.');
            var candidate = inferrational();
            if (validate(input, candidate)) return candidate;
            console.log('not polynomial. not rational');
            return '0';
            function inferpolynomial() {
                var input2matrix, vect2matrix;
                [input2matrix, vect2matrix] = parser32();
                var vect = solve(...input2matrix(input));
                var ret = stringify(vect2matrix(vect, vars), vars)
                console.log('Infer-Polynomial: ', ret);
                return ret;
            }
            function inferrational() {
                var input2matrix, vect2matrixnum, vect2matrixden;
                [input2matrix, vect2matrixnum, vect2matrixden] = parserrationalclosed();
                var matrix = input2matrix(input)
                console.log('matrix', matrix);
                var vect = solve(...matrix);
                console.log('vect', vect);
                console.log(stringify(vect2matrixnum(vect), vars) + ' : ' + stringify(vect2matrixden(vect), vars));
                var num = stringify(vect2matrixnum(vect), vars);
                var den = stringify(vect2matrixden(vect), vars);
                if (den == '1') return num;
                if (num.includes('+') || num.includes('-')) num = '(' + num + ')';
                if (den.includes('+') || den.includes('-')) den = '(' + den + ')';
                return num + ' / ' + den;
            }
            function validate(inputstring, outputstring) {
                var scope = {};
                for (let char of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
                    scope[char] = Math.random() * 10 - 5;
                var input = math.eval(inputstring, scope);
                var output = math.eval(outputstring, scope);
                var error = Math.abs(input - output);
                console.log('Error', error)
                return error < .0001;
            }
            function makexs(vars) {
                var xs = [];
                xs.ones = Array(20).fill(1);
                //xs.push([-2, -1, 0, 1]);
                for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>Math.random() * 10 - 5));
                //xs = xs.map(row=>row.map(cell=>Math.round(1000 * cell) / 1000));
                //xs.ones = Array(10).fill(1);
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
                var ATb = math.multiply(AT, b);
                return solvesquare(ATA, ATb);
                function solvesquare(A, b) {
                    console.log('Solve > SolveSquare > Determinant', math.det(A));
                    if (math.det(A) < .1) return solvesquare2(A, b);
                    var Ainv = math.divide(math.eye(A[0].length), A);
                    var x = math.multiply(Ainv, b);
                    return x.valueOf();
                }
                function solvesquare2(A, b) {
                    console.log('det2', math.det(A));
                    var Ainv = math.divide(math.eye(A[0].length), A);
                    var x = math.multiply(Ainv, b);
                    return x.valueOf();
                }
            }
            function stringify(termcoefs, vars) {
                //console.log(termcoefs)
                //console.log(vars)
                var power = termcoefs.length - 1;
                termcoefs = termcoefs.map(row=>row.map(cell=>Math.round(cell * 10000) / 10000));
                var ret = '';
                for (var v2 = 0; v2 <= power; v2++) {
                    for (var v1 = 0; v1 <= power; v1++) {
                        ret += (v1 == 0 && v2 == 0) ? termcoefs[v2][v1] : term(termcoefs[v2][v1] || 0, termvars(v1, v2, vars));
                    }
                }
                if (ret.length == 1) return ret;
                if (ret[0] == '0') ret = ret.substr(1);
                if (ret[0] == '+') ret = ret.substr(1);
                return ret;
                function term(termcoef, termvar) {
                    if (termcoef == 0) return '';
                    if (termcoef == 1) return '+' + termvar;
                    return '+' + termcoef + (termvar == '1' ? '' : '*' + termvar);
                }
                function termvars(v1, v2, vars) {
                    if (vars.length == 1) return subterm(vars[0], v1);
                    if (v2 == 0) return subterm(vars[0], v1);
                    if (v1 == 0) return subterm(vars[1], v2);
                    return subterm(vars[0], v1) + '*' + subterm(vars[1], v2);
                    function subterm(variable, power) {
                        if (power == 0) return '';
                        return variable + (power == 1 ? '' : '^' + power);
                    }
                }
            }
            function parserrationalclosed() {   //      (a+bx)/(c+dx)
                return [
                    function input2matrix1(input) {
                        var vars = getvars(input);
                        var xs = makexs(vars);
                        var b = makeb(xs, input);
                        var y = _.unzip(b)[0];
                        try {
                            var A = makeA(xs);
                        } catch (e) {
                            alert(e)
                        }
                        b = [...xs.ones.map(q=>0), 1];
                        return [A, b];
                        function makeA(xs) {
                            var c1 = [...xs[0], 0];
                            var c2 = [...xs.ones, 0];
                            var c3 = [...math.multiply(-1, math.dotMultiply(xs[0], y)), 1];
                            var c4 = [...math.multiply(-1, y), 0];
                            //var c5 = [0, 0, 0, 0, 1];
                            console.log('xs[0]', c1);
                            console.log('xs.ones', c2);
                            console.log('xs[0]*y', c3);
                            console.log('y', c4);
                            //console.log('c5', c5);
                            var AT = [];
                            AT.push(c1);
                            AT.push(c2);
                            AT.push(c3);
                            AT.push(c4);
                            //AT.push(c5);
                            return math.transpose(AT);
                        }
                    },
                    function vect2matrixnum(vect, vars) {
                        //vect = vect.map(v=>v * math.factorial(13)).map(Math.round)
                        //vect = vect.map(v=>v / math.gcd(...vect));
                        return [[vect[1], vect[0], 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                    },
                    function vect2matrixden(vect, vars) {
                        //vect = vect.map(v=>v * math.factorial(13)).map(Math.round)
                        //vect = vect.map(v=>v / math.gcd(...vect));
                        return [[vect[3], vect[2], 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                    }
                ];
            }
            function parserrationalsearch() {   //      (a+bx+cx²)/(d+ex)
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
                    function vect2matrixnum(vect, vars) {
                        return [[vect[0], vect[1], vect[2], 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                    },
                    function vect2matrixden(vect, vars) {
                        return [[vect[3], vect[4], 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                    }
                ]
            }
            function parser32() {    //  a+bx+cx²+dx³ + ey+fxy+gx²y+hx³y + iy²+jxy²+kx²y²+lx³y² + my³+nxy³+ox²y³+px³y³
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
                    function vect2matrix(vect, vars) {
                        //if (vars.length < 2) return [[vect[0], vect[1], vect[2], vect[3]], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                        return [[vect[0], vect[1], vect[2], vect[3]], [vect[4], vect[5], vect[6], vect[7]], [vect[8], vect[9], vect[10], vect[11]], [vect[12], vect[13], vect[14], vect[15]]];
                    }
                ];
            }
            function parser22() {    //  a+bx+cx² + dy+exy+fx²y + gy²+hxy²+ix²y²
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
                    function vect2matrix(vect, vars) {
                        return [[vect[0], vect[1], vect[2], 0], [vect[3], vect[4], vect[5], 0], [vect[6], vect[7], vect[8], 0], [0, 0, 0, 0]];
                    }
                ];
            }
            function parser2() {    //  a+bx+cy
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
                    function vect2matrix(vect, vars) {
                        return [[vect[0], vect[1], 0, 0], [vect[2], 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                    }
                ];
            }
            function parser1() {    //  a+bx+cx²
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
                    function vect2matrix(vect, vars) {
                        return [[vect[0], vect[1], vect[2], 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                    }
                ];
            }
        }
    }
}
