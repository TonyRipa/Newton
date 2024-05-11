
/*
	Author:	Anthony John Ripa
	Date:	5/10/2024
	Newton:	An A.I. for Math
*/

class Newton {

	static simplify(input) {	//	+2024.4
		return Newton.poly2trig(Newton.trig2poly(input))
	}

	static trig2poly(input) {
		let ret = input
		ret = ret.replace(new RegExp(/exp\((-?\d*\w)\)/ ,'g'),'(1+($1)+($1)^2/2+($1)^3/6+($1)^4/24+($1)^5/120)')
		ret = ret.replace(new RegExp(/cosh\((-?\d*\w)\)/,'g'),'(1+($1)^2/2+($1)^4/24)')
		ret = ret.replace(new RegExp(/sinh\((-?\d*\w)\)/,'g'),'(($1)+($1)^3/6+($1)^5/120)')
		ret = ret.replace(new RegExp(/cos\((-?\d*\w)\)/ ,'g'),'(1-($1)^2/2+($1)^4/24)')
		ret = ret.replace(new RegExp(/sin\((-?\d*\w)\)/ ,'g'),'(($1)-($1)^3/6+($1)^5/120)')
		return ret
	}

	static poly2trig(input) {
		let p = new polynomialratio1().parse(input)
		return exp(p) ?? p.toString()
		function exp(p) {
			if (p.pv.num.terms()<3) return p.toString()
			let x = p.base
			let s = p.pointtimes(new polynomialratio1().parse(`1+${x}+2${x}^2+6${x}^3+24${x}^4+120${x}^5`))
			if (s.pv.num.terms() == 2) {	//	+2023.11
				if (s.pv.den.terms() == 2) {//	+2023.12
					let b = s.pv.den.get(1)
					let ab = s.pv.num.get(1)
					let a = ab.divide(b)
					let c = s.pv.num.get(0).sub(a)
					return `${coef(a)} + ${coef(c)}exp(${coef(b.negate())}${x})`					
				}
				if (s.pv.den.terms() == 3) {//	+2023.12
					let [a,b,c] = [s.pv.den.get(0),s.pv.den.get(1),s.pv.den.get(2)]
					let r1 = b.negate().add(b.times(b).sub(a.times(c).scale(4)).sqrt()).divide(a).unscale(2)
					let r2 = b.negate().sub(b.times(b).sub(a.times(c).scale(4)).sqrt()).divide(a).unscale(2)
					return `exp(${coef(r1)}${x}) + exp(${coef(r2)}${x})`					
				}
			}
			if (s.pv.num.is1term()) {
				if (s.pv.den.terms() == 2) {//	+2024.2
					if (s.pv.num.isconst() && s.pv.den.len()<3) return `${coef(s.pv.num.get(0))}exp(${coef(s.pv.den.get(1).negate())}${x})`
					let ish = s.pv.den.get(2).times(s.pv.den.get(0)).isneg()
					let sign = (ish == s.pv.den.get(2).isneg()) ? '' : '-'
					let h = ish ? 'h' : ''
					let co = s.pv.den.get(2).abs().sqrt()
					if (!s.pv.num.get(0).is0()) return `${sign}${coef(s.pv.num.get(0)           )}cos${h}(${coef(co)}${x})`
					if (!s.pv.num.get(1).is0()) return `${sign}${coef(s.pv.num.get(1).divide(co))}sin${h}(${coef(co)}${x})`					
				}
			}
			function coef(c) {
				c = c.toString(false,true)
				if (c==1) return ''
				if (c==-1) return '-'
				return c
			}
		}
	}

	static sample(exp) {
		let vars = Expression.getvars(exp)
		if (vars.length == 0) vars  = ['x']
		return vars[0] + '\n' + [0,1,2,3].map(x=>math.evaluate(exp,{[vars[0]]:x})).map(x=>x?.toString().replace('NaN','%')).join('\n')
	}

	static regress(vari,...exp) {
		return new polynomial1(vari,new wholeplacevalue(exp.map(rational.parse)).unpointeval()).toString()
	}

}
