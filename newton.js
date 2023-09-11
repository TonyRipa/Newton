
/*
	Author:	Anthony John Ripa
	Date:	9/10/2023
	Newton:	An A.I. for Math
*/

class Newton {

	static preprocess(input) {
		let ret = input
		ret = ret.replace(/exp\((-?\d*)(\w)\)/,'(1+($1$2)+($1$2)^2/2+($1$2)^3/6+($1$2)^4/24)')
		ret = ret.replace(/cosh\((-?\d*)(\w)\)/,'(1+($1$2)^2/2+($1$2)^4/24)')
		ret = ret.replace(/sinh\((-?\d*)(\w)\)/,'(($1$2)+($1$2)^3/6+($1$2)^5/120)')
		ret = ret.replace(/cos\((-?\d*)(\w)\)/,'(1-($1$2)^2/2+($1$2)^4/24)')
		ret = ret.replace(/sin\((-?\d*)(\w)\)/,'(($1$2)-($1$2)^3/6+($1$2)^5/120)')
		return ret
	}

	static simplify(input) {
		let p = new polynomialratio1().parse(Newton.preprocess(input))
		return exp(p) ?? p.toString()
		function exp(p) {
			if (p.pv.num.terms()<3) return p.toString()
			let b = p.base
			let s = p.pointtimes(new polynomialratio1().parse(`1+${b}+2${b}^2+6${b}^3+24${b}^4+120${b}^5`))
			if (s.pv.num.is1term()) {
				if (s.pv.num.is1() && s.pv.den.len()<3) return `exp(${coef(s.pv.den.get(1).negate().toString(false,true))}${b})`
				let ish = s.pv.den.get(2).times(s.pv.den.get(0)).isneg()
				let sign = (ish == s.pv.den.get(2).isneg()) ? '' : '-'
				let h = ish ? 'h' : ''
				if (!s.pv.num.get(0).is0()) return `${sign}cos${h}(${coef(s.pv.den.get(2).abs().sqrt().toString(false,true))}${b})`
				if (!s.pv.num.get(1).is0()) return `${sign}sin${h}(${coef(s.pv.den.get(2).abs().sqrt().toString(false,true))}${b})`
			}
			function coef(c) {
				if (c==1) return ''
				if (c==-1) return '-'
				return c
			}
		}
	}

}
