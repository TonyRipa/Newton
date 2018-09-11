
/*
	Author:	Anthony John Ripa
	Date:	9/10/2018
	Matrix:	A matrix library
*/


class matrix {

	static solve(A, b) {
		if (b.every(x=>x==0)) return matrix.homogeneous.solve(A);
		return undefined;
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
				return ret.map(x=>math.divide(x,gcd))
			}
		}
		return undefined;
	}

}