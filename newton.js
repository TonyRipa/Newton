﻿
/*
	Author:	Anthony John Ripa
	Date:	7/10/2019
	Newton:	An A.I. for Math
*/

function assert(x, s = 'Assertion Failed') {	//	2018.8
	if (!x) {
		alert(s);
		throw new Error(s);
	}
}

class Newton {
	static getpoints() {
		var orig = _.zip(...Newton.x, Newton.y);
		console.log(orig)
		var t = transform(orig)
		var tran = t.map(point=>point.map(x=>math.fraction(0).add(x)));			//	2018.8	Fraction	//	2018.9	Added for NaN handling
		console.log('getpoints',tran);
		return {orig, tran};													//	2018.6	Added
	}
	static getpointsreal() {													//	2018.8	Added
		return _.mapValues(Newton.getpoints(),arr=>arr.map(xyz=>math.number(xyz)));
	}
	static getrightpoints() {
		if (vm.trans==1) return Newton.getpoints().tran;						//	2019.3	vm.trans
		return Newton.getpoints().orig;
	}
	static getvars(input) {	//	2018.12
		input = input.replace('sinh','').replace('sin','').replace('cosh','').replace('cos','').replace('exp','');	//	2019.2	sinh & cosh
		var vars = [];
		var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		for (let symbol of input) {
			if (alphabet.includes(symbol)) {
				if (!vars.includes(symbol)) vars.push(symbol);
			}
		}
		return vars;
	}
	static simplify(input) {
		var expr, constant, best, candidates;
		[expr, constant] = input.split('|');
		//expr = infers(expr);																			//	2019.5	Removed
		({candidates,best} = infers(expr));																//	2019.5	Added
		vm.selected = best;																				//	2019.5	Added
		assert(candidates !== undefined, "Newton.simplify returning undefined")							//	2018.8	Added
		if (!constant) return [Newton.getpointsreal(), candidates];										//	2018.8	Added
		//return [Newton.getpointsreal(), expr, infer(evaluate(expr, constant))];						//	2018.8	Added	//	2019.4	Removed
		return [Newton.getpointsreal(), candidates, candidates.map(e=>infer(evaluate(e, constant)))];	//	2019.4	Added
		function evaluate(input, val) {
			return substitute(input, Newton.getvars(input).slice(-1)[0], val);
		}
		function substitute(input, vari, val) {
			if (vari === undefined) return input;
			return input.replace(new RegExp(vari, 'g'), '(' + val + ')');
		}
		function infer(input) {																//	2019.4	Added
			var candidates,best;															//	2019.5	Added
			({candidates,best} = infers(input));											//	2019.5	Added
			return candidates[best];														//	2019.5	Added
			//return infers(input)[0];														//	2019.5	Removed
		}
		function infers(input) {//alert('infer')											//	2019.4	Renamed
			assert(input !== undefined, "Newton.infer Arg undefined")						//	2018.8	Added
			var vars = Newton.getvars(input);
			var xs = makexs(vars);
			var y = makey(xs, input);
			console.log(JSON.stringify(xs))
			console.log(y)
			console.log(JSON.stringify(y))
			console.log(JSON.stringify(_.unzip(Newton.getpoints().tran)))
			if (vm.trans==1) { [xs, y] = _.unzip(Newton.getpoints().tran); xs = [xs]; xs.ones = Array(y.length).fill(1); }
			console.log(JSON.stringify(xs))
			console.log(JSON.stringify(y))
			//if (vars.length==2) return [inferpolynomial(xs, y, parser32)];	//	2019.4	list	//	2019.5	Removed
			if (vars.length==2) return {candidates:[inferpolynomial(xs, y, parser32)],best:0};		//	2019.5	object
			//if (vm.trans==2) return [inferdifferential(xs)];					//	2019.4	list	//	2019.5	Removed
			if (vm.trans==2) return {candidates:[inferdifferential(xs)],best:0};					//	2019.5	object
			var e = math.fraction([100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000]);	//	2018.8	Fraction
			var candidate = [];
			for (let i of [0,1,2,3,4,5,6,7,8]) {
				try {
					console.log('Candidate: ' + i);
					candidate[i] = i==0 ? inferpolynomial(xs, y, parser01) : i==1 ? inferpolynomial(xs, y, parser_21) : i==2 ? inferpolynomial(xs, y, parser51) : inferrational(xs, y, i-2);
					assert(candidate[i] !== undefined);
					e[i] = geterrorbypoints(Newton.getrightpoints(), candidate[i]);
					//alert([candidate[i],_.range(vm.range+1,9).some(x=>candidate[i].replace('^2','').includes(x))])
					//if (candidate[i].replace('^2','').split('').some(x=>_.range(vm.range+1,9).includes(x))) e[i]=math.fraction(99999);
					//if (_.range(Number(vm.range)+1,9+1).some(x=>candidate[i].includes(x))) e[i]=math.fraction(99999); // 2019.3 Complexity Control // 2019.4 Removed
					if (vm.range<9 && new RegExp(`[${Number(vm.range)+1}-9]`).test(candidate[i])) e[i]=math.fraction(99998); // 2019.4 Complexity Control Single Digit
					if (candidate[i].match(/\d\d/)) e[i]=math.fraction(99999);												 //	2019.4 Complexity Control Double Digit
					//console.log(['vm.range',vm.range])
				} catch(e) { console.log(`Candidate[${i}] fails : ${e}`); /* Ignore error because some inference engines must fail */ }
			}
			if (e[7]) e[7] = e[7].mul(100);	//	complexity
			console.log('Infer > Error > ', math.number(e), candidate)
			//return candidate[0]

			e = math.number(e);												//	2019.4	Return Candidates Sorted
			var leasterror = math.min(e);									//	2019.5	Added
			var best = e.indexOf(leasterror);								//	2019.5	Added
			return {candidates:candidate,best};								//	2019.5	Added
			function nanmin(array) {
				if(array.every(isNaN)) return array[0];
				return Math.min(...array.filter(x=>!isNaN(x)));
			}
			function inferdifferential(xs) {	//	2018.11
				var tovect, decodernum, decoderden;
				({tovect, decodernum, decoderden} = parserdifferential());
				var vect = tovect(Newton.getpoints().orig);//alert(JSON.stringify(vect))
				var num = stringify(vect, vars, decodernum);
				var den = stringify(vect, vars, decoderden);
				if (den == 1) return num;
				return num + ' / (' + den + ')';
			}
			function inferpolynomial(xs, y, parser) {
				var tomatrix, decoder;
				({tomatrix, decoder} = parser());
				var vect = solve(...tomatrix(xs, y));
				var ret = stringify(vect, vars, decoder);
				console.log('Infer-Polynomial: ', ret);
				if (ret === undefined) { var s = "Newton.infer.inferpolynomial returning undefined" ; alert(s) ; throw new Error(s) }	//	2018.8
				return ret;
			}
			function inferrational(xs, y, algo) {
				if (arguments.length<3) algo = 0;
				var tovect, tomatrix, decodernum, decoderden, parser;
				var parser = [parserrationalclosed, parserrational0, parserrational11, parserrational21, parserrational1, parserrational2, sparser, parserrationalbrute, parserrationalsearch][algo];
				//if (algo<=6) {																	//	2019.3	Removed
				//	({tomatrix, decodernum, decoderden} = parser());
				//	var matrix = tomatrix(xs, y);
				//	console.log('matrix', matrix);
				//	var vect = solve(...matrix);
				//} else {
				//	({tovect, decodernum, decoderden} = parser());
				//	var vect = tovect(Newton.getpoints().tran);
				//}
				({tovect, tomatrix, decodernum, decoderden} = parser());							//	2019.3	Added
				var vect = tomatrix ? solve(...tomatrix(xs, y)) : tovect(Newton.getpoints().tran);	//	2019.3	Added
				console.log('vect', vect);
				//console.log(stringify(vect2matrixnum(vect), vars) + ' : ' + stringify(vect2matrixden(vect), vars));
				var num = stringify(vect, vars, decodernum);
				var den = stringify(vect, vars, decoderden);
				assert(num !== undefined, "Newton.infer.inferrational returning undefined")	//	2018.8
				if (den == '1') return num;
				if (num.includes('+') || num.includes('-')) num = '(' + num + ')';
				if (den.includes('+') || den.includes('-') || den.includes('*')) den = '(' + den + ')';
				return num + ' / ' + den;
			}
			function validate(inputstring, outputstring, tolerance) {
				var scope = {};
				for (let char of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
					scope[char] = math.fraction(Math.random() * 10 - 5);
				var input = math.eval(inputstring, scope);
				var output = math.eval(outputstring, scope);
				var error = math.abs(input.sub(output));
				console.log('Validate > Error', error, inputstring, outputstring)
				return error < tolerance;
			}
			function validatebypoints(points, outputstring, tolerance) {
				return geterrorbypoints(points, outputstring) < tolerance;
			}
			function geterrorbypoints(points, outputstring) {
				if (outputstring=='0 / 0') return math.fraction(0).add(NaN);									//	2018.9
				var error = math.fraction(0);
				for(var i = 0 ; i < points.length ; i++ ) {
					var scope = {};
					for (let char of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
						scope[char] = points[i][0];
					var input = points[i][1];
					try {
						var output = math.eval(outputstring, scope);
					} catch(e) {
						var output = 0;
					} 
					var abserror = math.abs(input.sub(output));							//	2018.8	sub
					if (!isNaN(abserror)) error = error.add(abserror.mul(abserror));	//	2018.8	add&mul		//	2018.9	Removed test
					//error = error.add(abserror.mul(abserror));						//	2018.8	add&mul		//	2018.9	Removed test
				}
				console.log('Geterrorbypoints > Error', math.number(error), math.number(points), outputstring)
				return error;
			}
			function makexs(vars) {
				var xs = [];
				var numpoints = (vm.trans==1) ? 300 : (vm.trans==0) ? 40 : 4;	//	2018.7	inc tran from 150 to 300 to recog tran(cos)
				numpoints = Number(vm.size);	//	2019.3
				xs.ones = Array(numpoints).fill(math.fraction(1));	//	2018.9	fraction
				//xs.push([-2, -1, 0, 1]);
				//for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>Math.random() * 10 - 5));
				//	if (!trans) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>Math.random()*8));				//	2018.8	Removed
				if (vm.trans==0) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>math.fraction(math.round(100000*Math.random()*8)/100000)));	//	2018.8	Added
				if (vm.trans==1) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(_.range(0, numpoints).map(x=>x/60));	//	2018.7	inc den from 30 to 60 cause tran inc
				if (vm.trans==2) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(_.range(1, numpoints+1).map(x=>x/175));	//	2018.12	start at 1, /175 for sin
				//for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>Math.random() * 10 - 5).map(Math.round));
				//xs = xs.map(row=>row.map(cell=>Math.round(1000 * cell) / 1000));
				//xs.ones = Array(10).fill(1);
				Newton.x = xs;
				return xs;
			}
			function makescope(vars, vals) {		//	2018.8	Added
				var scope = {};
				for (let i=0; i<vars.length; i++) {
					scope[vars[i]] = vals[i];
				}
				return scope;
			}
			function makey(xs, input) {             //  2018.8  Added
				var nofrac = input.includes('2.718') || input.includes('sin') || input.includes('cos');	//	2018.8	math.eval can't do fractions
				var ys = [];
				for (var datai = 0; datai < xs.ones.length; datai++) {
					var expression = input;
					var vals = [];
					for (var varj = 0; varj < vars.length; varj++) {
						var val = xs[varj][datai];
						if (nofrac) val = math.number(val);												//	2018.8	math.eval can't do fractions
						vals.push(val);
					}
					var scope = makescope(vars, vals);
					//ys.push(math.fraction(math.eval(expression, scope)));								//	2018.8	in case math.eval is not fraction
					ys.push(math.fraction(0).add(math.eval(expression, scope)));						//	2018.8	in case math.eval is not fraction	//	2018.9	0+ is Robust for NaN
				}
				Newton.y = ys;
				return ys;
			}
			function solve(A, b) {
				console.log('solve',A, b);
				var AT = math.transpose(A);
				var ATA = math.multiply(AT, A);
				var ATb = math.multiply(AT, b);
				return matrix.solve(ATA, ATb);	//	2019.7	Added
				//return solvesquare(ATA, ATb);	//	2019.7	Removed
				//function solvesquare(A, b) {
				//	console.log('Solve > SolveSquare > Determinant', A, math.det(A), math.number(math.det(A)));
				//	//if (math.det(A) < .1) return solvesquare2(A, b);
				//	if (math.abs(math.det(A)) < .1) { var ret = matrix.solve(A, b) ; if (ret!=undefined) return ret; };	//	2018.9	matrix.
				//	var Ainv = math.divide(math.eye(A[0].length), A);
				//	var x = math.multiply(Ainv, b);
				//	return x.valueOf();
				//}
			}
			function stringify(termcoefs, vars, decoder) {
				console.log('stringify: termcoefs=',termcoefs)
				termcoefs = termcoefs.map(cell=>Math.round(cell * 1.00) / 1.00);	//	2018.9
				//termcoefs = termcoefs.map(cell=>Math.round(cell * 10.0) / 10.0);	//	2018.9
				var ret = '';
				for (var i = 0; i < decoder.length; i++)
					if (Array.isArray(decoder[i]))
						if(decoder[i].length==2)
							ret += term(termcoefs[i] || 0, termvars(decoder[i][0], decoder[i][1], vars))
						else
							ret += term(decoder[i][2] || 0, termvars(decoder[i][0], decoder[i][1], vars))
				if (ret.length == 1) return ret;
				if (ret[0] == '0') ret = ret.substr(1);
				if (ret[0] == '+') ret = ret.substr(1);
				if (ret == '') ret = '0';
				console.log('stringify: ret=',ret);
				return ret;
				function term(termcoef, termvar) {
					if (termcoef == 0) return '';
					if ('1'.includes(termvar)) return '+' + termcoef;
					if (termcoef == 1) return '+' + termvar;
					return '+' + termcoef + ('1'.includes(termvar) ? '' : '*' + termvar);
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

			function sparser() {	//	2019.3
				return {
					tovect: function brute(allpoints) {
						//var points = allpoints;
						var points = _.sampleSize(allpoints, 4);
						var f = (x, p) =>(p[1] + p[3] * x + p[5] * x * x) / (p[0] + p[2] * x + p[4] * x * x);
						var range = vm.range;
						//if (range>4) range=4;			//	2019.4	Removed
						var bestval = 1000;
						var besti;
						var p;
						var ps = binitems(6,range);		//	2019.4	Added
						for (p of ps) {
							//p = [0,0,0,0,0,0];		//	2019.4	Removed
							//for (var e of n) p[e]++;	//	2019.4	Removed
							//console.log(JSON.stringify([n,p]));
							if (p[0]+p[2]+p[4]==0) continue;
							for (var sp=p; sp.some(x=>x>0); sp=incrementsign(sp)) {
								//console.log(JSON.stringify([n,p,sp]));
								var curval = diff(f, points, sp);
								//if (JSON.stringify(n)=='[0,3]') alert(JSON.stringify([n,p,sp,curval,f(points[0][0],sp)]))
								if (curval < bestval) {//alert(JSON.stringify([n,p,sp,curval,f(points[0][0],sp)]))
									besti = sp;
									bestval = curval;
								}
							}
						}
						//alert(JSON.stringify([n,p,sp,bestval,besti]));
						return besti;
						function binitems(numbins,numitems) {
							var ret = []
							for (let i = 1 ; i<=numitems ; i++) {
								var list = binitems1(numbins,i);
								ret.push(...list)
							}
							return ret
							function binitems1(numbins,numitems) {
								if (numbins==1) return [[numitems]];
								var ret = []
								for (var i=0; i<=numitems; i++) {
									var rest = binitems1(numbins-1,numitems-i)
									for (let list of rest)
										ret.push([i,...list]);
								}
								return ret;
							}
						}
						function incrementsign(number) {//console.log(JSON.stringify(['number',number]))
							if (number.length==0) return [];
							if (number[0]==0) return [0,...incrementsign(number.slice(1))];
							if (number[0]> 0) return [-number[0],...number.slice(1)];
							if (number[0]< 0) return [-number[0],...incrementsign(number.slice(1))];
						}
						//function increment(number,base) {//console.log('increment')	//	2019.6	Removed
						//	number[0]++;
						//	regroup(number,base);
						//	function regroup(number,base) {
						//		for (var i = 0; i<number.length; i++) {
						//			if (number[i] >= base) {
						//				number[i] -= base;
						//				if (i==number.length-1) number.push(0); else number[i+1]++;
						//			}
						//		}
						//	}
						//}
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
					decodernum: [0,[0,0],0,[1,0],0,[2,0]],
					decoderden: [[0,0],0,[1,0],0,[2,0]]
				}				
			}
			function parserdifferential() {			//	2018.11
				return {
					tovect: function transform(points) {			   console.log('parsDiff: points = ',points.map(xy=>math.number(xy[1])));
						var derivatives = pointstoderivatives(points); console.log('parsDiff: der = ',math.number(derivatives));
						var {num,den} = seq2frac(derivatives);		   console.log('parsDiff: der = ',math.number(derivatives),' num = ',num,' den = ',math.number(den))
						return [...num,...den];
						function pointstoderivatives(points) {
							return [points[0][1],
							(points[1][1]-points[0][1])/(points[1][0]-points[0][0]),
							(points[2][1]-2*points[1][1]+points[0][1])/(points[1][0]-points[0][0])**2,
							(points[3][1]-3*points[2][1]+3*points[1][1]-points[0][1])/(points[1][0]-points[0][0])**3];
						}
						function seq2frac(seq) {	//	2019.6
							var terminating = math.abs(seq[3])<.01 ;
							return terminating ? finiteseq2frac(seq) : infiniteseq2frac(seq);
							function finiteseq2frac(seq) { return {'num' : [0,0,...seq] , 'den' : [1,0,0,0] } }
							function infiniteseq2frac(seq) {
								seq = math.round(math.number(seq))
								var leading0 = 1;	//	All sequences implicitly have 1 leading0 in 1's place (i.e. start at .1's place) ( e.g. 0.4738 )
								while (seq[0]==0 || math.abs(seq[0]/seq[1])< 0.5) { leftshift(seq); leading0++}	//	Process leading0's
								var den = divide([seq[0],0,0,0],seq);
								den.pop();		//	Least significant number in division is typically error so remove it
								den.reverse()	//	[…,x³,x²,x¹,x⁰,…] -> […,x⁰,x¹,x²,x³,…]
								//alert(den)
								while (den[0]==0 || math.abs(den[0]/den[1]) < 0.5) den.shift(); // Remove Leading0's (Leading0's are negative powers)
								var width = den.length;					//	Denominator Width			//	e.g. width(101) = 3
								var pow = width - 1;													//	Highest power of a polynomial is width-1
								pow -= leading0;
								num = [0,0,0,0,0,0];
								num[1-pow] = seq[0];					//	index=1-pow : return API is numerators as [x¹,x⁰,x⁻¹,x⁻²,x⁻³,x⁻⁴]
								return {num, den}
								function leftshift(arr) { arr.shift(); arr.push(0); }
								function divide(num,den) {
									return div(num,den,3).slice(0,4);
									function div(n,d,c) {
										if (c<=0) return n;
										var q = math.divide(n[0],d[0]);
										var sub = math.multiply(d,q);
										var r = math.subtract(n,sub);
										leftshift(r);
										var rest = div(r,den,c-1);
										rest.unshift(q);
										return rest;
									}
								}
							}
						}
					},
					decodernum: [[1,0],[0,0],[-1,0],[-2,0],[-3,0],[-4,0]],
					decoderden: [0,0,0,0,0,0,[0,0],[1,0],[2,0],[3,0]]
				}
			}
			function parserrationalOLD() {   //      (a+bx)/(1+cx+dx^2)
				return {
					tomatrix: function (xs, y) {
						var A = makeA(xs);
						//var b = math.dotMultiply(math.dotMultiply(xs[0], xs[0]), y);	//	'xs[0]^2*y'
						var b = y;
						return [A, b];
						function makeA(xs) {
							var c1 = xs.ones;
							var c2 = xs[0];
							var c3 = math.multiply(-1, math.dotMultiply(xs[0], y));
							var c4 = math.multiply(-1, math.dotMultiply(math.dotMultiply(xs[0], xs[0]), y));	//	'-xs[0]^2*y'
							console.log('xs.ones', c1);
							console.log('xs[0]', c2);
							console.log('-xs[0]*y', c3);
							console.log('-xs[0]^2*y', c4);
							var AT = [];
							AT.push(c1);
							AT.push(c2);
							AT.push(c3);
							AT.push(c4);
							return math.transpose(AT);
						}
					},
					decodernum: [[0,0],[1,0]],
					decoderden: [0,0,[1,0],[2,0],[0,0,1]]
					//decoderden: [0,0,[0,0],[1,0],[2,0,1]]
					//decoderden: [0,0,[0,0],[2,0,1]]
				};
			}
			function parserrational0() {   //      a/b	//	2018.9
				//	Set up problem as Ax=b with			//	2018.10
				//	A = [1,-Y]							//	2018.10
				//	x = (a,b)							//	2018.10
				//	b = (0,0)							//	2018.10
				return {
					tomatrix: function (xs, y) {
						var A = makeA(xs);
						//var b = math.dotMultiply(math.dotMultiply(xs[0], xs[0]), y);	//	'xs[0]^2*y'
						var b = xs.ones.map(q=>0);
						return [A, b];
						function makeA(xs) {
							var c1 = xs.ones;
							var c2 = math.multiply(-1, y);
							console.log('xs.ones', c1);
							console.log('-y', c2);
							var AT = [];
							AT.push(c1);
							AT.push(c2);
							return math.transpose(AT);
						}
					},
					decodernum: [[0,0]],
					decoderden: [0,[0,0]]
					//decoderden: [0,0,[0,0],[1,0],[2,0,1]]
					//decoderden: [0,0,[0,0],[2,0,1]]
				};
			}
			function parserrational11() {   //      a/(bx)	//	2019.1
				//	Set up problem as Ax=b with
				//	A = [1,-xy]
				//	x = (a,b)
				//	b = (0,0)
				return {
					tomatrix: function (xs, y) {
						var A = makeA(xs);
						var b = xs.ones.map(q=>0);
						return [A, b];
						function makeA(xs) {
							var c1 = xs.ones;
							var c2 = math.multiply(-1, math.dotMultiply(xs[0], y));
							var AT = [];
							AT.push(c1);
							AT.push(c2);
							return math.transpose(AT);
						}
					},
					decodernum: [[0,0]],
					decoderden: [0,[1,0]]
				};
			}
			function parserrational21() {   //      (a+bx)/c	//	2018.10
				//	Set up problem as Ax=b with					//	2018.10
				//	A = [1,x,-Y]								//	2018.10
				//	x = (a,b,c)									//	2018.10
				//	b = (0,0,0)									//	2018.10
				return {
					tomatrix: function (xs, y) {
						var A = makeA(xs);
						var b = xs.ones.map(q=>0);
						return [A, b];
						function makeA(xs) {
							var c1 = xs.ones;
							var c2 = xs[0];
							var c3 = math.multiply(-1, y);
							console.log('xs.ones', c1);
							console.log('xs[0]', c2);
							console.log('-y', c3);
							var AT = [];
							AT.push(c1);
							AT.push(c2);
							AT.push(c3);
							return math.transpose(AT);
						}
					},
					decodernum: [[0,0],[1,0]],
					decoderden: [0,0,[0,0]]
				};
			}
			function parserrational1() {   //      (a+bx)/(c+1*x)
				//	Set up problem as Ax=b with					//	2019.7
				//	A = [1,x,-Y]								//	2019.7
				//	x = (a,b,c)									//	2019.7
				//	b = xY										//	2019.7
				return {
					tomatrix: function (xs, y) {
						var A = makeA(xs);
						var b = math.dotMultiply(xs[0], y);	//	'xs[0]*y'
						return [A, b];
						function makeA(xs) {
							var c1 = xs.ones;
							var c2 = xs[0];
							var c3 = math.multiply(-1, y);
							console.log('xs.ones', c1);
							console.log('xs[0]', c2);
							console.log('-y', c3);
							var AT = [];
							AT.push(c1);
							AT.push(c2);
							AT.push(c3);
							return math.transpose(AT);
						}
					},
					decodernum: [[0,0],[1,0]],
					decoderden: [0,0,[0,0],[1,0,1]]
				};
			}
			function parserrational2() {   //      (a+bx)/(c+dx+x^2)
				return {
					tomatrix: function (xs, y) {
						var A = makeA(xs);
						var b = math.dotMultiply(math.dotMultiply(xs[0], xs[0]), y);	//	'xs[0]^2*y'
						return [A, b];
						function makeA(xs) {
							var c1 = xs.ones;
							var c2 = xs[0];
							var c3 = math.multiply(-1, y);
							var c4 = math.multiply(-1, math.dotMultiply(xs[0], y));
							console.log('xs.ones', c1);
							console.log('xs[0]', c2);
							console.log('-y', c3);
							console.log('-xs[0]*y', c4);
							var AT = [];
							AT.push(c1);
							AT.push(c2);
							AT.push(c3);
							AT.push(c4);
							return math.transpose(AT);
						}
					},
					decodernum: [[0,0],[1,0]],
					decoderden: [0,0,[0,0],[1,0],[2,0,1]]
					//decoderden: [0,0,[0,0],[2,0,1]]
				};
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
					decodernum: [[1,0],[0,0]],
					decoderden: [0,0,[1,0],[0,0]]
				};
			}
			function parserrationalbrute() {   //      (a+bx+cx²)/(d+ex+fx²)
				return {
					tovect: function brute(allpoints) {
						var points = allpoints//_.sample(allpoints, 39);
						var f = (x, p) =>(p[0] + p[1] * x + p[2] * x * x) / (p[6] + p[7] * x + p[8] * x * x);
						//var range = 2;
						var range = vm.range;
						if (range>2) range=2;
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
						if (bestval<.01) return besti;
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
						for (var p0 = -range; p0<=range; p0++)			//	(a+bx+cx²)/(d+ex+fx²)
							for (var p1 = -range; p1<=range; p1++)
								for (var p2 = -range; p2<=range; p2++)
									for (var p3 = -range; p3<=range; p3++)
										for (var p4 = -range; p4<=range; p4++)
											for (var p5 = -range; p5<=range; p5++) {
												var curval = diff(f, points, [p0,p1,p2,0,0,0,p3,p4,p5]);
												if (curval < bestval) {
													besti = [p0,p1,p2,0,0,0,p3,p4,p5];
													bestval = curval;
												}
												if (curval == bestval) {
													var besti2 = [p0,p1,p2,0,0,0,p3,p4,p5];
													if (math.sum(math.abs(besti2)) < math.sum(math.abs(besti)) || math.sum(math.sign(besti2)) > math.sum(math.sign(besti))) {
														besti = besti2;
														bestval = curval;
													}
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
					decodernum: [[0,0],[1,0],[2,0],[0,1],[1,1],[0,2]],
					decoderden: [0,0,0,0,0,0,[0,0],[1,0],[2,0]]
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
					decodernum: [[0,0],[1,0],[2,0]],
					decoderden: [0,0,0,[0,0],[1,0],[2,0]]
				}
			}
			function parserlaurent() {    // //  a+bx+cx²+dx³ + ey+fxy+gx²y+hx³y + iy²+jxy²+kx²y²+lx³y² + my³+nxy³+ox²y³+px³y³
				var power = 2;
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
								for (var p = -power; p <= power; p++) cols.push(x.map(xi=>math.pow(xi, p)));
								return cols;
							}
						}
					},
					decoder: [[-2,0],[-1,0],[0,0],[1,0],[2,0]]
				};
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
									ret.push(col1[i].mul(col2[i]));	//	2018.8	* -> mul for fraction
								return ret;
							}
							function makepowercols(x) {
								var cols = [];
								for (var p = 0; p <= power; p++) cols.push(x.map(xi=>math.pow(xi, p)));
								return cols;
							}
						}
					},
					decoder: [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2],[2,2],[3,2],[0,3],[1,3],[2,3],[3,3]]
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
					decoder: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]]
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
					decoder: [[0,0],[1,0],[0,1]]
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
					decoder: [[0,0],[1,0],[2,0]]
				};
			}
			function parser51() {    //  ax^-2+bx^-1+c+dx+ex²+fx^3+gx^4+hx^5
				return {
					tomatrix: function (xs, y) {
						var A = makeA(xs);
						var b = y;
						return [A, b];
						function makeA(xs) {
							var AT = [];
							for (var power = -2; power <= 5; power++) AT.push(xs[0].map(xi=>math.pow(xi, power)));
							return math.transpose(AT);
						}
					},
					decoder: [[-2,0],[-1,0],[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]]
				};
			}
			function parser_21() {    //  ax^-2+bx^-1
				return {
					tomatrix: function (xs, y) {
						var A = makeA(xs);
						var b = y;
						return [A, b];
						function makeA(xs) {
							var AT = [];
							for (var power = -2; power <= -1; power++) AT.push(xs[0].map(xi=>math.pow(xi, power)));
							return math.transpose(AT);
						}
					},
					decoder: [[-2,0],[-1,0]]
				};
			}
			function parser01() {    //  a
				return {
					tomatrix: function (xs, y) {
						var A = makeA(xs);
						var b = y;
						return [A, b];
						function makeA(xs) {
							var AT = [];
							for (var power = 0; power <= 0; power++) AT.push(xs[0].map(xi=>math.pow(xi, power)));
							return math.transpose(AT);
						}
					},
					decoder: [[0,0]]
				};
			}
		}
	}
}
