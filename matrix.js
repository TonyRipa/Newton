
/*
	Author:	Anthony John Ripa
	Date:	12/10/2020
	Matrix:	A matrix library
*/


class matrix {

	static dft(b) {
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
		var ATA = math.multiply(AT, A);
		var ATb = math.multiply(AT, b);
		if (matrix.short(A)) return matrix.solvesingular(A, b);							//	+2020.12
		if (!matrix.homogeneous.fullrank(A)) {											//						+2020.11
			if (matrix.tall(A))
				return matrix.solvesingular(ATA, ATb);
			else
				return matrix.solvesingular(A, b);
		}
		//if (!matrix.homogeneous.fullrank(A)) return matrix.solvesingular(ATA, ATb);	//			+2020.9		-2020.11
		//if (matrix.homogeneous.singular(ATA)) return matrix.solvesingular(ATA, ATb);	//	+2020.6	-2020.9
		return matrix.solvenotsingular(ATA, ATb);										//	+2020.6
		//if (math.abs(math.det(ATA)) > .4) return matrix.solvenotsingular(ATA, ATb);	//	-2020.6
		//return matrix.solvesingular(ATA, ATb);										//	-2020.6
	}

	static tall(A) {																	//	+2020.11
		return A.length > A[0].length;
	}

	static short(A) {																	//	+2020.12
		return A.length < A[0].length;
	}

	static solvesingular(A, b) {														//	2019.11	Added
		console.log("Matrix.SolveSingular: A="+JSON.stringify(math.number(A))+", b="+b);//	2019.11	Added
		if (b.every(x=>x==0)) return matrix.scaletoint(matrix.homogeneous.solve(A));
		console.log('Matrix.SolveSingular: Homogenizing');
		for(let i = 0;i<A.length;i++) {
			A[i].push(math.unaryMinus(b[i]));
			//A[i].reverse();	//	-2020.8
		}
		var solution = matrix.homogeneous.solve(A);
		solution.pop();			//	+2020.8
		//solution.reverse();	//	-2020.9
		//solution.pop();		//	-2020.8
		console.log("Matrix.SolveSingular: sol.="+JSON.stringify(math.number(solution)));//	+2020.9
		return solution;
	}

	static solvenotsingular(A, b) {					//	2019.7	Added
		console.log('Matrix.solvenotsingular')
		console.log(JSON.stringify(math.number(A)),JSON.stringify(math.number(b)));
		console.log(math.number(math.det(A)));
		var Ainv = math.divide(math.eye(A[0].length), A);
		var x = math.multiply(Ainv, b);
		console.log(math.number(x.valueOf()))		//	+2020.8
		return x.valueOf();
	}

	static scaletoint(vect) {								//	2019.7	Added
		console.log('Matrix.scaletoint');
		if (vect.length==1) return vect;
		var ret = math.multiply(vect,2*3*4*5*6*7*8*9*10*11*12*13);
		ret = math.round(ret);
		var gcd = ret.reduce((x,y)=>math.gcd(x,y))
		if (gcd==0) return ret;
		if (vect.length==2 && math.norm(ret.map(x=>math.divide(x,gcd)))>1000) return scaletoint2(ret);
		return ret.map(x=>math.divide(x,gcd))
		function scaletoint2(vect) {
			console.log('Matrix.scaletoint2');
			var candidates = [];
			var scores = [];
			for (var i = 0; i<=10; i++) {
				for (var j = 1; j<=10; j++) {
					candidates.push([i,j]);
					scores.push(math.abs(math.subtract(math.divide(i,j),math.divide(vect[0],vect[1]))));
				}
			}
			var bestscore = math.min(scores);
			var bestindex = scores.indexOf(bestscore);
			return candidates[bestindex];
		}
	}

	static log(A) {									//	2020.1	Added
		if (Array.isArray(A[0])) console.log(matrix.m(A));
		else console.log(matrix.v(A));
	}

	static m(A) {									//	2020.1	Added
		return math.number(A).map(row=>matrix.v(row)).join('\n');
	}

	static v(b) {									//	2020.1	Added
		return math.number(b).map(x=>x.toFixed(1)).join('\t');
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
					//A = matrix.homogeneous.rref(A);console.log(A)		//	2020.1	Removed
					A = matrix.homogeneous.rref(A);matrix.log(A);		//	2020.1	Added	//	-2020.8
					matrix.log(A);A = matrix.homogeneous.rref(A);matrix.log(A);				//	+2020.8
					var row0 = A[0];
					var row1 = A[1];
					//var b = row1[2] == 0 ? 0 : math.unaryMinus(math.divide(row1[2],row1[1]));					//	2019.12	Removed
					var a = row0[2] == 0 || row0[0] == 0 ? 0 : math.unaryMinus(math.divide(row0[2],row0[0]));	//	2019.12	Added
					var b = row1[2] == 0 || row1[1] == 0 ? 0 : math.unaryMinus(math.divide(row1[2],row1[1]));	//	2019.12	Added
					var ret = [a, b, 1];																		//	2019.7	Added
					return ret;
				}
			}
			if (A[0].length==4) {		//	2019.7	Added
				if (A.length>=4-1) {
					//A = matrix.homogeneous.rref(A);console.log(A)		//	2020.1	Removed
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
					//A = matrix.homogeneous.rref(A);console.log(A)		//	2020.1	Removed
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

	//static rref(A) {												//	2020.1	Added	//	-2020.8
	//	var ref = matrix.homogeneous.ref;
	//	var flip = matrix.homogeneous.flip;
	//	return flip(ref(flip(ref(A,true))));
	//}

	//static flip(A) {												//	2020.1	Added	//	-2020.8
	//	return A.slice().reverse().map(row=>row.slice().reverse());
	//}

	static fullrank(A) {																//	+2020.9
		if (A.length > A[0].length) A = math.transpose(A);
		var R = matrix.homogeneous.rref(A);
		console.log('R=',R,math.number(R))
		for (var i=0; i<R.length; i++) {
			if (R[i].every(x=>math.abs(x)<1E-1)) return false;
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

	//static ref(A) {												//	2018.10	Added	//	2020.1	Removed
	//	if (A.length==1) return A;
	//	if (A[0].length<1) return A;								//	2019.11	Added
	//	A = zerosbelow(A);
	//	let S = submatrix(A);
	//	S = matrix.homogeneous.ref(S);
	//	A = overlay(A,S);
	//	return A;
	//	function zerosbelow(A) {
	//		let row0 = A[0];
	//		let ret = [row0];
	//		for ( let i = 1 ; i<A.length ; i++ ) {
	//			let row = A[i];
	//			if (row[0]!=0 && row0[0]!=0) row = math.subtract(row,math.multiply(math.divide(row[0],row0[0]),row0));
	//			ret.push(row);
	//		}
	//		return ret;
	//	}
	//	function submatrix(A) {
	//		return A.filter((x,i)=>i>0).map(row=>row.filter((x,i)=>i>0))
	//	}
	//	function overlay(A,S) {
	//		return [A[0],...S.map((row,i)=>[A[i+1][0],...row])]
	//	}
	//}

	//static rref(A) {												//	2018.10	Added	//	2020.1	Removed
	//	var ref = matrix.homogeneous.ref;
	//	return flip(ref(flip(ref(A))));
	//	function flip(A) {
	//		return A.slice().reverse();
	//	}
	//}

}
