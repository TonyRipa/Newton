
/*
	Author:	Anthony John Ripa
	Date:	6/05/2026
	LayoutRender:	A Layout & Render class
*/

class LayoutRender {

	static draw(stage, dag) {
		return LayoutRender.#layout(stage, dag).then(x => LayoutRender.#render(stage, x))
	}

	static node(id) {
		return $(`<span class='cont' data-node='${id}' style='display:inline-block;margin:10px;vertical-align:top'></span>`)
	}

	static watch(stage, dag) {
		LayoutRender.unwatch(stage)

		const observer = new ResizeObserver(() => {
			clearTimeout(stage.data('layoutrender-timer'))

			stage.data('layoutrender-timer', setTimeout(() => {
				LayoutRender.draw(stage, dag)
			}, 100))
		})

		stage.find('.cont[data-node]').each(function() {
			observer.observe(this)
		})

		stage.data('layoutrender-observer', observer)
	}

	static unwatch(stage) {
		const observer = stage.data('layoutrender-observer')
		const timer = stage.data('layoutrender-timer')

		if (observer) observer.disconnect()
		if (timer) clearTimeout(timer)

		stage.removeData('layoutrender-observer')
		stage.removeData('layoutrender-timer')
	}

	static #layout(stage, dag) {
		const $nodes = stage.find('.cont[data-node]')
		const children = []
		const id2size = {}

		$nodes.each(function(){
			const $c = $(this)
			const id = $c.attr('data-node')
			const w = Math.max(10, Math.ceil($c.outerWidth()))
			const h = Math.max(10, Math.ceil($c.outerHeight()))

			id2size[id] = { w, h }
			children.push({ id, width: w, height: h })
		})

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
				'elk.algorithm': 'layered',
				'elk.direction': 'DOWN',
				'elk.spacing.nodeNode': '24',
				'elk.layered.spacing.nodeNodeBetweenLayers': '40',
				'elk.spacing.edgeEdge': '16',
				'elk.spacing.edgeNode': '16',
				'elk.edgeRouting': 'POLYLINE',
				'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
				'elk.layered.wrapping.strategy': 'SINGLE_EDGE',
				'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES'
			},
			children,
			edges
		}

		const elk = new window.ELK()

		return elk.layout(graph).then(layout => {
			return { layout, $nodes, id2size }
		})
	}

	static #render(stage, x) {
		stage.find('#net-edges').remove()
		const { layout, $nodes, id2size } = x

		let maxX = 0
		let maxY = 0

		for (const n of (layout.children || [])) {
			const $cont = $nodes.filter(`[data-node="${n.id}"]`)

			$cont.css({ position: 'absolute', left: n.x + 'px', top: n.y + 'px', margin: 0 })

			maxX = Math.max(maxX, n.x + (n.width || id2size[n.id]?.w || 0))
			maxY = Math.max(maxY, n.y + (n.height || id2size[n.id]?.h || 0))
		}

		const layoutW = Math.ceil(maxX + 40)
		const layoutH = Math.ceil(maxY + 40)

		stage.css({
			width: layoutW + 'px',
			minHeight: layoutH + 'px',
			marginLeft: 'auto',
			marginRight: 'auto'
		})

		const svg = $(`<svg id='net-edges' style='position:absolute;top:0;left:0;width:${Math.ceil(maxX + 80)}px;height:${Math.ceil(maxY + 80)}px;pointer-events:none;overflow:visible'></svg>`)
		stage.append(svg)

		const svgEl = svg[0]

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

				for (let i = 1; i < pts.length; i++) {
					d += ` L ${pts[i].x} ${pts[i].y}`
				}

				const path = document.createElementNS('http://www.w3.org/2000/svg','path')

				path.setAttribute('d', d)
				path.setAttribute('fill','none')
				path.setAttribute('stroke','#8a8a8a')
				path.setAttribute('stroke-width','1.5')
				path.setAttribute('marker-end','url(#arrow)')

				svgEl.appendChild(path)
			}
		}
	}

}
