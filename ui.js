
/*
	Author:	Anthony John Ripa
	Date:	3/10/2025
	UI:	A user interface library
*/

class ui {

	static makenet() {
		$('#net').empty()
		let net = nodot($('#netstr').val())
		let ids = Graph.net2ids(net)
		let dag = Graph.str2dag(net)
		let rank = Graph.dag2rank(dag)
		let fs = makess(dag)
		for (let i = ids.length-1 ; i > 0 ; i--) {
			let numpars = dag.par[ids[i]]?.length
			if (numpars > 0)
				ui.makego(ids[i],fs.slice(i-ids.length),numpars)
		}
		function makess(dag) {
			let fs = []
			let tempids = []
			for (let row of rank) {
				for (let col of row) {
					if (!tempids.includes(col)) {
						tempids.push(col)
						fs.push(...ui.makes(dag,col))
					}
				}
				ui.makebr()
			}
			return fs
		}
	}

	static makes(dag,me) {
		return me.split(',').map(id=>ui.make(dag,id))
	}

	static make(dag,id) {
		$('#net').append(`<span class='cont' style='display:inline-block;margin:10px;vertical-align:top'></span>`)
		if (id.startsWith('datas_')) return ui.makeselect(dag,id,Data.get(id))
		if (id.startsWith('data_')) return ui.makeinputbig(dag,id,Data.get(id))
		switch(id) {
			case 'input':
			case 'input2': return ui.makeinput(dag,id)
			case 'inputbig': return ui.makeinputbig(dag,id)
			case 'filter': return ui.makefilter(dag,id)
			case 'where': return ui.makewhere(dag,id)
			case 'plot': return ui.makeplot(dag,id)
			case 'plot1': return ui.makeplot1(dag,id)
			case 'plot2': return ui.makeplot2(dag,id)
			case 'plot23': return ui.makeplot23(dag,id)
			case 'plot2layer': return ui.makeplot2layer(dag,id)
			case 'cause': return ui.makecause(dag,id)
			case 'plots': return ui.makeplots(dag,id)
			case 'trigpoly': return ui.makef(dag,id,Newton.trig2poly)
			case 'polytrig': return ui.makef(dag,id,Newton.poly2trig)
			case 'gf': return ui.makef(dag,id,Newton.gf)
			case 'igf': return ui.makef(dag,id,Newton.igf)
			case 'egf': return ui.makef(dag,id,Newton.egf)
			case 'iegf': return ui.makef(dag,id,Newton.iegf)
			case 'solve': return ui.makef(dag,id,Lisp.solve)
			case 'prob2oddstable': return ui.makeprob2oddstable(dag,id)
			case 'oddschain2oddstable': return ui.makeoddschain2oddstable(dag,id)
			case 'sample': return ui.makef(dag,id,Newton.sample)
			case 'regress': return ui.makef(dag,id,Newton.regress)
			case 'laplace': return ui.makef(dag,id,Newton.laplace)
			case 'invlaplace': return ui.makef(dag,id,Newton.invlaplace)
			case 'network': return ui.makenetwork(dag,id)
			case 'eq2json': return ui.makef(dag,id,x=>JSON.stringify(Plot.eq2json(x),null,2))
			case 'json2net': return ui.makejson2net(dag,id,Plot.plotjson)
			case 'net2json': return ui.makef(dag,id,Plot.net2json)
			case 'json2eq': return ui.makef(dag,id,Plot.json2eq)
			case 'prolog': return ui.makeprolog(dag,id)
			case 'var': return ui.makef(dag,id,Expression.getvars)
			case 'template': return ui.makef(dag,id,x=>x.split('|')[0])
		}
		alert(`ui.make() : id ${id} not found`)
	}

	static makebr() { $('#net').append(`<br>`) }
	static makebrs() { ui.makebr() ; ui.makebr() }

	static me2parkid(dag,me) {
		let par = dag.par[me]
		let kid = dag.kid[me]
		par = par?.join()
		kid = kid?.join()
		return {par,kid}
	}

	static makeinputbig(dag,me,data) {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<textarea id='${me}' cols='180' rows='7'>${data}</textarea>`)
		return ()=>{if (par) putval(me,$('#'+par).val())}
	}

	static makeselect(dag,me,data) {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<select id='${me}'>`+data.map(d=>'<option>'+d+'</option>')+`</select>`)
		return ()=>{}
	}

	static makeinput(dag,me,data='') {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<input id='${me}' value='${data}' placeholder='${me}'>`)
		return ()=>{if (par) $('#'+me).val($('#'+par).val())}
	}

	static makefilter(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<textarea id='${me}' cols='50' rows='7' placeholder='${me}'></textarea>`)
		return ()=>set_textarea(me,Stats.p(get_input(par.split(',')[0]),id2array(par.split(',')[1])))
	}

	static makeprolog(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		let pars = par.split(',')
		$('.cont:last-of-type').append(`<textarea id='${me}' cols='50' rows='7' placeholder='${me}'></textarea>`)
		return ()=>{let s=pl.create();s.consult(Data.prolog()+get_input(pars[1])+'\n');s.query(get_input(pars[0]));s.answer({success:x=>set_textarea(me,s.format_answer(x))})
		}
	}

	static makewhere(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<textarea id='${me}' cols='150' rows='7' placeholder='${me}'></textarea>`)
		return ()=>set_textarea(me,Frame.fromstr(get_input(par.split(',')[1])).where(get_input(par.split(',')[0])))
	}

	static makeoddschain2oddstable(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<textarea id='${me}' cols='50' rows='10' placeholder='${me}'></textarea>`)
		return ()=>{
			let r = id2array(par,',')[0]
			let ret = Stats.oddschain2oddstable(r)
			set_textarea(me,ret)
		}
	}

	static makeprob2oddstable(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<textarea id='${me}' cols='30' rows='10' placeholder='${me}'></textarea>`)
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

	static makeplot(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			let frame = Frame.fromString(get_input(par))
			$('#'+me).empty()
			$('#'+me).removeAttr('style')
			if (frame.numcols()==2) Plot.fromFrame(frame).plot1 (me)
			if (frame.numcols()==3) Plot.fromFrame(frame).table2(me)
			if (frame.numcols()==4) Plot.fromFrame(frame).table3(me)
		}
	}

	static makenetwork(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		window.godiagram = null
		$('.cont:last-of-type').append(`<div id='${me}' style='border:thin solid black;width:640px;height:400px;color:#999'>${me}</div>`)
		return () => Plot.plotnetwork(me,get_input(par))
	}

	static makejson2net(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		window.godiagram = null
		$('.cont:last-of-type').append(`<div id='${me}' style='border:thin solid black;width:640px;height:400px;color:#999'>${me}</div>`)
		return () => Plot.json2net(me,get_input(par))
	}

	static makeplots(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			let frame = Frame.fromString(get_input(par))
			let frame1 = frame.copy().removecol(1)
			let frame2 = frame.copy().removecol(0)
			if (frame.numcols() >= 3) {
				$('#'+me).empty()
				$('#'+me).removeAttr('style')
				$('#'+me).append(`<table><tr><td id='${me}1' width='500px'></td><td id='${me}2' width='500px'></td></tr></table>`)
				Plot.fromFrame(frame1).plot1(me+1)
				Plot.fromFrame(frame2).plot1(me+2)
			}			
		}
	}

	static makeplot1(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<span id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</span>`)
		return () => {
			let frame = Frame.fromString(get_input(par))
			$('#'+me).empty()
			$('#'+me).removeAttr('style')
			$('#'+me).append(`<table><tr><td id='${me}2' width='400px'></td></tr></table>`)
			Plot.fromFrame(frame).plot1(me+'2')
		}
	}

	static makeplot2(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			let frame = Frame.fromString(get_input(par))
			let frame1 = frame.copy().removecol(1)
			let frame2 = frame.copy().removecol(0)
			if (frame.numcols() >= 3) {
				$('#'+me).empty()
				$('#'+me).removeAttr('style')
				$('#'+me).append(`<table><tr><td id='${me}1' width='500px'></td><td id='${me}2' width='500px'></td><td id='${me}3' width='500px'></td></tr></table>`)
				Plot.fromFrame(frame1).plot1(me+1)
				Plot.fromFrame(frame ).plot2(me+2)
				Plot.fromFrame(frame2).plot1(me+3)
			}			
		}
	}

	static makeplot23(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			let frame = Frame.fromString(get_input(par))
			let frame1 = frame.copy().removecol(1)
			let frame2 = frame.copy().removecol(0)
			if (frame.numcols() >= 3) {
				$('#'+me).empty()
				$('#'+me).removeAttr('style')
				$('#'+me).append(`<table><tr><td id='${me}1' width='500px'></td><td id='${me}2' width='500px'></td><td id='${me}3' width='500px'></td></tr></table>`)
				Plot.fromFrame(frame1).plot1 (me+1)
				Plot.fromFrame(frame ).plot23(me+2)
				Plot.fromFrame(frame2).plot1 (me+3)
			}			
		}
	}

	static makeplot2layer(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			$('#'+me).empty()
			$('#'+me).removeAttr('style')
			$('#'+me).append(`<table><tr><td id='${me}2' width='500px'></td></tr></table>`)
			Plot.fromString(get_input(par)).plot2layer(me+2)
		}
	}

	static makecause(dag,me) {
		let {par,kid} = ui.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<textarea id='${me}' cols='50' rows='7' placeholder='${me}'></textarea>`)
		return ()=>{
			let csv = get_input(par)
			let model = new Model(Frame.fromString(csv))
			let middle = model.get_control_name()
			let ends = model.get_noncontrol_names()
			let graph = ends[0] + '-' + middle + '-' + ends[1]
			set_textarea(me,graph)
		}
	}

	static makef(dag,me,f) {
		let {par,kid} = ui.me2parkid(dag,me)
		let pars = par.split(',')
		$('.cont:last-of-type').append(`<textarea id='${me}' placeholder='${me}' cols='30'></textarea>`)
		return ()=>$('#'+me).val(f(...pars.map(p=>$('#'+p).val())))
	}

	static makego(id0,fs,numpars) {
		id0 = id0?.split(',').slice(-1)[0]
		let id = math.randomInt(1,9999)
		let arrows = ['','↓','↘ ↙'][numpars]
		$(`<button id='${id}' title='${arrows}\n${id0}'>${arrows}</button><br>`).insertBefore('#'+id0)
		$('#'+id).on('click',()=>{fs.map(f=>f())})
	}

}
