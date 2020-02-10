
/*
    Author: Anthony John Ripa
    Date:   2/10/2020
    UnTransform: A data untransformer
*/


function untransform(s) {
	s = s.replace(new RegExp('x','g'),'s');
	if (s == '0') return '0';
	if (s == '1 / s') return '1';
	if (s == 's^-1') return '1';
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
	if (s.includes('+')) {
		var arr = s.split('+');
		return arr.map(untransform).join('+');
	}
	if (s.startsWith('2 /')) {
		var un = untransform('1'+s.substr(1));
		if (un == '1') return 2;
		return '2*' + untransform(s.substr(2));
	}
	if (s.startsWith('2*')) {
		var un = untransform(s.substr(2));
		if (un == '1') return 2;
		return '2*' + un;
	}
	if (s.startsWith('4*')) {
		var un = untransform(s.substr(2));
		if (un == '1') return 4;
		return '4*' + un;
	}
	return 'ℒ⁻¹(' + s + ')';
}