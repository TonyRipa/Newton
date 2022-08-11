
/*
	Author:	Anthony John Ripa
	Date:	8/10/2022
	Newton:	An A.I. for Math
*/

class Expression {

	static getvars(str) {			//	+2022.7
		let bag = getvarsnode(math.parse(str));
		let set = [...new Set(bag)];
		return set;
		function getvarsnode(node) {
			if (Array.isArray(node)) return node.map(getvarsnode);	//	+2022.8
			switch (node.type) {
				case 'ConstantNode': return [];
				case 'SymbolNode': return [node.name];
				case 'ParenthesisNode': return getvarsnode(node.content);
				case 'OperatorNode':
				case 'FunctionNode': return node.args.map(getvarsnode).flat();
				default: alert('Expression.getvars Error : ' + node.type)
			}
		}
	}

	static evaluate(input, val) {
		return Expression.substitute(input, Expression.getvars(input).slice(-1)[0], val);
	}

	static substitute(input, vari, val) {
		if (vari === undefined) return input;
		var scope = {};														//	+2022.05
		scope[vari] = Number(val);											//	+2022.05
		try {												//	+2021.11
			var ret = math.simplify(input, scope).toString();
		} catch (e) {
			return "0/0";
		}
		return ret;											//	+2021.11
	}

	static expressiontofunction(expr) {
		assert(expr !== undefined, "Expression.expressiontofunction Arg is undefined");
		var vars = Expression.getvars(expr);
		if (vars.length <= 1) return expressiontofunction1(expr);
		if (vars.length == 2) return expressiontofunction2(expr);
		throw new Error('Not the right amount of variables: expr = ' + expr);
		function expressiontofunction1(expr) {
			var vari = Expression.getvars(expr)[0];
			var f = x=>math.eval(expr,JSON.parse('{' + '"' + vari + '"' + ':'+x+'}'));
			return f;
		}
		function expressiontofunction2(expr) {
			var vars = Expression.getvars(expr);
			expr = expr.replace(/\^/g, '**');
			expr = expr.replace(new RegExp(vars[0], 'g'), 'x');
			expr = expr.replace(new RegExp(vars[1], 'g'), 'y');
			var f = (x, y) =>eval(expr);
			return f;
		}
	}

}
