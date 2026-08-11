
/*
	Author:	Anthony John Ripa
	Date:	7/15/2026
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
		if (this.me.startsWith('objectdatas.')) return this.objectselect(Data.get(this.me))
		if (this.me.startsWith('datas.')) return this.select(Data.get(this.me))
		if (this.me.startsWith('data.')) return this.inputbig(Data.get(this.me))
		switch(this.me) {
			case 'input':
			case 'input2': this.input() ; break
			case 'inputbig': this.inputbig() ; break
			case 'objectinput': this.objectinput() ; break
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

	static el(id) {
		return $('#' + CSS.escape(id))
	}

	static get(id) {
		if (Array.isArray(id)) return id.map(x => View.get(x))
		let me = View.el(id)
		if (me.is('form.object')) return Object.fromEntries(new FormData(me[0]))
		let ret = me.val().replace(/\\n/g,'\n')
		if (isCSV(ret)) ret = csv2array(ret)
		return ret
	}

	static set(id, val) {
		let me = View.el(id)
		let setter = (me[0].tagName=='DIV') ? 'html' : 'val'
		val = fixval(val)
		me[setter](val)
		function fixval(val) {
			if (math.typeOf(val) === 'Object') return JSON.stringify(val,null,2)
			let d = dim(val)
			if (d == -1) return undefined
			if (d ==  0) return val.toString()
			if (d ==  1) return val
			if (d ==  2) return val.join('\n')
		}
	}

	in(i = 0) {
		return View.get(this.par[i])
	}

	ins() {
		return this.par.map(p => View.get(p))
	}

	inputbig(data) {
		this.html = `<textarea id='${this.me}' cols='180' rows='7'>${data}</textarea>`
		this.f = ()=>{if (this.par) View.set(this.me,this.in())}
	}

	select(data) {
		this.html = `<select style='max-width:1400px' id='${this.me}'>${View.options(data)}</select>`
		this.f = ()=>{}
	}

	static options(data) {
		if (Array.isArray(data))
			return data.map(d=>'<option>'+d+'</option>').join('')
		else
			return Object.keys(data).map(key=>`<optgroup label='${key}'>`+data[key].map(d=>'<option>'+d+'</option>').join('')+'</optgroup>').join('')
	}

	input(data='') {
		this.html = `<input id='${this.me}' value='${data}' placeholder='${this.me}'>`
		this.f = ()=>{if (this.par) View.set(this.me,this.in())}
	}

	filter() {
		this.html = `<textarea id='${this.me}' cols='50' rows='7' placeholder='${this.me}'></textarea>`
		this.f = ()=>View.set(this.me,Stats.p(...this.ins()))
	}

	prolog() {
		this.html = `<textarea id='${this.me}' cols='50' rows='7' placeholder='${this.me}'></textarea>`
		this.f = () => {prolog.do(...this.ins(),this.me)}
	}

	where() {
		this.html = `<textarea id='${this.me}' cols='150' rows='7' placeholder='${this.me}'></textarea>`
		this.f = ()=>View.set(this.me,Frame.fromHeadedRows(this.in(1)).where(this.in()))
	}

	objectinput() {
		this.html = `
			<form id='${this.me}' class='object' onsubmit='return false' style='outline: thin solid black'>
				<table></table>
			</form>`
		this.f = () => {
			let old = View.get(this.me)
			let keys = this.in().flat()
			let table = View.el(this.me).find('table').empty()

			for (let key of keys) {
				let input = $('<input>')
					.attr('name',key)
					.val(old[key] ?? '')

				let row = $('<tr>').append(
					$('<td>').text(key),
					$('<td>').append(input)
				)

				table.append(row)
			}
		}
	}

	objectselect(data) {
		this.html = `
			<form id='${this.me}' class='object' onsubmit='return false' style='outline: thin solid black'>
				<table></table>
			</form>`
		this.f = () => {
			let old = View.get(this.me)
			let keys = Array.isArray(this.in()) ? this.in().flat() : this.in()
			let options = View.options(data)
			let table = View.el(this.me).find('table').empty()

			for (let key of keys) {
				let select = $('<select>')
					.attr('name',key)
					.html(options)
					.val(old[key] ?? '')

				let row = $('<tr>').append(
					$('<td>').text(key),
					$('<td>').append(select)
				)

				table.append(row)
			}
		}
	}

	oddschain2oddstable() {
		this.html = `<textarea id='${this.me}' cols='50' rows='10' placeholder='${this.me}'></textarea>`
		this.f = ()=>{
			let r = this.in()[0]
			let ret = Stats.oddschain2oddstable(r)
			View.set(this.me,ret)
		}
	}

	prob2oddstable() {
		this.html = `<textarea id='${this.me}' cols='30' rows='10' placeholder='${this.me}'></textarea>`
		this.f = ()=>{
			let ret = ''
			let p = this.in()[0]
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
			View.set(this.me,ret)
		}
	}

	plot() {
		this.html = `<div id='${this.me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${this.me}</div>`
		this.f = () => {
			let frame = Frame.fromHeadedRows(this.in())
			View.el(this.me).empty()
			View.el(this.me).removeAttr('style')
			if (frame.numcols()==2) Plot.fromFrame(frame).plot1 (this.me)
			if (frame.numcols()==3) Plot.fromFrame(frame).table2(this.me)
			if (frame.numcols()==4) Plot.fromFrame(frame).table3(this.me)
		}
	}

	network() {
		window.godiagram = null
		this.html = `<div id='${this.me}' style='border:thin solid black;width:640px;height:400px;color:#999'>${this.me}</div>`
		this.f = () => Plot.plotnetwork(this.me,this.in())
	}

	json2net() {
		window.godiagram = null
		this.html = `<div id='${this.me}' style='border:thin solid black;width:640px;height:400px;color:#999'>${this.me}</div>`
		this.f = () => Plot.json2net(this.me,this.in())
	}

	plots() {
		this.html = `<div id='${this.me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${this.me}</div>`
		this.f = () => {
			let frame = Frame.fromHeadedRows(this.in())
			let frame1 = frame.copy().removecol(1)
			let frame2 = frame.copy().removecol(0)
			if (frame.numcols() >= 3) {
				View.el(this.me).empty()
				View.el(this.me).removeAttr('style')
				View.el(this.me).append(`<table><tr><td id='${this.me}1' width='500px'></td><td id='${this.me}2' width='500px'></td></tr></table>`)
				Plot.fromFrame(frame1).plot1(this.me+1)
				Plot.fromFrame(frame2).plot1(this.me+2)
			}			
		}
	}

	plot1() {
		this.html = `<span id='${this.me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${this.me}</span>`
		this.f = () => {
			let frame = Frame.fromHeadedRows(this.in())
			View.el(this.me).empty()
			View.el(this.me).removeAttr('style')
			View.el(this.me).append(`<table><tr><td id='${this.me}2' width='400px'></td></tr></table>`)
			Plot.fromFrame(frame).plot1(this.me+'2')
		}
	}

	plot2() {
		this.html = `<div id='${this.me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${this.me}</div>`
		this.f = () => {
			let frame = Frame.fromHeadedRows(this.in())
			let frame1 = frame.copy().removecol(1)
			let frame2 = frame.copy().removecol(0)
			if (frame.numcols() >= 3) {
				View.el(this.me).empty()
				View.el(this.me).removeAttr('style')
				View.el(this.me).append(`<table><tr><td id='${this.me}1' width='500px'></td><td id='${this.me}2' width='500px'></td><td id='${this.me}3' width='500px'></td></tr></table>`)
				Plot.fromFrame(frame1).plot1(this.me+1)
				Plot.fromFrame(frame ).plot2(this.me+2)
				Plot.fromFrame(frame2).plot1(this.me+3)
			}			
		}
	}

	plot23() {
		this.html = `<div id='${this.me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${this.me}</div>`
		this.f = () => {
			let frame = Frame.fromHeadedRows(this.in())
			let frame1 = frame.copy().removecol(1)
			let frame2 = frame.copy().removecol(0)
			if (frame.numcols() >= 3) {
				View.el(this.me).empty()
				View.el(this.me).removeAttr('style')
				View.el(this.me).append(`<table><tr><td id='${this.me}1' width='500px'></td><td id='${this.me}2' width='500px'></td><td id='${this.me}3' width='500px'></td></tr></table>`)
				Plot.fromFrame(frame1).plot1 (this.me+1)
				Plot.fromFrame(frame ).plot23(this.me+2)
				Plot.fromFrame(frame2).plot1 (this.me+3)
			}			
		}
	}

	plot2layer() {
		this.html = `<div id='${this.me}' style='border:thin solid black;width:100px;height:50px;color:#999'>${this.me}</div>`
		this.f = () => {
			View.el(this.me).empty()
			View.el(this.me).removeAttr('style')
			View.el(this.me).append(`<table><tr><td id='${this.me}2' width='500px'></td></tr></table>`)
			Plot.fromHeadedRows(this.in()).plot2layer(this.me+2)
		}
	}

	cause() {
		this.html = `<textarea id='${this.me}' cols='50' rows='7' placeholder='${this.me}'></textarea>`
		this.f = ()=>{
			let csv = this.in()
			let model = new Model(Frame.fromHeadedRows(csv))
			let middle = model.get_control_name()
			let ends = model.get_noncontrol_names()
			let graph = ends[0] + '-' + middle + '-' + ends[1]
			View.set(this.me,graph)
		}
	}

	func(f) {
		this.html = `<textarea id='${this.me}' placeholder='${this.me}' cols='30'></textarea>`
		this.f = ()=>View.set(this.me,f(...this.ins()))
	}

}
