
/*
	Author:	Anthony John Ripa
	Date:	11/10/2021
	Newton:	An A.I. for Math
*/


class Expression {

	static getvars(input) {
		input = input.toString();	//	+2021.11
		input = input.replaceAll('sinh','').replaceAll('sin','').replaceAll('cosh','').replaceAll('cos','').replaceAll('exp','');
		var vars = [];
		var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		for (let symbol of input) {
			if (alphabet.includes(symbol)) {
				if (!vars.includes(symbol)) vars.push(symbol);
			}
		}
		return vars;
	}

	static evaluate(input, val) {
		return Expression.substitute(input, Expression.getvars(input).slice(-1)[0], val);
	}

	static substitute(input, vari, val) {
		if (vari === undefined) return input;
		var scope = JSON.parse('{' + '"' + vari + '"' + ':' + val + '}');
		try {												//	+2021.11
			var ret = math.simplify(input, scope).toString();
		} catch (e) {
			return "0/0";
		}
		return ret;											//	+2021.11
		//return math.simplify(input, scope).toString();	//	-2021.11
	}

	static expressiontofunction(expr) {
		assert(expr !== undefined, "Expression.expressiontofunction Arg is undefined");
		var vars = Expression.getvars(expr);
		if (vars.length <= 1) return Expression.expressiontofunction1(expr);
		if (vars.length == 2) return Expression.expressiontofunction2(expr);
		throw new Error('Not the right amount of variables: expr = ' + expr);
	}

	static expressiontofunction1(expr) {
		var vari = Expression.getvars(expr)[0];
		var f = x=>math.eval(expr,JSON.parse('{' + '"' + vari + '"' + ':'+x+'}'));
		return f;
	}

	static expressiontofunction2(expr) {
		var vars = Expression.getvars(expr);
		expr = expr.replace(/\^/g, '**');
		expr = expr.replace(new RegExp(vars[0], 'g'), 'x');
		expr = expr.replace(new RegExp(vars[1], 'g'), 'y');
		var f = (x, y) =>eval(expr);
		return f;
	}

}
