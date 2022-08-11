
/*
    Author: Anthony John Ripa
    Date:   8/10/2022
    Transform: A data transformer
*/


class Transform {												//	+2020.6

	//static nonan(points) { return points.filter(xy=>!math.number(xy).includes(NaN)); }	//	+2020.8												//	-2021.9
	//static nonan(points) { console.log(points);return points.filter(xy=>xy[0].hasOwnProperty('im')?(!xy[0].isNaN()&&!xy[1].isNaN()):!math.number(xy).includes(NaN)); }	//	+2021.9	//	-2022.8
	static nonan(points) {	//	+2022.8
		return points.filter( point => point.every(an) )
		function an(x) { return !nan(x) }
		function nan(x) { return math.isNaN(math.number(math.abs(x))) }
	}

	static nonanxy(xs,y) {																//	+2020.8
		var allpoints = Transform.topoints(xs,y);
		var allnnanpoints = Transform.nonan(allpoints);
		return Transform.toxy(allnnanpoints);
	}

	static toxy(points) {																//	+2020.8
		var [xs,y] = _.unzip(points.map(r=>[r.slice(0,-1),r.slice(-1)]));
		xs = _.unzip(xs);
		y = _.unzip(y)[0];
		return [xs,y];
	}

	static topoints(xs,y) {																//	+2020.8
		return _.zip(...xs,y);
	}

	static isfrac(seq) {																//	+2021.6
		var terminating = math.abs(seq.slice(-1)[0])<.01 && (math.abs(seq[2])<.01 || math.abs(seq[1])>.01 || math.abs(seq[0])<.01);	//	+2021.7
		var geometric = math.abs(seq[0]*seq[3]-seq[1]*seq[2])<.01;
		return !terminating && geometric;
	}

	//static infiniteseq2frac(seq) {														//	+2021.6	//	-2022.8
	static infiniteseq2frac(seq, powers_increasing) {													//	+2022.8
		var L = seq.length;	//	+2021.7
		//seq = math.round(math.number(seq))															//	-2022.8
		seq = seq.map(x=>math.typeof(x)=='Fraction'?math.number(x):x)									//	+2022.8
		seq = math.round(seq)																			//	+2022.8
		var leading0 = 1;	//	All sequences implicitly have 1 leading0 in 1's place (i.e. start at .1's place) ( e.g. 0.4738 )
		if (seq.some(x=>x!=0))																										//	+2021.8
			while (seq[0]==0) { leftshift(seq); leading0++ }								//	Process leading0's	//	+2020.12
		var den = divide([seq[0],...new Array(L-1).fill(0)],seq);	//	+2021.7
		den.pop();		//	Least significant number in division is typically error so remove it
		den.reverse()	//	[…,x³,x²,x¹,x⁰,…] -> […,x⁰,x¹,x²,x³,…]
		while (den[0]==0 || math.abs(den[0]/den[1]) < 0.5) den.shift(); // Remove Leading0's (Leading0's are negative powers)
		if (powers_increasing) den.reverse()															//	+2022.8
		var width = den.length;					//	Denominator Width			//	e.g. width(101) = 3
		var pow = width - 1;													//	Highest power of a polynomial is width-1
		pow -= leading0;
		var num = new Array(L+2).fill(0);	//	+2021.7
		num[1-pow] = seq[0];					//	index=1-pow : return API is numerators as [x¹,x⁰,x⁻¹,x⁻²,x⁻³,x⁻⁴]
		//while (den.length<4) den.push(0);		//	+2021.5	//	-2021.7
		while (den.length<L) den.push(0);					//	+2021.7
		return {num, den}
		function leftshift(arr) { arr.shift(); arr.push(0); }
		function divide(num,den) {
			//return div(num,den,3).slice(0,4);	//	-2021.7
			return div(num,den,3).slice(0,L);	//	+2021.7
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

	static num2neat(num) {	//	+2022.8
		if (math.typeof(num)=='Array') {
			return num.map(Transform.num2neat)
		} else if (math.typeof(num)=='Complex') {
			return num.round().toString()
		} else if (math.typeof(num)=='string') {
			return Transform.num2neat(math.eval(num))
		} else {
			return math.number(num)
		}
	}

}
