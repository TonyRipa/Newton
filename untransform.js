
/*
    Author: Anthony John Ripa
    Date:   11/10/2020
    UnTransform: A data untransformer
*/

class Untransform {				//	+2020.7

	static str(s) {				//	+2020.7
		s = s.replace(new RegExp('x','g'),'s');
		if (s == '0') return '0';
		if (s == '1 / s') return '1';
		if (s == 's^-1') return '1';
		if (s == '1 / s^2') return 'x';					//	+2020.11
		if (s == 's^-2') return 'x';
		if (s == 'h^-1') return '1';
		if (s == 'h^-2') return 'h';
		if (s == 'h^-3') return 'h^2/2';
		if (s == '1 / (-1+s)') return 'e^x';
		if (s == '1 / (1+s)') return 'e^-x';
		if (s == '1 / (1+s^2)') return 'sin(x)';
		if (s == 's / (1+s^2)') return 'cos(x)';
		if (s == '1 / (-1+s^2)') return 'sinh(x)';
		if (s == 's / (-1+s^2)') return 'cosh(x)';
		//if (s.includes('+')) {						//	-2020.7
		if (s.includes('+') && !s.includes(' / ')) {	//	+2020.7
			var arr = s.split('+');
			//return arr.map(untransform).join('+');	//	-2020.7
			return arr.map(Untransform.str).join('+');	//	+2020.7
		}
		if (s.startsWith('2 /')) {
			//var un = untransform('1'+s.substr(1));	//	-2020.7
			var un = Untransform.str('1'+s.substr(1));	//	+2020.7
			if (un == '1') return 2;
			//return '2*' + untransform(s.substr(2));	//	-2020.7
			return '2*' + Untransform.str('1 '+s.substr(2));//	+2020.7
		}
		if (s.startsWith('2*')) {
			//var un = untransform(s.substr(2));		//	-2020.7
			var un = Untransform.str(s.substr(2));		//	+2020.7
			if (un == '1') return 2;
			return '2*' + un;
		}
		if (s.startsWith('4*')) {
			//var un = untransform(s.substr(2));		//	-2020.7
			var un = Untransform.str(s.substr(2));		//	+2020.7
			if (un == '1') return 4;
			return '4*' + un;
		}
		return 'ℒ⁻¹(' + s + ')';
	}

}