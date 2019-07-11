
/*
	Author:	Anthony John Ripa
	Date:	7/10/2019
	Matrix:	A matrix library
*/


class matrix {

	static solve(A, b) {//A=math.round(math.number(A));b=math.round(math.number(b));
		console.log("Matrix.solve: A="+A+", b="+b);
		if (math.abs(math.det(A)) > .01) return matrix.solvenotsingular(A,b);	//	2019.7	Added
		if (b.every(x=>x==0)) return matrix.scaletoint(matrix.homogeneous.solve(A));
		for(let i = 0;i<A.length;i++) {
			A[i].push(math.unaryMinus(b[i]));
			A[i].reverse();
		}
		A.push(new Array(A.length+1).fill(0));
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
		console.log('Matrix.homogeneous.solve: ' + A.length);
		if (A.length==1) {					//	2019.7	Added
			if (A[0].length==1) {
				return [0];
			}
		}
		if (A.length==2) {																	//	2019.7	Added
			if (A[0].length==2) {
				A = matrix.homogeneous.rref(A);console.log(A)
				var row0 = A[0];
				var a = row0[1] == 0 ? 0 : math.unaryMinus(math.divide(row0[1],row0[0]));
				var ret = [a, 1];
				//return matrix.scaletoint(ret);
				return ret;
			}
		}
		if (A.length==3) {		//	2018.10	Added
			if (A[0].length==3) {
				A = matrix.homogeneous.rref(A);console.log(A)
				var row0 = A[0];
				var row1 = A[1];
				var a = row0[2] == 0 ? 0 : math.unaryMinus(math.divide(row0[2],row0[0]));	//	2019.7	Added
				var b = row1[2] == 0 ? 0 : math.unaryMinus(math.divide(row1[2],row1[1]));	//	2019.7	Added
				var ret = [a, b, 1];														//	2019.7	Added
				//return matrix.scaletoint(ret);
				return ret;
			}
		}
		if (A.length==4) {		//	2019.7	Added
			if (A[0].length==4) {
				A = matrix.homogeneous.rref(A);console.log(A)
				var row0 = A[0];
				var row1 = A[1];
				var row2 = A[2];
				var a = row0[3] == 0 ? 0 : math.unaryMinus(math.divide(row0[3],row0[0]));	//	2019.7	Added
				var b = row1[3] == 0 ? 0 : math.unaryMinus(math.divide(row1[3],row1[1]));	//	2019.7	Added
				var c = row2[3] == 0 ? 0 : math.unaryMinus(math.divide(row2[3],row2[2]));	//	2019.7	Added
				var ret = [a, b, c, 1];														//	2019.7	Added
				//return matrix.scaletoint(ret);
				return ret;
			}
		}
		return undefined;
	}

	static ref(A) {				//	2018.10	Added
		if (A.length==1) return A;
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
