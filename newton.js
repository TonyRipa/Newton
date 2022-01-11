
/*
	Author:	Anthony John Ripa
	Date:	01/10/2022
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
		if (math.typeof(Newton.x[0][0])=="Complex") return {orig, nonan:[]}	//	+2020.12
		var nonan = Transform.nonan(orig);									//	+2020.8
		return {orig, nonan};												//	+2020.8
	}
	static getpointsreal() {													//	2018.8	Added
		//return _.mapValues(Newton.getpoints(),arr=>arr.map(xyz=>math.number(xyz)));											//	-2020.12
		return _.mapValues(Newton.getpoints(),arr=>arr.map(xyz=>math.typeof(xyz[0])=="Complex"?math.re(xyz):math.number(xyz)));	//	+2020.12
	}
	//static getvars(input) {	//	2018.12	//	-2021.9
	//	input = input.replace('sinh','').replace('sin','').replace('cosh','').replace('cos','').replace('exp','');	//	2019.2	sinh & cosh
	//	var vars = [];
	//	var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	//	for (let symbol of input) {
	//		if (alphabet.includes(symbol)) {
	//			if (!vars.includes(symbol)) vars.push(symbol);
	//		}
	//	}
	//	return vars;
	//}
	//static simplify(input) {																			//	2020.2	Removed
	static simplify(input,trans=vm.trans) {																//	2020.2	Added
		//var expr, constant, best, candidates;															//	-2020.10
		var expr, constant, best, candidates, e;														//	+2020.10
		[expr, constant] = input.split('|');
		//({candidates,best} = infers(expr));															//	2019.5	Added	//	-2020.10
		({candidates,best,e} = infers(expr));																				//	+2020.10
		assert(candidates !== undefined, "Newton.simplify returning undefined")							//	2018.8	Added
		var points = Newton.getpointsreal();															//	2019.8	Added
		//if (!constant) return simplify0pipe(points, candidates, best);								//	2019.8	Added	//	-2020.7
		//else return simplify1pipe(points, candidates[best], constant);								//	2019.8	Added	//	-2020.7
		//var ret;																						//	+2020.7			//	-2021.11
		//if (!constant) ret = simplify0pipe(points, candidates.map(x=>x[0]), best);					//	+2020.7			//	-2020.10
		//if (!constant) ret = simplify0pipe(points, candidates.map(x=>x[0]), best, e);					//	+2020.7			//	-2020.10	//	-2021.11
		//else ret = simplify1pipe(points, candidates[best], constant);									//	+2020.7			//	-2020.8
		//else ret = simplify1pipe(points, candidates[best][0], constant);													//	+2020.8		//	-2020.10
		//else ret = simplify1pipe(points, candidates[best][0], constant, e);																//	+2020.10	//	-2020.11
		//else ret = simplify1pipe(points, candidates[best][0], constant, [e[best]]);																		//	+2020.11	//	-2021.1
		//else ret = simplify1pipe(points, candidates[best], constant, [e[best]]);																							//	+2021.1	//	-2021.11
		var ret = [best, e, points, candidates.map(x=>x[0])];																															//	+2021.11
		//if (constant) {ret.push([candidates.map(x=>x[1])[best]])} else								//	+2021.1																		//	-2021.11
		//ret.push(candidates.map(x=>x[1]));															//	+2020.7			//	-2021.11
		if (trans != 0) ret.push(candidates.map(x=>x[1]));												//	+2021.11
		if (trans==0 && constant) ret.push(undefined);													//	+2021.11
		if (constant) ret.push(candidates.map(c=>Expression.evaluate(c[trans==0?0:1],constant)));		//	+2021.11
		return ret;																						//	+2020.7
		//return [Newton.getpointsreal(), candidates, candidates.map(e=>infer(evaluate(e, constant)))];	//	2019.4	Added	//	2019.8	Removed
		//function simplify0pipe(points, candidates, bestindex) {										//	2019.8	Added	//	-2020.10
		/*																													//	-2021.11
		function simplify0pipe(points, candidates, bestindex, e) {															//	+2020.10
			vm.selected = bestindex;
			//return [points, candidates];																//	2019.12	Removed
			//return [points, candidates, candidates[bestindex]];										//	2019.12	Added	//	-2020.10
			return [points, candidates, candidates[bestindex], e];															//	+2020.10
		}
		//function simplify1pipe(points, candidate, constant) {											//	2019.8	Added	//	-2020.10
		function simplify1pipe(points, candidate, constant, e) {															//	+2020.10
			vm.selected = 0;
			//var evalu = infer(evaluate(candidate,constant));											//	-2020.8
			//var evalu = infer(evaluate(candidate,constant))[0];										//	+2020.8			//	-2021.1
			//var evalu = infer(evaluate(candidate[trans==0?0:1],constant))[trans==0?0:1];									//	+2021.1	//	-2021.9
			var evalu = Expression.evaluate(candidate[trans==0?0:1],constant);															//	+2021.9
			//return [points, [candidate], [evalu]];													//	-2020.10
			//return [points, [candidate], [evalu], e];													//	+2020.10		//	-2020.1
			return [points, [candidate[0]], [evalu], e];																	//	+2020.1
		}
		*/
		//function evaluate(input, val) {											//	-2021.9
		//	return substitute(input, Newton.getvars(input).slice(-1)[0], val);
		//}
		//function substitute(input, vari, val) {									//	-2021.9
		//	if (vari === undefined) return input;
		//	return input.replace(new RegExp(vari, 'g'), '(' + val + ')');
		//}
		function infer(input) {														//	2019.4	Added
			var candidates,best;													//	2019.5	Added
			({candidates,best} = infers(input));									//	2019.5	Added
			return candidates[best];												//	2019.5	Added
		}
		function infers(input) {//alert('infer')									//	2019.4	Renamed
			assert(input !== undefined, "Newton.infer Arg undefined")				//	2018.8	Added
			var F = Fit;															//	2019.8	Added
			//var vars = Newton.getvars(input);										//	-2021.9
			var vars = Expression.getvars(input);									//	+2021.9
			var xs = makexs(vars);
			var y = makey(xs, input);
			console.log(JSON.stringify(xs))
			console.log(y)
			console.log(JSON.stringify(y))
			console.log(JSON.stringify(xs))
			console.log(JSON.stringify(y))
			//if (vars.length==2) return {candidates:[inferpolynomial(xs, y, F.poly32)],best:0};	//	2019.5	object	//	-2020.7
			//if (vars.length==2) return {candidates:[Render.stringify(inferpolynomial(xs, y, F.poly32))],best:0};		//	+2020.7			//	-2020.11
			//if (vars.length==2) return {candidates:[Render.stringify(inferpolynomial(xs, y, F.poly32))],best:0,e:[0]};					//	+2020.11	//	-2020.12
			if (vars.length==2) return {candidates:[Render.stringify(inferpolynomial(xs, y, F.poly32()))],best:0,e:[0]};					//	+2020.11	//	+2020.12
			//if (vm.trans==1) return {candidates:[inferdifferential(xs)],best:0};					//	2019.5	object	//	2020.2	Removed
			//if (trans==1) return {candidates:[inferdifferential(xs)],best:0};											//	2020.2	Added	//	-2020.7
			//if (trans==1) return {candidates:[Render.stringify(inferdifferential(xs))],best:0};											//	+2020.7	//	-2021.1
			if (trans==1) {																																//	+2021.1
				var candidate = Render.stringify(inferdifferential(xs));
				//var err = math.number(geterrorbypoints(points, candidate[1]));	//	-2021.4
				var err = math.number(geterrorbyinput(input, candidate[1]));		//	+2021.4
				return {candidates:[candidate],best:0,e:[err]};
			}
			//var e = math.fraction([100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000]);	//	2018.8	Fraction		//	-2020.11
			var e = math.fraction([1E20, 1E20, 1E20, 1E20, 1E20, 1E20, 1E20, 1E20, 1E20]);													//	+2020.11
			var candidates = [];
			//var inferers = [0,1,2,3,4,5,6,7,8];	//	2019.9	Added	//	-2020.8
			var inferers = [0,1,2,3,4,5,6,7,8,9];						//	+2020.8
			for (let i of inferers) {				//	2019.9	Added
			//for (let i of [0,1,2,3,4,5,6,7,8]) {	//	2019.9	Removed
				//try {
					console.log('Candidate: ' + i);
					//candidates[i] = i==0 ? inferpolynomial(xs, y, F.poly01) : i==1 ? inferpolynomial(xs, y, F.laurent21) : i==2 ? inferpolynomial(xs, y, F.laurent25) : inferrational(xs, y, i-2);	//	-2020.4
					//candidates[i] = i==0 ? inferpolynomial(xs, y, F.poly01) : i==1 ? inferpolynomial(xs, y, F.laurent21) : i==2 ? inferpolynomial(xs, y, F.laurent26) : inferrational(xs, y, i-2);	//	+2020.4	//	-2020.12
					candidates[i] = i==0 ? inferpolynomial(xs, y, F.polyn1(vm.range)) : i==1 ? inferpolynomial(xs, y, F.laurent21()) : i==2 ? inferpolynomial(xs, y, F.laurent26()) : inferrational(xs, y, i-2);//	+2020.4	//	+2020.12
					candidates[i] = Render.stringify(candidates[i]);	//	+2020.7
					assert(candidates[i] !== undefined);
					//e[i] = geterrorbypoints(Newton.getrightpoints(), candidates[i]);		//	2020.2	Removed
					//e[i] = geterrorbypoints(Newton.getrightpoints(trans), candidates[i]);	//	2020.2	Added	//	-2020.7
					//e[i] = geterrorbypoints(Newton.getrightpoints(trans), candidates[i][0]);					//	+2020.7	//	-2021.4
					e[i] = geterrorbyinput(input, candidates[i][trans]);													//	+2021.4
					//if (vm.range<9 && new RegExp(`[${Number(vm.range)+1}-9]`).test(candidates[i])) e[i]=math.fraction(99998);	//	2019.4 Complexity Control Single Digit	//	2020.3	Removed
					//if (candidates[i].match(/\d\d/)) e[i]=math.fraction(99999);												//	2019.4 Complexity Control Double Digit	//	2020.3	Removed
					//e[i] = e[i].mul(complexity(candidates[i]));							//	2020.3	Added	//	-2020.7
					e[i] = e[i].mul(complexity(candidates[i][0]));												//	+2020.7
					//console.log(['vm.range',vm.range])
				//} catch(e) { console.log(`Candidate[${i}] fails : ${e}`); /* Ignore error because some inference engines must fail */ }
			}
			//if (e[7]) e[7] = e[7].mul(100);	//	complexity				//	2020.3	Removed
			console.log('Infer > Error > ', math.number(e), candidates)

			e = math.number(e);												//	2019.4	Return Candidates Sorted
			var leasterror = math.min(e);									//	2019.5	Added
			var best = e.indexOf(leasterror);								//	2019.5	Added
			//return {candidates,best};										//	2019.5	Added	//	-2020.10
			return {candidates,best,e};															//	+2020.10
			function makexs(vars) {
				var xs = [];
				var numpoints = (trans==0) ? 40 : 4;	//	2018.7	//	2019.9	Removed	//	--2021.1
				//numpoints = Number(vm.size);		//	2019.3	//	2019.9	Removed
				//var numpoints = Number(vm.size);	//	2019.3	//	2019.9	Added	//	-2021.1
				//var fourierx = { 4 : [math.complex(1,1E-99),math.complex(0,1),math.complex(-1,0),math.complex(0,-1)] ,	//	-2021.5
				var fourierx = { 4 : [math.complex(1,0),math.complex(0,1),math.complex(-1,0),math.complex(0,-1)] ,			//	+2021.5
					8: [math.complex(+1,0),math.complex(+.7071067811865475,+.7071067811865475),math.complex(0,+1),math.complex(-.7071067811865475,+.7071067811865475),math.complex(-1,0),math.complex(-.7071067811865475,-.7071067811865475),math.complex(0,-1),math.complex(+.7071067811865475,-.7071067811865475)] };	//	+2020.12
				//fourierx = fourierx[4];								//	+2020.12	//	-2021.7
				fourierx = fourierx[8];													//	+2021.7
				//var originx = _.range(1, numpoints+1).map(x=>x/175);	//	+2020.12	//	-2021.3
				var originx = [-1.5/175,-.5/175,.5/175,1.5/175];						//	+2021.3
				//var neighborhoodx = true ? originx : fourierx;		//	+2020.12	//	-2021.5
				//var neighborhoodx = false ? originx : fourierx.map(x=>x.div(100));	//	+2021.5	//	-2021.7
				var neighborhoodx = false ? originx : fourierx.map(x=>x.div(20));					//	+2021.7
				xs.ones = Array(numpoints).fill(math.fraction(1));	//	2018.9	fraction
				//if (vm.trans==0) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>math.fraction(math.round(100000*Math.random()*8)/100000)));	//	2018.8	Added	//	2020.2	Removed
				//if (vm.trans==1) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(_.range(1, numpoints+1).map(x=>x/175));	//	2018.12	start at 1, /175 for sin					//	2020.2	Removed
				//if (trans==0) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>math.fraction(math.round(100000*(Math.random()*8))/100000)));//	2018.8	Added		//	2020.2	Added	//	-2020.8
				if (trans==0) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map((x,k)=>math.fraction(k<9?k:math.round(100000*(Math.random()*32-16))/100000)));								//	+2020.8
				//if (trans==1) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(_.range(1, numpoints+1).map(x=>x/175));	//	2018.12	start at 1, /175 for sin						//	2020.2	Added	//	-2020.12
				if (trans==1) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(neighborhoodx);	//	+2020.12
				Newton.x = xs;
				return xs;
			}
			//function makey(xs, input) {             //  2018.8  Added	//	-2020.12
			//	//var nofrac = input.includes('2.718') || input.includes('sin') || input.includes('cos');	//	2018.8	math.eval can't do fractions	//	-2020.11
			//	var nofrac = input.includes('2.718') || input.includes('sin') || input.includes('cos') || input.includes('exp');		//	+2020.11
			//	var ys = [];
			//	//for (var datai = 0; datai < xs.ones.length; datai++) {	//	-2020.8
			//	for (var datai = 0; datai < xs[0].length; datai++) {		//	+2020.8
			//		var expression = input;
			//		var vals = [];
			//		for (var varj = 0; varj < vars.length; varj++) {
			//			var val = xs[varj][datai];
			//			if (nofrac) val = math.number(val);												//	2018.8	math.eval can't do fractions
			//			vals.push(val);
			//		}
			//		var scope = makescope(vars, vals);
			//		try {											//	+2020.8
			//			ys.push(math.fraction(0).add(math.eval(expression, scope)));						//	2018.8	in case math.eval is not fraction	//	2018.9	0+ is Robust for NaN
			//		} catch {ys.push(math.fraction(0).add(NaN))}	//	+2020.8
			//	}
			//	Newton.y = ys;
			//	return ys;
			//}
			function makey(xs, input) {	//	+2020.12
				if (math.typeof(xs[0][0]) == "Complex")
					var ys = makeyraw(xs, input);
				else if (input.includes('2.718') || input.includes('sin') || input.includes('cos') || input.includes('exp'))
					var ys = makeyraw(xs.map(x=>math.number(x)), input).map(y=>math.fraction(0).add(y));
				else
					var ys = makeyraw(xs, input).map(y=>math.fraction(0).add(y));
				Newton.y = ys;
				return ys;
				function makeyraw(xs, input) {
					var ys = [];
					for (var datai = 0; datai < xs[0].length; datai++) {
						var expression = input;
						var vals = [];
						for (var varj = 0; varj < vars.length; varj++) {
							var val = xs[varj][datai];
							vals.push(val);
						}
						var scope = makescope(vars, vals);
						try {
							ys.push(math.eval(expression, scope));
						} catch { ys.push(NaN); }
					}
					return ys;
				}
			}
			function complexity(expression) {								//	2020.3	Added
				if (expression.match(/\d\d/)) return math.fraction(99999);
				for (let i = 9; i > 0; i--) {
					if (new RegExp(`${i}`).test(expression)) return math.fraction(i);
				}
				return 1;
			}
			function nanmin(array) {
				if(array.every(isNaN)) return array[0];
				return Math.min(...array.filter(x=>!isNaN(x)));
			}
			function inferdifferential(xs) {	//	2018.11
				var tovect, decodernum, decoderden;
				({tovect, decodernum, decoderden} = F.differential());
				var vect = tovect(Newton.getpoints().orig);//alert(JSON.stringify(vect))
				return [vect, vars, {decodernum, decoderden}];									//	+2020.7
				//return Newton.stringifyfrac(vect, vars, decodernum, decoderden);	//	+2020.5	//	-2020.7
				/* var num = Newton.stringify(vect, vars, decodernum);				//	-2020.5
				var den = Newton.stringify(vect, vars, decoderden);
				if (den == 1) return num;
				return num + ' / (' + den + ')'; */
			}
			function inferpolynomial(xs, y, parser) {
				var tomatrix, decoder;
				//({tomatrix, decoder} = parser());				//	-2020.12
				({tomatrix, decoder} = parser);					//	+2020.12
				//var vect = solve(...tomatrix(xs, y));			//	2019.11	Removed
				var ab = tomatrix(xs, y)
				console.log(ab)
				var vect = matrix.solve(...ab);	//	2019.11	Added
				return [vect, vars, decoder];						//	+2020.7
				/*													//	-2020.7
				var ret = Newton.stringify(vect, vars, decoder);
				console.log('Infer-Polynomial: ', ret);
				if (ret === undefined) { var s = "Newton.infer.inferpolynomial returning undefined" ; alert(s) ; throw new Error(s) }	//	2018.8
				return ret;
				*/
			}
			function inferrational(xs, y, algo) {
				if (arguments.length<3) algo = 0;
				var tovect, tomatrix, decodernum, decoderden, parser;
				var parser = [F.rational1_01, F.rational0_0, F.rational0_1, F.rational1_0, F.rational1_01H, F.rational1_02H, F.sparse, F.polynomialratio, F.rationalbrute, F.rationalsearch][algo];
				({tovect, tomatrix, decodernum, decoderden} = parser());									//	2019.3	Added
				var vect = tomatrix ? matrix.solve(...tomatrix(xs, y)) : tovect(Newton.getpoints().orig);	//	2019.11	Added
				//console.log('vect', vect);					//	-2020.4
				console.log('Infer-Rational: vect=', vect);		//	+2020.4
				//console.log(stringify(vect2matrixnum(vect), vars) + ' : ' + stringify(vect2matrixden(vect), vars));
				return [vect, vars, {decodernum, decoderden}];						//	+2020.7
				//return Newton.stringifyfrac(vect, vars, decodernum, decoderden);	//	-2020.7
				/* var num = Newton.stringify(vect, vars, decodernum);	//	-2020.5
				var den = Newton.stringify(vect, vars, decoderden);
				assert(num !== undefined, "Newton.infer.inferrational returning undefined")	//	2018.8
				if (den == '1') return num;
				if (num.includes('+') || num.includes('-')) num = '(' + num + ')';
				if (den.includes('+') || den.includes('-') || den.includes('*')) den = '(' + den + ')';
				return num + ' / ' + den; */
			}
			//function validate(inputstring, outputstring, tolerance) {		//	2019.12	Removed
			//	var scope = {};
			//	for (let char of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
			//		scope[char] = math.fraction(Math.random() * 10 - 5);
			//	var input = math.eval(inputstring, scope);
			//	var output = math.eval(outputstring, scope);
			//	var error = math.abs(input.sub(output));
			//	console.log('Validate > Error', error, inputstring, outputstring)
			//	return error < tolerance;
			//}
			//function validatebypoints(points, outputstring, tolerance) {	//	2019.12	Removed
			//	return geterrorbypoints(points, outputstring) < tolerance;
			//}
			function geterrorbyinput(inputstring, outputstring) {	//	+2021.4
				var x = 0.540302306;
				var scope = {};
				for (let char of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
					scope[char] = x;
				var y = math.eval(inputstring,scope);
				points = [[x,math.fraction(y)]];
				return geterrorbypoints(points, outputstring);
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
					if (!isNaN(abserror)) error = error.add(abserror.mul(abserror));	//	2018.8	add&mul		//	2018.9	Added test
				}
				console.log('Geterrorbypoints > Error', math.number(error), math.number(points), outputstring)
				return error;
			}
			function makescope(vars, vals) {		//	2018.8	Added
				var scope = {};
				for (let i=0; i<vars.length; i++) {
					scope[vars[i]] = vals[i];
				}
				return scope;
			}
			//function solve(A, b) {									//	2019.11	Removed
			//	console.log('solve',A, b);
			//	var AT = math.transpose(A);
			//	var ATA = math.multiply(AT, A);
			//	var ATb = math.multiply(AT, b);
			//	return matrix.solve(ATA, ATb);	//	2019.7	Added
			//}
		}
	}
	/*	//	-2020.7
	static stringifyfrac(termcoefs, vars, decodernum, decoderden) {	//	+2020.5
		var num = Newton.stringify(termcoefs, vars, decodernum);
		var den = Newton.stringify(termcoefs, vars, decoderden);
		assert(num !== undefined, "Newton.infer.inferrational returning undefined")	//	2018.8
		if (den == '1') return num;
		if (num.includes('+') || num.includes('-')) num = '(' + num + ')';
		if (den.includes('+') || den.includes('-') || den.includes('*')) den = '(' + den + ')';
		return num + ' / ' + den;
	}
	static stringify(termcoefs, vars, decoder) {	//	+2020.5
		//console.log('stringify: termcoefs=',termcoefs)
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
		//console.log('stringify: ret=',ret);
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
	*/
}
