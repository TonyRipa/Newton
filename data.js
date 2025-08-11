
/*
	Author:	Anthony John Ripa
	Date:	7/20/2025
	Data:	A data library
*/

class Data {

	static get(x) {
		let [prefix,suffix] = x.split('_')
		return Data[suffix]()
	}

	static type() {
		return {'Variable':['Any','IEEE754','Real','Boolean'],'Constant':['Indeterminate']}
	}

	static expr() {
		return [0,1,2,12/8,'x','x*x','x/x','(x^2-1)/(x-1)','(x-1)/(x^2-1)','2+h','(2+h)^2','(2+h)^2-2^2','((2+h)^2-2^2)/h','((2+h)^2-2^2)/h|0','exp(x)','exp(2x)','sin(x)','sin(3x)','cos(x)','cos(4x)','sinh(x)','sinh(5x)','cosh(x)','cosh(6x)','δ(x)']
	}

	static eqn() {
		return ['X=0','X=1','X+0=0','X+0=1','X+1=0','X+1=1','X*0=0','X*0=1','X*1=0','X*1=1','X*2=1','M*h=h','M*h=(2*x+h)*h','h*M=(2*x+h)*h','X=e-e','Y=2*3','Y=x*3',              '0*1=0','0*X=0','(2*x+h)*h=M*h',                                'Y=X*3','2*X=X','X=X*2','X=2*X','X*2=X',        'X=X',              'Y*X=1']
	}

	static eqn2() {
		return ['X=0','X=1','X+0=0','X+0=1','X+1=0','X+1=1','X*0=0','X*0=1','X*1=0','X*1=1','X*2=1','M*h=h','M*h=(2*x+h)*h','h*M=(2*x+h)*h','X=e-e','Y=2*3','Y=x*3','X*y*g=y*3*g','0*1=0','0*X=0','(2*x+h)*h=M*h','(2*x+H)*H=M*H','M*H=(2*x+H)*H','Y=X*3','2*X=X','X=X*2','X=2*X','X*2=X','X=Y*X','X=X','Y=(2*x+H)*H','Y*X=1']
	}

	static prog() {//1,57,58,59
		return String.raw`
:- op(0800,xfx,@).
:- op(0900,xfx,<-).
:- op(1000,xfx,<--).
:- op(1100,xfx,<---).
:- op(1200,xfx,<----).

:- dynamic see/0.

if(Condition,Statement) :- Condition->Statement ; true .

shop(Text) :- if(see, (write('□ '),writeln(Text))) .
show(Text) :- if(see, (write('. '),writeln(Text))) .
succ(Text) :- if(see, (write('+ '),writeln(Text))) .

prepro(0,sum([])) :- shop(('1',0)) , ! .
prepro(1,prod([])) :- shop(('2',1)) , ! .
prepro(f(X),Ans) :- shop(('3',f(X))) , prepro(X*X, Ans) , ! .
prepro(A+B,Ans) :- shop(('4',A+B)) , prepro(A,AP) , prepro(B,BP) , getsum(AP,AL) , getsum(BP,BL) , conc(AL,BL,LR) , prepro(sum(LR),Ans) , ! .
prepro(A*B,Ans) :- shop(('5',A*B)) , prepro(A,AP) , prepro(B,BP) , getprod(AP,AL) , getprod(BP,BL) , conc(AL,BL,LR) , prepro(prod(LR),Ans) , ! .
prepro(A-B,AP-BP) :- shop(('6',A-B)) , prepro(A,AP) , prepro(B,BP) , ! .
prepro(A/B,AP/BP) :- shop(('7',A/B)) , prepro(A,AP) , prepro(B,BP) , ! .
prepro(A@B=C, AP@B=CP) :- shop(('8',A/B)) , prepro(A,AP) , prepro(C,CP) , ! .
prepro(X,X) :- shop(('9',X)) , ! .

flat(prod([H]),Ans) :- flat(H,Ans) , ! .
flat(sum([H]),Ans) :- flat(H,Ans) , ! .
flat(prod(L),Ans) :- select(prod(A),L,L2) , append(A,L2,L3) , flat(prod(L3),Ans) , ! .
flat(sum(L),Ans) :- select(sum(A),L,L2) , append(A,L2,L3) , flat(sum(L3),Ans) , ! .
flat(prod(L),prod(L2)) :- maplist(flat,L,L2) , ! .
flat(sum(L),sum(L2)) :- maplist(flat,L,L2) , ! .
flat(X,X) :- ! .

getprod(A,Ans) :- flat(A,prod(Ans)) , ! .
getprod(A,[A1]) :- flat(A,A1) , ! .

getsum(A,Ans) :- flat(A,sum(Ans)) , ! .
getsum(A,[A1]) :- flat(A,A1) , ! .	

conc(A,B,Ans) :- append(A,B,C) , msort(C,S) , reverse(S,Ans) .

go(prod(L),Ans) :- show(('01',prod(L))) , conc(L,[],LR) , L\=LR , go(prod(LR),Ans) , succ(('01',Ans)) , ! .
go(prod([sum([]),B]),sum([])) :- show(('02',prod([sum([]),B]))) , succ(('02',sum([]))) , ! .
go(prod([sum([H|T]),B]),Ans) :- show(('03',prod([sum([H|T]),B]))) , SH=prod([H,B]) , go(prod([sum(T),B]),ST) , go(sum([SH|[ST]]),Ans) , succ(('03',Ans)) , ! .
go(prod([A,B,C|T]),Ans) :- show(('04',prod([A,B,C]))) , go(prod([A,B]),AB) , go(prod([AB,C|T]),Ans) , succ(('04',Ans)) , ! .
go(sum([H|T]),Ans) :- show(('05',sum([H|T]))) , go(H,HS) , go(sum(T),TS) , getsum(HS,HL) , getsum(TS,TL) , conc(HL,TL,LS) , Ans=sum(LS) , succ(('05',Ans)) , ! .
go(A-B,Ans) :- show(('06',A-B)) , go(A,A0) , getsum(A0,A1) , go(B,B0) , getsum(B0,[B1]) , select(B1,A1,L) , go(sum(L),Ans) , succ(('06',Ans)) , ! .
go(N/D,Ans) :- show(('07',N/D)) , go(N,N0) , getprod(N0,N1) , go(D,D1) , D1\=sum([]) , select(D1,N1,L) , go(prod(L),Ans) , succ(('07',Ans)) , ! .
go(N/D,Ans) :- show(('08',N/D)) , go(N,sum([H|T])) , go(D,D1) , go(H/D1,H1) , go(sum(T)/D1,T0) , getsum(T0,T1) , go(sum([H1|T1]),Ans) , succ(('08',Ans)) , ! .
go(A@A=B,B) :- show(('09',A@A=B)) , succ(('09',B)) , ! .
go(A@B=C,Ans) :- show(('10',A@B=C)) , go(A,sum([H|T])) , go(H@B=C,H1) , go(sum(T)@B=C,sum(T1)) , go(sum([H1|T1]),Ans) , succ(('10',Ans)) , ! .
go(A@B=C,Ans) :- show(('11',A@B=C)) , go(A,prod([H|T])) , go(H@B=C,H1) , go(prod(T)@B=C,prod(T1)) , go(prod([H1|T1]),Ans) , succ(('11',Ans)) , ! .
go(A@B,Ans) :- show(('12',A@B)) , go(A,Ans) , succ(('12',Ans)) , ! .
go(X,X) :- show(('13',X)) , succ(('13',X)) , ! .

postpro(prod([]),1) :- shop(('1',prod([]))) , ! .
postpro(sum([]),0) :- shop(('2',sum([]))) , ! .
postpro(X,X) :- shop(('3',X)) , ! .

<----(Answer,X) :- if(not(see),assert(see)) , show("PreProcessing") , prepro(X,Answer) .	%	PreProcess
<---(Answer,X) :- <----(P,X) , show("Simplifying") , go(P,Answer) .							%	Simplify
<--(Answer,X) :- <---(Simp,X) , show("PostProcessing") , postpro(Simp,Answer) .				%	PostProcess
<-(Answer,X) :- if(see,retract(see)) , prepro(X,P) , go(P,Simp) , postpro(Simp,Answer) .	%	Quiet
`
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

	static french() {
		return `Fat,Disease,Country
1,3,US
2,4,US
3,1,FR
4,2,FR
`
	}

	static hire() {
		return `Sex,Race,Job
F,B,No
F,W,Yes
M,B,Yes
M,W,No
`
	}

	static car() {
		return `Sex,Wealth,WealthDisplay
F,Poor,No
F,Rich,No
M,Poor,No
M,Rich,Yes
`
	}

	static or0() {
		return `Var1,Var2,Var3
0,0,0
1,0,1
1,1,0
1,1,1
`
	}

	static or1() {
		return `Var1,Var2,Var3
0,0,0
0,1,1
1,1,0
1,1,1
`
	}

	static or2() {
		return `Var1,Var2,Var3
0,0,0
0,1,1
1,0,1
1,1,1
`
	}

	static coin() {
		return `Coin1,Coin2,Or
Heads,Heads,True
Heads,Tails,True
Tails,Heads,True
Tails,Tails,False
`
	}

	static drug() {
		return Frame.str2frame(`_Count,Drug,Recover,Sex
7,1,1,M
1,1,0,M
23,0,1,M
4,0,0,M
26,1,1,F
8,1,0,F
5,0,1,F
3,0,0,F
`).uncompact().toString()
	}

	static test() {
		return Frame.str2frame(`_Count,Actual,Test,Hospital
96,+,+,1
32,+,-,1
64,-,+,1
64,-,-,1
`).uncompact().toString()
	}

	static berk() {
		return Frame.str2frame(`_Count,Sex,Admit,Dept
62,M,1,A
63,M,1,B
37,M,1,C
33,M,1,D
38,M,1,E
06,M,1,F
82,F,1,A
68,F,1,B
34,F,1,C
35,F,1,D
24,F,1,E
07,F,1,F
38,M,0,A
37,M,0,B
63,M,0,C
67,M,0,D
62,M,0,E
94,M,0,F
18,F,0,A
32,F,0,B
66,F,0,C
65,F,0,D
76,F,0,E
93,F,0,F
`).uncompact().toString()
	}

static kill() {
		return `Icecream,Shark,Season
166, 65,1
194, 41,1
178, 42,1
213, 71,2
239,140,3
265,142,3
293,163,4
298,158,4
165, 54,1
300,173,4
280,145,4
152, 31,1
147, 53,1
249,110,3
262,140,3
252,109,3
249,126,3
306,163,4
282,172,4
211,105,2
274,166,4
199, 95,2
287,168,4
257,151,4
290,172,4
165, 28,1
202, 86,1
240,127,3
280,143,4
259,127,3
253,137,3
275,166,4
246,133,3
243,118,3
233, 87,2
206, 88,2
161, 75,1
249,149,3
300,185,4
286,186,4
242,116,3
199, 84,2
243,126,3
154, 52,1
214, 91,2
263,146,3
180, 78,2
288,202,4
291,163,4
186, 27,1
295,167,4
170, 43,1
186, 50,1
192, 89,2
184, 98,2
281,183,4
305,186,4
285,168,4
291,167,4
208, 79,2
183,113,2
270,151,4
214, 80,2
173, 60,1
251,142,3
305,162,4
215, 90,2
278,183,4
206, 41,1
309,183,4
246,123,3
198, 67,2
204, 73,2
161, 40,1
255,131,3
195, 84,2
186, 76,2
200, 92,2
209, 92,2
283,181,4
308,175,4
250,109,3
256,144,3
218, 99,2
153, 52,1
190, 65,1
158, 70,1
190,100,2
209, 94,2
166, 42,1
257,180,4
247,139,3
200, 98,2
297,172,4
204,115,2
202, 66,2
165, 60,1
206, 83,2
295,188,4
242,142,3
173, 78,1
149, 37,1
224,119,2
242,145,3
291,172,4
215,110,2
167, 23,1
300,175,4
179, 75,1
186, 24,1
169, 30,1
203, 55,1
231,119,3
300,163,4
294,193,4
160, 37,1
238,143,3
158, 40,1
179, 53,1
189, 54,1
269,167,4
304,151,4
196, 95,2
123, 12,1
228,138,3
259,145,3
253,123,3
201, 98,2
177, 67,1
270,187,4
292,143,4
264,139,3
284,172,4
243,126,3
207, 97,2
269,181,4
286,172,4
247,134,3
274,185,4
272,141,4
178, 59,1
219, 92,2
256,160,4
246,114,3
168, 44,1
177, 57,1
167, 38,1
278,181,4
208, 74,2
260,149,4
181, 99,2
192, 41,1
273,175,4
208, 93,2
304,187,4
257,142,3
239, 99,3
298,182,4
287,136,4
180, 23,1
293,168,4
157, 44,1
159, 39,1
259,133,3
277,110,3
242,127,3
215,105,2
249,142,3
213, 82,2
169, 43,1
156, 39,1
175, 53,1
235, 89,2
178, 53,1
249,143,3
217, 80,2
272,120,3
225, 77,3
154, 23,1
220,139,3
264,147,3
192, 79,2
299,160,4
266,120,3
204, 91,2
206, 89,2
254,120,3
294,161,4
312,145,4
185, 99,2
208, 79,2
203, 85,2
177, 42,1
319,170,4
154, 53,1
219, 94,2
236,119,3
242,129,3
237, 85,2
304,190,4
151, 86,1
167, 34,1
260,104,3
245,131,3
193, 83,2
276,162,4
270,167,4
184, 43,1
220, 92,2
220, 83,2
231,125,3
211, 79,2
241, 74,2
157, 68,1
212, 78,2
212, 98,2
190,100,2
276,160,4
144, 37,1
281,164,4
237, 84,3
267,127,3
258,121,3
303,148,4
304,182,4
185, 56,1
265,117,3
208, 92,2
247,148,3
166, 41,1
268,167,4
185, 28,1
222, 96,2
221,108,2
195,104,2
223, 84,2
184, 60,1
172, 43,1
165, 55,1
291,160,4
279,167,4
227, 71,2
209, 69,2
149, 45,1
199, 94,2
223, 76,2
160, 61,1
204, 98,2
195,106,2
221,126,3
250,120,3
225, 83,2
195, 39,1
259,141,3
279,165,4
175, 44,1
222, 90,2
315,161,4
190, 69,1
291,162,4
216,110,2
186, 29,1
229, 49,2
295,156,4
234,123,3
168,103,2
311,180,4
179, 39,1
175, 64,1
194, 48,1
161, 64,1
266,169,4
288,179,4
218, 89,2
254,116,3
225, 88,2
215, 76,2
181, 66,1
175, 54,1
215, 90,2
285,186,4
152, 39,1
210, 67,2
243,109,3
245,110,3
279,152,3
291,158,4
189, 46,1
186, 63,1
220,122,3
275,154,4
239,110,2
216,101,2
198, 48,1
161,  0,1
175, 65,1
247,119,3
281,148,4
248,121,3
218,101,2
300,169,4
267,175,4
234,123,3
242,128,3
187, 47,1
222, 80,2
197, 72,2
280,167,4
227,156,3
308,179,4
204,106,2
206, 77,2
313,178,4
190, 51,1
264,140,3
148, 23,1
256, 98,3
157, 62,1
228,141,3
217, 80,2
259,189,4
162, 62,1
211, 64,2
203, 97,2
291,138,4
224,100,2
182, 55,1
292,166,4
147, 78,1
249,125,3
263,109,3
299,164,4
205, 71,1
280,174,4
253,149,3
153, 56,1
226,129,3
178, 50,1
250,143,3
244,135,3
241, 96,2
224,114,2
252,126,3
260,161,3
258,127,3
242,137,3
184, 71,2
229,131,3
239,117,3
220,113,2
290,179,4
234,129,3
243,149,3
186, 47,1
273,184,4
259,118,3
205,100,2
280,155,4
192,108,2
243,117,3
251,137,3
309,153,4
171, 41,1
299,169,4
195, 45,1
181, 61,2
136, 51,1
189,100,2
240,131,3
177, 16,1
206,117,2
166, 64,1
253,117,3
277,185,4
185, 87,2
162, 63,1
312,164,4
149, 56,1
288,175,4
207, 71,2
166, 67,1
174, 88,2
218, 84,2
198, 97,2
168, 28,1
216, 96,2
286,173,4
219, 72,2
192, 72,2
226,116,3
177, 79,1
175, 43,1
156, 47,1
207,113,2
224,124,3
186, 33,1
290,143,4
226, 95,2
179, 66,1
188, 95,2
285,176,4
317,166,4
288,151,4
244,115,3
185, 48,1
203, 90,2
224,100,2
274,126,3
183, 48,1
218, 90,2
179, 36,1
184, 71,1
164, 18,1
213,123,3
210,103,2
158, 36,1
189, 26,1
256,114,3
209, 90,2
283,190,4
253,131,3
148, 38,1
238,143,3
242,141,3
220, 94,2
294,186,4
314,185,4
266,135,4
232,128,2
250,137,3
231,156,3
212, 92,2
284,170,4
155, 28,1
286,165,4
202,121,2
242,124,3
247,155,3
206, 97,2
235,127,3
245,112,3
199,115,2
155, 67,1
275,142,4
178, 60,1
289,175,4
247,145,3
213,152,3
250,139,3
220, 91,2
242, 79,2
175, 75,1
252,150,4
154, 39,1
295,167,4
251,117,3
205, 73,2
173, 76,1
273,147,3
243,113,3
208, 38,1
244,137,3
157, 31,1
194, 48,1
253,114,3
240,141,3
283,173,4
184, 83,2
253,164,3
227, 62,2
153, 19,1
216,103,2
299,181,4
199, 55,1
284,170,4
241,110,2
300,171,4
294,172,4
215, 70,2
266,115,3
152, 26,1
221, 83,2
220,109,2
224, 78,2
204,113,2
173, 57,1
298,169,4
199, 60,2
194, 71,2
174, 51,1
210, 89,2
309,162,4
302,177,4
224, 83,2
202, 53,1
282,152,4
189, 35,1
293,159,4
290,174,4
208,109,2
294,175,4
272,166,4
262,157,3
294,184,4
226, 96,2
268,165,4
203, 91,2
203,  8,1
268,167,4
268,138,4
294,197,4
163, 41,1
278,123,3
282,147,3
255,115,3
259,129,3
134, 76,1
247,120,3
197, 97,2
238,124,3
243,115,3
177, 36,1
167, 77,1
199, 73,2
298,169,4
291,161,4
287,187,4
141, 52,1
232,154,3
296,179,4
292,174,4
212, 84,2
256,131,3
267,121,3
213, 70,2
251,154,3
242,134,3
163, 40,1
250,145,3
210, 78,2
233,160,3
273,149,4
270,163,4
246,140,3
244,127,3
225, 93,2
222,112,2
166, 69,1
226,117,3
263,126,3
153, 51,1
304,180,4
242,140,3
211,103,2
176, 43,1
307,170,4
289,144,4
192,111,2
267,171,4
259,139,3
252,127,3
296,173,4
287,192,4
161, 52,1
309,166,4
230,145,3
241,114,3
157, 73,1
214,112,2
241,140,3
210,120,2
171, 17,1
196, 87,2
204, 72,2
268,123,3
249,152,3
180, 49,1
227, 91,2
257,136,3
265,133,3
220, 98,2
149, 59,1
186, 68,1
150, 26,1
167, 53,1
244,112,3
322,166,4
242,144,3
294,178,4
231, 92,2
282,171,4
200, 77,2
183, 80,2
179, 44,1
274,167,4
250,129,3
169, 72,1
279,174,4
185, 88,2
285,106,3
270,152,4
171, 38,1
245,135,3
157, 51,1
232, 90,2
219, 86,2
297,186,4
299,206,4
273,185,4
308,172,4
206, 79,2
179, 44,1
208, 94,2
180, 33,1
211, 73,2
287,177,4
285,152,4
203, 62,2
218, 69,2
286,114,3
202, 77,2
220,128,3
296,181,4
223, 85,2
255,105,3
210,121,2
291,185,4
137, 48,1
218, 79,2
228,104,3
182, 79,2
281,171,3
240, 76,2
212,116,2
168, 51,1
170, 55,1
244,133,3
283,193,4
204, 86,1
237, 87,2
254,116,3
219, 62,2
239,128,3
303,187,4
158, 58,1
289,168,4
286,152,4
307,147,4
220, 85,2
220, 84,2
216,111,2
236,134,3
157, 51,1
230,102,2
162, 66,1
265,125,3
306,181,4
174, 42,1
303,161,4
199, 48,2
239,143,3
210, 73,2
164, 47,1
209, 63,2
213, 87,2
228,145,3
212,107,2
305,158,4
260,106,3
218, 97,2
210, 70,2
279,165,4
177, 45,1
209, 69,2
237, 68,2
289,163,4
209, 76,2
282,191,4
179, 52,1
189,115,2
247,111,3
313,180,4
257,122,3
233,144,3
190, 58,1
248,120,3
270,160,4
254,127,3
223, 79,2
237,149,3
238,128,3
295,160,4
157, 59,1
245,122,3
249,117,3
261,124,3
226,142,3
184, 19,1
165, 78,1
167, 39,1
204,101,2
253,110,3
160, 51,1
261,133,3
218, 89,2
155, 39,1
212, 87,2
155, 48,1
195, 96,2
310,203,4
209,100,2
228, 61,2
281,187,4
147, 53,1
192, 61,1
198, 81,2
201,107,2
214, 91,2
274,155,3
285,181,4
312,166,4
306,159,4
291,180,4
264,124,3
260,111,3
168, 29,1
200, 75,2
302,155,4
275,128,3
297,162,4
307,154,4
301,167,4
179,106,2
243,102,3
262,141,3
288,162,4
213, 76,2
242,120,3
180, 77,2
280,176,4
219,128,3
225, 78,2
231,153,3
200,101,2
188, 46,1
223,126,3
251,188,4
124, 75,1
159, 55,1
292,166,4
240,116,3
215, 72,2
235,128,3
211, 98,2
206, 88,2
307,148,4
212, 87,2
286,136,4
289,195,4
285,160,4
278,141,4
257,195,4
192, 72,2
205,107,2
250,148,3
249,151,3
239,137,3
280,161,4
236,118,3
296,176,4
259,135,3
160, 40,1
267,127,3
307,180,4
243,126,3
192, 64,1
197, 47,1
234,132,3
288,165,4
266,156,4
161, 45,1
262,140,3
311,196,4
207, 98,2
189, 57,1
234,112,2
155, 78,1
278,164,4
171, 50,1
163, 35,1
249,112,3
215,140,2
207, 95,2
284,182,4
216, 97,2
235,145,3
203, 86,2
181, 67,1
302,162,4
142, 57,1
161, 63,1
201, 33,1
185,113,2
189, 43,1
160, 35,1
190, 95,2
204, 75,1
152, 55,1
284,145,4
283,142,3
325,193,4
175, 80,2
157, 27,1
231,115,3
291,174,4
206, 98,2
218,101,2
148, 53,1
149, 78,1
158, 57,1
267,177,4
216, 85,2
248,118,3
189, 49,1
206, 79,2
291,160,4
219, 75,2
192, 44,1
301,172,4
250,140,3
173, 48,1
260,150,3
190,102,2
157, 32,1
250,127,3
257,133,3
215, 92,2
177, 52,1
270,133,3
235,129,3
194, 97,2
250,114,3
217, 84,2
165, 29,1
180,  9,1
213,106,2
289,180,4
240,154,3
245,144,3
253,114,3
200, 94,2
181,104,2
268,139,3
231,144,3
246,122,3
249,145,3
296,192,4
186, 67,2
305,190,4
256,122,3
301,145,4
303,152,4
276,157,4
262,118,3
222,115,3
150, 77,1
251,143,3
237,123,3
156, 35,1
190,112,2
309,155,4
300,145,4
224, 97,2
257,182,4
258,156,3
239, 81,2
212, 83,2
306,171,4
235,127,2
218, 62,2
225, 50,2
190, 73,2
259,147,3
280,174,4
213, 87,2
235,125,3
132, 45,1
199,106,2
229,101,2
165, 84,1
238, 93,3
174, 61,1
270,118,3
181, 48,1
238, 90,2
293,173,4
299,168,4
252,140,4
264,125,3
249,168,4
230,129,3
230, 59,2
163, 43,1
280,131,3
207, 64,2
276,156,4
204, 90,2
268,147,3
172, 45,1
230,147,3
206,106,2
178, 45,1
297,170,4
163, 33,1
196, 77,2
287,179,4
252,132,3
284,132,3
279,186,4
220,114,2
199, 44,1
270,108,3
262,142,3
295,167,4
223,140,3
224,150,3
264,173,4
216, 53,2
146, 33,1
207, 92,2
182, 50,1
203, 69,2
188,102,2
283,177,4
182, 45,1
287,166,4
245,137,3
157, 74,1
281,189,4
295,157,4
186, 82,2
176, 48,1
292,157,4
163, 44,1
212, 83,2
267,119,3
315,177,4
206, 89,2
260,149,3
256,125,3
197, 92,2
162, 50,1
219, 86,2
200,100,2
199, 55,2
174, 41,1
162, 45,1
251,115,3
279,182,4
221, 80,2
198, 74,2
292,148,4
175, 28,1
236,118,3
218, 83,2
285,169,4
207, 94,2
171, 40,1
273,121,3
167, 64,1
281,194,4
289,162,4
281,169,4
289,179,4
178, 57,1
227,105,2
181, 40,1
268,160,4
293,170,4
237,124,3
287,159,4
163, 61,1
226,117,3
185, 64,1
277, 85,3
293,176,4
183, 50,1
233,122,3
296,200,4
289,167,4
196, 92,2
190, 82,2
281,150,4
184, 46,1
172, 55,1
221, 74,2
207, 80,2
245,153,3
215, 61,2
249,120,3
`
	}

static stone() {
		return Frame.str2frame(`_Count,Treatment,Success,Stone Size
071,A,0,Large
192,A,1,Large
006,A,0,Small
081,A,1,Small
025,B,0,Large
055,B,1,Large
036,B,0,Small
234,B,1,Small
`).uncompact().toString()
	}

	static day0() {
		return `Sex,Source,Day
F,https://www.justiceatwork.com/equal-pay-day-2021/,2024-03-24
F,https://www.industriall-union.org/international-equal-pay-day,2024-09-18
F,http://www.equalpaytoday.org/equal-pay-day,2024-03-12
F,https://english.colostate.edu/news/equal-pay-day/,2024-04-10
F,https://www.aauw.org/resources/article/equal-pay-day-calendar/,2024-03-12
F,https://universe.byu.edu/2022/03/17/equal-pay-day-draws-attention-the-gender-wage-gap-that-plagues-the-u-s/,2024-03-15
F,https://wwwdev.tridelta.org/the-trident/what-equal-pay-day-means-for-your-financial-future/,2024-03-24
F,https://www.zonta.org/Web/Web/News_Events/Articles/Zonta_International_commemorates_International_Equal_Pay_Day_2022.aspx,2024-09-18
F,https://www.nationaldaycalendar.com/national-day/national-equal-pay-day-changes-annually,2024-03-14
F,https://www.rochester.edu/sba/equal-pay-day-2024/,2024-03-12
F,https://alltogether.swe.org/2021/03/demand-equal-pay-for-all-women/,2024-03-24
F,https://www.energy.gov/articles/even-equal-pay-day-not-equal,2024-03-24
F,https://www.nawrb.com/equalpayday2020/,2024-03-31
F,https://www.facebook.com/p/International-Equal-Pay-Day-18-September-100064784198520/,2024-09-18
F,https://elevatebdg.com/equal-pay-day-march-15-2022/,2024-03-15
F,https://www.sagaftra.org/17th-annual-new-york-state-equal-pay-day,2024-03-14
F,https://www.uppermichiganssource.com/2024/03/12/gov-whitmer-proclaims-march-12-equal-pay-day/,2024-03-12
F,https://www.senatorvillanueva.com/news/234-villanueva-marks-march-12-as-equal-pay-day,2024-03-12
F,http://forlocals.ufcw.org/2024/03/04/make-your-voices-heard-on-womens-equal-pay-day-3/,2024-03-12
F,https://www.goiam.org/news/departments/hq/womens-human-rights-and-young-workers/womens-rights-womens-human-rights-veterans-community-services/latina-equal-pay-day-2023-is-october-5/,2024-10-05
F,https://www.equalrights.org/viewpoints/equal-pay-day-2022/,2024-03-15
F,https://www.linkedin.com/pulse/international-equal-pay-day-sarah-o-loughlin?trk=public_post_main-feed-card_feed-article-content,2024-09-18
F,https://en.wikipedia.org/wiki/Equal_Pay_Day,2024-03-15
F,https://womenlawyers.org/women-lawyers-equal-pay-day/,2024-03-14
F,https://insureequality.medium.com/equal-pay-day-insurance-ranked-worst-for-paying-women-fairly-86653fc5cfdd,2024-03-14
M,https://www.justiceatwork.com/equal-pay-day-2021/,2024-01-01
M,https://www.industriall-union.org/international-equal-pay-day,2024-01-01
M,http://www.equalpaytoday.org/equal-pay-day,2024-01-01
M,https://english.colostate.edu/news/equal-pay-day/,2024-01-01
M,https://www.aauw.org/resources/article/equal-pay-day-calendar/,2024-01-01
M,https://universe.byu.edu/2022/03/17/equal-pay-day-draws-attention-the-gender-wage-gap-that-plagues-the-u-s/,2024-01-01
M,https://wwwdev.tridelta.org/the-trident/what-equal-pay-day-means-for-your-financial-future/,2024-01-01
M,https://www.zonta.org/Web/Web/News_Events/Articles/Zonta_International_commemorates_International_Equal_Pay_Day_2022.aspx,2024-01-01
M,https://www.nationaldaycalendar.com/national-day/national-equal-pay-day-changes-annually,2024-01-01
M,https://www.rochester.edu/sba/equal-pay-day-2024/,2024-01-01
M,https://alltogether.swe.org/2021/03/demand-equal-pay-for-all-women/,2024-01-01
M,https://www.energy.gov/articles/even-equal-pay-day-not-equal,2024-01-01
M,https://www.nawrb.com/equalpayday2020/,2024-01-01
M,https://www.facebook.com/p/International-Equal-Pay-Day-18-September-100064784198520/,2024-01-01
M,https://elevatebdg.com/equal-pay-day-march-15-2022/,2024-01-01
M,https://www.sagaftra.org/17th-annual-new-york-state-equal-pay-day,2024-01-01
M,https://www.uppermichiganssource.com/2024/03/12/gov-whitmer-proclaims-march-12-equal-pay-day/,2024-01-01
M,https://www.senatorvillanueva.com/news/234-villanueva-marks-march-12-as-equal-pay-day,2024-01-01
M,http://forlocals.ufcw.org/2024/03/04/make-your-voices-heard-on-womens-equal-pay-day-3/,2024-01-01
M,https://www.goiam.org/news/departments/hq/womens-human-rights-and-young-workers/womens-rights-womens-human-rights-veterans-community-services/latina-equal-pay-day-2023-is-october-5/,2024-01-01
M,https://www.equalrights.org/viewpoints/equal-pay-day-2022/,2024-01-01
M,https://www.linkedin.com/pulse/international-equal-pay-day-sarah-o-loughlin?trk=public_post_main-feed-card_feed-article-content,2024-01-01
M,https://en.wikipedia.org/wiki/Equal_Pay_Day,2024-01-01
M,https://womenlawyers.org/women-lawyers-equal-pay-day/,2024-01-01
M,https://insureequality.medium.com/equal-pay-day-insurance-ranked-worst-for-paying-women-fairly-86653fc5cfdd,2024-01-01
`
	}

	static day() {
		return `Sex,Source,Days
F,justiceatwork,83
F,industriall-union,261
F,equalpaytoday,71
F,colostate,100
F,aauw,71
F,byu,74
F,tridelta,83
F,zonta,261
F,nationaldaycalendar,73
F,rochester,71
F,alltogether,83
F,energy,83
F,nawrb,90
F,facebook,261
F,elevatebdg,74
F,sagaftra,73
F,uppermichiganssource,71
F,senatorvillanueva,71
F,ufcw,71
F,goiam,278
F,equalrights,74
F,linkedin,261
F,wikipedia,74
F,womenlawyers,73
F,medium,73
M,justiceatwork,0
M,industriall-union,0
M,equalpaytoday,0
M,colostate,0
M,aauw,0
M,byu,0
M,tridelta,0
M,zonta,0
M,nationaldaycalendar,0
M,rochester,0
M,alltogether,0
M,energy,0
M,nawrb,0
M,facebook,0
M,elevatebdg,0
M,sagaftra,0
M,uppermichiganssource,0
M,senatorvillanueva,0
M,ufcw,0
M,goiam,0
M,equalrights,0
M,linkedin,0
M,wikipedia,0
M,womenlawyers,0
M,medium,0
`
	}

	static gap0() {
		return `Sex,Source,Pay
F,https://www.forbes.com/sites/elissasangster/2021/03/24/the-pay-gap-is-real-dont-let-anyone-convince-you-otherwise/,.81
F,https://blog.soroptimist.org/blog/equal-pay-day-what-is-the-gender-gap,.83
F,https://blog.dol.gov/2023/03/14/5-fast-facts-the-gender-wage-gap,.837
F,https://www.statista.com/chart/13182/where-the-gender-pay-gap-is-widest/,.831
F,https://www.vantagecircle.com/en/blog/gender-pay-gap/,.74
F,https://thehill.com/changing-america/respect/equality/3878062-the-gender-pay-gap-has-stayed-largely-unchanged-for-20-years-what-will-it-take-to-close-it/,.82
F,https://www.cnbc.com/2023/03/14/the-wage-gap-gets-worse-when-women-hit-their-30s-heres-why.html,.84
F,https://hbr.org/2019/11/how-to-close-the-gender-pay-gap-in-u-s-medicine,.75
F,https://www.aauw.org/resources/research/simple-truth/,.84
F,https://blog.dol.gov/2024/03/12/what-you-need-to-know-about-the-gender-wage-gap,.84
F,https://i4di.org/pubs/gender-pay-gap-in-the-united-states/,.92
F,https://www.wosu.org/npr-news/npr-news/2023-03-14/its-equal-pay-day-the-gender-pay-gap-has-hardly-budged-in-20-years-what-gives,.82
F,https://www.businessinsider.com/gender-wage-pay-gap-charts-2017-3,.83
F,https://manoa.hawaii.edu/careercenter/women-and-the-gender-pay-gap/,.62
F,https://goodfaithmedia.org/minimal-progress-on-u-s-gender-pay-gap-since-2002/,.82
F,https://www.britannica.com/money/gender-wage-gap,.623
F,https://www.pewresearch.org/short-reads/2023/03/01/gender-pay-gap-facts/,.82
F,https://www.pewresearch.org/short-reads/2023/03/01/gender-pay-gap-facts/,.87
F,https://www.statista.com/chart/4279/the-gender-pay-gap-in-developed-nations-visualised/,.634
F,https://obamawhitehouse.archives.gov/blog/2015/04/14/five-facts-about-gender-pay-gap,.78
F,https://www.washingtonpost.com/business/2024/01/16/gender-pay-gap-women-discussing-wages/,.84
F,https://www.pewresearch.org/short-reads/2023/03/01/gender-pay-gap-facts/,.82
F,https://venngage.com/templates/infographics/the-gender-pay-gap-in-different-industries-and-professions-b5cf3e1a-c72d-495b-9f73-85fa40a93702,.80
F,https://www.payanalytics.com/resources/articles/the-unadjusted-pay-gap-vs-the-adjusted-pay-gap,.90
F,https://www.forbesindia.com/article/rotman/principled-consumption-how-gender-pay-gaps-affect-perpetrators/88697/1,.57
F,https://www.nytimes.com/2021/07/01/business/salary-transparency-pay-gap.html,.96
F,https://news.cornell.edu/stories/2019/02/gender-pay-gap-shrinks-when-companies-disclose-wages,.811
F,https://www.bankrate.com/banking/savings/how-women-can-shrink-the-gender-pay-gap/,.84
F,https://www.countyhealthrankings.org/reports/gender-pay-gap,.77
M,https://www.forbes.com/sites/elissasangster/2021/03/24/the-pay-gap-is-real-dont-let-anyone-convince-you-otherwise/,1
M,https://blog.soroptimist.org/blog/equal-pay-day-what-is-the-gender-gap,1
M,https://blog.dol.gov/2023/03/14/5-fast-facts-the-gender-wage-gap,1
M,https://www.statista.com/chart/13182/where-the-gender-pay-gap-is-widest/,1
M,https://www.vantagecircle.com/en/blog/gender-pay-gap/,1
M,https://thehill.com/changing-america/respect/equality/3878062-the-gender-pay-gap-has-stayed-largely-unchanged-for-20-years-what-will-it-take-to-close-it/,1
M,https://www.cnbc.com/2023/03/14/the-wage-gap-gets-worse-when-women-hit-their-30s-heres-why.html,1
M,https://hbr.org/2019/11/how-to-close-the-gender-pay-gap-in-u-s-medicine,1
M,https://www.aauw.org/resources/research/simple-truth/,1
M,https://blog.dol.gov/2024/03/12/what-you-need-to-know-about-the-gender-wage-gap,1
M,https://i4di.org/pubs/gender-pay-gap-in-the-united-states/,1
M,https://www.wosu.org/npr-news/npr-news/2023-03-14/its-equal-pay-day-the-gender-pay-gap-has-hardly-budged-in-20-years-what-gives,1
M,https://www.businessinsider.com/gender-wage-pay-gap-charts-2017-3,1
M,https://manoa.hawaii.edu/careercenter/women-and-the-gender-pay-gap/,1
M,https://goodfaithmedia.org/minimal-progress-on-u-s-gender-pay-gap-since-2002/,1
M,https://www.britannica.com/money/gender-wage-gap,1
M,https://www.pewresearch.org/short-reads/2023/03/01/gender-pay-gap-facts/,1
M,https://www.pewresearch.org/short-reads/2023/03/01/gender-pay-gap-facts/,1
M,https://www.statista.com/chart/4279/the-gender-pay-gap-in-developed-nations-visualised/,1
M,https://obamawhitehouse.archives.gov/blog/2015/04/14/five-facts-about-gender-pay-gap,1
M,https://www.washingtonpost.com/business/2024/01/16/gender-pay-gap-women-discussing-wages/,1
M,https://www.pewresearch.org/short-reads/2023/03/01/gender-pay-gap-facts/,1
M,https://venngage.com/templates/infographics/the-gender-pay-gap-in-different-industries-and-professions-b5cf3e1a-c72d-495b-9f73-85fa40a93702,1
M,https://www.payanalytics.com/resources/articles/the-unadjusted-pay-gap-vs-the-adjusted-pay-gap,1
M,https://www.forbesindia.com/article/rotman/principled-consumption-how-gender-pay-gaps-affect-perpetrators/88697/1,1
M,https://www.nytimes.com/2021/07/01/business/salary-transparency-pay-gap.html,1
M,https://news.cornell.edu/stories/2019/02/gender-pay-gap-shrinks-when-companies-disclose-wages,1
M,https://www.bankrate.com/banking/savings/how-women-can-shrink-the-gender-pay-gap/,1
M,https://www.countyhealthrankings.org/reports/gender-pay-gap,1
`
	}

	static gap() {
		return `Sex,Source,Pay
F,forbes,.81
F,soroptimist,.83
F,dol,.837
F,statista,.831
F,vantagecircle,.74
F,thehill,.82
F,cnbc,.84
F,hbr,.75
F,aauw,.84
F,dol,.84
F,i4di,.92
F,wosu,.82
F,businessinsider,.83
F,hawaii,.62
F,goodfaithmedia,.82
F,britannica,.623
F,pewresearch,.82
F,pewresearch,.87
F,statista,.634
F,obamawhitehouse,.78
F,washingtonpost,.84
F,pewresearch,.82
F,venngage,.80
F,payanalytics,.90
F,forbesindia,.57
F,nytimes,.96
F,cornell,.811
F,bankrate,.84
F,countyhealthrankings,.77
M,forbes,1
M,soroptimist,1
M,dol,1
M,statista,1
M,vantagecircle,1
M,thehill,1
M,cnbc,1
M,hbr,1
M,aauw,1
M,dol,1
M,i4di,1
M,wosu,1
M,businessinsider,1
M,hawaii,1
M,goodfaithmedia,1
M,britannica,1
M,pewresearch,1
M,pewresearch,1
M,statista,1
M,obamawhitehouse,1
M,washingtonpost,1
M,pewresearch,1
M,venngage,1
M,payanalytics,1
M,forbesindia,1
M,nytimes,1
M,cornell,1
M,bankrate,1
M,countyhealthrankings,1
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
		let datam = Frame.str2frame(Data.sym1()).copy().where(0,'M')
		let dataf = Frame.str2frame(Data.sym1()).copy().where(0,'F').apply(2,x=>x+2000)
		let d = {'Sex':[...datam.dict['Sex'],...dataf.dict['Sex']],
			'Hours':[...datam.dict['Hours'],...dataf.dict['Hours']],
			'Pay':[...datam.dict['Pay'],...dataf.dict['Pay']],
		}
		let data = new Frame(d)
		return data.toString()
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

static voo() {
	return `Date,Close
2024-01-02,434.01001
2024-01-03,430.790009
2024-01-04,429.429993
2024-01-05,429.980011
2024-01-08,436.130005
2024-01-09,435.070007
2024-01-10,437.940002
2024-01-11,437.790009
2024-01-12,437.98999
2024-01-16,436.5
2024-01-17,434.070007
2024-01-18,437.929993
2024-01-19,443.290009
2024-01-22,444.299988
2024-01-23,445.619995
2024-01-24,445.98999
2024-01-25,448.5
2024-01-26,448.230011
2024-01-29,451.48999
2024-01-30,451.170013
2024-01-31,443.820007
2024-02-01,449.660004
2024-02-02,454.279999
2024-02-05,452.619995
2024-02-06,454.029999
2024-02-07,457.76001
2024-02-08,458.070007
2024-02-09,460.670013
2024-02-12,460.459991
2024-02-13,453.970001
2024-02-14,458.290009
2024-02-15,461.390015
2024-02-16,459.029999
2024-02-20,456.51001
2024-02-21,456.970001
2024-02-22,466.570007
2024-02-23,466.779999
2024-02-26,465.070007
2024-02-27,465.929993
2024-02-28,465.209991
2024-02-29,466.929993
2024-03-01,471.429993
2024-03-04,470.869995
2024-03-05,466.149994
2024-03-06,468.619995
2024-03-07,473.26001
2024-03-08,470.390015
2024-03-11,470
2024-03-12,475.029999
2024-03-13,474.309998
2024-03-14,473.269989
2024-03-15,470.01001
2024-03-18,472.950012
2024-03-19,475.600006
2024-03-20,479.75
2024-03-21,481.350006
2024-03-22,479.179993
2024-03-25,477.940002
2024-03-26,476.600006
2024-03-27,480.76001
2024-03-28,480.700012
2024-04-01,480.070007
2024-04-02,476.929993
2024-04-03,477.359985
2024-04-04,471.480011
2024-04-05,476.48999
2024-04-08,476.679993
2024-04-09,477.269989
2024-04-10,472.649994
2024-04-11,476.059998
2024-04-12,469.570007
2024-04-15,463.609985
2024-04-16,462.779999
2024-04-17,459.98999
2024-04-18,458.940002
2024-04-19,455.100006
2024-04-22,459.049988
2024-04-23,464.839996
2024-04-24,464.5
2024-04-25,462.579987
2024-04-26,467.209991
2024-04-29,468.839996
2024-04-30,461.429993
2024-05-01,459.929993
2024-05-02,464.220001
2024-05-03,469.980011
2024-05-06,474.720001
2024-05-07,475.399994
2024-05-08,475.420013
2024-05-09,478.149994
2024-05-10,478.73999
2024-05-13,478.769989
2024-05-14,481.040009
2024-05-15,486.899994
2024-05-16,485.970001
2024-05-17,486.690002
2024-05-20,487.170013
2024-05-21,488.480011
2024-05-22,487.059998
2024-05-23,483.440002
2024-05-24,486.730011
2024-05-28,487.119995
2024-05-29,483.690002
2024-05-30,480.440002
2024-05-31,484.619995
2024-06-03,485.149994
2024-06-04,485.73999
2024-06-05,491.549988
2024-06-06,491.440002
2024-06-07,490.799988
2024-06-10,492.410004
2024-06-11,493.529999
2024-06-12,497.640015
2024-06-13,498.579987
2024-06-14,498.980011
2024-06-17,502.940002
2024-06-18,504.279999
2024-06-20,502.880005
2024-06-21,501.779999
2024-06-24,500.429993
2024-06-25,502.51001
2024-06-26,503.070007
2024-06-27,503.850006
2024-06-28,500.130005
2024-07-01,501.28
2024-07-02,504.53
2024-07-03,506.81
2024-07-05,509.84
2024-07-08,510.33
2024-07-09,510.89
2024-07-10,515.81
2024-07-11,511.39
2024-07-12,514.55
2024-07-15,516.11
2024-07-16,519.04
2024-07-17,511.79
2024-07-18,507.94
2024-07-19,504.55
`
	}

	static chol0() {
		return `Cholesterol,Exercise,Age
138,047,10
203,215,50
106,054,10
164,141,30
161,037,10
248,224,50
162,026,10
204,155,30
201,118,30
207,146,30
165,104,20
172,089,20
227,165,40
179,178,40
190,184,40
192,058,10
220,197,50
198,137,30
216,116,30
231,149,40
149,103,20
122,087,10
166,126,30
195,171,40
228,223,50
184,182,40
141,032,10
194,170,40
218,206,50
146,051,10
181,257,50
226,165,40
220,160,40
119,069,10
122,061,10
122,040,10
206,159,30
233,160,40
149,105,20
152,116,20
136,047,10
232,221,50
140,056,10
153,063,10
149,057,10
163,025,10
212,223,50
209,174,40
151,108,20
186,127,30
169,144,30
182,118,30
168,160,30
136,074,20
178,133,30
196,113,30
137,048,10
215,171,40
191,149,30
219,137,40
`
	}

static chol() {
	return `Exercise,Cholesterol,Age
47,138,10
104,165,20
141,164,30
165,227,40
215,203,50
54,106,10
37,161,10
224,248,50
26,162,10
155,204,30
118,201,30
146,207,30
89,172,20
178,179,40
184,190,40
58,192,10
197,220,50
137,198,30
116,216,30
149,231,40
103,149,20
87,122,10
126,166,30
171,195,40
223,228,50
182,184,40
32,141,10
170,194,40
206,218,50
51,146,10
106,177,20
157,227,40
151,212,40
166,217,40
64,173,20
87,154,20
186,244,50
80,130,20
171,203,40
51,115,10
69,199,20
40,158,10
100,148,20
158,209,40
116,175,30
83,155,20
57,145,10
213,226,50
232,210,50
68,179,20
223,211,50
81,169,20
99,172,20
59,140,10
83,201,20
125,195,30
55,135,10
50,167,10
98,164,20
218,249,50
222,219,50
50,145,10
205,230,50
54,153,10
151,160,30
228,210,50
129,172,30
209,224,50
249,189,50
38,161,10
173,193,40
184,181,40
60,149,10
124,171,30
121,195,30
39,170,10
172,210,40
132,199,30
102,165,20
133,188,30
153,227,40
174,214,40
223,222,50
187,207,40
160,127,30
210,222,50
52,164,10
38,142,10
46,131,10
95,149,20
141,179,30
136,172,30
152,209,40
24,156,10
51,144,10
57,138,10
121,184,30
116,199,30
81,172,20
55,149,10
51,134,10
193,254,50
218,218,50
141,193,30
46,151,10
143,187,30
112,195,30
100,142,20
108,224,30
95,194,20
164,203,40
96,146,20
215,234,50
172,204,40
227,207,50
156,209,30
134,181,30
99,147,20
68,106,10
194,228,50
162,187,40
201,229,50
91,163,20
50,142,10
148,183,40
58,134,10
113,200,30
146,237,40
52,162,10
140,190,30
111,165,20
218,226,50
170,230,40
45,146,10
74,165,20
88,171,20
34,166,10
222,213,50
59,134,10
70,167,20
86,171,20
68,120,10
75,181,20
105,172,20
69,126,10
88,128,20
85,166,20
159,165,30
231,224,50
132,169,30
25,162,10
59,186,20
167,207,40
44,153,10
146,219,40
66,139,10
113,150,20
129,182,30
66,205,20
191,237,50
55,185,10
211,228,50
52,137,10
142,236,40
82,169,20
38,160,10
33,136,10
74,176,20
130,228,40
214,224,50
109,221,30
141,170,30
120,211,30
58,108,10
198,237,50
150,171,30
169,218,40
97,152,20
108,145,20
48,158,10
41,170,10
247,190,50
112,171,30
173,172,40
91,157,20
177,221,40
120,201,30
58,148,10
104,167,20
187,217,40
137,161,30
189,187,40
118,130,20
177,220,40
181,237,50
127,183,30
50,173,10
65,134,10
134,178,30
111,166,20
44,141,10
142,218,40
90,170,20
228,234,50
179,180,40
210,227,50
149,210,30
54,172,10
52,143,10
124,188,30
61,152,10
139,180,30
113,136,20
148,186,30
116,193,30
121,191,30
179,199,40
120,209,30
201,219,50
164,182,40
65,153,20
77,184,20
34,123,10
168,170,40
213,223,50
193,242,50
222,200,50
206,246,50
96,160,20
55,116,10
208,224,50
166,178,40
118,174,20
234,199,50
231,210,50
125,210,30
213,207,50
52,140,10
48,154,10
198,225,50
92,163,20
40,144,10
168,202,40
65,120,10
105,146,20
155,192,30
184,263,50
44,142,10
182,245,50
212,220,50
139,193,30
201,226,50
207,222,50
43,140,10
155,220,40
153,205,40
116,186,30
209,229,50
170,166,40
148,161,30
115,153,20
76,165,20
208,253,50
148,217,40
216,199,50
155,221,40
130,188,30
138,187,30
108,154,20
102,153,20
228,218,50
137,223,40
48,134,10
118,179,30
92,153,20
218,195,50
131,139,30
194,241,50
110,192,30
68,143,10
44,173,10
129,206,30
172,195,40
135,205,30
215,198,50
177,197,40
205,247,50
83,188,20
168,198,40
64,178,10
48,140,10
179,207,40
117,124,20
95,185,20
231,208,50
116,157,20
167,198,40
175,189,40
201,195,50
192,241,50
154,221,40
60,159,20
169,188,40
122,183,30
206,186,40
42,147,10
159,208,40
158,208,40
202,261,50
114,173,30
71,110,10
60,188,20
131,186,30
212,217,50
49,128,10
89,158,20
197,215,40
170,209,40
227,236,50
138,215,30
173,209,40
86,167,20
126,168,30
112,196,30
101,196,30
202,210,50
130,226,40
84,167,20
41,160,10
120,220,30
138,191,30
207,234,50
40,151,10
172,214,40
158,199,40
120,136,20
179,222,40
129,167,30
169,207,40
210,216,50
138,198,30
230,207,50
54,202,20
151,156,30
197,241,50
146,181,30
49,154,10
126,177,30
94,186,20
43,147,10
54,132,10
58,165,10
204,258,50
144,169,30
147,157,30
158,215,40
84,159,20
151,182,40
85,189,20
218,226,50
97,231,30
213,204,50
184,191,40
53,132,10
105,198,30
31,135,10
66,175,20
99,161,20
191,181,40
163,208,40
33,166,10
88,172,20
190,248,50
92,149,20
182,202,40
121,180,20
96,133,20
165,204,40
224,225,50
136,188,30
88,159,20
90,152,20
210,235,50
229,233,50
106,193,30
199,215,50
116,151,20
75,162,20
191,174,40
228,212,50
192,205,40
173,230,40
157,211,40
90,165,20
70,136,10
119,144,20
81,133,10
197,190,40
221,230,50
88,149,20
22,138,10
80,177,20
169,221,40
127,181,30
106,144,20
66,141,10
98,119,20
166,215,40
94,145,20
197,226,50
81,152,20
131,175,30
123,181,30
224,242,50
119,213,30
172,229,40
108,131,20
130,177,30
117,197,30
225,247,50
142,174,30
117,200,30
131,174,30
210,223,50
55,134,10
58,157,10
105,186,30
69,137,10
226,226,50
33,161,10
101,171,20
191,202,40
222,229,50
44,138,10
76,153,20
94,214,20
148,212,40
185,156,40
129,176,30
190,210,50
168,219,40
142,212,40
176,212,40
137,170,30
179,175,40
103,150,20
123,191,30
155,213,40
110,172,20
119,153,20
83,116,10
184,201,40
59,145,10
214,224,50
156,207,40
129,181,30
121,191,30
81,187,20
101,164,20
191,172,40
100,156,20
192,185,40
155,216,40
192,192,40
174,216,40
172,198,40
74,158,20
108,159,20
178,166,40
171,195,40
48,143,10
57,135,10
224,234,50
125,198,30
193,193,40
170,205,40
61,134,10
190,185,40
215,218,50
208,223,50
209,235,50
53,145,10
131,192,30
99,158,20
133,167,30
225,225,50
167,191,40
39,156,10
34,139,10
219,239,50
106,133,20
33,169,10
180,241,50
26,169,10
48,175,10
48,117,10
168,147,30
84,152,20
28,152,10
222,207,50
220,225,50
158,225,40
207,205,50
74,174,20
228,204,50
175,192,40
203,219,50
133,174,30
36,129,10
120,201,30
107,152,20
51,143,10
215,232,50
218,189,50
69,164,20
131,184,30
122,183,30
88,136,20
140,174,30
136,188,30
135,204,30
88,172,20
150,238,40
107,179,30
219,223,50
110,201,30
201,202,50
93,169,20
168,191,40
112,212,30
67,174,20
112,201,30
90,163,20
131,182,30
62,135,10
57,153,10
126,202,30
183,248,50
76,121,10
178,188,40
141,174,30
93,152,20
195,206,50
167,196,40
78,150,20
44,156,10
41,113,10
149,188,40
68,157,10
174,192,40
139,168,30
178,172,40
107,135,20
40,143,10
126,184,30
158,198,40
187,198,40
102,167,20
218,217,50
182,250,50
116,163,20
73,115,10
211,234,50
178,164,40
195,240,50
182,211,40
212,244,50
83,190,20
136,184,30
197,218,50
82,165,20
203,240,50
211,225,50
149,163,30
64,167,20
93,166,20
183,222,40
209,254,50
50,170,10
212,228,50
176,195,40
195,179,40
162,237,40
54,146,10
193,256,50
182,211,40
168,217,40
47,144,10
48,144,10
139,198,30
171,202,40
183,264,50
152,225,40
36,152,10
35,180,10
133,173,30
84,153,20
208,250,50
131,166,30
185,189,40
173,191,40
143,201,30
53,143,10
74,134,10
134,175,30
120,174,30
46,173,10
169,178,30
42,164,10
192,244,50
107,145,20
165,196,40
111,228,30
139,170,30
169,207,40
155,220,40
169,250,50
171,224,40
158,208,40
163,217,40
56,141,10
31,185,10
137,162,30
62,109,10
117,170,30
133,181,30
110,203,30
62,152,10
171,190,40
208,210,50
143,177,30
74,170,20
83,154,20
39,149,10
40,140,10
213,232,50
39,150,10
30,137,10
69,170,20
192,191,40
32,167,10
173,223,40
103,159,20
124,186,30
79,155,20
135,189,30
191,249,50
212,228,50
222,222,50
118,192,30
76,180,20
215,206,50
165,204,40
104,172,20
149,182,30
154,225,40
135,181,30
124,179,30
175,204,40
157,191,30
118,205,30
55,156,10
38,139,10
60,135,10
207,235,50
181,207,40
64,150,10
70,168,20
144,200,30
156,191,40
134,188,30
60,195,20
202,186,50
100,162,20
101,175,20
25,147,10
78,99,10
72,127,10
194,225,50
197,216,50
223,233,50
101,202,30
164,179,40
141,190,30
183,208,40
145,215,40
45,129,10
55,157,10
198,219,50
37,120,10
162,173,40
51,138,10
45,146,10
207,210,50
127,213,30
148,207,30
98,165,20
81,146,20
99,133,20
68,116,10
106,216,30
151,188,40
72,188,20
44,150,10
182,210,40
75,139,10
89,123,20
107,153,20
210,228,50
92,160,20
210,224,50
40,137,10
228,231,50
211,242,50
86,169,20
160,149,30
131,183,30
140,186,30
58,143,10
183,223,50
125,162,30
119,180,30
113,165,20
133,191,30
194,230,50
198,235,50
81,162,20
205,202,50
41,149,10
158,218,40
187,265,50
61,138,10
175,219,40
70,126,10
69,134,10
73,133,10
98,170,20
139,187,30
55,122,10
137,186,30
77,175,20
198,223,50
97,164,20
123,195,30
188,163,40
39,182,10
71,113,10
70,128,10
253,216,50
100,145,20
138,139,30
162,207,40
42,137,10
104,131,20
75,176,20
207,219,50
129,193,30
234,183,50
99,211,30
193,230,50
172,225,40
122,173,30
116,204,30
204,221,50
63,151,10
65,141,10
216,219,50
161,211,40
186,181,40
50,143,10
206,248,50
124,179,30
93,156,20
103,184,20
176,201,40
128,181,30
200,203,50
74,167,20
21,159,10
153,190,30
114,230,30
49,150,10
82,167,20
175,180,40
103,168,20
138,196,30
207,233,50
158,149,30
99,198,30
128,204,30
80,169,20
221,206,50
120,156,20
160,223,40
132,200,30
39,160,10
150,230,40
177,204,40
48,127,10
127,183,30
160,230,40
65,185,20
117,207,30
123,180,30
39,142,10
188,236,50
88,160,20
103,200,30
32,154,10
80,144,20
103,142,20
107,167,20
176,212,40
66,192,20
135,194,30
203,233,50
135,201,30
214,236,50
103,169,20
166,216,40
115,204,30
97,160,20
45,150,10
57,151,10
137,179,30
159,184,40
65,150,10
27,160,10
126,211,30
204,203,40
128,186,30
76,145,10
174,204,40
231,229,50
41,153,10
108,215,30
100,164,20
124,199,30
168,201,40
206,205,50
53,144,10
161,167,30
142,168,30
26,173,10
54,175,10
45,152,10
189,235,50
240,205,50
182,186,40
199,225,50
117,191,30
175,204,40
21,157,10
225,219,50
77,178,20
238,222,50
105,184,20
187,215,40
102,172,20
84,157,20
146,239,40
131,202,30
184,199,40
212,212,50
170,190,40
230,202,50
170,197,40
42,157,10
153,168,30
25,140,10
222,205,50
39,156,10
70,184,20
58,160,10
46,137,10
92,135,20
209,233,50
119,191,30
147,180,30
116,151,20
170,232,50
144,157,30
112,162,20
61,151,10
136,201,30
96,176,20
180,182,40
65,131,10
125,185,30
142,222,40
113,190,30
201,232,50
138,177,30
207,229,50
43,161,10
243,200,50
181,223,50
78,157,20
75,184,20
73,178,20
135,171,30
64,141,10
205,215,50
197,214,50
90,152,20
196,233,50
188,185,40
101,161,20
72,180,20
137,193,30
138,159,30
131,170,30
160,162,30
116,209,30
104,201,30
94,154,20
186,219,50
164,207,40
114,214,30
172,199,40
204,236,50
206,225,50
127,182,30
197,245,50
107,189,30
122,171,30
165,169,40
101,172,20
237,211,50
138,182,30
104,155,20
162,252,40
180,196,40
102,131,20
21,163,10
156,160,30
194,170,40
155,185,40
176,208,40
214,211,50
141,168,30
37,174,10
126,186,30
142,163,30
94,170,20
34,136,10
115,141,20
182,256,50
189,201,40
116,201,30
161,194,40
129,199,30
184,164,40
72,170,20
181,185,40
157,217,40
65,128,10
141,187,30
200,198,40
37,128,10
53,129,10
39,150,10
70,157,20
83,155,20
30,154,10
104,144,20
161,233,40
63,150,10
89,156,20
91,151,20
257,181,50
165,226,40
160,220,40
69,119,10
61,122,10
40,122,10
159,206,30
160,233,40
105,149,20
116,152,20
47,136,10
221,232,50
56,140,10
63,153,10
57,149,10
25,163,10
223,212,50
174,209,40
108,151,20
127,186,30
144,169,30
118,182,30
160,168,30
74,136,20
133,178,30
113,196,30
48,137,10
171,215,40
149,191,30
137,219,40
`
	}

	static econ0() {
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
