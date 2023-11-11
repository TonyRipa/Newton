
/*
	Author:	Anthony John Ripa
	Date:	11/10/2023
	Newton:	An A.I. for Math
*/

class Newton {

	static preprocess(input) {
		let ret = input
		ret = ret.replace(/exp\((-?\d*\w)\)/,'(1+($1)+($1)^2/2+($1)^3/6+($1)^4/24+($1)^5/120)')
		ret = ret.replace(/cosh\((-?\d*\w)\)/,'(1+($1)^2/2+($1)^4/24)')
		ret = ret.replace(/sinh\((-?\d*\w)\)/,'(($1)+($1)^3/6+($1)^5/120)')
		ret = ret.replace(/cos\((-?\d*\w)\)/,'(1-($1)^2/2+($1)^4/24)')
		ret = ret.replace(/sin\((-?\d*\w)\)/,'(($1)-($1)^3/6+($1)^5/120)')
		return ret
	}

	static simplify(input) {
		let p = new polynomialratio1().parse(Newton.preprocess(input))
		return exp(p) ?? p.toString()
		function exp(p) {
			if (p.pv.num.terms()<3) return p.toString()
			let x = p.base
			let s = p.pointtimes(new polynomialratio1().parse(`1+${x}+2${x}^2+6${x}^3+24${x}^4+120${x}^5`))
			if (s.pv.num.terms() == 2) {	//	+2023.11
				let b = s.pv.den.get(1)
				let ab = s.pv.num.get(1)
				let a = ab.divide(b)
				let c = s.pv.num.get(0).sub(a)
				return `${coef(a)} + ${coef(c)}exp(${coef(b.negate())}${x})`
			}
			if (s.pv.num.is1term()) {
				if (s.pv.num.isconst() && s.pv.den.len()<3) return `${coef(s.pv.num.get(0))}exp(${coef(s.pv.den.get(1).negate())}${x})`
				let ish = s.pv.den.get(2).times(s.pv.den.get(0)).isneg()
				let sign = (ish == s.pv.den.get(2).isneg()) ? '' : '-'
				let h = ish ? 'h' : ''
				let co = s.pv.den.get(2).abs().sqrt()
				if (!s.pv.num.get(0).is0()) return `${sign}${coef(s.pv.num.get(0)           )}cos${h}(${coef(co)}${x})`
				if (!s.pv.num.get(1).is0()) return `${sign}${coef(s.pv.num.get(1).divide(co))}sin${h}(${coef(co)}${x})`
			}
			function coef(c) {
				c = c.toString(false,true)
				if (c==1) return ''
				if (c==-1) return '-'
				return c
			}
		}
	}

}
