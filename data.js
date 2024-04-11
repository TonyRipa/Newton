
/*
	Author:	Anthony John Ripa
	Date:	4/10/2024
	Data:	A data library
*/

class Data {

	static expr() {
		return [0,1,2,12/8,'x','x*x','x/x','(x^2-1)/(x-1)','(x-1)/(x^2-1)','2+h','(2+h)^2','(2+h)^2-2^2','((2+h)^2-2^2)/h','((2+h)^2-2^2)/h|0','exp(x)','exp(2x)','sin(x)','sin(3x)','cos(x)','cos(4x)','sinh(x)','sinh(5x)','cosh(x)','cosh(6x)']
	}

	static prob() {
		return '.5,.5,0,0'
	}

	static odds() {
		return '1,0,.5'
	}

	static econ() {
		return `
9	4	1	0	1	0
1	4	1	0	1	0
9	5	1	0	1	0
1	5	1	0	1	0
9	6	2	1	2	0
9	6	1	0	2	0
1	6	1	0	2	0
1	6	2	1	2	0
9	9	1	0	2	0
9	9	2	1	2	-1
1	9	1	0	2	0
1	9	2	1	2	0
9	0	1	0	4	-1
9	0	3	1	4	0
9	0	4	2	4	0
9	0	2	1	4	1
1	0	1	0	4	0
1	0	3	1	4	0
1	0	4	2	4	0
1	0	2	1	4	0
9	1	1	0	4	1
9	1	4	2	4	0
9	1	2	1	4	0
9	1	3	1	4	0
1	1	4	2	4	0
1	1	3	1	4	0
1	1	2	1	4	0
1	1	1	0	4	0
`
	}

}
