
/*
	Author:	Anthony John Ripa
	Date:	5/10/2023
	Matrix:	A matrix library
*/

class matrix {

	//static dft(b) {	//	-2021.5
	static idft(b) {	//	+2021.5
		if (b.length == 4) {
			var w0 = math.complex(1,0);
			var w1 = math.complex(0,1);
			var w2 = math.complex(-1,0);
			var w3 = math.complex(0,-1);
			var M = [[w0,w0,w0,w0],
					 [w0,w1,w2,w3],
					 [w0,w2,w0,w2],
					 [w0,w3,w2,w1]];
		} else {
			var w0 = math.complex(+1,0);
			var w1 = math.complex(+.7071067811865475,+.7071067811865475);
			var w2 = math.complex(0,+1);
			var w3 = math.complex(-.7071067811865475,+.7071067811865475);
			var w4 = math.complex(-1,0);
			var w5 = math.complex(-.7071067811865475,-.7071067811865475);
			var w6 = math.complex(0,-1);
			var w7 = math.complex(+.7071067811865475,-.7071067811865475);
			var M = [[w0,w0,w0,w0,w0,w0,w0,w0],
					 [w0,w1,w2,w3,w4,w5,w6,w7],
					 [w0,w2,w4,w6,w0,w2,w4,w6],
					 [w0,w3,w6,w1,w4,w7,w2,w5],
					 [w0,w4,w0,w4,w0,w4,w0,w4],
					 [w0,w5,w2,w7,w4,w1,w6,w3],
					 [w0,w6,w4,w2,w0,w6,w4,w2],
					 [w0,w7,w6,w5,w4,w3,w2,w1]]
		}
		return math.divide(b,M);
	}

	static solve(A, b) {																//	2019.11	Added
		console.log('solve', A, b);
		var AT = math.transpose(A);
		AT = conj(AT);																	//	+2022.8
		console.log('AT',AT)															//	+2022.8
		var ATA = math.multiply(AT, A);
		console.log('ATA',ATA)															//	+2022.8
		var ATb = math.multiply(AT, b);
		if (matrix.short(A)) return matrix.solvesingular(A, b);							//	+2020.12
		let fullrank = matrix.homogeneous.fullrank(A)									//	+2022.8
		console.log('fullrank',fullrank);												//	+2022.8
		//if (!matrix.homogeneous.fullrank(A)) {	//	+2020.11						//	-2022.8
		if (!fullrank) {																//	+2022.8
			if (matrix.tall(A))
				return matrix.solvesingular(ATA, ATb);
			else
				return matrix.solvesingular(A, b);
		}
		//if (!matrix.homogeneous.fullrank(A)) return matrix.solvesingular(ATA, ATb);	//			+2020.9		-2020.11
		//if (matrix.homogeneous.singular(ATA)) return matrix.solvesingular(ATA, ATb);	//	+2020.6	-2020.9
		return matrix.solvenotsingular(ATA, ATb);										//	+2020.6
		function conj(x) {																//	+2022.8
			if (Array.isArray(x)) return x.map(conj);
			//if (math.typeof(x)=='Complex)') return math.conj(x);						//	-2022.9
			if (math.typeof(x)=='Complex') return math.conj(x);							//	+2022.9
			return x;
		}
	}

	static tall(A) {																	//	+2020.11
		return A.length > A[0].length;
	}

	static short(A) {																	//	+2020.12
		return A.length < A[0].length;
	}

	static solvesingular(A, b) {														//	2019.11	Added
		//console.log("Matrix.SolveSingular: A="+JSON.stringify(math.number(A))+", b="+b);//	2019.11	Added	//	-2022.8
		console.log("Matrix.SolveSingular: A="+JSON.stringify(Transform.num2neat(A))+", b="+b);					//	+2022.8
		if (b.every(x=>x==0)) return matrix.scaletoint(matrix.homogeneous.solve(A));
		console.log('Matrix.SolveSingular: Homogenizing');
		for(let i = 0;i<A.length;i++) {
			A[i].push(math.unaryMinus(b[i]));
		}
		var solution = matrix.homogeneous.solve(A);
		solution.pop();			//	+2020.8
		//solution.reverse();	//	-2020.9
		//solution.pop();		//	-2020.8
		//console.log("Matrix.SolveSingular: sol.="+JSON.stringify(math.number(solution)));//	+2020.9	//	-2022.8
		console.log("Matrix.SolveSingular: sol.="+JSON.stringify(Transform.num2neat(solution)));		//	+2022.8
		return solution;
	}

	static solvenotsingular(A, b) {										//	+2022.8
		//console.log('Matrix.solvenotsingular',A)						//	-2022.9
		console.log('Matrix.solvenotsingular',A,b)						//	+2022.9
		console.log(JSON.stringify(Transform.num2neat(A)),JSON.stringify(Transform.num2neat(b)))
		console.log(math.det(A))
		let x = math.divide(b, math.transpose(A))
		console.log(Transform.num2neat(x.valueOf()))
		console.log(x.valueOf())										//	+2022.9
		return x.valueOf();
	}

	//static solvenotsingular(A, b) {				//	2019.7	Added	//	-2022.8
	//	console.log('Matrix.solvenotsingular')
	//	console.log(JSON.stringify(math.number(A)),JSON.stringify(math.number(b)))
	//	console.log(math.number(math.det(A)));
	//	var Ainv = math.divide(math.eye(A[0].length), A);
	//	var x = math.multiply(Ainv, b);
	//	console.log(math.number(x.valueOf()))		//	+2020.8
	//	return x.valueOf();
	//}

	static scaletoint(vect) {								//	2019.7	Added
		console.log('Matrix.scaletoint');
		if (vect.length==1) return vect;
		if (vect.length==2) return scaletoint2(vect);	//	+2021.2
		var ret = math.multiply(vect,2*3*4*5*6*7*8*9*10*11*12*13);
		ret = math.round(ret);
		//var gcd = ret.reduce((x,y)=>math.gcd(x,y))	//	-2022.8
		var gcd = ret.reduce(gcdf)						//	+2022.8
		if (gcd==0) return ret;
		//if (vect.length==2 && math.norm(ret.map(x=>math.divide(x,gcd)))>1000) return scaletoint2(ret);	//	-2021.2
		return ret.map(x=>math.divide(x,gcd))
		//function scaletoint2(vect) {	//	-2021.2
		//	console.log('Matrix.scaletoint2');
		//	var candidates = [];
		//	var scores = [];
		//	for (var i = 0; i<=10; i++) {
		//		for (var j = 1; j<=10; j++) {
		//			candidates.push([i,j]);
		//			scores.push(math.abs(math.subtract(math.divide(i,j),math.divide(vect[0],vect[1]))));
		//		}
		//	}
		//	var bestscore = math.min(scores);
		//	var bestindex = scores.indexOf(bestscore);
		//	return candidates[bestindex];
		//}
		//function scaletoint2(vect) {	//	+2021.2	//	-2022.8
		//	var f = vect[0];
		//	var d = math.number(f);
		//	//f = dec2frac(d);		//	-2021.3
		//	f = matrix.dec2frac(d);	//	+2021.3
		//	console.log('Matrix.scaletoint2 : vect = ' + JSON.stringify(vect) + ' = ' + math.number(vect));
		//	return [f.n,f.d];
		//}
		function scaletoint2(vect) {	//	+2022.8
			console.log('Matrix.scaletoint2 : vect = ' + JSON.stringify(vect));
			var f = vect[0];
			return math.typeof(f)=='Complex' ? complex(f) : notcomplex(f)
			function complex(f) {
				let fr = matrix.dec2frac(f.re);
				let fi = matrix.dec2frac(f.im);
				let gcd = gcdf(fr.d,fi.d)
				fr = math.number(fr.mul(gcd));
				fi = math.number(fi.mul(gcd));
				return [math.complex(fr,fi),gcd];
			}
			function notcomplex(f) {
				var d = math.number(f);
				f = matrix.dec2frac(d);
				return [f.n,f.d];
			}
		}
		function gcdf(x,y) {			//	+2022.8
			if (math.typeof(x) == 'Complex' && math.typeof(y) == 'Complex') {
				return x.arg()==y.arg() ? math.gcd(x.abs(),y.abs()) : 1
			} else if (math.typeof(x) == 'Complex') {
				return x.arg()==0 ? math.gcd(x.abs(),y) : 1
			} else if (math.typeof(y) == 'Complex') {
				return y.arg()==0 ? math.gcd(x,y.abs()) : 1
			} else {
				return math.gcd(x,y)
			}
		}
	}

	//static dec2frac(decimal) {								//	~2021.3	//	-2023.5
	static dec2frac(decimal, precision = 19) {								//	+2023.5
		console.log('matrix.dec2frac',decimal)					//	+2022.8
		if (math.isNaN(math.number(math.abs(decimal)))) return math.fraction(0).add(NaN)	//	+2022.8
		if (decimal=='.') return new math.fraction(0,1);		//	+2021.12
		decimal = Number(decimal);								//	+2021.12
		//if (decimal<0) return dec2frac(-decimal).neg();		//	-2021.3
		//if (decimal<0) return matrix.dec2frac(-decimal).neg();//	+2021.3	//	-2023.5
		if (decimal<0) return matrix.dec2frac(-decimal,precision).neg();	//	+2023.5
		decimal = standard(decimal);
		var radix = decimal.indexOf('.');
		var [terminend,rest] = split(decimal);
		var shift = terminend.length - radix - 1;
		terminend = terminend2frac(terminend);
		rest = rest2frac(rest);
		rest = math.divide(rest,10**shift);
		return math.add(terminend,rest);
		function standard(decimal) {
			//decimal = String(decimal);								//	-2021.3
			//decimal = decimal.toFixed(16);							//	+2021.3	//	-2021.12
			//decimal = decimal.toFixed(19);										//	+2021.12	//	-2023.5
			decimal = decimal.toFixed(precision);													//	+2023.5
			//while (decimal.slice(-1)==0) decimal = decimal.slice(0,-1)//	+2021.3	//	-2022.01
			decimal = unpad(decimal);
			decimal = ensureradix(decimal);
			return decimal;
			function unpad(decimal) {
				while (decimal[0]=='0')
					decimal = decimal.substring(1);
				return decimal;
			}
			function ensureradix(decimal) {
				if (decimal.includes('.')) return decimal;
				return decimal + '.';
			}
		}
		function split(decimal) {
			//if (!decimal.includes('.')) return [decimal,''];				//	-2021.12
			if (!decimal.slice(0,-1).includes('.')) return [decimal,''];	//	+2021.12
			var start = repeatstart(decimal);
			var terminend = decimal.substring(0,start);
			var rest = decimal.substring(start);
			return [terminend,rest];
			//function repeatstart(decimal) {	//	-2021.12
			//	decimal = String(decimal);
			//	for (let h = 0; h <= decimal.length; h++)
			//		for (let i = decimal.indexOf('.'); i < decimal.length; i++)
			//			for (let j = i+1; j < Math.min(h,decimal.length); j++)
			//				if (decimal[i] == decimal[j]) return i;
			//	return decimal.length;
			//}
			//function repeatstart(decimal) {		//	+2021.12	//	-2022.01
			//	decimal = String(decimal);
			//	var s = singlerepeat(decimal);
			//	var m = multirepeat(decimal);
			//	return (s[1]>=m[1]) ? s[0] : m[0];
			//	function multirepeat(decimal) {
			//		for (let h = 0; h <= decimal.length; h++)
			//			for (let i = decimal.indexOf('.'); i < decimal.length; i++)
			//				for (let j = i+1; j < Math.min(h,decimal.length); j++) {								
			//					if (decimal[i] == decimal[j]) {
			//						if (decimal[j] == decimal[j+(j-i)]) return [i, 3];
			//						return [i, 2];
			//					}
			//				}
			//		return [decimal.length, 2];
			//	}
			//	function singlerepeat(decimal) {
			//		var [head,tail] = decimal.split('.');
			//		var reps = [0,1,2,3,4,5,6,7,8,9].map(d=>repbydig(tail,d));
			//		var maxreps = math.max(reps);
			//		var maxdig = reps.indexOf(maxreps);
			//		var pos = tail.indexOf(String(maxdig).repeat(maxreps));
			//		return [head.length+pos+1,maxreps];
			//		function repbydig(tail,dig) {
			//			tail = tail.split('').map(digit => (digit==dig) ? dig : 'x').join('');
			//			for (let i = 0; i<100; i++)
			//				tail = tail.replace('xx','x');
			//			tail = tail.split('x');
			//			tail = tail.map(run=>run.length);
			//			return math.max(tail);
			//		}
			//	}
			//}
			function repeatstart(decimal) {	//	+2022.01
				decimal = String(decimal);
				let beststart = decimal.indexOf('.')+1;
				let bestwidth = 1;
				let bestnumreps = 0;
				for (let width = 1; width <= decimal.length; width++)
					for (let start = decimal.indexOf('.')+1; start < decimal.length; start++) {
						let thisnumreps = numreps(decimal,start,width);
						if (thisnumreps>bestnumreps) {
							beststart = start;
							bestwidth = width;
							bestnumreps = thisnumreps;
						}						
					}
				return beststart;
				function numreps(decimal,start,width) {
					let count = 0;
					for (let i = start; i<decimal.length; i+=width) {
						if (i == start) continue;
						for (let j = 0; j<width; j++) {
							if (decimal[i+j] != decimal[i+j-width]) return count;
						}
						count += width;
					}
					return count;
				}
			}
		}
		function terminend2frac(terminend) {
			if (terminend == '') terminend = '0';
			if (terminend == '.') terminend = '0';
			if (math.typeof(terminend) == 'Complex') return terminend;	//	+2022.8
			return math.fraction(terminend);
		}
		function rest2frac(rest) {
			if (rest == '') rest = '0';
			if (rest == '.') rest = '0';
			var proper = '.' + rest;
			var repetend = dtor(proper);
			var frac = rtof(repetend);
			frac = reduce(frac);
			frac = math.fraction(...frac);
			return frac;
			function dtor(d) {
				d = d.substring(1);	// remove dot
				var start = d[0];
				for (var i = 1; i < d.length; i++)
					if (d[i] == start) break;
				var repetend = d.substring(0,i);
				return repetend;
			}
			function rtof(repetend) {
				var len = repetend.length;
				var den = math.bignumber('9'.repeat(len));
				var num = math.bignumber(repetend);
				return [num,den];
			}
			function reduce(frac) {
				var g = math.gcd(...frac);
				frac = frac.map(e=>e/g);
				return frac;
			}
		}
	}

	static log(A) {									//	2020.1	Added
		if (Array.isArray(A[0])) console.log(matrix.m(A));
		else console.log(matrix.v(A));
	}

	static m(A) {									//	2020.1	Added
		//return math.number(A).map(row=>matrix.v(row)).join('\n');			//	-2022.8
		return Transform.num2neat(A).map(row=>matrix.v(row)).join('\n');	//	+2022.8
	}

	static v(b) {									//	2020.1	Added
		//return math.number(b).map(x=>x.toFixed(1)).join('\t');			//	-2022.8
		return Transform.num2neat(b).join('\t');							//	+2022.8
	}

}

matrix.homogeneous = class {

	static solve(A) {
		console.log('Matrix.homogeneous.solve: ' + A[0].length + ' x ' + A.length);	//	2019.10	Added
		try {																		//	2019.10	Added
			if (A[0].length==1) {					//	2019.7	Added
				if (A.length>=1-1) {
					return [0];
				}
			}
			if (A[0].length==2) {																	//	2019.7	Added
				//if (A.length>=2-1) {																//	-2020.11
				if (A.length==2) {																	//	+2020.11
					A = matrix.homogeneous.rref(A);console.log(A)
					var row0 = A[0];
					var a = row0[1] == 0 ? 0 : math.unaryMinus(math.divide(row0[1],row0[0]));
					var ret = [a, 1];
					return ret;
				}
			}
			if (A[0].length==3) {		//	2018.10	Added
				if (A.length>=3-1) {
					A = matrix.homogeneous.rref(A);matrix.log(A);		//	2020.1	Added	//	-2020.8
					matrix.log(A);A = matrix.homogeneous.rref(A);matrix.log(A);				//	+2020.8
					var row0 = A[0];
					var row1 = A[1];
					var a = row0[2] == 0 || row0[0] == 0 ? 0 : math.unaryMinus(math.divide(row0[2],row0[0]));	//	2019.12	Added
					var b = row1[2] == 0 || row1[1] == 0 ? 0 : math.unaryMinus(math.divide(row1[2],row1[1]));	//	2019.12	Added
					var ret = [a, b, 1];																		//	2019.7	Added
					return ret;
				}
			}
			if (A[0].length==4) {		//	2019.7	Added
				if (A.length>=4-1) {
					//A = matrix.homogeneous.rref(A);matrix.log(A);		//	2020.1	Added	//	-2020.8
					matrix.log(A);A = matrix.homogeneous.rref(A);matrix.log(A);				//	+2020.8
					var row0 = A[0];
					var row1 = A[1];
					var row2 = A[2];
					var a = row0[3] == 0 || row0[0] == 0 ? 0 : math.unaryMinus(math.divide(row0[3],row0[0]));	//	2019.11	Added
					var b = row1[3] == 0 || row1[1] == 0 ? 0 : math.unaryMinus(math.divide(row1[3],row1[1]));	//	2019.11	Added
					var c = row2[3] == 0 || row2[2] == 0 ? 0 : math.unaryMinus(math.divide(row2[3],row2[2]));	//	2019.11	Added
					var ret = [a, b, c, 1];																		//	2019.7	Added
					return ret;
				}
			}
			if (A[0].length==5) {		//	2019.9	Added
				if (A.length>=5-1) {
					A = matrix.homogeneous.rref(A);matrix.log(A)		//	2020.1	Added
					var row0 = A[0];
					var row1 = A[1];
					var row2 = A[2];
					var row3 = A[3];
					var a = row0[4] == 0 || row0[0] == 0 ? 0 : math.unaryMinus(math.divide(row0[4],row0[0]));	//	2019.10	Added
					var b = row1[4] == 0 || row1[1] == 0 ? 0 : math.unaryMinus(math.divide(row1[4],row1[1]));	//	2019.10	Added
					var c = row2[4] == 0 || row2[2] == 0 ? 0 : math.unaryMinus(math.divide(row2[4],row2[2]));	//	2019.10	Added
					var d = row3[4] == 0 || row3[3] == 0 ? 0 : math.unaryMinus(math.divide(row3[4],row3[3]));	//	2019.10	Added
					var ret = [a, b, c, d, 1];
					return ret;
				}
			}
			if (A[0].length > 5) {		//	+2020.12
				A = matrix.homogeneous.rref(A); matrix.log(A);
				var width = A[0].length;
				var height = A.length;
				var ret = [];
				for (var i = 0; i < width-1; i++)
					ret.push(i >= height || A[i][width-1] == 0 || A[i][i] == 0 ? 0 : math.unaryMinus(math.divide(A[i][width-1],A[i][i])));
				ret.push(1);
				return ret;
			}
			//if (A[0].length== 9) return [0,0,0,0,0,0,0,0,0,0];	//	+2020.8		//	-2020.12
			//if (A[0].length==10) return [0,0,0,0,0,0,0,0,0,0];	//	+2020.8		//	-2020.12
		} catch(e) {								//	2019.10	Added
			alert("matrix.homogeneous : " + e)		//	2019.10	Added
		}											//	2019.10	Added
		return undefined;
	}

	static ref(A,swap) {							//	2020.1	Added
		for (let i = 0; i < A.length-1; i++) {
			if (swap) sort(A,i);
			A = zerosbelow(A,i,i)
		}
		return A;
		function sort(A,col) {
			let row = col;
			for (let i = row; i < A.length; i++) {
				for (let j = i+1; j < A.length; j++) {
					if (dist1(A[j][col])<dist1(A[i][col]))
						[A[i],A[j]] = [A[j],A[i]]				
				}
			}
		}
		function dist1(x) {
			x = math.abs(x);
			if (x>1) return x;
			return 1/x;
		}
		function zerosbelow(A,r,c) {
			let pivotrow = A[r];
			let ret = [];
			for (let i = 0; i <= r; i++ ) ret.push(A[i].slice());	//	Keep rows above pivot (& pivot row)
			for (let i = r+1 ; i<A.length ; i++) {
				let row = A[i];
				//if (row[c]!=0 && pivotrow[c]!=0) row = math.subtract(row,math.multiply(math.divide(row[c],pivotrow[c]),pivotrow));						//	-2020.8
				if (math.abs(row[c])>1E-8 && math.abs(pivotrow[c])>1E-8) row = math.subtract(row,math.multiply(math.divide(row[c],pivotrow[c]),pivotrow));	//	+2020.8
				ret.push(row);
			}
			return ret;
		}
	}

	static rref(A,swap) {	//	+2020.8
		//for (let i = 0; i < A.length-1; i++) {	//	-2020.9
		var size = math.min(A.length,A[0].length);	//	+2020.9
		for (let i = 0; i < size; i++) {			//	+2020.9
			if (swap) sort(A,i);
			A = zerosbelowabove(A,i,i)
		}
		return A;
		function sort(A,col) {
			let row = col;
			for (let i = row; i < A.length; i++) {
				for (let j = i+1; j < A.length; j++) {
					if (dist1(A[j][col])<dist1(A[i][col]))
						[A[i],A[j]] = [A[j],A[i]]				
				}
			}
		}
		function dist1(x) {
			x = math.abs(x);
			if (x>1) return x;
			return 1/x;
		}
		function zerosbelowabove(A,r,c) {
			let pivotrow = A[r];
			let ret = [];
			for (let i = 0 ; i<A.length ; i++) {
				let row = A[i];
				if (i!=r && math.abs(row[c])>1E-3 && math.abs(pivotrow[c])>1E-3) row = math.subtract(row,math.multiply(math.divide(row[c],pivotrow[c]),pivotrow));
				ret.push(row);
			}
			return ret;
		}
	}

	static fullrank(A) {																//	+2020.9
		if (A.length > A[0].length) A = math.transpose(A);
		var R = matrix.homogeneous.rref(A);
		//console.log('R=',R,math.number(R))						//	-2022.8
		console.log('R=',R,Transform.num2neat(R))					//	+2022.8
		for (var i=0; i<R.length; i++) {
			//if (R[i].every(x=>math.abs(x)<1E-1)) return false;	//	-2022.9
			if (R[i].every(x=>math.abs(x)<1E-4)) return false;		//	+2022.9
		}
		return true;
	}

	//static singular(A) {											//	+2020.6			//	-2020.9
	//	var R = matrix.homogeneous.rref(A);
	//	console.log('R=',R,math.number(R))
	//	for (var i=0; i<R.length; i++) {
	//		//if (R[i].every(x=>math.abs(x)<1E-3) && !R[i].every(x=>math.abs(x)<1E-4)) {matrix.log(A);alert(A)};
	//		if (R[i].every(x=>math.abs(x)<1E-3)) return true;		//	+2020.8
	//	}
	//	//if (R[i].every(x=>x==0)) return true;						//	-2020.8
	//	return false;
	//}

}
