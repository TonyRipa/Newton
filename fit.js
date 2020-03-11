
/*
	Author:	Anthony John Ripa
	Date:	3/10/2020
	Fit:	Infers a function from points
*/

class Fit {

	static sparse() {	//	2019.3
		return {
			tovect: function brute(allpoints) {
				var points = _.sampleSize(allpoints, 4);
				var f = (x, p) =>(p[1] + p[3] * x + p[5] * x * x) / (p[0] + p[2] * x + p[4] * x * x);
				var range = vm.range;
				//if (range>4) range=4;			//	2019.4	Removed
				var bestval = 1000;
				var besti;
				var p;
				var ps = binitems(6,range);		//	2019.4	Added
				for (p of ps) {
					//p = [0,0,0,0,0,0];		//	2019.4	Removed
					//for (var e of n) p[e]++;	//	2019.4	Removed
					//console.log(JSON.stringify([n,p]));
					if (p[0]+p[2]+p[4]==0) continue;
					for (var sp=p; sp.some(x=>x>0); sp=incrementsign(sp)) {
						//console.log(JSON.stringify([n,p,sp]));
						//var curval = diff(f, points, sp);					//	2020.3	Removed
						var curval = diff(f, points, sp) * complexity(sp);	//	2020.3	Added
						//if (JSON.stringify(n)=='[0,3]') alert(JSON.stringify([n,p,sp,curval,f(points[0][0],sp)]))
						if (curval < bestval) {//alert(JSON.stringify([n,p,sp,curval,f(points[0][0],sp)]))
							besti = sp;
							bestval = curval;
						}
					}
				}
				//alert(JSON.stringify([n,p,sp,bestval,besti]));
				return besti;
				function complexity(sp) {									//	2020.3	Added
					var v1 = sp.slice(0,3), v2 = sp.slice(3,6);
					var complex = norm2(v1) + 2 * norm2(v2);
					return math.max(1, complex);
					function norm2(v) { return math.norm(v)**2; }
				}
				function binitems(numbins,numitems) {
					var ret = []
					for (let i = 1 ; i<=numitems ; i++) {
						var list = binitems1(numbins,i);
						ret.push(...list)
					}
					return ret
					function binitems1(numbins,numitems) {
						if (numbins==1) return [[numitems]];
						var ret = []
						for (var i=0; i<=numitems; i++) {
							var rest = binitems1(numbins-1,numitems-i)
							for (let list of rest)
								ret.push([i,...list]);
						}
						return ret;
					}
				}
				function incrementsign(number) {//console.log(JSON.stringify(['number',number]))
					if (number.length==0) return [];
					if (number[0]==0) return [0,...incrementsign(number.slice(1))];
					if (number[0]> 0) return [-number[0],...number.slice(1)];
					if (number[0]< 0) return [-number[0],...incrementsign(number.slice(1))];
				}
				function diff(f, points, p) {
					var ys = points.map(xy=>[xy[1], f(xy[0], p)])
					var d0 = ys.map(pair =>1 / pair[0] == 0 && 1 / pair[1] == 0 ? 0 : isNaN(pair[0]) && isNaN(pair[1]) ? 0 : pair[0] - pair[1]);
					var d = d0.map(x=>x * x);
					d = d.map(x=>1 / x == 0 ? 1 : x);
					d = d.map(x=>isNaN(x) ? 1 : x);
					d = Math.sqrt(math.sum(...d));
					if (isNaN(d)) { console.log('disNaN', p, d0, y, y1); end }
					return d;
				}
			},
			decodernum: [0,[0,0],0,[1,0],0,[2,0]],
			decoderden: [[0,0],0,[1,0],0,[2,0]]
		}				
	}

	static differential() {			//	2018.11
		return {
			tovect: function transform(points) {			   console.log('parsDiff: points = ',points.map(xy=>math.number(xy[1])));
				var derivatives = pointstoderivatives(points); console.log('parsDiff: der = ',math.number(derivatives));
				var {num,den} = seq2frac(derivatives);		   console.log('parsDiff: der = ',math.number(derivatives),' num = ',num,' den = ',math.number(den))
				return [...num,...den];
				function pointstoderivatives(points) {
					return [points[0][1],
					(points[1][1]-points[0][1])/(points[1][0]-points[0][0]),
					(points[2][1]-2*points[1][1]+points[0][1])/(points[1][0]-points[0][0])**2,
					(points[3][1]-3*points[2][1]+3*points[1][1]-points[0][1])/(points[1][0]-points[0][0])**3];
				}
				function seq2frac(seq) {	//	2019.6
					var terminating = math.abs(seq[3])<.01 ;
					return terminating ? finiteseq2frac(seq) : infiniteseq2frac(seq);
					function finiteseq2frac(seq) { return {'num' : [0,0,...seq] , 'den' : [1,0,0,0] } }
					function infiniteseq2frac(seq) {
						seq = math.round(math.number(seq))
						var leading0 = 1;	//	All sequences implicitly have 1 leading0 in 1's place (i.e. start at .1's place) ( e.g. 0.4738 )
						while (seq[0]==0 || math.abs(seq[0]/seq[1])< 0.5) { leftshift(seq); leading0++}	//	Process leading0's
						var den = divide([seq[0],0,0,0],seq);
						den.pop();		//	Least significant number in division is typically error so remove it
						den.reverse()	//	[…,x³,x²,x¹,x⁰,…] -> […,x⁰,x¹,x²,x³,…]
						//alert(den)
						while (den[0]==0 || math.abs(den[0]/den[1]) < 0.5) den.shift(); // Remove Leading0's (Leading0's are negative powers)
						var width = den.length;					//	Denominator Width			//	e.g. width(101) = 3
						var pow = width - 1;													//	Highest power of a polynomial is width-1
						pow -= leading0;
						num = [0,0,0,0,0,0];
						num[1-pow] = seq[0];					//	index=1-pow : return API is numerators as [x¹,x⁰,x⁻¹,x⁻²,x⁻³,x⁻⁴]
						return {num, den}
						function leftshift(arr) { arr.shift(); arr.push(0); }
						function divide(num,den) {
							return div(num,den,3).slice(0,4);
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
			},
			decodernum: [[1,0],[0,0],[-1,0],[-2,0],[-3,0],[-4,0]],
			decoderden: [0,0,0,0,0,0,[0,0],[1,0],[2,0],[3,0]]
		}
	}

	static rational1_H02() {	//	(a+bx)/(1+cx+dx^2)
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				//var b = math.dotMultiply(math.dotMultiply(xs[0], xs[0]), y);	//	'xs[0]^2*y'
				var b = y;
				return [A, b];
				function makeA(xs) {
					var c1 = xs.ones;
					var c2 = xs[0];
					var c3 = math.multiply(-1, math.dotMultiply(xs[0], y));
					var c4 = math.multiply(-1, math.dotMultiply(math.dotMultiply(xs[0], xs[0]), y));	//	'-xs[0]^2*y'
					console.log('xs.ones', c1);
					console.log('xs[0]', c2);
					console.log('-xs[0]*y', c3);
					console.log('-xs[0]^2*y', c4);
					var AT = [];
					AT.push(c1);
					AT.push(c2);
					AT.push(c3);
					AT.push(c4);
					return math.transpose(AT);
				}
			},
			decodernum: [[0,0],[1,0]],
			decoderden: [0,0,[1,0],[2,0],[0,0,1]]
			//decoderden: [0,0,[0,0],[1,0],[2,0,1]]
			//decoderden: [0,0,[0,0],[2,0,1]]
		};
	}

	static rational0_0() {		//	a/b			//	2018.9
		//	Set up problem as Ax=b with			//	2018.10
		//	A = [1,-Y]							//	2018.10
		//	x = (a,b)							//	2018.10
		//	b = (0,0)							//	2018.10
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				//var b = math.dotMultiply(math.dotMultiply(xs[0], xs[0]), y);	//	'xs[0]^2*y'
				var b = xs.ones.map(q=>0);
				return [A, b];
				function makeA(xs) {
					var c1 = xs.ones;
					var c2 = math.multiply(-1, y);
					console.log('xs.ones', c1);
					console.log('-y', c2);
					var AT = [];
					AT.push(c1);
					AT.push(c2);
					return math.transpose(AT);
				}
			},
			decodernum: [[0,0]],
			decoderden: [0,[0,0]]
			//decoderden: [0,0,[0,0],[1,0],[2,0,1]]
			//decoderden: [0,0,[0,0],[2,0,1]]
		};
	}

	static rational0_1() {		//		a/(bx)			//	2019.1
		//	Set up problem as Ax=b with
		//	A = [1,-xy]
		//	x = (a,b)
		//	b = (0,0)
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				var b = xs.ones.map(q=>0);
				return [A, b];
				function makeA(xs) {
					var c1 = xs.ones;
					var c2 = math.multiply(-1, math.dotMultiply(xs[0], y));
					var AT = [];
					AT.push(c1);
					AT.push(c2);
					return math.transpose(AT);
				}
			},
			decodernum: [[0,0]],
			decoderden: [0,[1,0]]
		};
	}

	static rational1_0() {		//		(a+bx)/c		//	2018.10
		//	Set up problem as Ax=b with					//	2018.10
		//	A = [1,x,-Y]								//	2018.10
		//	x = (a,b,c)									//	2018.10
		//	b = (0,0,0)									//	2018.10
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				var b = xs.ones.map(q=>0);
				return [A, b];
				function makeA(xs) {
					var c1 = xs.ones;
					var c2 = xs[0];
					var c3 = math.multiply(-1, y);
					console.log('xs.ones', c1);
					console.log('xs[0]', c2);
					console.log('-y', c3);
					var AT = [];
					AT.push(c1);
					AT.push(c2);
					AT.push(c3);
					return math.transpose(AT);
				}
			},
			decodernum: [[0,0],[1,0]],
			decoderden: [0,0,[0,0]]
		};
	}

	static rational1_01H() {	//	(a+bx)/(c+1*x)
		//	Set up problem as Ax=b with					//	2019.7
		//	A = [1,x,-Y]								//	2019.7
		//	x = (a,b,c)									//	2019.7
		//	b = xY										//	2019.7
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				var b = math.dotMultiply(xs[0], y);	//	'xs[0]*y'
				return [A, b];
				function makeA(xs) {
					var c1 = xs.ones;
					var c2 = xs[0];
					var c3 = math.multiply(-1, y);
					console.log('xs.ones', c1);
					console.log('xs[0]', c2);
					console.log('-y', c3);
					var AT = [];
					AT.push(c1);
					AT.push(c2);
					AT.push(c3);
					return math.transpose(AT);
				}
			},
			decodernum: [[0,0],[1,0]],
			decoderden: [0,0,[0,0],[1,0,1]]
		};
	}

	static rational1_02H() {	//	(a+bx)/(c+dx+x^2)
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				var b = math.dotMultiply(math.dotMultiply(xs[0], xs[0]), y);	//	'xs[0]^2*y'
				return [A, b];
				function makeA(xs) {
					var c1 = xs.ones;
					var c2 = xs[0];
					var c3 = math.multiply(-1, y);
					var c4 = math.multiply(-1, math.dotMultiply(xs[0], y));
					console.log('xs.ones', c1);
					console.log('xs[0]', c2);
					console.log('-y', c3);
					console.log('-xs[0]*y', c4);
					var AT = [];
					AT.push(c1);
					AT.push(c2);
					AT.push(c3);
					AT.push(c4);
					return math.transpose(AT);
				}
			},
			decodernum: [[0,0],[1,0]],
			decoderden: [0,0,[0,0],[1,0],[2,0,1]]
			//decoderden: [0,0,[0,0],[2,0,1]]
		};
	}

	static rational1_01() {	//	(a+bx)/(c+dx)
		return {
			tomatrix: function (xs, y) {
				try {
					var A = makeA(xs);
				} catch (e) {
					alert(e)
				}
				var b = [...xs.ones.map(q=>0), 1];
				return [A, b];
				function makeA(xs) {
					var c1 = [...xs[0], 0];
					var c2 = [...xs.ones, 0];
					var c3 = [...math.multiply(-1, math.dotMultiply(xs[0], y)), 1];
					var c4 = [...math.multiply(-1, y), 0];
					//var c5 = [0, 0, 0, 0, 1];
					console.log('xs[0]', c1);
					console.log('xs.ones', c2);
					console.log('xs[0]*y', c3);
					console.log('y', c4);
					//console.log('c5', c5);
					var AT = [];
					AT.push(c1);
					AT.push(c2);
					AT.push(c3);
					AT.push(c4);
					//AT.push(c5);
					return math.transpose(AT);
				}
			},
			decodernum: [[1,0],[0,0]],
			decoderden: [0,0,[1,0],[0,0]]
		};
	}

	static rationalbrute() {	//	(a+bx+cx²)/(d+ex+fx²)
		return {
			tovect: function brute(allpoints) {
				var points = allpoints//_.sample(allpoints, 39);
				var f = (x, p) =>(p[0] + p[1] * x + p[2] * x * x) / (p[6] + p[7] * x + p[8] * x * x);
				//var range = 2;
				var range = vm.range;
				if (range>2) range=2;
				var bestval = 1000;
				var besti;
				for (var p0 = -range; p0<=range*2; p0++)	//	a+bx+cx²
					for (var p1 = -range; p1<=range*2; p1++)
						for (var p2 = -range; p2<=range; p2++) {
							var curval = diff(f, points, [p0,p1,p2,0,0,0,1,0,0]);
							//if (p0==1 && p1==1 && p2==0) alert(curval)
							if (curval < bestval) {
								besti = [p0,p1,p2,0,0,0,1,0,0];
								bestval = curval;
							}
						}
				if (bestval<.0001) return besti;
				for (var p6 = -range; p6<=range; p6++)	//	1/(a+bx+cx²)
					for (var p7 = -range; p7<=range; p7++)
						for (var p8 = -range; p8<=range; p8++) {
							var curval = diff(f, points, [1,0,0,0,0,0,p6,p7,p8]);
							if (curval < bestval) {
								besti = [1,0,0,0,0,0,p6,p7,p8];
								bestval = curval;
							}
						}
				if (bestval<.01) return besti;
				for (var p0 = range; p0>=-range; p0--)	//	(a+bx+cx²)/(d+ex)
					for (var p1 = -range; p1<=range; p1++)
						for (var p2 = -range; p2<=range; p2++)
							for (var p3 = 0; p3<=range; p3++)
								for (var p4 = -range; p4<=range; p4++) {
									var curval = diff(f, points, [p0,p1,p2,0,0,0,p3,p4,0]);
									if (curval < bestval) {
										besti = [p0,p1,p2,0,0,0,p3,p4,0];
										bestval = curval;
									}
								}
				if (bestval<.0001) return besti;
				for (var p0 = -range; p0<=range; p0++)			//	(a+bx+cx²)/(d+ex+fx²)
					for (var p1 = -range; p1<=range; p1++)
						for (var p2 = -range; p2<=range; p2++)
							for (var p3 = -range; p3<=range; p3++)
								for (var p4 = -range; p4<=range; p4++)
									for (var p5 = -range; p5<=range; p5++) {
										var curval = diff(f, points, [p0,p1,p2,0,0,0,p3,p4,p5]);
										if (curval < bestval) {
											besti = [p0,p1,p2,0,0,0,p3,p4,p5];
											bestval = curval;
										}
										if (curval == bestval) {
											var besti2 = [p0,p1,p2,0,0,0,p3,p4,p5];
											if (math.sum(math.abs(besti2)) < math.sum(math.abs(besti)) || math.sum(math.sign(besti2)) > math.sum(math.sign(besti))) {
												besti = besti2;
												bestval = curval;
											}
										}
									}
				var f2 = (x1,x2, p) =>(p[0] + p[1] * x1 + p[2] * x1 * x1 + p[3] * x2 + p[4] * x1 * x2 + p[5] * x2 * x2);
				if (bestval<.0001) return besti;
				for (var p0 = -range; p0<=range; p0++)
					for (var p1 = -range; p1<=range; p1++)
						for (var p2 = -range; p2<=range; p2++)
							for (var p3 = 0; p3<=range; p3++)
								for (var p4 = -range; p4<=range; p4++)
									for (var p5 = -range; p5<=range; p5++) {
										var curval = diff2(f2, points, [p0,p1,p2,p3,p4,p5,1,0,0,0]);
										if (curval < bestval) {
											besti = [p0,p1,p2,p3,p4,p5,1,0,0];
											bestval = curval;
										}
									}
				return besti;
				function diff(f, points, p) {
					var ys = points.map(xy=>[xy[1], f(xy[0], p)])
					var d0 = ys.map(pair =>1 / pair[0] == 0 && 1 / pair[1] == 0 ? 0 : isNaN(pair[0]) && isNaN(pair[1]) ? 0 : pair[0] - pair[1]);
					var d = d0.map(x=>x * x);
					d = d.map(x=>1 / x == 0 ? 1 : x);
					d = d.map(x=>isNaN(x) ? 1 : x);
					d = Math.sqrt(math.sum(...d));
					if (isNaN(d)) { console.log('disNaN', p, d0, y, y1); end }
					return d;
				}
				function diff2(f2, points, p) {
					var ys = points.map(xsy=>[xsy[2], f2(xsy[0],xsy[1], p)])
					var d0 = ys.map(pair =>1 / pair[0] == 0 && 1 / pair[1] == 0 ? 0 : isNaN(pair[0]) && isNaN(pair[1]) ? 0 : pair[0] - pair[1]);
					var d = d0.map(x=>x * x);
					d = d.map(x=>1 / x == 0 ? 1 : x);
					d = d.map(x=>isNaN(x) ? 1 : x);
					d = Math.sqrt(math.sum(...d));
					if (isNaN(d)) { console.log('disNaN', p, d0, y, y1); end }
					return d;
				}
			},
			decodernum: [[0,0],[1,0],[2,0],[0,1],[1,1],[0,2]],
			decoderden: [0,0,0,0,0,0,[0,0],[1,0],[2,0]]
		}
	}

	static rationalsearch() {	//	(a+bx+cx²)/(d+ex+fx²)
		return {
			tovect: function search(allpoints) {
				var eye = math.eye([6, 6]);
				var restartmax = 1000
				for (var restart = 0; restart < restartmax; restart++) {
					var points = _.sample(allpoints, 9);
					var param = math.ones([6]).map((v, i) =>Math.round(([2, 2, 2, 1, 1, 1][i] * Math.random() - [.5, .5, .5, 0, 0, 0][i]) * (restart / restartmax) * 5 * [1, 1, .5, .5, .5, .5][i]));
					var f = (x, p) =>(p[0] + p[1] * x + p[2] * x * x) / (p[3] + p[4] * x + p[5] * x * x);
					var maxtime = 30;
					for (var search = 0; search <= maxtime; search++) {
						var candidates = [];
						for (var i = 0; i < eye.length; i++) {
							candidates.push(math.add(param, eye[i]));
							candidates.push(math.subtract(param, eye[i]));
						}
						if (Math.max(...param.map(Math.abs)) > 10) break;
						var diffs = candidates.map(v=>diff(f, points, v));
						var best = Math.min(...diffs);
						var bestindex = diffs.indexOf(best);
						var param = candidates[bestindex];
						if (typeof (param) == 'undefined') { console.log(candidates, diffs, best); console.trace(); end }
						//if (diff(f, points, param) < .005) return param;
						if (diff(f, points, param) < .1) return param;
					}
				}
				return [0, 0, 0, 1, 0, 0];
				function diff(f, points, p) {
					var ys = points.map(xy=>[xy[1], f(xy[0], p)])
					var d0 = ys.map(pair =>1 / pair[0] == 0 && 1 / pair[1] == 0 ? 0 : isNaN(pair[0]) && isNaN(pair[1]) ? 0 : pair[0] - pair[1]);
					var d = d0.map(x=>x * x);
					d = d.map(x=>1 / x == 0 ? 1 : x);
					d = d.map(x=>isNaN(x) ? 1 : x);
					d = Math.sqrt(math.sum(...d));
					if (isNaN(d)) { console.log('disNaN', p, d0, y, y1); end }
					return d;
				}
			},
			decodernum: [[0,0],[1,0],[2,0]],
			decoderden: [0,0,0,[0,0],[1,0],[2,0]]
		}
	}

	static laurent22() {	//	ax^-2+bx^-1+c+dx+ex²
		var power = 2;
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				var b = y;
				return [A, b];
				function makeA(xs) {
					var AT = [];
					if (xs.length == 0) {
						AT.push(xs.ones);
					} else if (xs.length == 1) {
						AT = AT.concat(makepowercols(xs[0]));
					}
					return math.transpose(AT);
					function coltimescol(col1, col2) {
						var ret = [];
						for (var i = 0; i < col1.length; i++)
							ret.push(col1[i] * col2[i]);
						return ret;
					}
					function makepowercols(x) {
						var cols = [];
						for (var p = -power; p <= power; p++) cols.push(x.map(xi=>math.pow(xi, p)));
						return cols;
					}
				}
			},
			decoder: [[-2,0],[-1,0],[0,0],[1,0],[2,0]]
		};
	}

	static poly32() {	//	a+bx+cx²+dx³ + ey+fxy+gx²y+hx³y + iy²+jxy²+kx²y²+lx³y² + my³+nxy³+ox²y³+px³y³
		var power = 3;
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				var b = y;
				return [A, b];
				function makeA(xs) {
					var AT = [];
					if (xs.length == 0) {
						AT.push(xs.ones);
					} else if (xs.length == 1) {
						AT = AT.concat(makepowercols(xs[0]));
					} else if (xs.length == 2) {
						for (var i = 0; i <= power; i++) {
							AT = AT.concat(makepowercols(xs[0]).map(x=>coltimescol(x, xs[1].map(xi=>math.pow(xi, i)))));
						}
					}
					return math.transpose(AT);
					function coltimescol(col1, col2) {
						var ret = [];
						for (var i = 0; i < col1.length; i++)
							ret.push(col1[i].mul(col2[i]));	//	2018.8	* -> mul for fraction
						return ret;
					}
					function makepowercols(x) {
						var cols = [];
						for (var p = 0; p <= power; p++) cols.push(x.map(xi=>math.pow(xi, p)));
						return cols;
					}
				}
			},
			decoder: [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2],[2,2],[3,2],[0,3],[1,3],[2,3],[3,3]]
		};
	}

	static poly22() {	//	a+bx+cx² + dy+exy+fx²y + gy²+hxy²+ix²y²
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				var b = y
				return [A, b];
				function makeA(xs) {
					var AT = [];
					if (xs.length == 0) {
						AT.push(xs.ones);
					} else if (xs.length == 1) {
						AT = AT.concat(makepowercols(xs[0]));
					} else if (xs.length == 2) {
						AT = AT.concat(makepowercols(xs[0]));
						AT = AT.concat(makepowercols(xs[0]).map(x=>coltimescol(x, xs[1])));
						AT = AT.concat(makepowercols(xs[0]).map(x=>coltimescol(x, xs[1].map(xi=>math.pow(xi, 2)))));
					}
					return math.transpose(AT);
					function coltimescol(col1, col2) {
						var ret = [];
						for (var i = 0; i < col1.length; i++)
							ret.push(col1[i] * col2[i]);
						return ret;
					}
					function makepowercols(x) {
						var cols = [];
						for (var power = 0; power <= 2; power++) cols.push(x.map(xi=>math.pow(xi, power)));
						return cols;
					}
				}
			},
			decoder: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]]
		};
	}

	static poly12() {	//	a+bx+cy
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				var b = y;
				return [A, b];
				function makeA(xs) {
					var ones = Array(xs[0].length).fill(1);
					var AT = [ones].concat(xs);
					var A = math.transpose(AT);
					return A;
				}
			},
			decoder: [[0,0],[1,0],[0,1]]
		};
	}

	static poly21() {	//	a+bx+cx²
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				var b = y;
				return [A, b];
				function makeA(xs) {
					var AT = [];
					for (var power = 0; power <= 2; power++) AT.push(xs[0].map(xi=>math.pow(xi, power)));
					return math.transpose(AT);
				}
			},
			decoder: [[0,0],[1,0],[2,0]]
		};
	}

	static laurent25() {	//	ax^-2+bx^-1+c+dx+ex²+fx^3+gx^4+hx^5
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				var b = y;
				return [A, b];
				function makeA(xs) {
					var AT = [];
					for (var power = -2; power <= 5; power++) AT.push(xs[0].map(xi=>math.pow(xi, power)));
					return math.transpose(AT);
				}
			},
			decoder: [[-2,0],[-1,0],[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]]
		};
	}

	static laurent21() {	//	ax^-2+bx^-1
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				var b = y;
				return [A, b];
				function makeA(xs) {
					var AT = [];
					for (var power = -2; power <= -1; power++) AT.push(xs[0].map(xi=>math.pow(xi, power)));
					return math.transpose(AT);
				}
			},
			decoder: [[-2,0],[-1,0]]
		};
	}

	static poly01() {	//	a
		return {
			tomatrix: function (xs, y) {
				var A = makeA(xs);
				var b = y;
				return [A, b];
				function makeA(xs) {
					var AT = [];
					for (var power = 0; power <= 0; power++) AT.push(xs[0].map(xi=>math.pow(xi, power)));
					return math.transpose(AT);
				}
			},
			decoder: [[0,0]]
		};
	}

}