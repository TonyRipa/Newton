
/*
	Author:	Anthony John Ripa
	Date:	3/15/2026
	View:	A view library
*/

class View {

	constructor(dag, me) {
		this.dag = dag
		this.me = me
		this.par = dag.par[me]
		this.kid = dag.kid[me]
		this.init()
	}

	init() {
		if (this.me.startsWith('datas_')) this.select(Data.get(this.me))
		if (this.me.startsWith('data_')) this.inputbig(Data.get(this.me))
		switch(this.me) {
			case 'input':
			case 'input2': this.input() ; break
			case 'inputbig': this.inputbig() ; break
			case 'filter': this.filter() ; break
			case 'where': this.where() ; break
			case 'plot': this.plot() ; break
			case 'plot1': this.plot1() ; break
			case 'plot2': this.plot2() ; break
			case 'plot23': this.plot23() ; break
			case 'plot2layer': this.plot2layer() ; break
			case 'cause': this.cause() ; break
			case 'plots': this.plots() ; break
			case 'trigpoly': this.func(Newton.trig2poly) ; break
			case 'polytrig': this.func(Newton.poly2trig) ; break
			case 'gf': this.func(Newton.gf) ; break
			case 'igf': this.func(Newton.igf) ; break
			case 'egf': this.func(Newton.egf) ; break
			case 'iegf': this.func(Newton.iegf) ; break
			case 'solve': this.func(Lisp.solve) ; break
			case 'prob2oddstable': this.prob2oddstable() ; break
			case 'oddschain2oddstable': this.oddschain2oddstable() ; break
			case 'sample': this.func(Newton.sample) ; break
			case 'regress': this.func(Newton.regress) ; break
			case 'laplace': this.func(Newton.laplace) ; break
			case 'invlaplace': this.func(Newton.invlaplace) ; break
			case 'network': this.network() ; break
			case 'eq2json': this.func(x=>JSON.stringify(Plot.eq2json(x),null,2)) ; break
			case 'json2net': this.json2net(Plot.plotjson) ; break
			case 'net2json': this.func(Plot.net2json) ; break
			case 'json2eq': this.func(Plot.json2eq) ; break
			case 'prolog': this.prolog() ; break
			case 'var': this.func(Expression.getvars) ; break
			case 'template': this.func(x=>x.split('|')[0]) ; break
			case 'substitute': this.func(x=>x.split('|')[1]) ; break
			case 'substitution': this.func((x,y)=>y===''?'':math.evaluate(x,{[Expression.getvars(x)[0]]:y})) ; break
			default: if (!this.me.startsWith('data')) alert(`ui.init() : id ${this.me} not found`)
		}
	}

	static get(id) {
		return $('#'+id).val()
	}

	inputbig(data) {
		this.html = `<textarea id='${this.me}' cols='180' rows='7'>${data}</textarea>`
		this.f = ()=>{if (this.par) putval(this.me,View.get(this.par))}
	}

	select(data) {
		if (Array.isArray(data))
			data = data.map(d=>'<option>'+d+'</option>')
		else
			data = Object.keys(data).map(key=>`<optgroup label='${key}'>`+data[key].map(d=>'<option>'+d+'</option>'))
		this.html = `<select id='${this.me}'>${data}</select>`
		this.f = ()=>{}
	}

	input(data='') {
		this.html = `<input id='${this.me}' value='${data}' placeholder='${this.me}'>`
		this.f = ()=>{if (this.par) $('#'+this.me).val(View.get(this.par))}
	}

	filter() {
		this.html = `<textarea id='${this.me}' cols='50' rows='7' placeholder='${this.me}'></textarea>`
		this.f = ()=>set_textarea(this.me,Stats.p(View.get(this.par[0]),id2array(this.par[1])))
	}

	prolog() {
		this.html = `<textarea id='${this.me}' cols='50' rows='7' placeholder='${this.me}'></textarea>`
		this.f = () => {prolog.do(this.par[0],this.par[1],this.me)}
	}

	where() {
		this.html = `<textarea id='${this.me}' cols='150' rows='7' placeholder='${this.me}'></textarea>`
		this.f = ()=>set_textarea(this.me,Frame.fromstr(View.get(this.par[1])).where(View.get(this.par[0])))
	}

	oddschain2oddstable() {
		this.html = `<textarea id='${this.me}' cols='50' rows='10' placeholder='${this.me}'></textarea>`
		this.f = ()=>{
			let r = id2array(this.par,',')[0]
			let ret = Stats.oddschain2oddstable(r)
			set_textarea(this.me,ret)
		}
	}

	prob2oddstable() {
		this.html = `<textarea id='${this.me}' cols='30' rows='10' placeholder='${this.me}'></textarea>`
		this.f = ()=>{
			let ret = ''
			let p = id2array(this.par,',')[0]
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
			set_textarea(this.me,ret)
		}
	}

	plot() {
		this.html = `<div id='${this.me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${this.me}</div>`
		this.f = () => {
			let frame = Frame.fromString(View.get(this.par))
			$('#'+this.me).empty()
			$('#'+this.me).removeAttr('style')
			if (frame.numcols()==2) Plot.fromFrame(frame).plot1 (this.me)
			if (frame.numcols()==3) Plot.fromFrame(frame).table2(this.me)
			if (frame.numcols()==4) Plot.fromFrame(frame).table3(this.me)
		}
	}

	network() {
		window.godiagram = null
		this.html = `<div id='${this.me}' style='border:thin solid black;width:640px;height:400px;color:#999'>${this.me}</div>`
		this.f = () => Plot.plotnetwork(this.me,View.get(this.par))
	}

	json2net() {
		window.godiagram = null
		this.html = `<div id='${this.me}' style='border:thin solid black;width:640px;height:400px;color:#999'>${this.me}</div>`
		this.f = () => Plot.json2net(this.me,View.get(this.par))
	}

	plots() {
		this.html = `<div id='${this.me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${this.me}</div>`
		this.f = () => {
			let frame = Frame.fromString(View.get(this.par))
			let frame1 = frame.copy().removecol(1)
			let frame2 = frame.copy().removecol(0)
			if (frame.numcols() >= 3) {
				$('#'+this.me).empty()
				$('#'+this.me).removeAttr('style')
				$('#'+this.me).append(`<table><tr><td id='${this.me}1' width='500px'></td><td id='${this.me}2' width='500px'></td></tr></table>`)
				Plot.fromFrame(frame1).plot1(this.me+1)
				Plot.fromFrame(frame2).plot1(this.me+2)
			}			
		}
	}

	plot1() {
		this.html = `<span id='${this.me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${this.me}</span>`
		this.f = () => {
			let frame = Frame.fromString(View.get(this.par))
			$('#'+this.me).empty()
			$('#'+this.me).removeAttr('style')
			$('#'+this.me).append(`<table><tr><td id='${this.me}2' width='400px'></td></tr></table>`)
			Plot.fromFrame(frame).plot1(this.me+'2')
		}
	}

	plot2() {
		this.html = `<div id='${this.me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${this.me}</div>`
		this.f = () => {
			let frame = Frame.fromString(View.get(this.par))
			let frame1 = frame.copy().removecol(1)
			let frame2 = frame.copy().removecol(0)
			if (frame.numcols() >= 3) {
				$('#'+this.me).empty()
				$('#'+this.me).removeAttr('style')
				$('#'+this.me).append(`<table><tr><td id='${this.me}1' width='500px'></td><td id='${this.me}2' width='500px'></td><td id='${this.me}3' width='500px'></td></tr></table>`)
				Plot.fromFrame(frame1).plot1(this.me+1)
				Plot.fromFrame(frame ).plot2(this.me+2)
				Plot.fromFrame(frame2).plot1(this.me+3)
			}			
		}
	}

	plot23() {
		this.html = `<div id='${this.me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${this.me}</div>`
		this.f = () => {
			let frame = Frame.fromString(View.get(this.par))
			let frame1 = frame.copy().removecol(1)
			let frame2 = frame.copy().removecol(0)
			if (frame.numcols() >= 3) {
				$('#'+this.me).empty()
				$('#'+this.me).removeAttr('style')
				$('#'+this.me).append(`<table><tr><td id='${this.me}1' width='500px'></td><td id='${this.me}2' width='500px'></td><td id='${this.me}3' width='500px'></td></tr></table>`)
				Plot.fromFrame(frame1).plot1 (this.me+1)
				Plot.fromFrame(frame ).plot23(this.me+2)
				Plot.fromFrame(frame2).plot1 (this.me+3)
			}			
		}
	}

	plot2layer() {
		this.html = `<div id='${this.me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${this.me}</div>`
		this.f = () => {
			$('#'+this.me).empty()
			$('#'+this.me).removeAttr('style')
			$('#'+this.me).append(`<table><tr><td id='${this.me}2' width='500px'></td></tr></table>`)
			Plot.fromString(View.get(this.par)).plot2layer(this.me+2)
		}
	}

	cause() {
		this.html = `<textarea id='${this.me}' cols='50' rows='7' placeholder='${this.me}'></textarea>`
		this.f = ()=>{
			let csv = View.get(this.par)
			let model = new Model(Frame.fromString(csv))
			let middle = model.get_control_name()
			let ends = model.get_noncontrol_names()
			let graph = ends[0] + '-' + middle + '-' + ends[1]
			set_textarea(this.me,graph)
		}
	}

	func(f) {
		this.html = `<textarea id='${this.me}' placeholder='${this.me}' cols='30'></textarea>`
		this.f = ()=>$('#'+this.me).val(f(...this.par.map(p=>View.get(p))))
	}

}
