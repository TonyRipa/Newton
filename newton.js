
/*
    Author: Anthony John Ripa
    Date:   6/10/2018
    Newton: An A.I. for Math
*/

class Newton {
    static getpoints() {
        //xy.push([Newton.x[0][i], Newton.x[1][i], Newton.y[i][0]]);
        //  return _.zip(...Newton.x, _.unzip(Newton.y)[0]);            //  2018.6  Removed
        var orig = _.zip(...Newton.x, Newton.y);
        var tran = transform(orig);
        return {orig, tran};                            //  2018.6  Added
        //return math.transpose([...Newton.x, math.transpose(Newton.y)[0]]);
    }
    static simplify(input) {
        var expr, constant;
        [expr, constant] = input.split('|');
        expr = infer(expr);
        if (!constant) return [Newton.getpoints(), expr];
        return [Newton.getpoints(), expr, infer(evaluate(expr, constant))];
        function evaluate(input, val) {
            return substitute(input, getvars(input).slice(-1)[0], val);
        }
        function substitute(input, vari, val) {
            if (vari === undefined) return input;
            return input.replace(new RegExp(vari, 'g'), '(' + val + ')');
        }
        function getvars(input) {
            input = input.replace('sin','').replace('cos','').replace('exp','');
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
            var xs = makexs(vars);
            var y = makey(xs, input);
            //if (trans) return inferrational(xs, y);
            //console.log('Trying Polynomial');
            //var candidate = inferpolynomial(xs, y);
            //if (validate(input, candidate)) return candidate;
            //console.log('Not Polynomial. Trying Rational.');
            //if (validate(input, candidate)) return candidate;
            //console.log('not polynomial. not rational');
            //return '0';
            return inferrational('unused');
            function inferpolynomial(xs, y) {
                var tomatrix, vect2matrix;
                ({tomatrix, vect2matrix} = parser32());
                var vect = solve(...tomatrix(xs, y));
                var ret = stringify(vect2matrix(vect, vars), vars)
                console.log('Infer-Polynomial: ', ret);
                return ret;
            }
            function inferrational(xs, y) {
                var tovect, tomatrix, vect2matrixnum, vect2matrixden, parser;
                var parser = [parserrationalclosed, parserrationalsearch, parserrationalbrute][2];
                if (parser == parserrationalclosed) {
                    ({tomatrix, vect2matrixnum, vect2matrixden} = parser());
                    var matrix = tomatrix(xs, y);
                    console.log('matrix', matrix);
                    var vect = solve(...matrix);
                } else {
                    ({tovect, vect2matrixnum, vect2matrixden} = parser());
                    var vect = tovect(Newton.getpoints().tran);
                }
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
                var numpoints = trans ? 150 : 40;
                xs.ones = Array(numpoints).fill(1);
                //xs.push([-2, -1, 0, 1]);
                //for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>Math.random() * 10 - 5));
                if (!trans) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>Math.random()*8));
                if (trans) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(_.range(0, numpoints).map(x=>x/30));
                //for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>Math.random() * 10 - 5).map(Math.round));
                //xs = xs.map(row=>row.map(cell=>Math.round(1000 * cell) / 1000));
                //xs.ones = Array(10).fill(1);
                Newton.x = xs;
                return xs;
            }
            function makey(xs, input) {             //  2018.6  Added
                var ys = [];
                for (var datai = 0; datai < xs.ones.length; datai++) {
                    var expression = input;
                    for (var varj = 0; varj < vars.length; varj++) {
                        expression = substitute(expression, vars[varj], xs[varj][datai]);
                    }
                    ys.push(math.eval(expression));
                }
                Newton.y = ys;
                return ys;
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
                    if (v2 == 0) return subterm(vars[0] || 's', v1);
                    if (v1 == 0) return subterm(vars[1], v2);
                    return subterm(vars[0], v1) + '*' + subterm(vars[1], v2);
                    function subterm(variable, power) {
                        if (power == 0) return '';
                        return variable + (power == 1 ? '' : '^' + power);
                    }
                }
            }
            function parserrationalclosed() {   //      (a+bx)/(c+dx)
                return {
                    tomatrix: function (xs, y) {
                        try {
                            var A = makeA(xs);
                        } catch (e) {
                            alert(e)
                        }
                        var b = [...xs.ones.map(q=>0), 1];
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
                    vect2matrixnum: function (vect, vars) {
                        //vect = vect.map(v=>v * math.factorial(13)).map(Math.round)
                        //vect = vect.map(v=>v / math.gcd(...vect));
                        return [[vect[1], vect[0], 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                    },
                    vect2matrixden: function (vect, vars) {
                        //vect = vect.map(v=>v * math.factorial(13)).map(Math.round)
                        //vect = vect.map(v=>v / math.gcd(...vect));
                        return [[vect[3], vect[2], 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                    }
                };
            }
            function parserrationalbrute() {   //      (a+bx+cx²)/(d+ex+fx²)
                return {
                    tovect: function brute(allpoints) {
                        var points = allpoints//_.sample(allpoints, 39);
                        var f = (x, p) =>(p[0] + p[1] * x + p[2] * x * x) / (p[6] + p[7] * x + p[8] * x * x);
                        var range = 2;
                        var bestval = 1000;
                        var besti;
                        for (var p0 = -range; p0<=range*2; p0++)        //  a+bx+cx²
                            for (var p1 = -range; p1<=range*2; p1++)
                                for (var p2 = -range; p2<=range; p2++) {
                                    var curval = diff(f, points, [p0,p1,p2,0,0,0,1,0,0]);
                                    //if (p0==1 && p1==1 && p2==0) alert(curval)
                                    if (curval < bestval) {
                                        besti = [p0,p1,p2,0,0,0,1,0,0];
                                        bestval = curval;
                                    }
                                }
                        if (bestval<.0001) return besti;
                        for (var p6 = -range; p6<=range; p6++)          //  1/(a+bx+cx²)
                            for (var p7 = -range; p7<=range; p7++)
                                for (var p8 = -range; p8<=range; p8++) {
                                    var curval = diff(f, points, [1,0,0,0,0,0,p6,p7,p8]);
                                    if (curval < bestval) {
                                        besti = [1,0,0,0,0,0,p6,p7,p8];
                                        bestval = curval;
                                    }
                                }
                        if (bestval<.1) return besti;
                        for (var p0 = range; p0>=-range; p0--)          //  (a+bx+cx²)/(d+ex)
                            for (var p1 = -range; p1<=range; p1++)
                                for (var p2 = -range; p2<=range; p2++)
                                    for (var p3 = 0; p3<=range; p3++)
                                        for (var p4 = -range; p4<=range; p4++) {
                                            var curval = diff(f, points, [p0,p1,p2,0,0,0,p3,p4,0]);
                                            if (curval < bestval) {
                                                besti = [p0,p1,p2,0,0,0,p3,p4,0];
                                                bestval = curval;
                                            }
                                        }
                        if (bestval<.0001) return besti;
                        for (var p0 = -range; p0<=range; p0++)
                            for (var p1 = -range; p1<=range; p1++)
                                for (var p2 = -range; p2<=range; p2++)
                                    for (var p3 = 0; p3<=range; p3++)
                                        for (var p4 = -range; p4<=range; p4++)
                                            for (var p5 = -range; p5<=range; p5++) {
                                                var curval = diff(f, points, [p0,p1,p2,0,0,0,p3,p4,p5]);
                                                if (curval < bestval) {
                                                    besti = [p0,p1,p2,0,0,0,p3,p4,p5];
                                                    bestval = curval;
                                                }
                                            }
                        var f2 = (x1,x2, p) =>(p[0] + p[1] * x1 + p[2] * x1 * x1 + p[3] * x2 + p[4] * x1 * x2 + p[5] * x2 * x2);
                        if (bestval<.0001) return besti;
                        for (var p0 = -range; p0<=range; p0++)
                            for (var p1 = -range; p1<=range; p1++)
                                for (var p2 = -range; p2<=range; p2++)
                                    for (var p3 = 0; p3<=range; p3++)
                                        for (var p4 = -range; p4<=range; p4++)
                                            for (var p5 = -range; p5<=range; p5++) {
                                                var curval = diff2(f2, points, [p0,p1,p2,p3,p4,p5,1,0,0,0]);
                                                if (curval < bestval) {
                                                    besti = [p0,p1,p2,p3,p4,p5,1,0,0];
                                                    bestval = curval;
                                                }
                                            }
                        return besti;
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
                        function diff2(f2, points, p) {
                            var ys = points.map(xsy=>[xsy[2], f2(xsy[0],xsy[1], p)])
                            var d0 = ys.map(pair =>1 / pair[0] == 0 && 1 / pair[1] == 0 ? 0 : isNaN(pair[0]) && isNaN(pair[1]) ? 0 : pair[0] - pair[1]);
                            var d = d0.map(x=>x * x);
                            d = d.map(x=>1 / x == 0 ? 1 : x);
                            d = d.map(x=>isNaN(x) ? 1 : x);
                            d = Math.sqrt(math.sum(...d));
                            if (isNaN(d)) { console.log('disNaN', p, d0, y, y1); end }
                            return d;
                        }
                    },
                    vect2matrixnum: function (vect, vars) {
                        return [[vect[0], vect[1], vect[2], 0], [vect[3], vect[4], 0, 0], [vect[5], 0, 0, 0], [0, 0, 0, 0]];
                    },
                    vect2matrixden: function (vect, vars) {
                        return [[vect[6], vect[7], vect[8], 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                    }
                }
            }
            function parserrationalsearch() {   //      (a+bx+cx²)/(d+ex+fx²)
                return {
                    tovect: function search(allpoints) {
                        var eye = math.eye([6, 6]);
                        var restartmax = 1000
                        for (var restart = 0; restart < restartmax; restart++) {
                            var points = _.sample(allpoints, 9);
                            var param = math.ones([6]).map((v, i) =>Math.round(([2, 2, 2, 1, 1, 1][i] * Math.random() - [.5, .5, .5, 0, 0, 0][i]) * (restart / restartmax) * 5 * [1, 1, .5, .5, .5, .5][i]));
                            var f = (x, p) =>(p[0] + p[1] * x + p[2] * x * x) / (p[3] + p[4] * x + p[5] * x * x);
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
                                //if (diff(f, points, param) < .005) return param;
                                if (diff(f, points, param) < .1) return param;
                            }
                        }
                        return [0, 0, 0, 1, 0, 0];
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
                    },
                    vect2matrixnum: function (vect, vars) {
                        return [[vect[0], vect[1], vect[2], 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                    },
                    vect2matrixden: function (vect, vars) {
                        return [[vect[3], vect[4], vect[5], 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                    }
                }
            }
            function parser32() {    //  a+bx+cx²+dx³ + ey+fxy+gx²y+hx³y + iy²+jxy²+kx²y²+lx³y² + my³+nxy³+ox²y³+px³y³
                var power = 3;
                return {
                    tomatrix: function (xs, y) {
                        var A = makeA(xs);
                        var b = y;
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
                    vect2matrix: function (vect, vars) {
                        //if (vars.length < 2) return [[vect[0], vect[1], vect[2], vect[3]], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                        return [[vect[0], vect[1], vect[2], vect[3]], [vect[4], vect[5], vect[6], vect[7]], [vect[8], vect[9], vect[10], vect[11]], [vect[12], vect[13], vect[14], vect[15]]];
                    }
                };
            }
            function parser22() {    //  a+bx+cx² + dy+exy+fx²y + gy²+hxy²+ix²y²
                return {
                    tomatrix: function (xs, y) {
                        var A = makeA(xs);
                        var b = y
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
                    vect2matrix: function (vect, vars) {
                        return [[vect[0], vect[1], vect[2], 0], [vect[3], vect[4], vect[5], 0], [vect[6], vect[7], vect[8], 0], [0, 0, 0, 0]];
                    }
                };
            }
            function parser2() {    //  a+bx+cy
                return {
                    tomatrix: function (xs, y) {
                        var A = makeA(xs);
                        var b = y;
                        return [A, b];
                        function makeA(xs) {
                            var ones = Array(xs[0].length).fill(1);
                            var AT = [ones].concat(xs);
                            var A = math.transpose(AT);
                            return A;
                        }
                    },
                    vect2matrix: function (vect, vars) {
                        return [[vect[0], vect[1], 0, 0], [vect[2], 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                    }
                };
            }
            function parser1() {    //  a+bx+cx²
                return {
                    tomatrix: function (xs, y) {
                        var A = makeA(xs);
                        var b = y;
                        return [A, b];
                        function makeA(xs) {
                            var AT = [];
                            for (var power = 0; power <= 2; power++) AT.push(xs[0].map(xi=>math.pow(xi, power)));
                            return math.transpose(AT);
                        }
                    },
                    vect2matrix: function (vect, vars) {
                        return [[vect[0], vect[1], vect[2], 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
                    }
                };
            }
        }
    }
}
