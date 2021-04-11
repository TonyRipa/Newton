
/*
	Author:	Anthony John Ripa
	Date:	4/10/2021
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
		if (math.typeof(Newton.x[0][0])=="Complex")return{orig,tran:[],nonan:[]}//	+2020.12
		//var t = transform(orig)												//	-2020.6
		var t = Transform.transform(orig)										//	+2020.6
		var tran = t.map(point=>point.map(x=>math.fraction(0).add(x)));			//	2018.8	Fraction	//	2018.9	Added for NaN handling
		var nonan = Transform.nonan(orig);										//	+2020.8
		console.log('getpoints',tran);
		//return {orig, tran};													//	2018.6	Added		//	-2020.8
		return {orig, tran, nonan};												//	+2020.8
	}
	static getpointsreal() {													//	2018.8	Added
		//return _.mapValues(Newton.getpoints(),arr=>arr.map(xyz=>math.number(xyz)));											//	-2020.12
		return _.mapValues(Newton.getpoints(),arr=>arr.map(xyz=>math.typeof(xyz[0])=="Complex"?math.re(xyz):math.number(xyz)));	//	+2020.12
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
		//var expr, constant, best, candidates;															//	-2020.10
		var expr, constant, best, candidates, e;														//	+2020.10
		[expr, constant] = input.split('|');
		//({candidates,best} = infers(expr));															//	2019.5	Added	//	-2020.10
		({candidates,best,e} = infers(expr));																				//	+2020.10
		//vm.selected = best;																			//	2019.5	Added	//	2019.8	Removed
		assert(candidates !== undefined, "Newton.simplify returning undefined")							//	2018.8	Added
		//if (!constant) return [Newton.getpointsreal(), candidates];									//	2018.8	Added	//	2019.8	Removed
		var points = Newton.getpointsreal();															//	2019.8	Added
		//if (!constant) return simplify0pipe(points, candidates, best);								//	2019.8	Added	//	-2020.7
		//else return simplify1pipe(points, candidates[best], constant);								//	2019.8	Added	//	-2020.7
		var ret;																						//	+2020.7
		//if (!constant) ret = simplify0pipe(points, candidates.map(x=>x[0]), best);					//	+2020.7			//	-2020.10
		if (!constant) ret = simplify0pipe(points, candidates.map(x=>x[0]), best, e);					//	+2020.7			//	-2020.10
		//else ret = simplify1pipe(points, candidates[best], constant);									//	+2020.7			//	-2020.8
		//else ret = simplify1pipe(points, candidates[best][0], constant);													//	+2020.8		//	-2020.10
		//else ret = simplify1pipe(points, candidates[best][0], constant, e);																//	+2020.10	//	-2020.11
		//else ret = simplify1pipe(points, candidates[best][0], constant, [e[best]]);																		//	+2020.11	//	-2021.1
		else ret = simplify1pipe(points, candidates[best], constant, [e[best]]);																							//	+2021.1
		if (constant) {ret.push([candidates.map(x=>x[1])[best]])} else									//	+2021.1
		ret.push(candidates.map(x=>x[1]));																//	+2020.7
		return ret;																						//	+2020.7
		//return [Newton.getpointsreal(), candidates, candidates.map(e=>infer(evaluate(e, constant)))];	//	2019.4	Added	//	2019.8	Removed
		//function simplify0pipe(points, candidates, bestindex) {										//	2019.8	Added	//	-2020.10
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
			var evalu = infer(evaluate(candidate[trans==0?0:1],constant))[trans==0?0:1];									//	+2021.1
			//return [points, [candidate], [evalu]];													//	-2020.10
			//return [points, [candidate], [evalu], e];													//	+2020.10		//	-2020.1
			return [points, [candidate[0]], [evalu], e];																	//	+2020.1
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
			//if (vars.length==2) return {candidates:[inferpolynomial(xs, y, F.poly32)],best:0};	//	2019.5	object	//	-2020.7
			//if (vars.length==2) return {candidates:[Render.stringify(inferpolynomial(xs, y, F.poly32))],best:0};		//	+2020.7			//	-2020.11
			//if (vars.length==2) return {candidates:[Render.stringify(inferpolynomial(xs, y, F.poly32))],best:0,e:[0]};					//	+2020.11	//	-2020.12
			if (vars.length==2) return {candidates:[Render.stringify(inferpolynomial(xs, y, F.poly32()))],best:0,e:[0]};					//	+2020.11	//	+2020.12
			//if (vm.trans==2) return [inferdifferential(xs)];					//	2019.4	list	//	2019.5	Removed
			//if (vm.trans==2) return {candidates:[inferdifferential(xs)],best:0};					//	2019.5	object	//	2020.2	Removed
			//if (trans==2) return {candidates:[inferdifferential(xs)],best:0};											//	2020.2	Added	//	-2020.7
			//if (trans==2) return {candidates:[Render.stringify(inferdifferential(xs))],best:0};											//	+2020.7	//	-2021.1
			if (trans==2) {																																//	+2021.1
				var candidate = Render.stringify(inferdifferential(xs));
				var points = Newton.getrightpoints(trans);
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
				var numpoints = (vm.trans==1) ? 300 : (vm.trans==0) ? 40 : 4;	//	2018.7	inc tran from 150 to 300 to recog tran(cos)	//	2019.9	Removed	//	--2021.1
				//numpoints = Number(vm.size);		//	2019.3	//	2019.9	Removed
				//var numpoints = Number(vm.size);	//	2019.3	//	2019.9	Added	//	-2021.1
				//if (trans==1) numpoints *= 2;		//	+2020.5	inc numpoints for cosh & sinh	//	-2020.11
				var gaussx = { 3 : [0.7745966692414834,  0,  -0.7745966692414834] ,
					4 : [-0.3399810435848563,0.3399810435848563,-0.8611363115940526,0.8611363115940526] ,
					10 : [-0.1488743389816312,0.1488743389816312,-0.4333953941292472,0.4333953941292472,-0.6794095682990244,0.6794095682990244,-0.8650633666889845,0.8650633666889845,-0.9739065285171717,0.9739065285171717] ,
					20 : [-0.0765265211334973,0.0765265211334973,-0.2277858511416451,0.2277858511416451,-0.3737060887154195,0.3737060887154195,-0.5108670019508271,0.5108670019508271,-0.6360536807265150,0.6360536807265150,-0.7463319064601508,0.7463319064601508,-0.8391169718222188,0.8391169718222188,-0.9122344282513259,0.9122344282513259,-0.9639719272779138,0.9639719272779138,-0.9931285991850949,0.9931285991850949] ,
					40 : [-0.0387724175060508,0.0387724175060508,-0.1160840706752552,0.1160840706752552,-0.1926975807013711,0.1926975807013711,-0.2681521850072537,0.2681521850072537,-0.3419940908257585,0.3419940908257585,-0.4137792043716050,0.4137792043716050,-0.4830758016861787,0.4830758016861787,-0.5494671250951282,0.5494671250951282,-0.6125538896679802,0.6125538896679802,-0.6719566846141796,0.6719566846141796,-0.7273182551899271,0.7273182551899271,-0.7783056514265194,0.7783056514265194,-0.8246122308333117,0.8246122308333117,-0.8659595032122595,0.8659595032122595,-0.9020988069688743,0.9020988069688743,-0.9328128082786765,0.9328128082786765,-0.9579168192137917,0.9579168192137917,-0.9772599499837743,0.9772599499837743,-0.9907262386994570,0.9907262386994570,-0.9982377097105593,0.9982377097105593] ,
					64 : [-0.0243502926634244,0.0243502926634244,-0.0729931217877990,0.0729931217877990,-0.1214628192961206,0.1214628192961206,-0.1696444204239928,0.1696444204239928,-0.2174236437400071,0.2174236437400071,-0.2646871622087674,0.2646871622087674,-0.3113228719902110,0.3113228719902110,-0.3572201583376681,0.3572201583376681,-0.4022701579639916,0.4022701579639916,-0.4463660172534641,0.4463660172534641,-0.4894031457070530,0.4894031457070530,-0.5312794640198946,0.5312794640198946,-0.5718956462026340,0.5718956462026340,-0.6111553551723933,0.6111553551723933,-0.6489654712546573,0.6489654712546573,-0.6852363130542333,0.6852363130542333,-0.7198818501716109,0.7198818501716109,-0.7528199072605319,0.7528199072605319,-0.7839723589433414,0.7839723589433414,-0.8132653151227975,0.8132653151227975,-0.8406292962525803,0.8406292962525803,-0.8659993981540928,0.8659993981540928,-0.8893154459951141,0.8893154459951141,-0.9105221370785028,0.9105221370785028,-0.9295691721319396,0.9295691721319396,-0.9464113748584028,0.9464113748584028,-0.9610087996520538,0.9610087996520538,-0.9733268277899110,0.9733268277899110,-0.9833362538846260,0.9833362538846260,-0.9910133714767443,0.9910133714767443,-0.9963401167719553,0.9963401167719553,-0.9993050417357722,0.9993050417357722] };
				gaussx = gaussx[64];
				if (trans==1) numpoints = gaussx.length;
				var b = 10;
				var a = 0;
				gaussx = gaussx.map(x => x*(b-a)/2 + (b+a)/2);
				var fourierx = { 4 : [math.complex(1,1E-99),math.complex(0,1),math.complex(-1,0),math.complex(0,-1)] ,
					8: [math.complex(+1,0),math.complex(+.7071067811865475,+.7071067811865475),math.complex(0,+1),math.complex(-.7071067811865475,+.7071067811865475),math.complex(-1,0),math.complex(-.7071067811865475,-.7071067811865475),math.complex(0,-1),math.complex(+.7071067811865475,-.7071067811865475)] };	//	+2020.12
				fourierx = fourierx[4];									//	+2020.12
				//var originx = _.range(1, numpoints+1).map(x=>x/175);	//	+2020.12	//	-2021.3
				var originx = [-1.5/175,-.5/175,.5/175,1.5/175];						//	+2021.3
				var neighborhoodx = true ? originx : fourierx;			//	+2020.12
				xs.ones = Array(numpoints).fill(math.fraction(1));	//	2018.9	fraction
				//if (vm.trans==0) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>math.fraction(math.round(100000*Math.random()*8)/100000)));	//	2018.8	Added	//	2020.2	Removed
				//if (vm.trans==1) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(_.range(0, numpoints).map(x=>x/60));	//	2018.7	inc den from 30 to 60 cause tran inc			//	2020.2	Removed
				//if (vm.trans==2) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(_.range(1, numpoints+1).map(x=>x/175));	//	2018.12	start at 1, /175 for sin					//	2020.2	Removed
				//if (trans==0) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>math.fraction(math.round(100000*(Math.random()*8))/100000)));//	2018.8	Added		//	2020.2	Added	//	-2020.8
				if (trans==0) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map((x,k)=>math.fraction(k<9?k:math.round(100000*(Math.random()*32-16))/100000)));								//	+2020.8
				//if (trans==1) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(_.range(0, numpoints).map(x=>x/60));	//	2018.7	inc den from 30 to 60 cause tran inc			//	2020.2	Added	//	-2020.11
				if (trans==1) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(gaussx);																													//	+2020.11
				//if (trans==2) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(_.range(1, numpoints+1).map(x=>x/175));	//	2018.12	start at 1, /175 for sin						//	2020.2	Added	//	-2020.12
				if (trans==2) for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(neighborhoodx);	//	+2020.12
				//for (var i = 0; i < Math.max(1, vars.length) ; i++) xs.push(xs.ones.map(x=>Math.random() * 10 - 5).map(Math.round));
				//xs = xs.map(row=>row.map(cell=>Math.round(1000 * cell) / 1000));
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
				//var vect = tomatrix ? solve(...tomatrix(xs, y)) : tovect(Newton.getpoints().tran);		//	2019.11	Removed
				var vect = tomatrix ? matrix.solve(...tomatrix(xs, y)) : tovect(Newton.getpoints().tran);	//	2019.11	Added
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
