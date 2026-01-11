
/*
	Author:	Anthony John Ripa
	Date:	12/15/2025
	View:	A view library
*/

class View {

	static me2parkid(dag,me) {
		let par = dag.par[me]
		let kid = dag.kid[me]
		par = par?.join()
		kid = kid?.join()
		return {par,kid}
	}

	static makeinputbig(dag,me,data) {
		let {par,kid} = View.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<textarea id='${me}' cols='180' rows='7'>${data}</textarea>`)
		return ()=>{if (par) putval(me,$('#'+par).val())}
	}

	static makeselect(dag,me,data) {
		let {par,kid} = View.me2parkid(dag,me)
		if (Array.isArray(data))
			data = data.map(d=>'<option>'+d+'</option>')
		else
			data = Object.keys(data).map(key=>`<optgroup label='${key}'>`+data[key].map(d=>'<option>'+d+'</option>'))
		$('.cont:last-of-type').append(`<select id='${me}'>${data}</select>`)
		return ()=>{}
	}

	static makeinput(dag,me,data='') {
		let {par,kid} = View.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<input id='${me}' value='${data}' placeholder='${me}'>`)
		return ()=>{if (par) $('#'+me).val($('#'+par).val())}
	}

	static makefilter(dag,me) {
		let {par,kid} = View.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<textarea id='${me}' cols='50' rows='7' placeholder='${me}'></textarea>`)
		return ()=>set_textarea(me,Stats.p(get_input(par.split(',')[0]),id2array(par.split(',')[1])))
	}

	static makeprolog(dag,me) {
		let {par,kid} = View.me2parkid(dag,me)
		let pars = par.split(',')
		$('.cont:last-of-type').append(`<textarea id='${me}' cols='50' rows='7' placeholder='${me}'></textarea>`)
		return () => {prolog.do(pars[0],pars[1],me)}
	}

	static makewhere(dag,me) {
		let {par,kid} = View.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<textarea id='${me}' cols='150' rows='7' placeholder='${me}'></textarea>`)
		return ()=>set_textarea(me,Frame.fromstr(get_input(par.split(',')[1])).where(get_input(par.split(',')[0])))
	}

	static makeoddschain2oddstable(dag,me) {
		let {par,kid} = View.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<textarea id='${me}' cols='50' rows='10' placeholder='${me}'></textarea>`)
		return ()=>{
			let r = id2array(par,',')[0]
			let ret = Stats.oddschain2oddstable(r)
			set_textarea(me,ret)
		}
	}

	static makeprob2oddstable(dag,me) {
		let {par,kid} = View.me2parkid(dag,me)
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
		let {par,kid} = View.me2parkid(dag,me)
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
		let {par,kid} = View.me2parkid(dag,me)
		window.godiagram = null
		$('.cont:last-of-type').append(`<div id='${me}' style='border:thin solid black;width:640px;height:400px;color:#999'>${me}</div>`)
		return () => Plot.plotnetwork(me,get_input(par))
	}

	static makejson2net(dag,me) {
		let {par,kid} = View.me2parkid(dag,me)
		window.godiagram = null
		$('.cont:last-of-type').append(`<div id='${me}' style='border:thin solid black;width:640px;height:400px;color:#999'>${me}</div>`)
		return () => Plot.json2net(me,get_input(par))
	}

	static makeplots(dag,me) {
		let {par,kid} = View.me2parkid(dag,me)
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
		let {par,kid} = View.me2parkid(dag,me)
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
		let {par,kid} = View.me2parkid(dag,me)
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
		let {par,kid} = View.me2parkid(dag,me)
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
		let {par,kid} = View.me2parkid(dag,me)
		$('.cont:last-of-type').append(`<div id='${me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${me}</div>`)
		return () => {
			$('#'+me).empty()
			$('#'+me).removeAttr('style')
			$('#'+me).append(`<table><tr><td id='${me}2' width='500px'></td></tr></table>`)
			Plot.fromString(get_input(par)).plot2layer(me+2)
		}
	}

	static makecause(dag,me) {
		let {par,kid} = View.me2parkid(dag,me)
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
		let {par,kid} = View.me2parkid(dag,me)
		let pars = par.split(',')
		$('.cont:last-of-type').append(`<textarea id='${me}' placeholder='${me}' cols='30'></textarea>`)
		return ()=>$('#'+me).val(f(...pars.map(p=>$('#'+p).val())))
	}

}
