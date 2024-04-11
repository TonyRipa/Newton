
/*
	Author:	Anthony John Ripa
	Date:	4/10/2024
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
			case 'trigpoly': return ui.maketrigpoly(ids,id)
			case 'polytrig': return ui.makepolytrig(ids,id)
			case 'prob2oddstable': return ui.makeprob2oddstable(ids,id)
			case 'oddschain2oddstable': return ui.makeoddschain2oddstable(ids,id)
			case 'probdata': return ui.makeinput(ids,id,Data.prob())
			case 'oddsdata': return ui.makeinput(ids,id,Data.odds())
			case 'econdata': return ui.makeinputbig(ids,id,Data.econ())
			case 'exprdata': return ui.makeselect(ids,id,Data.expr())
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
		$('#net').append(`<textarea id='${me}' cols='150' rows='7'>${data}</textarea>`)
		return ()=>{}
	}

	static makeselect(ids,me,data) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<select id='${me}' onchange="$('#${kid}').val($(this).val())">`+data.map(d=>'<option>'+d+'</option>')+`</select>`)
		return ()=>{}
	}

	static makeinput(ids,me,data='') {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<input id='${me}' value='${data}'>`)
		return ()=>{}
	}

	static makefilter(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}' cols='50' rows='7'></textarea>`)
		return ()=>set_textarea(me,Stats.p(get_input(par.split(',')[0]),id2array(par.split(',')[1])))
	}

	static makeoddschain2oddstable(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}' cols='50' rows='10'></textarea>`)
		return ()=>{
			let ret = ''
			let r = id2array(par,',')[0]
			for (let i = 0 ; i <= r.length ; i++) {
				for (let j = 0 ; j <= r.length ; j++) {
					let odds
					if (i==j) {
						odds = 1
					} else if (i==j-1) {
						odds = r[i]
					} else if (i==j-2) {
						odds = r[i]*r[i+1]
					} else if (i==j-3) {
						odds = r[i]*r[i+1]*r[i+2]
					} else if (i==j+1) {
						odds = 1/r[j]
					} else if (i==j+2) {
						odds = 1/(r[j]*r[j+1])
					} else if (i==j+3) {
						odds = 1/(r[j]*r[j+1]*r[j+2])
					}
					odds = isNaN(odds) ? '%' : odds
					odds = odds==1/0 ? '∞' : odds
					odds = odds==-1/0 ? '-∞' : odds
					ret += odds
					if (j<r.length) ret += '\t'
				}
				if (i<r.length) ret += '\n'
			}
			set_textarea(me,ret)
		}
	}

	static makeprob2oddstable(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}' cols='30' rows='10'></textarea>`)
		return ()=>{
			let ret = ''
			let p = id2array(par,',')[0]
			for (let i = 0 ; i < p.length ; i++) {
				for (let j = 0 ; j < p.length ; j++) {
					let odds = p[i] / p[j]
					odds = isNaN(odds) ? '%' : odds
					odds = odds==1/0 ? '∞' : odds
					odds = odds==-1/0 ? '-∞' : odds
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
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px'></div>`)
		return () => {
			let results = id2array(par,',').map(row=>[row.slice(0,row.length-1),row.slice(-1)[0]])
			if (Array.isArray(results)) {
				$('#'+me).empty()
				$('#'+me).removeAttr('style')
				if (results[0][0].length==1) Plot.factory1(results).plot(me)
				if (results[0][0].length==2) set_div(me,Plot.factory2(results))
			}			
		}
	}

	static maketrigpoly(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}'></textarea>`)
		return ()=>$('#'+me).html(Newton.trig2poly($('#'+par).val()))
	}

	static makepolytrig(ids,me) {
		let myi = ui.idtoindex(ids,me) , par = ids[myi-1], kid = ids[myi+1]
		$('#net').append(`<textarea id='${me}'></textarea>`)
		return ()=>$('#'+me).text(Newton.poly2trig($('#'+par).val()))
	}

	static makego(fs) {
		let id = math.randomInt(1,9999)
		$('#net').prepend(`<button id='${id}'>Go</button>`)
		$('#'+id).on('click',()=>{fs.map(f=>f())})
	}

}
