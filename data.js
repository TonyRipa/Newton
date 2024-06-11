
/*
	Author:	Anthony John Ripa
	Date:	6/9/2024
	Data:	A data library
*/

class Data {

	static get(x) {
		switch (x) {
			case 'probdata': return Data.prob()
			case 'oddsdata': return Data.odds()
			case 'econdata': return Data.econ()
			case 'exprdata': return Data.expr()
			case 'eqndata' : return Data.eqn()
			case 'symdata' : return Data.sym()
			case 'wagedata': return Data.wage()
			case 'agedata' : return Data.age()
			case 'hiredata': return Data.hire()
		}
	}

	static expr() {
		return [0,1,2,12/8,'x','x*x','x/x','(x^2-1)/(x-1)','(x-1)/(x^2-1)','2+h','(2+h)^2','(2+h)^2-2^2','((2+h)^2-2^2)/h','((2+h)^2-2^2)/h|0','exp(x)','exp(2x)','sin(x)','sin(3x)','cos(x)','cos(4x)','sinh(x)','sinh(5x)','cosh(x)','cosh(6x)']
	}

	static eqn() {
		return ['X=0','X=1','X+0=0','X+0=1','X+1=0','X+1=1','X*0=0','X*0=1','X*1=0','X*1=1','X*2=1','M*h=(2*x+h)*h','h*M=(2*x+h)*h','X=e-e','Y=2*3','Y=x*3','0*1=0','0*X=0','(2*x+h)*h=M*h','X=X']
	}

	static eqn2() {
		return ['X=0','X=1','X+0=0','X+0=1','X+1=0','X+1=1','X*0=0','X*0=1','X*1=0','X*1=1','X*2=1','M*h=(2*x+h)*h','h*M=(2*x+h)*h','X=e-e','Y=2*3','Y=x*3','X*y*g=y*3*g','0*1=0','0*X=0','(2*x+h)*h=M*h','(2*x+H)*H=M*H','M*H=(2*x+H)*H','Y=X*3','X=2*X','X=X*2','X*2=X','2*X=X','X=Y*X','X=X','Y=(2*x+H)*H']
	}

	static prob() {
		return '.5,.5,0,0'
	}

	static odds() {
		return '1,0,.5'
	}

	static age() {
		return `Age,Population %,Congress %
<65,83,46
>=65,17,54
`
	}

	static sym() {
		return [Data.sym2(), Data.sym1()].map(data=>data.replace(/\n/g,'\\n'))
	}

	static sym1() {
		return `Sex,Hours,Pay
F,40.65,55659.85
F,41.02,56188.58
F,41.26,56531.54
F,41.46,56817.34
F,41.63,57060.27
F,41.78,57274.62
F,41.91,57460.39
F,42.05,57660.45
F,42.17,57831.93
F,42.30,58017.70
F,42.43,58203.47
F,42.55,58374.95
F,42.69,58575.01
F,42.82,58760.78
F,42.97,58975.13
F,43.14,59218.06
F,43.34,59503.86
F,43.58,59846.82
F,43.95,60375.55
M,42.05,57660.45
M,42.42,58189.18
M,42.66,58532.14
M,42.86,58817.94
M,43.03,59060.87
M,43.18,59275.22
M,43.31,59460.99
M,43.45,59661.05
M,43.57,59832.53
M,43.70,60018.30
M,43.83,60204.07
M,43.95,60375.55
M,44.09,60575.61
M,44.22,60761.38
M,44.37,60975.73
M,44.54,61218.66
M,44.74,61504.46
M,44.98,61847.42
M,45.35,62376.15
`
	}

	static sym2() {
		let data = Frame.str2frame(Data.sym1())
		data.get(0,'F').apply(2,x=>x+2000)
		return data.toString()
	}

	static hire() {
		return `Sex,Race,Job
F,B,0
F,W,1
M,B,1
M,W,0
`
	}

	static wage() {
		return `Sex,Hours,Pay
M,10,001500
M,32,007200
M,40,039600
M,40,015400
F,38,010000
F,15,005600
M,84,054000
M,10,001500
M,40,042000
M,50,029000
M,50,008000
M,40,060000
M,52,037500
M,45,034000
M,40,029000
M,80,000300
M,40,050000
F,40,015000
F,20,008000
M,40,025000
M,25,014000
M,09,072000
M,25,002000
F,72,020000
M,40,036000
M,25,015000
F,40,019000
F,40,019000
M,32,022000
M,40,054000
M,55,030000
F,25,005000
M,22,002400
F,03,000000
M,45,035000
M,30,025000
M,40,019000
M,40,000200
M,10,011800
M,48,015000
M,40,081000
M,40,044000
M,30,020000
M,40,015000
M,50,047000
F,40,050000
M,40,003000
M,40,002100
M,37,010000
F,25,002000
F,12,005000
F,40,050000
F,25,006000
M,40,006200
F,17,003100
M,06,000600
M,30,001100
M,60,000700
M,60,250000
M,40,120000
F,40,040000
M,40,022000
F,45,042000
M,50,080000
M,40,040000
F,40,020000
M,43,030000
M,20,012000
M,40,100000
M,40,100000
M,24,017000
F,40,040000
M,28,019000
M,40,045000
F,45,045000
M,40,060000
F,40,038000
F,40,030000
M,04,001000
M,40,019000
F,45,047000
M,45,165000
M,40,002000
F,30,030500
M,40,037000
M,25,004000
F,25,060000
F,40,040000
F,40,070000
F,50,090000
M,32,024000
F,12,007000
F,12,004000
F,35,005500
F,40,045000
M,10,011500
F,40,130000
M,42,057000
F,30,025200
F,36,080000
M,50,020000
M,40,022900
F,45,091000
F,40,130000
M,20,014000
M,10,000500
F,60,026000
F,60,025000
F,40,027700
F,50,070000
M,50,070000
M,20,020000
M,40,011900
M,40,268000
F,26,002500
M,40,035000
M,40,052000
F,80,426000
M,24,014300
M,40,020000
M,20,000780
M,40,012500
F,36,006000
M,36,020400
F,40,024000
M,35,006500
F,36,036000
M,50,107000
F,35,003000
M,40,062000
M,40,029100
F,30,004200
M,20,001800
F,50,002000
M,71,024600
M,60,026000
M,36,005000
F,16,006000
M,45,028800
M,03,000000
M,86,036700
F,10,009600
F,32,008000
F,20,005000
M,15,000490
F,20,010000
F,25,005000
M,20,003000
M,45,028000
M,25,003800
M,40,022900
M,36,003200
F,20,003000
M,12,002200
M,40,002000
F,40,007500
M,32,000600
F,03,000770
M,40,030000
F,25,000000
M,12,005500
M,20,001400
M,40,005500
F,40,006000
F,25,400000
F,20,007000
F,40,060000
M,44,011000
F,15,022500
M,40,200000
F,40,140000
F,05,017800
F,40,007200
F,06,000000
F,35,022000
F,06,001000
F,30,000000
F,40,015000
F,08,001300
F,40,012000
M,50,090000
F,65,075000
F,25,002500
M,40,009300
F,40,089000
F,40,110000
M,50,017000
M,40,000000
M,40,000000
M,40,250000
F,16,008000
M,40,044000
F,24,018700
M,35,045000
M,25,020000
M,80,020000
F,80,020000
M,40,027000
M,40,027000
M,40,005000
F,40,045000
M,20,000250
M,12,000500
F,08,002000
F,20,003500
F,32,030000
F,25,011700
F,25,009600
M,40,060000
F,40,165000
F,50,150000
M,40,006000
M,15,000800
F,40,005000
F,35,003600
M,40,006500
F,16,008000
M,40,035700
F,40,035000
F,32,020000
M,50,040000
M,30,010000
F,48,000000
M,68,022000
F,40,058000
M,65,114000
F,40,065000
M,60,070000
M,40,043000
F,24,012000
F,10,000400
F,20,020000
F,40,030000
F,40,060000
M,50,687000
F,25,004000
F,40,056000
M,40,030000
M,40,200000
F,36,060000
F,36,080000
M,60,136000
F,16,009800
M,40,025000
M,40,008000
M,50,008000
M,30,015000
F,40,031100
F,40,055000
M,40,065000
F,20,000760
F,30,001000
M,60,008700
M,40,060000
M,40,035000
F,36,056000
M,40,035600
M,45,150000
M,50,019800
M,45,018000
M,45,073000
M,12,003000
F,20,015000
F,50,037000
F,20,015000
F,40,040000
M,16,003500
M,40,060000
M,20,024000
M,30,000000
F,20,072000
M,15,004000
M,15,011500
M,40,070000
F,40,045000
M,36,014500
M,24,010000
M,40,055000
F,04,001700
M,20,006700
F,40,025000
M,30,030000
F,30,025000
F,45,112000
F,12,045000
F,30,018000
M,40,120000
M,40,085000
M,60,070000
F,45,005200
M,40,007200
M,40,058000
M,15,007000
M,40,065000
M,10,000000
F,40,050000
M,60,050000
M,45,050000
M,20,019000
F,30,012400
M,40,025000
F,28,020000
F,40,159000
M,35,024000
F,53,050000
M,28,004800
M,20,034000
M,20,012000
M,46,132000
M,40,114000
M,40,055000
F,40,055000
M,50,042000
M,40,221000
M,40,040000
F,50,080000
M,20,008000
M,40,020000
F,40,100000
F,30,024500
F,40,070000
F,25,014000
F,40,135000
F,40,150000
M,40,050000
M,40,031000
F,30,023900
M,40,000500
M,48,030000
M,40,033000
M,40,030000
F,30,024000
M,40,027900
F,12,005400
M,40,047200
F,23,007000
F,40,075000
M,37,009000
F,10,000000
M,30,009400
F,22,016000
M,40,025000
F,32,010000
M,39,016600
M,40,100000
M,60,030000
F,60,030000
F,10,004000
M,50,110000
M,50,100000
F,36,050000
M,40,054000
M,32,017000
F,32,004800
M,40,020000
M,06,000000
M,40,065000
M,40,074000
F,30,010000
M,20,000400
F,30,054000
M,40,030000
F,40,013000
M,34,030000
F,25,008000
F,06,001000
M,40,030300
F,40,243000
M,40,006800
M,30,000000
M,40,065000
M,40,025000
F,35,000000
`
	}

	static econ() {
		return `V0,V1,V2,Y
Γ,x,A,0
Γ,x,B,1
Γ,x,C,2
Γ,y,A,3
Γ,y,B,4
Γ,y,C,5
`
	}

}
