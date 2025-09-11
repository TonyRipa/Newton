
/*
	Author:	Anthony John Ripa
	Date:	8/20/2025
	Prolog:	A prolog library
*/

class prolog {

	static do(queryid, programid, answerid) {
		let s = pl.create();
		let program = get_input(programid).split('\n')
					.map(x=>(x.includes('dynamic')&&!x.includes('('))?x.slice(0,x.indexOf('c')+1)+'('+x.slice(x.indexOf('c')+2,-1)+').':x)
					.join('\n')
		s.consult(prolog.lib() + program)
		s.query(get_input(queryid));
		s.answer({success:x=>set_textarea(answerid,s.format_answer(x))})
	}

	static lib() {
		return String.raw`
:- dynamic(global_var/2) .
nb_setval(Name, Value) :- assertz(global_var(Name, Value)) .
nb_getval(Name, Value) :- global_var(Name, Value) .
writeln(X) :- write(X) .
last([X],X):- ! . last([H|T],X):- last(T,X) , ! .
length([],0) . length([_|L],C1) :- length(L,C2) , C1 is C2+1 .
append([],L,L). append([H|L1],L2,[H|L3]) :- append(L1,L2,L3) .
nth(I,L,E) :- append(F,[E|_],L) , length(F,I) .
member(E,L) :- nth(_,L,E) .
pairs_values(Pairs, Values) :- findall(V, member(_-V, Pairs), Values) .
msort(L,S) :- findall(X-X, member(X,L), Ps), keysort(Ps, SPs), pairs_values(SPs, S) .
r([]) --> []. r([H|T]) --> r(T),[H] . reverse(L1,L2) :- r(L1,L2,[]) .
select(E,B,L) :- append(F,[E|T],B) , append(F,T,L) .
maplist(_,[],[]) :- ! . maplist(F,[H|T],[H1|T1]) :- call(F,H,H1) , maplist(F,T,T1) .
not(X) :- \+ X .
`
	}

}