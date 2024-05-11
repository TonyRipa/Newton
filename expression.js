
/*
	Author:	Anthony John Ripa
	Date:	2023.08.15
	Expression:	An expression library
*/

class Expression {

	static getvars(str) {
		let ret
		if (str.includes('=')) {
			let expressions = str.split('=')
			ret = expressions.map(Expression.getvarsexpression).flat()
		} else {
			ret = Expression.getvarsexpression(str)
		}
		return [...new Set(ret)]
	}

	static getvarsexpression(str) {
		let bag = getvarsnode(math.parse(str));
		let set = [...new Set(bag)];
		return set;
		function getvarsnode(node) {
			if (Array.isArray(node)) return node.map(getvarsnode);
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

}
