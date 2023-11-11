
// Author:  Anthony John Ripa
// Date:    11/10/2023
// PlaceValueRatio: a datatype for representing base agnostic arithmetic via ratios of WholePlaceValues

class placevalueratio {					//	+2023.5

	//function placevalueratio(arg) {	//	-2023.5
	constructor(arg) {					//	+2023.5
		var num, den;
		if (arguments.length == 0)[num, den] = [new wholeplacevalue(rational), new wholeplacevalue(rational).parse(1)];                 //  2018.2
		if (arguments.length == 1) {
			if (arg === rational || arg === rationalcomplex)[num, den] = [new wholeplacevalue(arg), new wholeplacevalue(arg).parse(1)]; //  2018.2 rationalcomplex
			//else[num, den] = [arg, new wholeplacevalue(arg.datatype)];			//	-2023.5
			else [num, den] = [arg, new wholeplacevalue(arg.datatype).parse(1)];	//	+2023.5
		}
		if (arguments.length == 2)[num, den] = arguments;
		if (!(num instanceof wholeplacevalue)) { var s = 'placevalueratio expects arg 1 to be a wholeplacevalue but found ' + typeof num + ' ' + JSON.stringify(num); alert(s); throw new Error(s); }
		if (!(den instanceof wholeplacevalue)) { var s = 'placevalueratio expects arg 2 to be a wholeplacevalue but found ' + typeof num + ' ' + JSON.stringify(num); alert(s); throw new Error(s); }
		this.num = num;
		this.den = den;
		this.reduce();
		console.log('this.num = ' + this.num + ', this.den = ' + this.den + ', den = ' + den + ', arguments.length = ' + arguments.length + ", Array.isArray(num)=" + Array.isArray(num));
	}

	parse(man) {    // 2017.9
		if (man instanceof String || typeof (man) == 'string') if (man.indexOf('num') != -1) {
			var a = JSON.parse(man);
			var ret = new placevalueratio(this.num.parse(JSON.stringify(a.num)), this.num.parse(JSON.stringify(a.den)));
			if (!(this.num.datatype == ret.num.datatype)) { var s = "placevalueratio.parse's arg different digit datatype\n" + this.num.datatype + '\n' + ret.num.datatype; alert(s); throw new Error(s); } //  2018.2
			return ret;
		}    //  2017.10
		var den = 0;
		if (typeof (man) == "number") man = man.toString();     // 2015.11
		if (typeof (man) == "string" && man.indexOf('num') != -1) {
			console.log("new placevalueratio : arg is stringified placevalueratio");
			var ans = JSON.parse(man);
			man = ans.num;
			den = ans.den;
		} else if (man instanceof Object && JSON.stringify(man).indexOf('num') != -1) {   // 2015.8
			console.log("new placevalueratio : arg is placevalueratio");
			den = man.den;  // get den from man before
			man = man.num;  // man overwrites self 2015.8
		}
		var slashindex = findslash(man);
		if (slashindex == -1) {
			var num = this.num.parse(man);
			var den = this.num.parse(1);
		} else {
			var num = this.num.parse(man.substr(0, slashindex));
			var den = this.num.parse(man.substr(slashindex + 1));
		}
		return new placevalueratio(num, den);
		function findslash(x) { //  2016.7
			var depth = 0;
			for (var i = 0; i < x.length; i++) {
				if (x[i] == '/' && depth == 0) return i;
				if (x[i] == '(') depth++;
				if (x[i] == ')') depth--;
			}
			return -1;
		}
	}

	tohtml(short) {       // Long and Short HTML  2015.11
		if (short) return this.toString(true);
		//return this.num.toString(true) + ' / ' + this.den;      // Replaces toStringInternal 2015.7	//	-2023.5
		return this.num.toString(true) + ' / ' + this.den + ' = ' + this.num.divideleft(this.den);		//	+2023.5
	}

	toString(sTag) {      //  sTag    2015.11
		return this.den.toString() === '1' ? this.num.toString() : this.num.toString() + "/" + this.den.toString();
	}

	reduce() {            //  2016.5

		if (this.isNaN()) fixnan(this);                         //  2018.3
		circumfixEuclid(this);
		pulloutcommonconstants(this);

		function fixnan(me) {                                   //  2018.3
			me.num = me.num.parse(0);
			me.den = me.den.parse(0);
		}

		function circumfixEuclid(me) {
			var n = me.num.gcd();
			var d = me.den.gcd();//alert(JSON.stringify([n,d]))
			me.num = me.num.unscale(n);
			me.den = me.den.unscale(d);
			euclid(me);
			me.num = me.num.scale(n);
			me.den = me.den.scale(d);
		}

		function euclid(ratio) {
			var g = gcdpv(ratio.num, ratio.den);
			if (g.mantisa.length == 1) return;
			ratio.num = ratio.num.divide(g);
			ratio.den = ratio.den.divide(g);
		}

		function pulloutcommonconstants(me) {
			if (me.num.is0() && me.den.is0()) return;
			if (me.num.is0()) { me.den = me.num.parse(1); return }
			if (me.den.is0()) { me.num = me.num.parse(1); return }
			var num = me.num//.scale(2 * 3 * 4 * 5 * 6 * 7 * 8 * 9 * 10).round();   // Large Composite
			var den = me.den;
			var n = num.gcd();
			var d = den.gcd();
			var g = n.gcd(d);   // delegate to digits   2016.7
			me.num = num.unscale(g);
			me.den = den.unscale(g);
		}

		function gcdpv(a, b) {
			if (a.get(a.mantisa.length - 1).isneg() && b.get(b.mantisa.length - 1).ispos()) return gcdpv(a.negate(), b);
			if (a.is0()) return b;
			if (b.is0()) return a;
			if (a.mantisa.length > b.mantisa.length) return gcdpv(a.remainder(b), b);
			return gcdpv(b.remainder(a), a);
		}
	}

	isconst() { return this.num.isconst() && this.den.isconst(); }	//	+2023.8
	isNaN() { return this.num.isNaN() || this.den.isNaN(); }  //  2018.3

	add(addend) {
		if (!(this.num.datatype == addend.num.datatype)) { var s = "placevalueratio.add's arg (placevalueratio) different digit datatype\n" + this.num.datatype + '\n' + addend.num.datatype; alert(s); throw new Error(s); } //  2018.2
		return new placevalueratio(this.num.times(addend.den).add(addend.num.times(this.den)), this.den.times(addend.den));
	}

	sub(subtrahend) {
		return new placevalueratio(this.num.times(subtrahend.den).sub(subtrahend.num.times(this.den)), this.den.times(subtrahend.den));
	}

	pointsub(other) {
		var first = this.num.div10s(this.den.mantisa.length - 1);
		var second = other.num.div10s(other.den.mantisa.length - 1);
		return new placevalueratio(first.pointsub(second), this.num.parse(1));
	}

	pointadd(other) {
		var first = this.num.div10s(this.den.mantisa.length - 1);
		var second = other.num.div10s(other.den.mantisa.length - 1);
		return new placevalueratio(first.pointadd(second), this.num.parse(1));
	}

	//placevalueratio.prototype.pointtimes = function (other) {	//	-2023.5
	//	var first = this.num.div10s(this.den.mantisa.length - 1);
	//	var second = other.num.div10s(other.den.mantisa.length - 1);
	//	return new placevalueratio(first.pointtimes(second), this.num.parse(1));
	//}

	pointtimes(other) {	//	+2023.5
		var first = this.num.divideleft(this.den);
		var second = other.num.divideleft(other.den);
		return new placevalueratio(first.pointtimes(second), this.num.parse(1)).factor();
	}

	pointdivide(other) {
		var first = this.num.div10s(this.den.mantisa.length - 1);
		var second = other.num.div10s(other.den.mantisa.length - 1);
		return new placevalueratio(first.pointtimes(second), this.num.parse(1));
	}

	pointpow(other) {	// 2015.12
		var first = this.num.div10s(this.den.mantisa.length - 1);
		var second = other.num.div10s(other.den.mantisa.length - 1);
		return new placevalueratio(first.pointpow(second), this.num.parse(1));
	}

	pow(power) {	// 2015.8
		if (power instanceof placevalueratio) power = power.num;
		if (!(power instanceof wholeplacevalue)) power = this.num.parse('(' + power + ')');  // 2015.11
		var pow = power.get(0).abs();	//	-2020.5
		var pow = power;				//	+2020.5
		if (power.get(0).ispos()) return new placevalueratio(this.num.pow(pow), this.den.pow(pow));
		return new placevalueratio(this.den.pow(pow), this.num.pow(pow));
		//if (power.get(0).isneg()) return (new placevalueratio(wholeplacevalue.parse(1), 0)).divide(this.pow(new placevalueratio(new wholeplacevalue([power.get(0).negate()]), 0))); // 2015.8 //  Add '(' for 2 digit power   2015.12
		//var num = this.num.pow(power);
		//var den = this.den.pow(power);
		//return new placevalueratio(num, den);
	}

	times(top) {
		return new placevalueratio(this.num.times(top.num), this.den.times(top.den))
	}

	scale(scalar) {   // 2015.11
		var num = this.num.scale(scalar);
		return new placevalueratio(num, this.den);
	}

	divide(denominator) {
		return new placevalueratio(this.num.times(denominator.den), this.den.times(denominator.num));
	}

	dividemiddle(denominator) {    // 2016.5
		return new placevalueratio(this.num.times(denominator.den), this.den.times(denominator.num));
	}

	divideleft(denominator) {      // 2016.5
		return new placevalueratio(this.num.times(denominator.den), this.den.times(denominator.num));
	}

	remainder(denominator) {		//	2019.4
		return this.sub(this.divide(denominator).times(denominator));
	}

	clone() {
		return new placevalueratio(this.num.clone(), this.den.clone());
	}

	reciprocal() {
		var temp = this.num;
		this.num = this.den;
		this.den = temp;
	}

	eval(base) {
		if (!(base instanceof this.constructor)) base = this.parse('('+base+')');	//	+2023.5
		if (base.num.is0()) return new placevalueratio(new wholeplacevalue([this.num.get(0)]), new wholeplacevalue([this.den.get(0)]));
		var num = new placevalueratio(this.num.parse(0), this.num.parse(1));
		for (var i = 0; i < this.num.mantisa.length; i++) {
			if (!this.num.get(i).is0()) num = num.add(base.pow(i).scale(this.num.get(i)));
		}
		var den = new placevalueratio(this.num.parse(0), this.num.parse(1));
		for (var i = 0; i < this.den.mantisa.length; i++) {
			if (!this.den.get(i).is0()) den = den.add(base.pow(i).scale(this.den.get(i)));
		}
		return num.divide(den);
	}

	evalfull(base) {	//	+2023.7
		let eva = this.eval(base)
		let ratio = eva.num.divide(eva.den)
		return ratio.get(0)
	}

	factor() {	//	+2023.11
		let n = this.num.clone()
		let d = this.den.clone()
		let power = 0
		while (n.get(0).is0()) {
			n.div10()
			power++
		}
		if (n.len() < 4) return this.clone()
		if (d.len() > 1) return this.clone()
		let r = n.reciprocal()
		let q = n.divide(d)
		if (r.len() <= 4) return this.parse('('+q.get(0)+')E'+power+'/('+q.get(1).times(q.get(1)).divide(q.get(0)).sub(q.get(2)).divide(q.get(0))+')('+q.get(1).divide(q.get(0)).negate()+')(1)')
		if (f1(this,q)) return f1(this,q)	//	+2023.11
		return this.clone()
		function f1(me, q) {				//	+2023.11
			//	a + c/(1-bx)
			let len = q.len()
			if (len<3) return false
			let b = q.get(2).divide(q.get(1))
			for (let i = 1 ; i < len-1 ; i++)
				if (!(q.get(i).times(b).equals(q.get(i+1)))) return false
			let c = q.get(1).divide(b)
			let a = q.get(0).sub(c)
			let n = q.parse('('+a.times(b).negate()+')('+a.add(c)+')')
			let d = q.parse('('+b.negate()         +')(1)')
			return new me.constructor(n,d)
		}
	}

/*	//	-2023.11
	factor() {	//	+2023.5
		//if (this.num.len() < 5) return this.clone()										//	-2023.7
		if (this.num.len() < 4) return this.clone()											//	+2023.7
		if (this.den.len() > 1) return this.clone()
		let r = this.num.reciprocal()
		//if (r.len() <= 3 && !r.is0()) return new placevalueratio(this.num.parse(1 ),r)	//	-2023.7
		if (r.len() <= 4 && !r.is0()) return new placevalueratio(this.num.parse(1 ),r)		//	+2023.7
		r = this.num.parse(10).divideleft(this.num)
		if (r.len() <= 3 && !r.is0()) return new placevalueratio(this.num.parse(10),r)
		return this.clone()
	}
*/

}
