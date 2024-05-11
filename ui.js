
/*
	Author:	Anthony John Ripa
	Date:	5/10/2024
	UI:	A user interface library
*/

class ui {

	static makenet() {
		$('#net').empty()
		let net = $('#netstr').val()
		let ids = net.split('→')
		let fs = []
		for (let i = 0 ; i < ids.length ; i++) {//alert(i)
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
			case 'filter': return ui.makefilter(ids,id)
			case 'plot': return ui.makeplot(ids,id)
			case 'plot3': return ui.makeplot3(ids,id)
			case 'plots': return ui.makeplots(ids,id)
			case 'trigpoly': return ui.maketrigpoly(ids,id)
			case 'polytrig': return ui.makepolytrig(ids,id)
			case 'solve': return ui.makesolve(ids,id)
			case 'prob2oddstable': return ui.makeprob2oddstable(ids,id)
			case 'oddschain2oddstable': return ui.makeoddschain2oddstable(ids,id)
			case 'sample': return ui.makesample(ids,id)
			case 'regress': return ui.makeregress(ids,id)
			case 'probdata': return ui.makeinput(ids,id,Data.prob())
			case 'oddsdata': return ui.makeinput(ids,id,Data.odds())
			case 'econdata': return ui.makeinputbig(ids,id,Data.econ())
			case 'exprdata': return ui.makeselect(ids,id,Data.expr())
			case 'eqndata': return ui.makeselect(ids,id,Data.eqn())
			case 'symdata': return ui.makeinputbig(ids,id,Data.sym())
		}
		alert('ui.make() : id not found')
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
		$('#net').append(`<select id='${me}' onchange="$('#${kid}').val($(this).val())">`+data.map(d=>'<option>'+d+'</option>')+`</select>`)
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
				if (results[0][0].length==1) Plot.factory1(results).plot(me)
				if (results[0][0].length==2) Plot.factory2(results).table2(me)
				if (results[0][0].length==3) Plot.factory2(results).table3(me)
			}			
		}
	}

	static makeplots(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			let results = id2array(par,'\t').map(row=>[row.slice(0,row.length-1),row.slice(-1)[0]])
			let results1 = results.map(row=>[[row[0][0]],row[1]])
			let results2 = results.map(row=>[[row[0][1]],row[1]])
			console.log(results)
			console.log(results1)
			console.log(results2)
			if (Array.isArray(results)) {
				$('#'+me).empty()
				$('#'+me).removeAttr('style')
				$('#'+me).append(`<div id='${me}1'></div>`)
				$('#'+me).append(`<div id='${me}2'></div>`)
				Plot.factory0(results1).plot(me+1)
				Plot.factory0(results2).plot(me+2)
			}			
		}
	}

	static makeplot3(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			let results = id2array(par,'\t').map(row=>[row.slice(0,row.length-1),row.slice(-1)[0]])
			let results1 = results.map(row=>[[row[0][0]],row[1]])
			let results2 = results.map(row=>[[row[0][1]],row[1]])
			if (Array.isArray(results)) {
				$('#'+me).empty()
				$('#'+me).removeAttr('style')
				$('#'+me).append(`<table><tr><td id='${me}1' width='500px'></td><td id='${me}2' width='500px'></td><td id='${me}3' width='500px'></td></tr></table>`)
				Plot.factory0(results1).plot(me+1)
				Plot.factory3(results).plot2(me+2)
				Plot.factory0(results2).plot(me+3)
			}			
		}
	}

	static maketrigpoly(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}' placeholder='${me}'></textarea>`)
		return ()=>$('#'+me).html(Newton.trig2poly($('#'+par).val()))
	}

	static makepolytrig(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}' placeholder='${me}'></textarea>`)
		return ()=>$('#'+me).text(Newton.poly2trig($('#'+par).val()))
	}

	static makesolve(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}' placeholder='${me}'></textarea>`)
		return ()=>$('#'+me).text(Lisp.solve($('#'+par).val()))
	}

	static makego(fs) {
		let id = math.randomInt(1,9999)
		$('#net').prepend(`<button id='${id}'>Go</button>`)
		$('#'+id).on('click',()=>{fs.map(f=>f())})
	}

	static makesample(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}' rows='4' placeholder='${me}'></textarea>`)
		return ()=>$('#'+me).text(Newton.sample($('#'+par).val()))
	}

	static makeregress(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}' placeholder='${me}'></textarea>`)
		return ()=>$('#'+me).text(Newton.regress(...$('#'+par).val().split('\n')))
	}

}
