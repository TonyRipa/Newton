
/*
	Author:	Anthony John Ripa
	Date:	8/10/2023
	Newton:	An A.I. for Math
*/

class Newton {

	constructor(input) {
		this.input = input
	}

	parse() {
		if (this.parsed == undefined) this.parsed = math.parse(this.input)
		return this.parsed
	}

	fourier(n = 4) {
		if (n == 1) return [this.eval(new Comp(1,0))]
		if (n == 2) return [this.eval(new Comp(1,0)),this.eval(new Comp(1,1/2))]
		if (n == 3) return [this.eval(new Comp(1,0)),this.eval(new Comp(1,1/3)),this.eval(new Comp(1,2/3))]
		if (n == 4) return [this.eval(new Comp(1,0)),this.eval(new Comp(1,1/4)),this.eval(new Comp(1,2/4)),this.eval(new Comp(1,3/4))]
	}

	static ifourier(arr) {
		console.log(arr)
		if (arr.length == 1) return arr[0]
		if (arr.length == 2) return arr[0].add(arr[1]).divide(2) + ' + ' + arr[0].sub(arr[1]).divide(2) + 'x'
		if (arr.length == 3) return arr[0].add(arr[1]).add(arr[2]).divide(3) + ' + ' +
			arr[0].add(arr[1].times(new Comp(1,2/3))).add(arr[2].times(new Comp(1,1/3))).divide(3) + 'x + ' + 
			arr[0].add(arr[1].times(new Comp(1,1/3))).add(arr[2].times(new Comp(1,2/3))).divide(3) + 'x²'
		if (arr.length == 4) return arr[0].add(arr[2]).add(arr[1].add(arr[3])).divide(4) + ' + ' +
			arr[0].add(arr[2].times(new Comp(1,2/4))).add(arr[1].times(new Comp(1,3/4))).add(arr[3].times(new Comp(1,1/4))).divide(4) + 'x + ' +
			arr[0].add(arr[2].times(new Comp(1,4/4))).add(arr[1].times(new Comp(1,2/4))).add(arr[3].times(new Comp(1,2/4))).divide(4) + 'x² + ' +
			arr[0].add(arr[2].times(new Comp(1,2/4))).add(arr[1].times(new Comp(1,1/4))).add(arr[3].times(new Comp(1,3/4))).divide(4) + 'x³'
	}

	eval(value) {
		if (!(value instanceof Comp)) value = new Comp(value)
		return Newton.evalh(this.parse(), value)
	}

	static evalh(node, value) {
		if (node.type == 'SymbolNode') {
			console.log('SymbolNode')
			return value
		} else if (node.type == 'OperatorNode') {
			console.log('OperatorNode')
			var kids = node.args;
			var a = this.evalh(kids[0], value);
			if (node.fn == 'unaryMinus') {
				console.log(a)
				var c = a.negate()
				console.log(a)
				console.log(c)
			} else if (node.fn == 'unaryPlus') {
				var c = a
			} else {
				var b = this.evalh(kids[1], value)
				var c = (node.op == '+') ? a.add(b) : (node.op == '-') ? a.sub(b) : (node.op == '*') ? a.times(b) : (node.op == '/') ? a.divide(b) : (node.op == '|') ? a.eval(b) : a.pow(b);
			}
			return c
		} else if (node.type == 'ConstantNode') {
			console.log('ConstantNode: ' + node.value)
			return new Comp(Number(node.value))
		} else if (node.type == 'ParenthesisNode') {
			return this.evalh(node.content, value)
		} else {
			alert('othertype')
		}
	}

	simplify() {
		return Newton.ifourier(this.fourier())
	}

}
