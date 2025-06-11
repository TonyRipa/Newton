
/*
	Author:	Anthony John Ripa
	Date:	2025.05.15
	Lisp:	A Constraint Solver
*/

class Lisp {

	static toinfix(lisp) {
		let ret = ''
		switch(Lisp.type(lisp)) {
			case 'ConstantNode': return lisp.toString()
			case 'SymbolNode': return lisp
			case 'OperatorNode' : return '( ' + Lisp.toinfix(lisp[1]) + ' ) ' + lisp[0] + ' ( ' + Lisp.toinfix(lisp[2]) + ' )'
		}
		return ret
	}

	static strto(strexp) {
		if (strexp.includes('=')) {
			let [l,r] = strexp.split('=')
			l = mathto(math.parse(l))
			r = mathto(math.parse(r))
			return ['=',l,r]
		} else {
			return mathto(math.parse(strexp))
		}
		function mathto(mathexp) {
			if (mathexp.type=="ConstantNode") {
				return mathexp.value
			} else if (mathexp.type=="SymbolNode") {
				return mathexp.name
			} else if (mathexp.type=="OperatorNode") {
				if (mathexp.op=='-' && mathexp.args.length==1 && mathexp.args[0].type=="ConstantNode")
					return -mathexp.args[0].value
				return [mathexp.op,...mathexp.args.map(x=>mathto(x))]
			} else if (mathexp.type=="FunctionNode") {
				return [mathexp.fn,...mathexp.args.map(x=>mathto(x))]
			} else if (mathexp.type=="ParenthesisNode") {
				return mathto(mathexp.content)
			}
			alert('Lisp.strto.mathto Error : mathexp = ' + mathexp)
		}
	}

	static simplify(lisp, type) {
		if (Lisp.type(lisp)!='OperatorNode') return lisp
		let op = lisp[0]
		let left = Lisp.simplify(lisp[1], type)
		let right = Lisp.simplify(lisp[2], type)
		if (type == 'Boolean') {
			if (op=='+') return math.max(left,right)
			if (op=='*') return math.min(left,right)
			if (op=='/') {
				if (left==0 && right==0) return 0/0
				return math.simplify(left + '/' + right)
			}
			if (op=='-') {
				if (left==0 && right==0) return 0/1
				if (left==0 && right==1) return 1/0
				if (left==1 && right==0) return 1/1
				if (left==1 && right==1) return 0/0
			}
		}
		if (math.simplify('('+left+')') == 0 && math.simplify('('+right+')') == 0 && op == '/') return 0/0	//	+2024.4
		return math.simplify('(' + left + ')' + op + '(' + right + ')')
	}

	/*	-2025.5
	static solve(infix, symboltable) {	//	+2024.4
		return Lisp.solvelisp(Lisp.strto(infix), symboltable)
	}
	*/

	static solve(infix, mytype) {	//	+2025.5
		let symboltable = Lisp.maketable(mytype)
		return Lisp.solvelisp(Lisp.strto(infix), symboltable)
	}

	/*	-2025.5
	//static maketable() {	//	+2024.4	//	-2025.3
	static maketable(type) {			//	+2025.3
		if (type === undefined || type === '') type = 'Any'	//	+2025.3
		let symboltable = {}
		for (let symbol of 'abcdefghijklmnopqrstuvwxyz') {
			//symboltable[symbol] = 'Generic'		//	-2025.4
			symboltable[symbol] = 'Indeterminate'	//	+2025.4
			//symboltable[symbol.toUpperCase()] = 'Any'	//	-2025.3
			symboltable[symbol.toUpperCase()] = type	//	+2025.3
		}
		return symboltable
	}
	*/

	static maketable(type) {			//	+2025.5
		if (type === undefined || type === '') type = 'Any'	//	+2025.3
		return x => x==x.toUpperCase() ? type : 'Indeterminate'
	}

	static solvelisp(lisp, symboltable = Lisp.maketable()) {	//	~2025.5
	//static solvelisp(lisp, mytype) {							//	~2025.5
	//	let symboltable = Lisp.maketable(mytype)				//	~2025.5
		console.log(lisp,symboltable)
		if (type(lisp) != 'OperatorNode') return lisp
		if (op(lisp) != '=') return math.simplify(Lisp.toinfix(lisp)).toString()
		let [l,r] = args(lisp)
		if (ground(l) && !ground(r)) return Lisp.solvelisp(['=',r,l], symboltable)
		if (ground(l) &&  ground(r)) return (math.simplify(Lisp.toinfix(l)).toString() == math.simplify(Lisp.toinfix(r))).toString()
		if ( isvar(l) &&  l==r) {	//	+2024.3
			var myvar = l
			var mytype = symboltable(myvar)
			var ret = 0/0
		}
		if ( isvar(l) &&  ground(r)) {
			var myvar = l
			var mytype = symboltable(myvar)
			var ret = Lisp.simplify(r, mytype)
		}
		if (isvar(r) && !ground(l) && !isvar(l)) return Lisp.solvelisp(['=',r,l], symboltable)	//	+2024.5
		if (isvar(l) && type(r)=='OperatorNode') {	//	+2024.5
			let myop = op(r)
			let [L,R] = args(r)
			if (!ground(L) && ground(R)) return Lisp.solvelisp(['=',l,[myop,R,L]], symboltable)
			if (atomic(L))				//	+2024.7
				if (l == R) {
					var myvar = l
					var mytype = symboltable(myvar)
					if (myop == '+') {
						if (L == 0) ret = 0/0
						else if (type(L) == 'ConstantNode') ret = 1/0
						else ret = 1/0
					}
					if (myop == '*') {
						if (L == 0) ret = 0
						else if (L == 1) ret = 0/0
						else if (type(L) == 'ConstantNode') ret=[0, 1/0]
						else ret = 0
					}
				} else {
					var myvar = l
					var mytype = symboltable(myvar)
					var ret = Lisp.simplify([myop, L, R], mytype)
					if (isvar(R))	//	+2024.8
						var myvars = [R, l]
				}
		}
		if (type(l)=='OperatorNode' && ground(r)) {
			let anti = {'+': '-', '*': '/'}[op(l)]
			let [L,R] = args(l)
			if ( ground(L) && !ground(R)) return Lisp.solvelisp(['=',[op(l),R,L],r], symboltable)
			if (!ground(L) &&  ground(R)) {
				var myvar = L
				var mytype = symboltable(myvar)
				var ret = Lisp.simplify([anti, r, R], mytype)
			}
			// if (!ground(L) && !ground(R) && symboltable[R]!='Any') {	//	+2024.1												//	-2024.6
			if (!ground(L) && !ground(R)) {	//	+2024.6
				var myvar = L
				var mytype = symboltable(myvar)
				var ret = Lisp.simplify([anti, r, R], mytype)
				var myvars = [R, L]
			}
			function reverse() { return Lisp.solvelisp(['=',[op(l),R,L],r], symboltable) }	//	+2024.2
		}
		if (ret == undefined) return Lisp.toinfix(lisp)
		let set = solution_intersect_mytype(ret, mytype)
		if (typeof myvars != 'undefined') {								//	+2024.1
			return myvars[0] + ' ∈ ' + symboltable(myvars[0]) + '\n' + myvars[1] + ' ∈ ' + set	//	-2024.6
		} else {
			return myvar + ' ∈ ' + set
		}
		function value(lisp) { return lisp }
		function name(lisp) { return lisp }
		function opargs(lisp) { return [op(lisp),args(lisp)] }
		function args(lisp) { return lisp.slice(1) }
		function op(lisp) { return lisp[0] }
		function type(lisp) { console.log(lisp); return Lisp.type(lisp) }
		function solution_intersect_mytype(solution, mytype) {
			if (math.typeOf(solution)=='number' && isNaN(solution)) {
				return name(mytype)
			} else if (mytype == 'Boolean') {
				if (math.typeOf(ret)=='OperatorNode') {
					return '{ }'
				} else if (1/ret==0) {
					return '{ }'
				}
			} else if (mytype == 'Real') {
				if (math.typeOf(ret)=='OperatorNode') {
					return '{ }'
				} else if (1/ret==0) {
					return '{ }'
				}
			} else if (mytype == 'IEEE754') {
				if (math.typeOf(ret)=='OperatorNode') {
					return '{ }'
				}
			} else if (mytype == 'Any') {
				//	Accept
			} else {
				console.trace()
				alert('Error: mytype = ' + mytype)
			}
			return '{ ' + solution + ' }'
		}
		function compound(lisp) { return type(lisp)=='OperatorNode' }
		function atomic(lisp) { return !compound(lisp) }
		//function isvar(lisp) { return type(lisp)=='SymbolNode' && symboltable[lisp]!='Generic' }		//	-2025.4
		function isvar(lisp) { return type(lisp)=='SymbolNode' && symboltable(lisp)!='Indeterminate' }	//	+2025.4
		function ground(lisp) { return atomic(lisp) ? !isvar(lisp) : args(lisp).every(ground) }
	}

	static type(lisp) {
		switch(math.typeOf(lisp)) {
			case "number": return "ConstantNode"
			case "string": return "SymbolNode"
			case "Array": return "OperatorNode"
		}
		console.trace()
		alert('type unknown: ' + lisp)
	}

}
