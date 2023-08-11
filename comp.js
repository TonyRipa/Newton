
/*
	Author:	Anthony John Ripa
	Date:	8/10/2023
	Comp:	A complex number library
*/

class Comp {

	constructor() {
		this.polar = true
		if (arguments.length == 0) this.val = [0,0]
		if (arguments.length == 1) {
			if (arguments[0] instanceof math.Complex) {
				this.val = [arguments[0].re,arguments[0].im]
				this.polar = false
			} else {
				this.val = [arguments[0],0]
			}
		}
		if (arguments.length >= 2) this.val = [arguments[0],arguments[1]]
		if (arguments.length == 3) this.polar = arguments[2]
	}

	clone() {
		let ret = new Comp()
		ret.polar = this.polar
		ret.val = [...this.val]
		return ret
	}

	standardize() {
		let ret = this.clone()
		if (!ret.polar) return ret
		while (ret.val[1] >= 1) {
			ret.val[1] -= 1
		}
		if (ret.val[1] >= 1/2) {
			ret.val[0] = -ret.val[0]
			ret.val[1] -= 1/2
		}
		return ret
	}

	negate() {
		return new Comp(-this.val[0],this.val[1]).standardize()
	}

	add(other) {
		if (!(other instanceof Comp)) other = new Comp(other)
		let [me,he] = [this.standardize(),other.standardize()]
		if (me.polar && he.polar) {
			if (me.val[1]==he.val[1]) {
				return new Comp(me.val[0]+he.val[0], me.val[1])
			}
			if (he.val[0]==0) {
				return me
			}
			if (me.val[0]==0) {
				return he
			}
		}
		return new Comp(me.toComplex().add(he.toComplex()))
	}

	sub(other) {
		if (!(other instanceof Comp)) other = new Comp(other)
		let [me,he] = [this.standardize(),other.standardize()]
		if (me.polar && he.polar) {
			if (me.val[1]==he.val[1]) {
				return new Comp(me.val[0]-he.val[0], me.val[1])
			}
		}
		return new Comp(me.toComplex().sub(he.toComplex()))
	}

	times(other) {
		if (!(other instanceof Comp)) other = new Comp(other)
		if (this.polar && other.polar) {
			return new Comp(this.val[0]*other.val[0],this.val[1]+other.val[1])
		} else {
			return new Comp(this.toComplex().mul(other.toComplex()))
		}
	}

	divide(other) {
		if (!(other instanceof Comp)) other = new Comp(other)
		if (this.polar && other.polar) {
			return new Comp(this.val[0]/other.val[0],this.val[1]-other.val[1])
		} else {
			return new Comp(this.toComplex().div(other.toComplex()))
		}
	}

	pow(other) {
		if (!(other instanceof Comp)) other = new Comp(other)
		if (this.polar && other.polar) {
			return new Comp(this.val[0]**other.val[0],this.val[1]*other.val[0])
		} else {
			return new Comp(this.toComplex().pow(other.toComplex()))
		}
	}

	toComplex() {
		if (!this.polar) return new math.complex(...this.val)
		return new math.complex({r:this.val[0],phi:this.val[1]*2*math.pi})
	}

	toString() {
		return this.val[0]
	}

}
