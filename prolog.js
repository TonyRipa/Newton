
/*
	Author:	Anthony John Ripa
	Date:	5/20/2025
	Prolog:	A prolog library
*/

class prolog {

	static do(queryid, programid, answerid) {
		let s = pl.create();
		let program = get_input(programid).split('\n')
					.map(x=>(x.includes('dynamic')&&!x.includes('('))?x.slice(0,x.indexOf('c')+1)+'('+x.slice(x.indexOf('c')+2,-1)+').':x)
					.join('\n')
		s.consult(Data.prolog() + program)
		s.query(get_input(queryid));
		s.answer({success:x=>set_textarea(answerid,s.format_answer(x))})
	}

}