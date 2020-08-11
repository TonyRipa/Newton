
/*
	Author:	Anthony John Ripa
	Date:	8/10/2020
	Render:	A toString Class
*/

class Render {	//	+2020.7

	static stringify(termcoefs_vars_decoder) {
		if (Array.isArray(termcoefs_vars_decoder[2])) {
			return Render.polynomial(termcoefs_vars_decoder);
		} else {
			return Render.polynomialratio(termcoefs_vars_decoder)
		}
	}

	static polynomial(termcoefs_vars_decoder) {
		return [Render.simple.polynomial(...termcoefs_vars_decoder),Render.transform.polynomial(...termcoefs_vars_decoder)];
	}

	static polynomialratio(termcoefs_vars_decoder) {
		var simp = Render.simple.polynomialratio(...termcoefs_vars_decoder);
		var tran = Render.transform.polynomialratio(...termcoefs_vars_decoder,simp);
		return [simp,tran];
	}

}

Render.transform = class {

	static polynomial(termcoefs, vars, decoder) {
		return Untransform.str(Render.simple.polynomial(termcoefs, vars, decoder));
	}

	static polynomialratio(termcoefs, vars, {decodernum, decoderden}, simp) {
		if (simp[0] == '0') {
			return '0';
		}
		if (JSON.stringify(decoderden) == '[0,0,[0,0],[1,0,1]]' && termcoefs[0]!=1) {
			termcoefs = termcoefs.map(cell=>Math.round(cell * 1.00) / 1.00);
			if (termcoefs[2]==0) return termcoefs[0];
		}
		if (JSON.stringify(decoderden) == '[0,0,[0,0],[1,0],[2,0,1]]' && termcoefs[0]!=1) {
			termcoefs = termcoefs.map(cell=>Math.round(cell * 1.00) / 1.00);
			if (termcoefs[2]==0 && termcoefs[3]==0) return Render.simple.polynomial([termcoefs[0]],vars,[[1,0]]);
		}
		//if (JSON.stringify(decodernum) == '[0,[0,0],0,[1,0],0,[2,0]]' && termcoefs[0]!=1) {			//	-2020.8
		if (JSON.stringify(decodernum) == '[0,[0,0],0,[1,0],0,[2,0]]' && math.abs(termcoefs[0])!=1) {	//	+2020.8
			if (termcoefs[4]==1) return Render.simple.polynomial([termcoefs[1],termcoefs[3]],vars,[[1,0],[0,0]]);
			if (termcoefs[2]==1) return termcoefs[1];
			return termcoefs[1] + '/' + termcoefs[2];
		}
		if (JSON.stringify(decodernum)=='[[1,0],[0,0],[-1,0],[-2,0],[-3,0],[-4,0]]') {
			termcoefs = termcoefs.map(cell=>Math.round(cell * 1.00) / 1.00);
			var num = termcoefs.slice(0,6);
			var den = termcoefs.slice(6);
			if (JSON.stringify(den)=='[1,0,0,0]') return Render.simple.polynomial(num.map((v,i)=>i>1?v/math.factorial(i-2):v),vars,decodernum.map(xy=>[-1-xy[0],xy[1]]));
		}
		return Untransform.str(simp);
	}

}

Render.simple = class {

	static polynomialratio(termcoefs, vars, {decodernum, decoderden}) {
		var num = Render.simple.polynomial(termcoefs, vars, decodernum);
		var den = Render.simple.polynomial(termcoefs, vars, decoderden);
		assert(num !== undefined, "Newton.infer.inferrational returning undefined")
		if (den == '1') return num;
		if (num.includes('+') || num.includes('-')) num = '(' + num + ')';
		if (den.includes('+') || den.includes('-') || den.includes('*')) den = '(' + den + ')';
		return num + ' / ' + den;
	}

	static polynomial(termcoefs, vars, decoder) {
		termcoefs = termcoefs.map(cell=>Math.round(cell * 1.00) / 1.00);
		var ret = '';
		for (var i = 0; i < decoder.length; i++)
			if (Array.isArray(decoder[i]))
				if(decoder[i].length==2)
					ret += term(termcoefs[i] || 0, termvars(decoder[i][0], decoder[i][1], vars))
				else
					ret += term(decoder[i][2] || 0, termvars(decoder[i][0], decoder[i][1], vars))
		if (ret.length == 1) return ret;
		if (ret[0] == '0') ret = ret.substr(1);
		if (ret[0] == '+') ret = ret.substr(1);
		if (ret == '') ret = '0';
		return ret;
		function term(termcoef, termvar) {
			if (termcoef == 0) return '';
			if ('1'.includes(termvar)) return '+' + termcoef;
			if (termcoef == 1) return '+' + termvar;
			return '+' + termcoef + ('1'.includes(termvar) ? '' : '*' + termvar);
		}
		function termvars(v1, v2, vars) {
			if (vars.length == 1) return subterm(vars[0], v1);
			if (v2 == 0) return subterm(vars[0] || 's', v1);
			if (v1 == 0) return subterm(vars[1], v2);
			return subterm(vars[0], v1) + '*' + subterm(vars[1], v2);
			function subterm(variable, power) {
				if (power == 0) return '';
				return variable + (power == 1 ? '' : '^' + power);
			}
		}
	}

}