
/*
	Author: Anthony John Ripa
	Date:   6/10/2023
	UnTransform: A data untransformer
*/

class Untransform {				//	+2020.7

	static str(s) {				//	+2020.7
		if (Untransform.is_neg_series(s)) return Untransform.untransform_neg_series(s);	//	+2022.3
		if (Untransform.is_pos_series(s)) return Untransform.untransform_pos_series(s);	//	+2022.3
		s = s.replace(new RegExp('x','g'),'s');
		if (s == '1 / (-1+s)') return 'exp(x)';			//	+2021.5
		if (s == '1 / (1+s)') return 'exp(-x)';			//	+2021.5
		if (s == '1 / (1+s^2)') return 'sin(x)';
		if (s == 's / (1+s^2)') return 'cos(x)';
		if (s == '1 / (-1+s^2)') return 'sinh(x)';
		if (s == 's / (-1+s^2)') return 'cosh(x)';
		if (s == '1 / (1+-2*s+s^2)') return 'x*exp(x)';	//	+2022.10
		if (s.includes('-') && !s.includes(' / ') && !s.includes('^-')) {	//	+2021.1
			var arr = s.split('-');
			return arr.map(Untransform.str).join('-');
		}
		if (s.includes('+') && !s.includes(' / ')) {	//	+2020.7
			var arr = s.split('+');
			return arr.map(Untransform.str).join('+');	//	+2020.7
		}
		//if (s.startsWith('2 /')) {					//	-2023.02
		//	var un = Untransform.str('1'+s.substr(1));	//	+2020.7
		//	if (un == '1') return 2;
		//	return '2*' + Untransform.str('1 '+s.substr(2));//	+2020.7
		//}
		//if (s.match(new RegExp("\\d /"))) {			//	+2023.02	//	-2023.03
		//if (s.match(new RegExp("[2-9] /"))) {							//	+2023.03	//	-2023.6
		if (s.match(new RegExp("^[2-9] /"))) {											//	+2023.6
			var un = Untransform.str('1'+s.substr(1));
			if (un == '1') return s[0];
			return s[0] + '*' + Untransform.str('1 '+s.substr(2));
		}
		if (s.match(/^-?\d*\*\w\^-?\d+$/)) {			//	+2021.11
			var [coef,spow] = s.split("*");
			var un = Untransform.str(spow);
			if (un == '1') return coef;
			return coef + '*' + un;
		}
		return 'ℒ^-1(' + s + ')';						//	+2022.8
	}

	static regex(kind) {						//	+2022.3
		var maybe = x => '(' + x + ')?';
		var any = x => '(' + x + ')*';
		var whole = x => '^' + x + '$';
		var or = (x,y) => '(' + x + '|' + y + ')';
		var char = String.raw`[A-Za-z]`;
		var pos = String.raw`\+`;
		var neg = String.raw`\-`;
		var mul = String.raw`\*`;
		var div = String.raw`/`;
		var pow = String.raw`\^`;
		var num = String.raw`\d+`;
		var posnum = maybe(pos) + num;
		var negnum = neg + num;
		var multermneg = maybe(neg) + maybe(num + maybe(mul)) + char + pow + negnum;
		var divtermneg = maybe(neg) + num + div + char + maybe(pow + posnum);
		var termneg = or(multermneg,divtermneg);
		var multermposconst = maybe(neg) + num + maybe(mul) + maybe(char + maybe(pow + posnum));
		var multermposvar = maybe(neg) + maybe(num + maybe(mul)) + char + maybe(pow + posnum);
		var multermpos = or(multermposconst,multermposvar);
		var termpos = multermpos;
		var joiner = or(pos,neg);
		var initneg = maybe(joiner) + termneg;
		var initpos = maybe(joiner) + termpos;
		var repeatedneg = joiner + termneg;
		var repeatedpos = joiner + termpos;
		var neg_series = initneg + any(repeatedneg);
		var pos_series = initpos + any(repeatedpos);
		var whole_neg_series = whole(neg_series);
		var whole_pos_series = whole(pos_series);
		if (kind == 'term_pos') return termpos;
		if (kind == 'term_neg') return termneg;
		if (kind == 'part_neg_series') return neg_series;
		if (kind == 'whole_neg_series') return whole_neg_series;
		if (kind == 'part_pos_series') return pos_series;
		if (kind == 'whole_pos_series') return whole_pos_series;
		alert('Error: Untransform.regex : Unkown Arg');
	}

	static is_neg_series(str) {					//	+2022.3
		str = str.replace(/\s*/g, '');
		var wholereg = Untransform.regex('whole_neg_series');
		return new RegExp(wholereg).test(str);
	}

	static is_pos_series(str) {					//	+2022.3
		str = str.replace(/\s*/g, '');
		var wholereg = Untransform.regex('whole_pos_series');
		return new RegExp(wholereg).test(str);
	}

	static untransform_pos_series(pos_series) {	//	+2022.3
		var terms = split(pos_series);
		terms = terms.map(parse_term);
		terms = terms.map(untransform_parsed_term);
		terms = terms.join('+');
		terms = terms.replace(new RegExp(String.raw`\+\-`,'g'),'-');
		if (terms[0] == '+') terms = terms.slice(1);
		return terms;
		function split(terms) {
			var ret = [];
			terms = terms.replace(/\s*/g, '');
			if (terms.length == 0) return ret;
			if (terms[0] != '-' && terms[0] != '+') terms = '+' + terms;
			var reg = new RegExp(Untransform.regex('term_pos'), 'g');
			var term;
			while (term = reg.exec(terms))
				ret.push(term[0]);
			return ret;
		}
		function parse_term(term) {
			var coef = term.match(new RegExp('^' + String.raw`[\+\-]?\d+` + '|' + '^' + String.raw`[\-]`));
			if (coef) term = term.replace(coef[0],""); else coef = '1';
			var times = term.match(new RegExp('^' + String.raw`[\*/]?`));
			if (times) term = term.replace(times[0],""); else times = '*';
			var alpha = term.match(new RegExp('^' + '[A-Za-z]'));
			if (alpha) {
				term = term.replace(alpha[0],"");
				var carat = term.match(new RegExp('^' + String.raw`\^`));
				if (carat) term = term.replace(carat[0],""); else carat = '^';
				var expo = term.match(new RegExp('^' + String.raw`[\+\-]?\d+`));
				if (expo) term = term.replace(expo[0],""); else expo = '1';
			} else {
				alpha = 'x';
				var pow = '^';
				var expo = '0';
			}
			let ret = [coef, times, alpha, carat, expo];
			return ret;
		}
		function untransform_parsed_term(parsed_term) {
			let [coef,times,alpha,carat,expo] = parsed_term;
			if (coef == 0) return 0;
			if (expo == 0) {
				if (coef == 1) return 'δ(' + alpha + ')';
				if (coef == -1) return '-δ(' + alpha + ')';
				return coef + times + 'δ(' + alpha + ')';
			}
			if (coef == 1) return "δ" + "'".repeat(expo) +  "(" + alpha + ')';
			if (coef == -1) return "-δ" + "'".repeat(expo) +  "(" + alpha + ')';
			return coef + times + "δ" + "'".repeat(expo) +  "(" + alpha + ')';
		}
	}

	static untransform_neg_series(neg_series) {	//	+2022.3
		var terms = split(neg_series);
		console.log(terms)
		terms = terms.map(parse_term);
		terms = terms.map(untransform_parsed_term);
		terms = terms.join('+');
		terms = terms.replace(new RegExp(String.raw`\+\-`,'g'),'-');
		if (terms[0] == '+') terms = terms.slice(1);
		return terms;
		function split(terms) {
			var ret = [];
			terms = terms.replace(/\s*/g, '');
			if (terms.length == 0) return ret;
			if (terms[0] != '-' && terms[0] != '+') terms = '+' + terms;
			var reg = new RegExp(Untransform.regex('term_neg'), 'g');
			var term;
			while (term = reg.exec(terms))
				ret.push(term[0]);
			return ret;
		}
		function parse_term(term) {
			var coef = term.match(new RegExp('^' + String.raw`[\+\-]?\d+` + '|' + '^' + String.raw`[\-]`));
			if (coef) term = term.replace(coef[0],""); else coef = '1';
			var times = term.match(new RegExp('^' + String.raw`[\*/]?`));
			if (times) term = term.replace(times[0],""); else times = '*';
			var alpha = term.match(new RegExp('^' + '[A-Za-z]'));
			if (alpha) term = term.replace(alpha[0],""); else alpha = 's';
			var carat = term.match(new RegExp('^' + String.raw`\^`));
			if (carat) term = term.replace(carat[0],""); else carat = '^';
			var expo = term.match(new RegExp('^' + String.raw`[\+\-]?\d+`));
			if (expo) term = term.replace(expo[0],""); else expo = '1';
			let ret = [coef, times, alpha, carat, expo];
			return ret;
		}
		function untransform_parsed_term(parsed_term) {
			let [coef,times,alpha,carat,expo] = parsed_term;
			if (times=='/') expo--; else expo++;
			if (times!='/') expo = -expo;
			coef = fraction_to_string(coef,math.factorial(expo));
			if (expo == 0) return coef;
			if (coef == 1 && expo == 1) return alpha;
			if (coef == -1 && expo == 1) return '-' + alpha;
			if (expo == 1) return coef + times + alpha;
			if (coef == 1) return alpha + carat + expo;
			if (coef == -1) return '-' + alpha + carat + expo;
			return coef + times + alpha + carat + expo;
			function fraction_to_string(num,den) {
				if (num == '-') num = -1;
				let gcd = math.gcd(num,den);
				num /= gcd;
				den /= gcd;
				if (den<0) {
					num *= -1;
					den *= -1;
				}
				if (den == 1) {
					return num;
				}
				return num + '/' + den;
			}
		}
	}

}