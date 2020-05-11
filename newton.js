
/*
	Author:	Anthony John Ripa
	Date:	5/10/2020
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
	//static getrightpoints() {													//	2020.2	Removed
	static getrightpoints(trans=vm.trans) {										//	2020.2	Added
		//if (vm.trans==1) return Newton.getpoints().tran;						//	2019.3	vm.trans	//	2020.2	Removed
		if (trans==1) return Newton.getpoints().tran;													//	2020.2	Added
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
	//static simplify(input) {																			//	2020.2	Removed
	static simplify(input,trans=vm.trans) {																//	2020.2	Added
		var expr, constant, best, candidates;
		[expr, constant] = input.split('|');
		//expr = infers(expr);																			//	2019.5	Removed
		({candidates,best} = infers(expr));																//	2019.5	Added
		//vm.selected = best;																			//	2019.5	Added	//	2019.8	Removed
		assert(candidates !== undefined, "Newton.simplify returning undefined")							//	2018.8	Added
		//if (!constant) return [Newton.getpointsreal(), candidates];									//	2018.8	Added	//	2019.8	Removed
		var points = Newton.getpointsreal();															//	2019.8	Added
		if (!constant) return simplify0pipe(points, candidates, best);									//	2019.8	Added
		else return simplify1pipe(points, candidates[best], constant);									//	2019.8	Added
		//return [Newton.getpointsreal(), expr, infer(evaluate(expr, constant))];						//	2018.8	Added	//	2019.4	Removed
		//return [Newton.getpointsreal(), candidates, candidates.map(e=>infer(evaluate(e, constant)))];	//	2019.4	Added	//	2019.8	Removed
		function simplify0pipe(points, candidates, bestindex) {											//	2019.8	Added
			vm.selected = bestindex;
			//return [points, candidates];																//	2019.12	Removed
			return [points, candidates, candidates[bestindex]];											//	2019.12	Added
		}
		function simplify1pipe(points, candidate, constant) {											//	2019.8	Added
			vm.selected = 0;
			var evalu = infer(evaluate(candidate,constant));
			return [points, [candidate], [evalu]];
		}
		function evaluate(input, val) {
			return substitute(input, Newton.getvars(input).slice(-1)[0], val);
		}
		function substitute(input, vari, val) {
			if (vari === undefined) return input;
			return input.replace(new RegExp(vari, 'g'), '(' + val + ')');
		}
		function infer(input) {														//	2019.4	Added
			var candidates,best;													//	2019.5	Added
			({candidates,best} = infers(input));									//	2019.5	Added
			return candidates[best];												//	2019.5	Added
			//return infers(input)[0];												//	2019.5	Removed
		}
		function infers(input) {//alert('infer')									//	2019.4	Renamed
			assert(input !== undefined, "Newton.infer Arg undefined")				//	2018.8	Added
			var F = Fit;															//	2019.8	Added
			var vars = Newton.getvars(input);
			var xs = makexs(vars);
			var y = makey(xs, input);
			console.log(JSON.stringify(xs))
			console.log(y)
			console.log(JSON.stringify(y))
			console.log(JSON.stringify(_.unzip(Newton.getpoints().tran)))
			//if (vm.trans==1) { [xs, y] = _.unzip(Newton.getpoints().tran); xs = [xs]; xs.ones = Array(y.length).fill(1); }	//	2020.2	Removed
			if (trans==1) { [xs, y] = _.unzip(Newton.getpoints().tran); xs = [xs]; xs.ones = Array(y.length).fill(1); }			//	2020.2	Added
			console.log(JSON.stringify(xs))
			console.log(JSON.stringify(y))
			//if (vars.length==2) return [inferpolynomial(xs, y, F.poly32)];	//	2019.4	list	//	2019.5	Removed
			if (vars.length==2) return {candidates:[inferpolynomial(xs, y, F.poly32)],best:0};		//	2019.5	object
			//if (vm.trans==2) return [inferdifferential(xs)];					//	2019.4	list	//	2019.5	Removed
			//if (vm.trans==2) return {candidates:[inferdifferential(xs)],best:0};					//	2019.5	object	//	2020.2	Removed
			if (trans==2) return {candidates:[inferdifferential(xs)],best:0};											//	2020.2	Added
			var e = math.fraction([100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000]);	//	2018.8	Fraction
			var candidates = [];
			var inferers = [0,1,2,3,4,5,6,7,8];		//	2019.9	Added 
			for (let i of inferers) {				//	2019.9	Added
			//for (let i of [0,1,2,3,4,5,6,7,8]) {	//	2019.9	Removed
				//try {
					console.log('Candidate: ' + i);
					//candidates[i] = i==0 ? inferpolynomial(xs, y, F.poly01) : i==1 ? inferpolynomial(xs, y, F.laurent21) : i==2 ? inferpolynomial(xs, y, F.laurent25) : inferrational(xs, y, i-2);	//	-2020.4
					candidates[i] = i==0 ? inferpolynomial(xs, y, F.poly01) : i==1 ? inferpolynomial(xs, y, F.laurent21) : i==2 ? inferpolynomial(xs, y, F.laurent26) : inferrational(xs, y, i-2);		//	+2020.4
					assert(candidates[i] !== undefined);
					//e[i] = geterrorbypoints(Newton.getrightpoints(), candidates[i]);		//	2020.2	Removed
					e[i] = geterrorbypoints(Newton.getrightpoints(trans), candidates[i]);	//	2020.2	Added
					//if (_.range(Number(vm.range)+1,9+1).some(x=>candidate[i].includes(x))) e[i]=math.fraction(99999); // 2019.3 Complexity Control // 2019.4 Removed
					//if (vm.range<9 && new RegExp(`[${Number(vm.range)+1}-9]`).test(candidates[i])) e[i]=math.fraction(99998);	//	2019.4 Complexity Control Single Digit	//	2020.3	Removed
					//if (candidates[i].match(/\d\d/)) e[i]=math.fraction(99999);												//	2019.4 Complexity Control Double Digit	//	2020.3	Removed
					e[i] = e[i].mul(complexity(candidates[i]));								//	2020.3	Added
					//console.log(['vm.range',vm.range])
				//} catch(e) { console.log(`Candidate[${i}] fails : ${e}`); /* Ignore error because some inference engines must fail */ }
			}
			//if (e[7]) e[7] = e[7].mul(100);	//	complexity				//	2020.3	Removed
			console.log('Infer > Error > ', math.number(e), candidates)
			//return candidates[0]

			e = math.number(e);												//	2019.4	Return Candidates Sorted
			var leasterror = math.min(e);									//	2019.5	Added
			var best = e.indexOf(leasterror);								//	2019.5	Added
			return {candidates,best};										//	2019.5	Added
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
				return Newton.stringifyfrac(vect, vars, decodernum, decoderden);	//	+2020.5
				/* var num = Newton.stringify(vect, vars, decodernum);				//	-2020.5
				var den = Newton.stringify(vect, vars, decoderden);
				if (den == 1) return num;
				return num + ' / (' + den + ')'; */
			}
			function inferpolynomial(xs, y, parser) {
				var tomatrix, decoder;
				({tomatrix, decoder} = parser());
				//var vect = solve(...tomatrix(xs, y));			//	2019.11	Removed
				var vect = matrix.solve(...tomatrix(xs, y));	//	2019.11	Added
				var ret = Newton.stringify(vect, vars, decoder);
				console.log('Infer-Polynomial: ', ret);
				if (ret === undefined) { var s = "Newton.infer.inferpolynomial returning undefined" ; alert(s) ; throw new Error(s) }	//	2018.8
				return ret;
			}
			function inferrational(xs, y, algo) {
				if (arguments.length<3) algo = 0;
				var tovect, tomatrix, decodernum, decoderden, parser;
				var parser = [F.rational1_01, F.rational0_0, F.rational0_1, F.rational1_0, F.rational1_01H, F.rational1_02H, F.sparse, F.rationalbrute, F.rationalsearch][algo];
				({tovect, tomatrix, decodernum, decoderden} = parser());									//	2019.3	Added
				//var vect = tomatrix ? solve(...tomatrix(xs, y)) : tovect(Newton.getpoints().tran);		//	2019.11	Removed
				var vect = tomatrix ? matrix.solve(...tomatrix(xs, y)) : tovect(Newton.getpoints().tran);	//	2019.11	Added
				//console.log('vect', vect);					//	-2020.4
				console.log('Infer-Rational: vect=', vect);		//	+2020.4
				//console.log(stringify(vect2matrixnum(vect), vars) + ' : ' + stringify(vect2matrixden(vect), vars));
				return Newton.stringifyfrac(vect, vars, decodernum, decoderden);
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
			function makexs(vars) {
				var xs = [];
				//var numpoints = (vm.trans==1) ? 300 : (vm.trans==0) ? 40 : 4;	//	2018.7	inc tran from 150 to 300 to recog tran(cos)		//	2019.9	Removed
				//numpoints = Number(vm.size);		//	2019.3	//	2019.9	Removed
				var numpoints = Number(vm.size);	//	2019.3	//	2019.9	Added
				if (trans==1) numpoints *= 2;		//	+2020.5	inc numpoints for cosh & sinh
				xs.ones = Array(numpoints).fill(math.fraction(1));	//	2018.9	fraction
				//for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>Math.random() * 10 - 5));
				//	if (!trans) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>Math.random()*8));				//	2018.8	Removed
				//if (vm.trans==0) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>math.fraction(math.round(100000*Math.random()*8)/100000)));	//	2018.8	Added	//	2020.2	Removed
				//if (vm.trans==1) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(_.range(0, numpoints).map(x=>x/60));	//	2018.7	inc den from 30 to 60 cause tran inc			//	2020.2	Removed
				//if (vm.trans==2) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(_.range(1, numpoints+1).map(x=>x/175));	//	2018.12	start at 1, /175 for sin					//	2020.2	Removed
				if (trans==0) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>math.fraction(math.round(100000*Math.random()*8)/100000)));	//	2018.8	Added		//	2020.2	Added
				if (trans==1) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(_.range(0, numpoints).map(x=>x/60));	//	2018.7	inc den from 30 to 60 cause tran inc				//	2020.2	Added
				if (trans==2) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(_.range(1, numpoints+1).map(x=>x/175));	//	2018.12	start at 1, /175 for sin						//	2020.2	Added
				//for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>Math.random() * 10 - 5).map(Math.round));
				//xs = xs.map(row=>row.map(cell=>Math.round(1000 * cell) / 1000));
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
					ys.push(math.fraction(0).add(math.eval(expression, scope)));						//	2018.8	in case math.eval is not fraction	//	2018.9	0+ is Robust for NaN
				}
				Newton.y = ys;
				return ys;
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
}
