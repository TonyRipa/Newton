
/*
    Author: Anthony John Ripa
    Date:   7/10/2021
    Transform: A data transformer
*/


class Transform {												//	+2020.6

	static transform(points) {									//	+2020.6
		if (vm.trans==0) return points;							//	+2020.6
		var ret, ret2, sum;
		ret = points.slice();
		return laplace(ret);

		function laplace(points) {
			return [1.5,2,3,4].map(s=>laplace1(points,s));
		}
		function laplace1(points, s) {
			return [s, integratedef(points.map(xy=>[xy[0],xy[1]*Math.exp(-s*xy[0])]))];
		}
		function integratedef(points) {
			return integrate(points).slice(-1)[0][1];
		}
		function integrate(points) {							//	+2020.11
			var ret = [];
			var sum = 0;
			for(var i = 0; i<points.length; i++) {
				//var y = (isNaN(points[i][1])) ? points[i+1][1] : points[i][1]								//	-2021.1
				var y = (isNaN(points[i][1])) ? (i==0) ? points[i+1][1] : points[i-1][1] : points[i][1];	//	+2021.1
				sum += y * c(i,points);
				ret.push([points[i][0], sum]);
			}
			return ret;
			function c(i,points) {
				if (points.length == 600) return simpson(i,points);
				return gauss(i,points);
				function riemann(i,points) {
					return points[1][0]-points[0][0];
				}
				function trapezoid(i,points) {
					var c = (i==0 || i==points.length-1) ? 1 : 2
					return (points[1][0]-points[0][0]) * c / 2;
				}
				function simpson(i,points) {
					var c = (i==0 || i==points.length-1) ? 1 : (i%2==1) ? 4 : 2
					return (points[1][0]-points[0][0]) * c / 3;
				}
				function gauss(i,points) {
					var b = 10;
					var a = 0;
					var w = { 3 : [0.5555555555555556, 0.8888888888888888, 0.5555555555555556] ,
					4 : [0.6521451548625461,0.6521451548625461,0.3478548451374538,0.3478548451374538] ,
					10 : [0.2955242247147529,0.2955242247147529,0.2692667193099963,0.2692667193099963,0.2190863625159820,0.2190863625159820,0.1494513491505806,0.1494513491505806,0.0666713443086881,0.0666713443086881] ,
					20 : [0.1527533871307258,0.1527533871307258,0.1491729864726037,0.1491729864726037,0.1420961093183820,0.1420961093183820,0.1316886384491766,0.1316886384491766,0.1181945319615184,0.1181945319615184,0.1019301198172404,0.1019301198172404,0.0832767415767048,0.0832767415767048,0.0626720483341091,0.0626720483341091,0.0406014298003869,0.0406014298003869,0.0176140071391521,0.0176140071391521] ,
					40 : [0.0775059479784248,0.0775059479784248,0.0770398181642480,0.0770398181642480,0.0761103619006262,0.0761103619006262,0.0747231690579683,0.0747231690579683,0.0728865823958041,0.0728865823958041,0.0706116473912868,0.0706116473912868,0.0679120458152339,0.0679120458152339,0.0648040134566010,0.0648040134566010,0.0613062424929289,0.0613062424929289,0.0574397690993916,0.0574397690993916,0.0532278469839368,0.0532278469839368,0.0486958076350722,0.0486958076350722,0.0438709081856733,0.0438709081856733,0.0387821679744720,0.0387821679744720,0.0334601952825478,0.0334601952825478,0.0279370069800234,0.0279370069800234,0.0222458491941670,0.0222458491941670,0.0164210583819079,0.0164210583819079,0.0104982845311528,0.0104982845311528,0.0045212770985332,0.0045212770985332] ,
					64 : [0.0486909570091397,0.0486909570091397,0.0485754674415034,0.0485754674415034,0.0483447622348030,0.0483447622348030,0.0479993885964583,0.0479993885964583,0.0475401657148303,0.0475401657148303,0.0469681828162100,0.0469681828162100,0.0462847965813144,0.0462847965813144,0.0454916279274181,0.0454916279274181,0.0445905581637566,0.0445905581637566,0.0435837245293235,0.0435837245293235,0.0424735151236536,0.0424735151236536,0.0412625632426235,0.0412625632426235,0.0399537411327203,0.0399537411327203,0.0385501531786156,0.0385501531786156,0.0370551285402400,0.0370551285402400,0.0354722132568824,0.0354722132568824,0.0338051618371416,0.0338051618371416,0.0320579283548516,0.0320579283548516,0.0302346570724025,0.0302346570724025,0.0283396726142595,0.0283396726142595,0.0263774697150547,0.0263774697150547,0.0243527025687109,0.0243527025687109,0.0222701738083833,0.0222701738083833,0.0201348231535302,0.0201348231535302,0.0179517157756973,0.0179517157756973,0.0157260304760247,0.0157260304760247,0.0134630478967186,0.0134630478967186,0.0111681394601311,0.0111681394601311,0.0088467598263639,0.0088467598263639,0.0065044579689784,0.0065044579689784,0.0041470332605625,0.0041470332605625,0.0017832807216964,0.0017832807216964] } ;
					w = w[points.length]
					w = w.map(e=>e*(b-a)/2);
					return w[i];
				}
			}
		}
	}

	static nonan(points) { return points.filter(xy=>!math.number(xy).includes(NaN)); }	//	+2020.8

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
		//var terminating = math.abs(seq[3])<.01 && (math.abs(seq[2])<.01 || math.abs(seq[1])>.01 || math.abs(seq[0])<.01);			//	-2021.7
		var terminating = math.abs(seq.slice(-1)[0])<.01 && (math.abs(seq[2])<.01 || math.abs(seq[1])>.01 || math.abs(seq[0])<.01);	//	+2021.7
		var geometric = math.abs(seq[0]*seq[3]-seq[1]*seq[2])<.01;
		return !terminating && geometric;
	}

	static infiniteseq2frac(seq) {														//	+2021.6
		var L = seq.length;	//	+2021.7
		seq = math.round(math.number(seq))
		var leading0 = 1;	//	All sequences implicitly have 1 leading0 in 1's place (i.e. start at .1's place) ( e.g. 0.4738 )
		while (seq[0]==0) { leftshift(seq); leading0++ }									//	Process leading0's	//	+2020.12
		//var den = divide([seq[0],0,0,0],seq);						//	-2021.7
		var den = divide([seq[0],...new Array(L-1).fill(0)],seq);	//	+2021.7
		den.pop();		//	Least significant number in division is typically error so remove it
		den.reverse()	//	[…,x³,x²,x¹,x⁰,…] -> […,x⁰,x¹,x²,x³,…]
		while (den[0]==0 || math.abs(den[0]/den[1]) < 0.5) den.shift(); // Remove Leading0's (Leading0's are negative powers)
		var width = den.length;					//	Denominator Width			//	e.g. width(101) = 3
		var pow = width - 1;													//	Highest power of a polynomial is width-1
		pow -= leading0;
		//var num = [0,0,0,0,0,0];	//	-2021.7
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

}
