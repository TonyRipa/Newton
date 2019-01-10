
/*
	Author:	Anthony John Ripa
	Date:	1/10/2019
	Matrix:	A matrix library
*/


class matrix {

	static solve(A, b) {
		if (b.every(x=>x==0)) return matrix.homogeneous.solve(A);
		return undefined;
	}

	static scaletoint(vect) {								//	2019.1	Added
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

matrix.homogeneous = class {

	static solve(A) {
		if (A.length==2) {
			if (A[0].length==2) {
				var A2 = A[0];
				var ret = [math.unaryMinus(A2[1]),A2[0]]
				var gcd = math.gcd(A2[0],A2[1])
				if (gcd==0) return ret;
				if (math.norm(ret.map(x=>math.divide(x,gcd)))>1000) return matrix.scaletoint(ret);	//	2019.1	Added
				return ret.map(x=>math.divide(x,gcd))
			}
		}
		if (A.length==3) {		//	2018.10	Added
			if (A[0].length==3) {
				A = matrix.homogeneous.rref(A);
				var row0 = A[0];
				var row1 = A[1];
				row0 = math.divide(row0,row0[2]);	//	Make both rows have 1 in last row
				row1 = math.divide(row1,row1[2]);	//	Make both rows have 1 in last row
				var ret = [math.unaryMinus(math.divide(row0[2],row0[0])), math.unaryMinus(math.divide(row0[2],row1[1])), row0[2]];
				ret = math.multiply(ret,2*3*4*5*6*7*8*9*10*11*12*13);
				ret = math.round(ret);
				var gcd = ret.reduce((x,y)=>math.gcd(x,y))
				if (gcd==0) return ret;
				return math.divide(ret,gcd)
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
