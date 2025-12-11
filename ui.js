
/*
	Author:	Anthony John Ripa
	Date:	12/6/2025
	UI:	A user interface library
*/

class ui {

	static makenet() {
		$('#net').empty()
		let net = nodot($('#netstr').val())
		let ids = Graph.net2ids(net)
		let dag = Graph.str2dag(net)
		let rank = Graph.dag2rank(dag)
		ids = rank.flat()  // Rebuild ids from flattened rank to match fs order
		let fs = makess(dag)
		for (let i = ids.length-1 ; i >= 0 ; i--) {
			let id = ids[i]
			let numpars = dag.par[id]?.length
			let row = rank.filter(r=>r.includes(id))[0]
			if (numpars > 0)
				ui.makego(id,fs.slice(i-ids.length),numpars,row)
		}
		ui.drawEdges(dag)
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
		// wrap container for layout; we tag it with data-node so ELK can place it later
		$('#net').append(`<span class='cont' data-node='${id}' style='display:inline-block;margin:10px;vertical-align:top'></span>`)
		// NOTE: all existing widget creation logic remains identical
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
			case 'substitute': return ui.makef(dag,id,x=>x.split('|')[1])
			case 'substitution': return ui.makef(dag,id,(x,y)=>y===''?'':math.evaluate(x,{[Expression.getvars(x)[0]]:y}))
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
		if (Array.isArray(data))
			data = data.map(d=>'<option>'+d+'</option>')
		else
			data = Object.keys(data).map(key=>`<optgroup label='${key}'>`+data[key].map(d=>'<option>'+d+'</option>'))
		$('.cont:last-of-type').append(`<select id='${me}'>${data}</select>`)
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
		return () => {prolog.do(pars[0],pars[1],me)}
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

	static makego(id0,fs,numpars,row) {
		id0 = id0?.split(',').slice(-1)[0]
		let id = math.randomInt(1,9999)
		let arrows = ['','↓','↘ ↙'][numpars]
		if (row.length == 2) {
			let col = row.indexOf(id0)
			arrows = ['↙','↘'][col]
		}
		$(`<button id='${id}' title='${arrows}\n${id0}'>${arrows}</button><br>`).insertBefore('#'+id0)
		$('#'+id).on('click',()=>{fs.map(f=>f())})
	}

	// ===== ELK INTEGRATION =====

	static drawEdges(dag) {
		const $net = $('#net')
		if ($net.length === 0) return

		// Ensure positioned container for absolute children + overlay
		if ($net.css('position') === 'static') $net.css('position','relative')

		// Remove any old overlay
		$('#net-edges').remove()

		// Build nodes from the current DOM (.cont[data-node])
		const $nodes = $('#net .cont[data-node]')
		if ($nodes.length === 0 || !dag || !dag.par) return

		// If ELK is available, use it; otherwise try to load it. If that fails, fall back.
		const run = () => ui._elkLayoutAndRender(dag, $nodes, $net).catch(err => {
			console.warn('ELK layout failed, falling back to straight lines.', err)
			ui._drawEdgesFallbackStraightLines(dag, $net)
		})
		if (window.ELK) { run(); }
		else {
			const s = document.createElement('script')
			s.src = 'https://unpkg.com/elkjs@0.9.3/lib/elk.bundled.js'
			s.onload = run
			s.onerror = () => ui._drawEdgesFallbackStraightLines(dag, $net)
			document.head.appendChild(s)
		}
	}

	static _elkLayoutAndRender(dag, $nodes, $net) {
		// Measure current node sizes (use wrapper sizes so layout has real geometry)
		const children = []
		const id2size = {}
		$nodes.each(function(){
			const $c = $(this)
			const id = $c.attr('data-node')
			// force layout measurement as block; then ELK will position absolutely
			const w = Math.max(10, Math.ceil($c.outerWidth()))
			const h = Math.max(10, Math.ceil($c.outerHeight()))
			id2size[id] = { w, h }
			children.push({ id, width: w, height: h })
		})

		// Build edges from dag.par
		const edges = []
		for (let child in dag.par) {
			const parents = dag.par[child] || []
			for (let p of parents) {
				edges.push({ id: 'e_' + p + '_' + child, sources: [p], targets: [child] })
			}
		}

		const graph = {
			id: 'root',
			layoutOptions: {
				// Layered top-down with nice routed edges
				'elk.algorithm': 'layered',
				'elk.direction': 'DOWN',
				'elk.spacing.nodeNode': '24',
				'elk.layered.spacing.nodeNodeBetweenLayers': '40',
				'elk.spacing.edgeEdge': '16',
				'elk.spacing.edgeNode': '16',
				'elk.edgeRouting': 'POLYLINE',
				'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
				'elk.layered.wrapping.strategy': 'SINGLE_EDGE'
			},
			children,
			edges
		}

		const elk = new window.ELK()
		return elk.layout(graph).then(layout => {
			// Position nodes absolutely per ELK
			let maxX = 0, maxY = 0
			for (const n of (layout.children || [])) {
				const $cont = $nodes.filter(`[data-node="${n.id}"]`)
				// Convert to absolute positioning; remove margins to avoid offset drift
				$cont.css({ position: 'absolute', left: n.x + 'px', top: n.y + 'px', margin: 0 })
				maxX = Math.max(maxX, n.x + (n.width || id2size[n.id]?.w || 0))
				maxY = Math.max(maxY, n.y + (n.height || id2size[n.id]?.h || 0))
			}
			// Ensure container is large enough to show everything
			$net.css({ minWidth: Math.ceil(maxX + 40) + 'px', minHeight: Math.ceil(maxY + 40) + 'px' })

			// Draw routed edges from ELK sections
			const svg = $(`<svg id='net-edges' style='position:absolute;top:0;left:0;width:${Math.ceil(maxX + 80)}px;height:${Math.ceil(maxY + 80)}px;pointer-events:none;overflow:visible'></svg>`)
			$net.append(svg)
			const svgEl = svg[0]

			// Arrowhead
			const defs = document.createElementNS('http://www.w3.org/2000/svg','defs')
			const marker = document.createElementNS('http://www.w3.org/2000/svg','marker')
			marker.setAttribute('id','arrow')
			marker.setAttribute('markerWidth','10')
			marker.setAttribute('markerHeight','7')
			marker.setAttribute('refX','10')
			marker.setAttribute('refY','3.5')
			marker.setAttribute('orient','auto')
			const tip = document.createElementNS('http://www.w3.org/2000/svg','polygon')
			tip.setAttribute('points','0 0, 10 3.5, 0 7')
			tip.setAttribute('fill','#8a8a8a')
			marker.appendChild(tip)
			defs.appendChild(marker)
			svgEl.appendChild(defs)

			for (const e of (layout.edges || [])) {
				for (const sec of (e.sections || [])) {
					const pts = [sec.startPoint].concat(sec.bendPoints || [], [sec.endPoint])
					if (!pts.length) continue
					let d = `M ${pts[0].x} ${pts[0].y}`
					for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x} ${pts[i].y}`
					const path = document.createElementNS('http://www.w3.org/2000/svg','path')
					path.setAttribute('d', d)
					path.setAttribute('fill','none')
					path.setAttribute('stroke','#8a8a8a')
					path.setAttribute('stroke-width','1.5')
					path.setAttribute('marker-end','url(#arrow)')
					svgEl.appendChild(path)
				}
			}
		})
	}

	// Original simple overlay retained as a safe fallback
	static _drawEdgesFallbackStraightLines(dag, $net) {
		$('#net-edges').remove()
		let width = $net.innerWidth()
		let height = $net.innerHeight()
		if (!width) width = $net[0].scrollWidth || 0
		if (!height) height = $net[0].scrollHeight || 0
		let svg = $(`<svg id='net-edges' style='position:absolute;top:0;left:0;width:${width}px;height:${height}px;pointer-events:none;overflow:visible'></svg>`)
		$net.append(svg)
		let svgEl = svg[0]
		if (!svgEl || !dag || !dag.par) return
		for (let child in dag.par) {
			let parents = dag.par[child] || []
			let $child = $('#'+child)
			if ($child.length === 0) continue
			let co = $child.position()
			let cx = co.left + $child.outerWidth()/2
			let cy = co.top + $child.outerHeight()/2
			for (let p of parents) {
				let $p = $('#'+p)
				if ($p.length === 0) continue
				let po = $p.position()
				let px = po.left + $p.outerWidth()/2
				let py = po.top + $p.outerHeight()/2
				let line = document.createElementNS('http://www.w3.org/2000/svg','line')
				line.setAttribute('x1', px)
				line.setAttribute('y1', py)
				line.setAttribute('x2', cx)
				line.setAttribute('y2', cy)
				line.setAttribute('stroke', '#aaa')
				line.setAttribute('stroke-width', '1')
				svgEl.appendChild(line)
			}
		}
	}

}
