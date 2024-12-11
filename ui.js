
/*
	Author:	Anthony John Ripa
	Date:	11/18/2024
	UI:	A user interface library
*/

class ui {

	static makenet() {
		$('#net').empty()
		let net = nodot($('#netstr').val())
		let ids = ui.net2ids(net)
		let dag = ui.str2dag(net)
		let fs = []
		for (let i = 0 ; i < ids.length ; i++) {
			fs.push(...ui.makes(dag,ids[i]))
			ui.makebr()
		}
		for (let i = ids.length-1 ; i >= 0 ; i--) {
			ui.makego(ids[i-1],fs.slice(i-ids.length))
		}
	}

	static net2ids(str) {
		let ids = []
		let nodes = str2nodes(str)
		let graph = ui.str2dag(str)
		if (nodes.length < 2) return nodes
		while (nodes.length > 1) {
			let nodeskids = nodes.map(node=>graph.kid[node])
			let node
			for (let i = 0; i < nodes.length ; i++) {
				if (nodeskids[i]==undefined || nodeskids[i].length==0) {
					node = nodes[i]
					ids.unshift(node)
					nodes = nodes.filter(n=>n!=node)
					let pars = graph.par[node]
					if (pars != undefined) pars.map(function(par){graph.kid[par]=graph.kid[par].filter(k=>k!=node)})
				}
			}
		}
		ids = [...nodes,...ids]
		return ids
		function str2nodes(str) {
			let paths = str.split(';')
			paths.reverse()
			let nodes = paths.map(path=>path.split('→')).flat()
			return [...new Set(nodes)]
		}
	}

	static str2dag(str) {
		let par = {}
		let kid = {}
		let edges = str.split(';')
		for (let edge of edges) {
			let ids = edge.split('→')
			for (let i = 0 ; i < ids.length ; i++) {
				if (i != 0) {
					if (par[ids[i]] == undefined) par[ids[i]] = [ids[i-1]]
					else par[ids[i]].push(ids[i-1])
				}
				if (i != ids.length-1) {
					if (kid[ids[i]] == undefined) kid[ids[i]] = [ids[i+1]]
					else kid[ids[i]].push(ids[i+1])
				}
			}
		}
		return {par,kid}
	}

	static makes(ids,me) {
		return me.split(',').map(id=>ui.make(ids,id))
	}

	static make(ids,id) {
		if (id.startsWith('datas_')) return ui.makeselect(ids,id,Data.get(id))
		if (id.startsWith('data_')) return ui.makeinputbig(ids,id,Data.get(id))
		switch(id) {
			case 'input': return ui.makeinput(ids,id)
			case 'inputbig': return ui.makeinputbig(ids,id)
			case 'filter': return ui.makefilter(ids,id)
			case 'where': return ui.makewhere(ids,id)
			case 'plot': return ui.makeplot(ids,id)
			case 'plot1': return ui.makeplot1(ids,id)
			case 'plot2': return ui.makeplot2(ids,id)
			case 'plot23': return ui.makeplot23(ids,id)
			case 'plot2layer': return ui.makeplot2layer(ids,id)
			case 'cause': return ui.makecause(ids,id)
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
			case 'laplace': return ui.makef(ids,id,Newton.laplace)
			case 'invlaplace': return ui.makef(ids,id,Newton.invlaplace)
			case 'network': return ui.makenetwork(ids,id)
			case 'eq2json': return ui.makef(ids,id,x=>JSON.stringify(Plot.eq2json(x),null,2))
			case 'json2net': return ui.makejson2net(ids,id,Plot.plotjson)
			case 'net2json': return ui.makef(ids,id,Plot.net2json)
			case 'json2eq': return ui.makef(ids,id,Plot.json2eq)
			case 'prolog': return ui.makeprolog(ids,id)
			//case 'json2net': return ui.makejson2net(ids,id)
		}
		alert(`ui.make() : id ${id} not found`)
	}

	static makebr() { $('#net').append(`<br>`) }
	static makebrs() { ui.makebr() ; ui.makebr() }

	static me2parkid(ids,me) {
		let par = ids.par[me]
		let kid = ids.kid[me]
		par = par?.join()
		kid = kid?.join()
		return {par,kid}
	}

	static makeinputbig(ids,me,data) {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<textarea id='${me}' cols='180' rows='7'>${data}</textarea>`)
		return ()=>{if (par) putval(me,$('#'+par).val())}
	}

	static makeselect(ids,me,data) {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<select id='${me}'>`+data.map(d=>'<option>'+d+'</option>')+`</select>`)
		return ()=>{}
	}

	static makeinput(ids,me,data='') {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<input id='${me}' value='${data}' placeholder='${me}'>`)
		return ()=>{$('#'+me).val($('#'+par).val())}
	}

	static makefilter(ids,me) {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<textarea id='${me}' cols='50' rows='7' placeholder='${me}'></textarea>`)
		return ()=>set_textarea(me,Stats.p(get_input(par.split(',')[0]),id2array(par.split(',')[1])))
	}

	static makeprolog(ids,me) {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<textarea id='${me}' cols='50' rows='7' placeholder='${me}'></textarea>`)
		return ()=>{let s=pl.create();s.consult(get_input(par.split(',')[1])+'\n');s.query(get_input(par.split(',')[0]));s.answer({success:x=>set_textarea(me,s.format_answer(x))})
		}
	}

	static makewhere(ids,me) {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<textarea id='${me}' cols='150' rows='7' placeholder='${me}'></textarea>`)
		return ()=>set_textarea(me,Frame.fromstr(get_input(par.split(',')[1])).where(get_input(par.split(',')[0])))
	}

	static makeoddschain2oddstable(ids,me) {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<textarea id='${me}' cols='50' rows='10' placeholder='${me}'></textarea>`)
		return ()=>{
			let r = id2array(par,',')[0]
			let ret = Stats.oddschain2oddstable(r)
			set_textarea(me,ret)
		}
	}

	static makeprob2oddstable(ids,me) {
		let {par,kid} = ui.me2parkid(ids,me)
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
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			let frame = Frame.fromString(get_input(par))
			$('#'+me).empty()
			$('#'+me).removeAttr('style')
			if (frame.numcols()==2) Plot.fromFrame(frame).plot1 (me)
			if (frame.numcols()==3) Plot.fromFrame(frame).table2(me)
			if (frame.numcols()==4) Plot.fromFrame(frame).table3(me)
		}
	}

	static makenetwork(ids,me) {
		window.godiagram = null
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:640px;height:400px;color:#999'>${me}</div>`)
		return () => Plot.plotnetwork(me,get_input(par))
	}

	static makejson2net(ids,me) {
		window.godiagram = null
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:640px;height:400px;color:#999'>${me}</div>`)
		return () => Plot.json2net(me,get_input(par))
	}

	static makeplots(ids,me) {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
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

	static makeplot1(ids,me) {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			let frame = Frame.fromString(get_input(par))
			$('#'+me).empty()
			$('#'+me).removeAttr('style')
			$('#'+me).append(`<table><tr><td id='${me}2' width='400px'></td></tr></table>`)
			Plot.fromFrame(frame).plot1(me+'2')
		}
	}

	static makeplot2(ids,me) {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
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

	static makeplot23(ids,me) {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
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

	static makeplot2layer(ids,me) {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			$('#'+me).empty()
			$('#'+me).removeAttr('style')
			$('#'+me).append(`<table><tr><td id='${me}2' width='500px'></td></tr></table>`)
			Plot.fromString(get_input(par)).plot2layer(me+2)
		}
	}

	static makecause(ids,me) {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<textarea id='${me}' cols='50' rows='7' placeholder='${me}'></textarea>`)
		return ()=>{
			let csv = get_input(par)
			let model = new Model(Frame.fromString(csv))
			let middle = model.get_control_name()
			let ends = model.get_noncontrol_names()
			let graph = ends[0] + '-' + middle + '-' + ends[1]
			set_textarea(me,graph)
		}
	}

	static makef(ids,me,f) {
		let {par,kid} = ui.me2parkid(ids,me)
		$('#net').append(`<textarea id='${me}' placeholder='${me}' cols='30'></textarea>`)
		return ()=>$('#'+me).val(f($('#'+par).val()))
	}

	static makego(id0,fs) {
		id0 = id0?.split(',').slice(-1)[0]
		let id = math.randomInt(1,9999)
		$(`<button id='${id}' style='display:block' title='${id0}\n↓'>↓</button>`).insertAfter('#'+id0)
		$('#'+id).on('click',()=>{fs.map(f=>f())})
	}

}
