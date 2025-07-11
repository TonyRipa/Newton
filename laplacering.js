
// Author:	Anthony John Ripa
// Date:	7/10/2025
// LaplaceRing: a datatype for representing the Laplace Transform

class laplacering extends abstractpolynomial {

	constructor(arg) {
		var arr, base
		if (arguments.length == 0) [base,arr] = ['x',[]]
		if (arguments.length == 1) [base,arr] = Array.isArray(arg) ? ['x',arg] : [arg,[]]
		if (arguments.length == 2) [base,arr] = arguments;
		super()
		arr = normal(arr)
		arr = trim(arr)
		this.arr = arr
		this.base = base
		function normal(points) {
			type(points)
			sort(points)
			combineliketerms(points)
			return points
			function type(list) {
				for (var i = 0; i < list.length; i++) {
					list[i] = list[i].map(x => x instanceof complex ? x : complex.parse(x))
				}
			}
			function sort(list) {
				for (var i = 0; i < list.length; i++)
					for (var j = 0; j < list.length; j++)
						if (list[i][1].below(list[j][1])) {
							var temp = list[i]
							list[i] = list[j]
							list[j] = temp
						} else if (list[i][1].equal(list[j][1]) && list[i][2].below(list[j][2])) {
							var temp = list[i]
							list[i] = list[j]
							list[j] = temp
						}
			}
			function combineliketerms(list) {
				var i = list.length - 1;
				while (i > 0)
					if (list[i][1].equals(list[i - 1][1]) && list[i][2].equals(list[i - 1][2])) {
						list[i][0] = list[i][0].add(list[i - 1][0]);
						list.splice(i - 1, 1);
						i--;
					} else i--;
			}
		}
		function trim(points) {
			for (var i = points.length - 1; i >= 0; i--)
				if (points[i][0].is0()) points.splice(i, 1)
			if (points.length == 0) points = [[new complex(0),new complex(0),new complex(1)]]
			return points;
		}
	}

	parseS(str) {
		let terms = str.replace(/\(s\+/g, '(sp').replace(/\(s-/g, '(sm').replace(/\^-/g, 'pm').replace(/-/g, '+-')
		terms = terms.split('+')
		terms = terms.map(term=>term.replace(/\(sp/g, '(s+').replace(/\(sm/g, '(s-').replace(/pm/g, '^-'))
		terms = terms.map(processterm)
		return new this.constructor(this.base,terms)
		function processterm(term) {
			let [num,den] = term.split('/')
			let c = num
			let a = geta(den)
			let p = getpower(den)
			return [c,a,p]
			function geta(den) {
				if (den === undefined) return 0
				if (den.includes('^')) den = den.split('^')[0]
				if (den[0]=='(') den = den.slice(1,-1)
				if (den[0]=='s') den = den.slice(1)
				if (den[0]=='-') return den.slice(1)
				if (den[0]=='+') return '-' + den.slice(1)
				return den
			}
			function getpower(den) {
				if (den === undefined) return 0
				if (!den.includes('^')) return 1
				return den.split('^')[1]
			}
		}
	}

	parse(strornode) {
		try { strornode = new polynomialratio1().parse(strornode,true).toString() } catch(e) {}
		console.log('<strornode>')
		console.log(strornode)
		console.log('</strornode>')
		var node = (strornode instanceof String || typeof (strornode) == 'string') ? math.parse(strornode == '' ? '0' : strornode.replace('NaN', '(0/0)').replace(/(')\1*/g, x=>x.length)) : strornode
		console.log('<node>')
		console.log(node)
		console.log('</node>')
		if (node.type == 'SymbolNode') {
			console.log('SymbolNode')
			if (node.name.match(complex.regexfull())) {
				return new this.constructor(1,[[complex.parse(node.name),new complex(0),new complex(1)]])
			} else {
				return new this.constructor(node.name,[[new complex(1),new complex(0),new complex(2)]])
			}
		} else if (node.type == 'OperatorNode') {
			console.log('OperatorNode')
			var kids = node.args
			var a = this.parse(kids[0])
			if (node.fn == 'unaryMinus') {
				var c = a.negate()
			} else if (node.fn == 'unaryPlus') {
				var c = a
			} else {
				var b = this.parse(kids[1])
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '^') ? a.pow(b) : a.pow(b)
			}
			return c
		} else if (node.type == 'ConstantNode') {
			console.log('ConstantNode: ' + node.value)
			return new this.constructor(1,[[new complex(Number(node.value)),new complex(0),new complex(1)]])
		} else if (node.type == 'ParenthesisNode') {
			return this.parse(node.content)
		} else if (node.type == 'FunctionNode') {
			console.log('FunctionNode: ' + node.type + " : " + JSON.stringify(node))
			console.log(node)
			var fn = node.name
			if (fn == 'exp' | fn == 'cosh' | fn == 'sinh' | fn == 'δ' | fn == 'δ1' | fn == 'δ2') var ior1 = 1
			if (fn == 'cis' | fn == 'cos' | fn == 'sin') var ior1 = 'i'
			if (!ior1) { var s = 'Syntax Error: laplacering expects input like 1, exp(x), cos(x), sinh(x), cis(2x), or 1+sin(x) but found ' + node.name + '.'; alert(s); throw new Error(s) }
			var kids = node.args
			var kidaspoly = new polynomial1(complex).parse(kids[0])
			var base = kidaspoly.base
			var exp = kidaspoly.pv.scale(ior1)
			var exp2 = exp.pow(-1)
			if (fn == 'exp' | fn == 'cis') var points = [[1,exp.get(1),1]]
			if (fn == 'cosh' | fn == 'cos') var points = [[1/2,exp.get(1),1],[1/2,exp.get(1).negate(),1]]
			if (fn == 'sinh') var points = [[1/2,exp.get(1),1],[-1/2,exp.get(1).negate(),1]]
			if (fn == 'sin') var points = [['-.5i',exp.get(1),1],['.5i',exp.get(1).negate(),1]]
			if (fn == 'δ') var points = [[1,0,0]]
			if (fn == 'δ1') var points = [[1,0,-1]]
			if (fn == 'δ2') var points = [[1,0,-2]]
			return new this.constructor(base,points);
		} else {
			alert('Laplacering.parse othertype : ' + typeof node);
		}
	}

	align(other) {
		if ( this.arr.length == [] ||  this.base == 1) this.base = other.base;
		if (other.arr.length == [] || other.base == 1) other.base = this.base;
		if (this.base != other.base) { alert('Different bases : ' + this.base + ' & ' + other.base); return new this.constructor(1, [[new complex(0/0),0,0]]) }
	}

	negate() {
		return new this.constructor(this.base,this.arr.map(cap=>[cap[0].negate(),cap[1],cap[2]]))
	}

	add(other) {
		this.align(other)
		return new this.constructor(this.base,[...this.arr,...other.arr])
	}

	sub(other) {
		this.align(other)
		return this.add(other.negate())
	}

	times(other) {
		this.align(other)
		let ret = []
		for (let i = 0 ; i < this.arr.length ; i++ ) {
			let p1 = this.arr[i]
			let n1 = p1[2].dec()
			for (let j = 0 ; j < other.arr.length ; j++ ) {
				let p2 = other.arr[j]
				let n2 = p2[2].dec()
				let n = n1.add(n2)
				let f = n.fact().divide(n1.fact()).divide(n2.fact())
				ret.push([f.times(p1[0]).times(p2[0]),p1[1].add(p2[1]),n.inc()])
			}
		}
		return new this.constructor(this.base,ret)
	}

	divide(other) {
		this.align(other)
		if (other.arr.length>1) return new this.constructor(1, [[new complex(0/0),0,1]])
		let ret = []
		for (let i = 0 ; i < this.arr.length ; i++ ) {
			let p1 = this.arr[i]
			let n1 = p1[2].dec()
			for (let j = 0 ; j < other.arr.length ; j++ ) {
				let p2 = other.arr[j]
				let n2 = p2[2].dec()
				let n = n1.sub(n2)
				let f = n.fact().divide(n1.fact()).divide(n2.fact())
				ret.push([f.times(p1[0]).times(p2[0]),p1[1].sub(p2[1]),n.inc()])
			}
		}
		return new this.constructor(this.base,ret)
	}

	pow(other) {
		this.align(other)
		if (other.arr.length == 0) return new this.constructor(this.base,[[new complex(1)  ,0,1]])
		if (other.arr.length >  1) return new this.constructor(this.base,[[new complex(0/0),0,1]])
		let p = other.arr[0]
		if (!p[1].is0() || !p[2].is1()) return new this.constructor(1, [[new complex(0/0),0,1]])
		if (p[0].is0()) return new this.constructor(this.base,[[new complex(1),0,1]])
		return this.times(this.pow(new other.constructor(other.base,[[p[0].dec(),p[1],p[2]]])))
	}

	eval(base) {
		return math.evaluate(this.toString(),{[this.base]:base.toString()})
	}

	toStringS() {
		let ret = ''
		for (let i = 0 ; i < this.arr.length ; i++) {
			let point = this.arr[i]
			if (point[0].is0()) { ret += '+0' }
			else if (point[1].is0() && point[2].is1()) ret += '+' + point[0].toString(false,true) + '/s'
			else if (point[2].is1()) ret += '+' + point[0].toString(false,true) + '/(s-' + point[1].toString(false,true) + ')'
			else if (point[1].is0()) ret += '+' + point[0].toString(false,true) + '/s^' + point[2].toString(false,true)
			else ret += '+' + point[0].toString(false,true) + '/(s-' + point[1].toString(false,true) + ')^' + point[2].toString(false,true)
		}
		return ret.substr(1).replace(/\+\-/g, '-').replace(/--/g, '+')
	}

	toString0() {
		let b = this.base
		let arr = this.arr.map(frac2lap)
		return math.simplify(arr.join('+')).toString()
		function frac2lap(frac) {
			let n = frac[2].dec()
			let c = frac[0].unscale(n.fact()).toString(true,true)
			let a = frac[1].toString(true,true)
			let str = c + '*exp(' + a + '*' + b + ')*' + b + '^' + n.toString(true,true)
			return math.simplify(math.parse(str)).toString()
		}
	}

	toString() {
		let b = this.base
		let ret = ''
		for (let i = this.arr.length - 1 ; i >= 0 ; i--) {
			let point = this.arr[i]
			let n = point[2].dec()
			let c = point[0].unscale(n.fact())
			let a = point[1]
			let term = []
			push(term,coef(c))
			push(term,power(b,n))
			push(term,exp(a,b))
			term = term.join('*').replace(/\*\*/g,'*')
			if (term === '') term = 1
			ret += '+' + term
		}
		if (ret == '') ret = '+0'
		return ret.substr(1).replace(/\-\*/g, '-').replace(/\+\-/g, '-').replace(/--/g, '+')
		function coef(c) {
			if (c instanceof complex && !c.isreal()) return c.toString(false,true) + '*'
			if (c instanceof rational) c = c.toString(false,true)
			return c == 1 ? '' : c.negate().is1() ? '-' : c.toString(false,true)
		}
		function sup(x) {
			if (x == 1) return '';
			return '^' + x.toString(false,true);
		}
		function exp(a, base) {
			if (a.is0()) return ''
			return 'exp(' + coef(a) + base + ')'
		}
		function power(base, n) {
			if (n.is0()) return ''
			if (n.ispos()) return b + sup(n)
			let primes = ''
			while (true) {
				n = n.inc()
				if (n.is0()) break
				primes += "'"
			}
			return 'δ' + primes + '(' + base + ')'
		}
		function push(arr,elem) { if (elem !== '') arr.push(elem) }
	}

}
