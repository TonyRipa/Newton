
/*
	Author:	Anthony John Ripa
	Date:	9/10/2022
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

	//static polynomial(termcoefs_vars_decoder) {	//	-2022.04
	//	if (Render.simple.isrepeating(...termcoefs_vars_decoder))	//	+2021.6
	//		return [Render.simple.polytoratio(...termcoefs_vars_decoder),Render.transform.polynomial(...termcoefs_vars_decoder)];
	//	return [Render.simple.polynomial(...termcoefs_vars_decoder),Render.transform.polynomial(...termcoefs_vars_decoder)];
	//}

	static polynomial(termcoefs_vars_decoder) {		//	+2022.04
		console.log('Render.polynomial',termcoefs_vars_decoder)	//	+2022.9
		if (termcoefs_vars_decoder[1].length == 2) return [Render.simple.polynomial(...termcoefs_vars_decoder),Render.transform.polynomial(...termcoefs_vars_decoder)];
		return [[Render.simple.polynomial(...termcoefs_vars_decoder),Render.simple.polytoratio(...termcoefs_vars_decoder)],Render.transform.polynomial(...termcoefs_vars_decoder)];
	}

	static polynomialratio(termcoefs_vars_decoder) {
		var simp = Render.simple.polynomialratio(...termcoefs_vars_decoder);
		var tran = Render.transform.polynomialratio(...termcoefs_vars_decoder,simp);
		return [simp,tran];
	}

}

Render.transform = class {

	static polynomial(termcoefs, vars, decoder) {
		if (Render.simple.isrepeating(termcoefs, vars, decoder))	//	+2021.6
			return Untransform.str(Render.simple.polytoratio(termcoefs,vars,decoder));
		return Untransform.str(Render.simple.polynomial(termcoefs, vars, decoder));
	}

	static polynomialratio(termcoefs, vars, {decodernum, decoderden}, simp) {
		if (simp[0] == '0') {//alert(0)
			return '0';
		}
		if (JSON.stringify(decoderden) == '[0,[1,0]]') {//alert(1)	//	Rational_O1	a/(bx)
			return termcoefs[0] + '/' + termcoefs[1];
		}
		if (JSON.stringify(decoderden) == '[0,0,[0,0],[1,0,1]]' && termcoefs[0]!=1) {//alert(2)	//	Rational1_O1H (a+bx)/(c+1x)
			termcoefs = termcoefs.map(cell=>Math.round(cell * 1.00) / 1.00);
			if (termcoefs[2]==0) return termcoefs[0];
		}
		if (JSON.stringify(decoderden) == '[0,0,[0,0],[1,0],[2,0,1]]' && termcoefs[0]!=1) {//alert(3)	//	Rational1_O2H (a+bx)/(c+dx+x²)
			return Render.transform.polynomialratio([termcoefs[1],termcoefs[0],0,0,0,0,termcoefs[2],termcoefs[3],1,0],vars,{decodernum:[[1,0],[0,0],[-1,0],[-2,0],[-3,0],[-4,0]],decoderden:[0,0,0,0,0,0,[0,0],[1,0],[2,0],[3,0]]},simp);	//	+2020.11
		}
		if (JSON.stringify(decodernum) == '[0,[0,0],0,[1,0],0,[2,0]]' && math.abs(termcoefs[0])!=1) {//alert(4)	//	Sparse (b+dx+fx²)/(a+cx+ex²)	//	+2020.8
			if (termcoefs[5]==0) return Render.transform.polynomialratio([termcoefs[3],termcoefs[1],0,0,0,0,termcoefs[0],termcoefs[2],termcoefs[4],0],vars,{decodernum:[[1,0],[0,0],[-1,0],[-2,0],[-3,0],[-4,0]],decoderden:[0,0,0,0,0,0,[0,0],[1,0],[2,0],[3,0]]},simp);	//	+2020.12
			if (termcoefs[4]==1) return Render.transform.polynomialratio([termcoefs[3],termcoefs[1],0,0,0,0,termcoefs[0],termcoefs[2],termcoefs[4],0],vars,{decodernum:[[1,0],[0,0],[-1,0],[-2,0],[-3,0],[-4,0]],decoderden:[0,0,0,0,0,0,[0,0],[1,0],[2,0],[3,0]]},simp);	//	+2020.11
			if (termcoefs[2]==1) return termcoefs[1];
			return termcoefs[1] + '/' + termcoefs[2];
		}
		//if (JSON.stringify(decodernum)=='[[1,0],[0,0],[-1,0],[-2,0],[-3,0],[-4,0]]') {//alert(5)	//	Differential (ax+b+cx⁻1+dx⁻²+ex⁻³+fx⁻⁴)/(g+hx+ix²+jx³)								//	-2021.7
		if (decodernum.every((x,i) => x[0]==1-i&&x[1]==0)) {//alert(5)	//	Differential (ax+b+cx⁻1+dx⁻²+ex⁻³+fx⁻⁴+gx⁻⁵+hx⁻⁶+ix⁻⁷+jx⁻⁸)/(k+lx+mx²+nx³)	//	+2021.7
			termcoefs = termcoefs.map(cell=>Math.round(cell * 1.00) / 1.00);
			//var num = termcoefs.slice(0,6);				//	-2021.7
			//var den = termcoefs.slice(6);					//	-2021.7
			var num = termcoefs.slice(0,decodernum.length);	//	+2021.7
			var den = termcoefs.slice(decodernum.length);	//	+2021.7
			if (['[1]','[1,0,0,0]'].includes(JSON.stringify(den))) return Render.polynomial([num.map((v,i)=>i>1?v/math.factorial(i-2):v),vars,decodernum.map(xy=>[-1-xy[0],xy[1]])])[0];				//	+2021.6
			if (JSON.stringify(den.slice(1))=='[0,0,0]') return Render.simple.polynomial(num.map((v,i)=>i>1?v/math.factorial(i-2):v),vars,decodernum.map(xy=>[-1-xy[0],xy[1]])) + ' / ' + den[0];	//	+2021.3
			//if (JSON.stringify(num)=='[0,1,0,0,0,0]' && (den.length<3 || den[2]==0)) return `exp(${coef(-den[0])}${vars[0]})`;	//	+2020.12	//	-2021.7
			if (num.every((x,i)=>i==1?x==1:x==0) && (den.length<3 || den[2]==0)) return `exp(${coef(-den[0])}${vars[0]})`;							//	+2021.7
			var h = (den[0]<0) ? 'h' : '';									//	+2020.11
			if (den[0] && den[1]==0 && num[0]) return `cos${h}(${coef(math.sqrt(math.abs(den[0])))}${vars[0]})`;	//	+2020.11
			if (den[0] && den[1]==0 && num[1]) return `sin${h}(${coef(math.sqrt(math.abs(den[0])))}${vars[0]})`;	//	+2020.11
		}
		//alert(6)
		return Untransform.str(simp);//Rational0_1 a/bx, Rational1_O1H (a+bx)/(c+x), Rational1_O2H (a+bx)/(c+dx+x²), sparse (a+bx+cx²)/(d+ex+fx²), PolyRat (a+bx+cx²)/(d+ex+fx²)
		function coef(c) {																							//	+2020.11
			if (c==1) return '';
			if (c==-1) return '-';	//	+2020.12
			return c;
		}
	}

}

Render.simple = class {

	static isrepeating(termcoefs, vars, decoder) {	//	+2021.6
		var fulldecoder = Render.simple.tofulldecoder(termcoefs, decoder);
		var seq = Render.simple.toseq(fulldecoder);
		return Transform.isfrac(seq);
	}

	static polytoratio(termcoefs, vars, decoder) {	//	+2021.6
		var fulldecoder = Render.simple.tofulldecoder(termcoefs, decoder);
		var seq = Render.simple.toseq(fulldecoder);
		//var {num,den} = Transform.infiniteseq2frac(seq);		//	-2022.8
		var {num,den} = Transform.infiniteseq2frac(seq,true);	//	+2022.8
		var decoders = { decodernum:[[1,0],[0,0],[-1,0],[-2,0],[-3,0],[-4,0],[-5,0],[-6,0],[-7,0],[-8,0]], decoderden: [0,0,0,0,0,0,0,0,0,0,[0,0],[1,0],[2,0],[3,0]] };	//	+2021.7
		return Render.simple.polynomialratio([...num,...den], vars, decoders);
	}

	static tofulldecoder(termcoefs, decoder) {	//	+2021.6
		var fulldecoder = [];
		for (var i = 0; i < decoder.length; i++)
			if (Array.isArray(decoder[i])) {
				var coef = (decoder[i].length==2) ? (termcoefs[i] || 0) : (decoder[i][2] || 0);
				fulldecoder.push([decoder[i][0], decoder[i][1], coef]);
			}
		return fulldecoder;
	}

	static toseq(fulldecoder) {	//	+2021.6
		var seq = [];
		//for (let power of [0,1,2,3])			//	-2021.7
		for (let power of [0,1,2,3,4,5,6,7])	//	+2021.7
			if (fulldecoder.filter(xyc=>xyc[0]==power).length) seq.push(fulldecoder.filter(xyc=>xyc[0]==power)[0][2]); else seq.push(0);
		return seq;
	}

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
		//termcoefs = termcoefs.map(cell=>Math.round(cell * 1.00) / 1.00);							//	-2022.9
		console.log(termcoefs)																		//	+2022.9
		termcoefs = termcoefs.map(cell=>math.typeof(cell)=='Complex'?cell.re:cell);					//	+2022.9
		console.log(termcoefs)																		//	+2022.9
		termcoefs = termcoefs.map(cell=>math.abs(cell-math.round(cell))<1E-5?math.round(cell):cell);//	+2022.9
		console.log(termcoefs)																		//	+2022.9
		termcoefs = termcoefs.map(cell=>matrix.dec2frac(cell));										//	+2022.9
		console.log(termcoefs)																		//	+2022.9
		var ret = '';
		var fulldecoder = Render.simple.tofulldecoder(termcoefs, decoder);	//	+2021.6
		var seq = Render.simple.toseq(fulldecoder);							//	+2021.6
		for (let decode of fulldecoder)										//	+2021.6
			ret += term(decode[2], termvars(decode[0], decode[1], vars));
		if (ret.length == 1) return ret;
		if (ret[0] == '0') ret = ret.substr(1);
		if (ret[0] == '+') ret = ret.substr(1);
		if (ret == '') ret = '0';
		return ret;
		function term(termcoef, termvar) {
			if (termcoef == 0) return '';
			//if ('1'.includes(termvar)) return '+' + termcoef;											//	-2022.9
			if ('1'.includes(termvar)) return '+' + neat(termcoef);										//	+2022.9
			if (termcoef == 1) return '+' + termvar;
			if (termcoef == -1) return '-' + termvar;	//	+2021.1
			//return '+' + termcoef + ('1'.includes(termvar) ? '' : '*' + termvar);						//	-2022.9
			return '+' + neat(termcoef) + ('1'.includes(termvar) ? '' : '*' + termvar);					//	+2022.9
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
		function neat(x) {	//	+2022.9
			let ret = '';
			if (x.s == -1) ret += '-';
			ret += x.n;
			if (x.d != 1) ret += '/' + x.d;
			return ret;
		}
	}

}

Render.dense = class {

	static sparse2dense(termcoefs, {decodernum, decoderden}) {
		var num = sparse2dense1(termcoefs,decodernum);
		var den = sparse2dense1(termcoefs,decoderden);
		return {num,den};
		function sparse2dense1(termcoefs,decoder) {
			var ret = [0,0,0,0,0,0,0,0];
			for (let exp=-4; exp<=3; exp++)
				for (let i=0; i<decoder.length; i++) {
					let code = decoder[i];
					if (code[0]==exp) ret[exp+4] = (code.length==3) ? code[2] : termcoefs[i];
				}
			return ret;

		}
	}

}