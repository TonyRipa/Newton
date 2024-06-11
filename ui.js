
/*
	Author:	Anthony John Ripa
	Date:	6/8/2024
	UI:	A user interface library
*/

class ui {

	static makenet() {
		$('#net').empty()
		let net = $('#netstr').val()
		let ids = net.split('→')
		let fs = []
		for (let i = 0 ; i < ids.length ; i++) {
			fs.push(...ui.makes(ids,i))
			ui.makebrs()
		}
		ui.makego(fs)
	}

	static makes(ids,myi) {
		return ids[myi].split(',').map(id=>ui.make(ids,id))
	}

	static make(ids,id) {
		switch(id) {
			case 'input': return ui.makeinput(ids,id)
			case 'inputbig': return ui.makeinputbig(ids,id)
			case 'filter': return ui.makefilter(ids,id)
			case 'plot': return ui.makeplot(ids,id)
			case 'plot2': return ui.makeplot2(ids,id)
			case 'plot23': return ui.makeplot23(ids,id)
			case 'plot2layer': return ui.makeplot2layer(ids,id)
			case 'plots': return ui.makeplots(ids,id)
			case 'trigpoly': return ui.makef(ids,id,Newton.trig2poly)
			case 'polytrig': return ui.makef(ids,id,Newton.poly2trig)
			case 'gf': return ui.makef(ids,id,Newton.gf)
			case 'igf': return ui.makef(ids,id,Newton.igf)
			case 'egf': return ui.makef(ids,id,Newton.egf)
			case 'iegf': return ui.makef(ids,id,Newton.iegf)
			case 'solve': return ui.makef(ids,id,Lisp.solve)
			case 'prob2oddstable': return ui.makeprob2oddstable(ids,id)
			case 'oddschain2oddstable': return ui.makeoddschain2oddstable(ids,id)
			case 'sample': return ui.makef(ids,id,Newton.sample)
			case 'regress': return ui.makef(ids,id,Newton.regress)
			case 'probdata': return ui.makeinput(ids,id,Data.prob())
			case 'oddsdata': return ui.makeinput(ids,id,Data.odds())
			case 'econdata': return ui.makeinputbig(ids,id,Data.econ())
			case 'exprdata': return ui.makeselect(ids,id,Data.expr())
			case 'eqndata': return ui.makeselect(ids,id,Data.eqn())
			case 'symdata': return ui.makeselect(ids,id,Data.sym())
			case 'wagedata': return ui.makeinputbig(ids,id,Data.wage())
			case 'agedata': return ui.makeinputbig(ids,id,Data.age())
			case 'hiredata': return ui.makeinputbig(ids,id,Data.hire())
		}
		alert(`ui.make() : id ${id} not found`)
	}

	static idtoindex(ids,id) {
		for (let i = 0 ; i < ids.length ; i++)
			if (ids[i].split(',').includes(id)) return i
		alert('idtoindex() : Error Not Found')
	}

	static makebr() { $('#net').append(`<br>`) }
	static makebrs() { $('#net').append(`<br><br>`) }

	static makeinputbig(ids,me,data) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}' cols='180' rows='7'>${data}</textarea>`)
		return ()=>{}
	}

	static makeselect(ids,me,data) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<select id='${me}' onchange="putval('${kid}',$(this).val())">`+data.map(d=>'<option>'+d+'</option>')+`</select>`)
		return ()=>{}
	}

	static makeinput(ids,me,data='') {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<input id='${me}' value='${data}' placeholder='${me}'>`)
		return ()=>{}
	}

	static makefilter(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}' cols='50' rows='7' placeholder='${me}'></textarea>`)
		return ()=>set_textarea(me,Stats.p(get_input(par.split(',')[0]),id2array(par.split(',')[1])))
	}

	static makeoddschain2oddstable(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}' cols='50' rows='10' placeholder='${me}'></textarea>`)
		return ()=>{
			let r = id2array(par,',')[0]
			let ret = Stats.oddschain2oddstable(r)
			set_textarea(me,ret)
		}
	}

	static makeprob2oddstable(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}' cols='30' rows='10' placeholder='${me}'></textarea>`)
		return ()=>{
			let ret = ''
			let p = id2array(par,',')[0]
			for (let i = 0 ; i < p.length ; i++) {
				for (let j = 0 ; j < p.length ; j++) {
					let odds = p[i] / p[j]
					if (isNaN(odds)) odds =  '%'
					if (odds == 1/0) odds =  '∞'
					if (odds ==-1/0) odds = '-∞'
					ret += odds
					if (j<p.length-1) ret += '\t'
				}
				if (i<p.length-1) ret += '\n'
			}
			set_textarea(me,ret)
		}
	}

	static makeplot(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			let results = id2array(par,',').map(row=>[row.slice(0,row.length-1),row.slice(-1)[0]])
			if (Array.isArray(results)) {
				$('#'+me).empty()
				$('#'+me).removeAttr('style')
				if (results[0][0].length==1) Plot.factory(results).plot1 (me)
				if (results[0][0].length==2) Plot.factory(results).table2(me)
				if (results[0][0].length==3) Plot.factory(results).table3(me)
			}			
		}
	}

	static makeplots(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			let results = id2array(par,',').map(row=>[row.slice(0,row.length-1),row.slice(-1)[0]])
			let results1 = results.map(row=>[[row[0][0]],row[1]])
			let results2 = results.map(row=>[[row[0][1]],row[1]])
			console.log(results)
			console.log(results1)
			console.log(results2)
			if (Array.isArray(results)) {
				$('#'+me).empty()
				$('#'+me).removeAttr('style')
				$('#'+me).append(`<table><tr><td id='${me}1' width='500px'></td><td id='${me}2' width='500px'></td></tr></table>`)
				Plot.factory(results1).plot1(me+1)
				Plot.factory(results2).plot1(me+2)
			}			
		}
	}

	static makeplot2(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			let results = id2array(par,',').map(row=>[row.slice(0,row.length-1),row.slice(-1)[0]])
			let results1 = results.map(row=>[[row[0][0]],row[1]])
			let results2 = results.map(row=>[[row[0][1]],row[1]])
			if (Array.isArray(results)) {
				$('#'+me).empty()
				$('#'+me).removeAttr('style')
				$('#'+me).append(`<table><tr><td id='${me}1' width='500px'></td><td id='${me}2' width='500px'></td><td id='${me}3' width='500px'></td></tr></table>`)
				Plot.factory(results1).plot1(me+1)
				Plot.factory(results ).plot2(me+2)
				Plot.factory(results2).plot1(me+3)
			}			
		}
	}

	static makeplot23(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			let results = id2array(par,',').map(row=>[row.slice(0,row.length-1),row.slice(-1)[0]])
			let results1 = results.map(row=>[[row[0][0]],row[1]])
			let results2 = results.map(row=>[[row[0][1]],row[1]])
			if (Array.isArray(results)) {
				$('#'+me).empty()
				$('#'+me).removeAttr('style')
				$('#'+me).append(`<table><tr><td id='${me}1' width='500px'></td><td id='${me}2' width='500px'></td><td id='${me}3' width='500px'></td></tr></table>`)
				Plot.factory(results1).plot1(me+1)
				Plot.factory(results ).plot23(me+2)
				Plot.factory(results2).plot1(me+3)
			}			
		}
	}

	static makeplot2layer(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			let results = id2array(par,',').map(row=>[row.slice(0,row.length-1),row.slice(-1)[0]])
			let results1 = results.map(row=>[[row[0][0]],row[1]])
			let results2 = results.map(row=>[[row[0][1]],row[1]])
			if (Array.isArray(results)) {
				$('#'+me).empty()
				$('#'+me).removeAttr('style')
				$('#'+me).append(`<table><tr><td id='${me}1' width='500px'></td><td id='${me}2' width='500px'></td><td id='${me}3' width='500px'></td></tr></table>`)
				// Plot.factory(results1).plot1(me+1)
				Plot.factory(results ).plot2layer(me+2)
				// Plot.factory(results2).plot1(me+3)
			}			
		}
	}

	static makef(ids,me,f) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}' placeholder='${me}'></textarea>`)
		return ()=>$('#'+me).text(f($('#'+par).val()))
	}

	static makego(fs) {
		let id = math.randomInt(1,9999)
		$('#net').prepend(`<button id='${id}'>Go</button>`)
		$('#'+id).on('click',()=>{fs.map(f=>f())})
	}

}
