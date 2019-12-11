
/*
	Author:	Anthony John Ripa
	Date:	12/10/2019
	Matrix:	A matrix library
*/


class matrix {

	static solve(A, b) {																//	2019.11	Added
		console.log('solve',A, b);
		var AT = math.transpose(A);
		var ATA = math.multiply(AT, A);
		var ATb = math.multiply(AT, b);
		if (math.abs(math.det(ATA)) > .4) return matrix.solvenotsingular(ATA, ATb);
		return matrix.solvesingular(ATA, ATb);
	}

	//static solve(A, b) {																//	2019.11	Removed
	static solvesingular(A, b) {														//	2019.11	Added
		//console.log("Matrix.solve: A="+A+", b="+b);									//	2019.11	Removed
		console.log("Matrix.SolveSingular: A="+JSON.stringify(math.number(A))+", b="+b);//	2019.11	Added
		//if (math.abs(math.det(A)) > .01) return matrix.solvenotsingular(A,b);			//	2019.11	Removed
		if (b.every(x=>x==0)) return matrix.scaletoint(matrix.homogeneous.solve(A));
		for(let i = 0;i<A.length;i++) {
			A[i].push(math.unaryMinus(b[i]));
			A[i].reverse();
		}
		var solution = matrix.homogeneous.solve(A);
		solution.reverse();
		solution.pop();
		return solution;
	}

	static solvenotsingular(A, b) {					//	2019.7	Added
		console.log('Matrix.solvenotsingular')
		var Ainv = math.divide(math.eye(A[0].length), A);
		var x = math.multiply(Ainv, b);
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

}

matrix.homogeneous = class {

	static solve(A) {
		console.log('Matrix.homogeneous.solve: ' + A[0].length);		//	2019.10	Added
		try {															//	2019.10	Added
			if (A[0].length==1) {					//	2019.7	Added
				if (A.length>=1-1) {
					return [0];
				}
			}
			if (A[0].length==2) {																	//	2019.7	Added
				if (A.length>=2-1) {
					A = matrix.homogeneous.rref(A);console.log(A)
					var row0 = A[0];
					var a = row0[1] == 0 ? 0 : math.unaryMinus(math.divide(row0[1],row0[0]));
					var ret = [a, 1];
					return ret;
				}
			}
			if (A[0].length==3) {		//	2018.10	Added
				if (A.length>=3-1) {
					A = matrix.homogeneous.rref(A);console.log(A)
					var row0 = A[0];
					var row1 = A[1];
					//var a = row0[2] == 0 ? 0 : math.unaryMinus(math.divide(row0[2],row0[0]));					//	2019.12	Removed
					//var b = row1[2] == 0 ? 0 : math.unaryMinus(math.divide(row1[2],row1[1]));					//	2019.12	Removed
					var a = row0[2] == 0 || row0[0] == 0 ? 0 : math.unaryMinus(math.divide(row0[2],row0[0]));	//	2019.12	Added
					var b = row1[2] == 0 || row1[1] == 0 ? 0 : math.unaryMinus(math.divide(row1[2],row1[1]));	//	2019.12	Added
					var ret = [a, b, 1];																		//	2019.7	Added
					return ret;
				}
			}
			if (A[0].length==4) {		//	2019.7	Added
				if (A.length>=4-1) {
					A = matrix.homogeneous.rref(A);console.log(A)
					var row0 = A[0];
					var row1 = A[1];
					var row2 = A[2];
					//var a = row0[3] == 0 ? 0 : math.unaryMinus(math.divide(row0[3],row0[0]));					//	2019.11	Removed
					//var b = row1[3] == 0 ? 0 : math.unaryMinus(math.divide(row1[3],row1[1]));					//	2019.11	Removed
					//var c = row2[3] == 0 ? 0 : math.unaryMinus(math.divide(row2[3],row2[2]));					//	2019.11	Removed
					var a = row0[3] == 0 || row0[0] == 0 ? 0 : math.unaryMinus(math.divide(row0[3],row0[0]));	//	2019.11	Added
					var b = row1[3] == 0 || row1[1] == 0 ? 0 : math.unaryMinus(math.divide(row1[3],row1[1]));	//	2019.11	Added
					var c = row2[3] == 0 || row2[2] == 0 ? 0 : math.unaryMinus(math.divide(row2[3],row2[2]));	//	2019.11	Added
					var ret = [a, b, c, 1];																		//	2019.7	Added
					return ret;
				}
			}
			if (A[0].length==5) {		//	2019.9	Added
				if (A.length>=5-1) {
					A = matrix.homogeneous.rref(A);console.log(A)
					var row0 = A[0];
					var row1 = A[1];
					var row2 = A[2];
					var row3 = A[3];
					//var a = row0[4] == 0 ? 0 : math.unaryMinus(math.divide(row0[4],row0[0]));					//	2019.10	Removed
					//var b = row1[4] == 0 ? 0 : math.unaryMinus(math.divide(row1[4],row1[1]));					//	2019.10	Removed
					//var c = row2[4] == 0 ? 0 : math.unaryMinus(math.divide(row2[4],row2[2]));					//	2019.10	Removed
					//var d = row3[4] == 0 ? 0 : math.unaryMinus(math.divide(row3[4],row3[3]));					//	2019.10	Removed
					var a = row0[4] == 0 || row0[0] == 0 ? 0 : math.unaryMinus(math.divide(row0[4],row0[0]));	//	2019.10	Added
					var b = row1[4] == 0 || row1[1] == 0 ? 0 : math.unaryMinus(math.divide(row1[4],row1[1]));	//	2019.10	Added
					var c = row2[4] == 0 || row2[2] == 0 ? 0 : math.unaryMinus(math.divide(row2[4],row2[2]));	//	2019.10	Added
					var d = row3[4] == 0 || row3[3] == 0 ? 0 : math.unaryMinus(math.divide(row3[4],row3[3]));	//	2019.10	Added
					var ret = [a, b, c, d, 1];
					return ret;
				}
			}
		} catch(e) {								//	2019.10	Added
			alert("matrix.homogeneous : " + e)		//	2019.10	Added
		}											//	2019.10	Added
		return undefined;
	}

	static ref(A) {													//	2018.10	Added
		if (A.length==1) return A;
		if (A[0].length<1) return A;								//	2019.11	Added
		A = zerosbelow(A);
		let S = submatrix(A);
		S = matrix.homogeneous.ref(S);
		A = overlay(A,S);
		return A;
		function zerosbelow(A) {
			let row0 = A[0];
			let ret = [row0];
			for ( let i = 1 ; i<A.length ; i++ ) {
				let row = A[i];
				if (row[0]!=0 && row0[0]!=0) row = math.subtract(row,math.multiply(math.divide(row[0],row0[0]),row0));
				ret.push(row);
			}
			return ret;
		}
		function submatrix(A) {
			return A.filter((x,i)=>i>0).map(row=>row.filter((x,i)=>i>0))
		}
		function overlay(A,S) {
			return [A[0],...S.map((row,i)=>[A[i+1][0],...row])]
		}
	}

	static rref(A) {			//	2018.10	Added
		var ref = matrix.homogeneous.ref;
		return flip(ref(flip(ref(A))));
		function flip(A) {
			return A.slice().reverse();
		}
	}

}
