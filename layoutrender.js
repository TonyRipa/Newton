
/*
	Author:	Anthony John Ripa
	Date:	8/14/2026
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

	static async #layout(stage, dag) {
		const $nodes = stage.find('.cont[data-node]')
		const ids = []
		const id2size = {}
		$nodes.each(function() {
			const $node = $(this)
			const id = $node.attr('data-node')
			ids.push(id)
			id2size[id] = {
				w: Math.max(10, Math.ceil($node.outerWidth())),
				h: Math.max(10, Math.ceil($node.outerHeight()))
			}
		})
		const edges = LayoutRender.#edges(dag)
		const spine = LayoutRender.#spine(dag, ids)
		const spineColumns = LayoutRender.#wrap(spine, id2size)
		const nodeColumn = LayoutRender.#assignColumns(ids, spineColumns, dag)
		const elk = new window.ELK()
		const children = []
		const routedEdges = []
		const bounds = []
		let left = 20
		for (let column = 0; column < spineColumns.length; column++) {
			const columnIds = ids.filter(id => nodeColumn.get(id) === column)
			const idSet = new Set(columnIds)
			const graph = {
				id: 'column_' + column,
				layoutOptions: LayoutRender.#options(),
				children: columnIds.map(id => ({
					id,
					width: id2size[id].w,
					height: id2size[id].h
				})),
				edges: edges.filter(edge =>
					idSet.has(edge.sources[0]) && idSet.has(edge.targets[0])
				)
			}
			const layout = await elk.layout(graph)
			const dx = left
			const dy = 20
			children.push(...(layout.children || []).map(node => ({
				...node,
				x: node.x + dx,
				y: node.y + dy
			})))
			routedEdges.push(...(layout.edges || []).map(edge =>
				LayoutRender.#moveEdge(edge, dx, dy)
			))
			bounds[column] = {
				left,
				right: left + layout.width,
				top: dy,
				bottom: dy + layout.height
			}
			left += layout.width + 80
		}
		const position = new Map(children.map(node => [node.id, node]))
		for (const edge of edges) {
			const sourceColumn = nodeColumn.get(edge.sources[0])
			const targetColumn = nodeColumn.get(edge.targets[0])
			if (sourceColumn === targetColumn) continue
			routedEdges.push(LayoutRender.#wrapEdge(
				edge,
				position,
				bounds,
				sourceColumn,
				targetColumn
			))
		}
		return {
			layout: { children, edges: routedEdges },
			$nodes,
			id2size
		}
	}

	static #edges(dag) {
		const edges = []
		const seen = new Set()
		for (const child in dag.par) {
			for (const parent of (dag.par[child] || [])) {
				const key = parent + '\u0000' + child
				if (seen.has(key)) continue
				seen.add(key)
				edges.push({
					id: 'e_' + edges.length,
					sources: [parent],
					targets: [child]
				})
			}
		}
		return edges
	}
	/* Object insertion order preserves the first path produced by Graph.prepro. */

	static #spine(dag, ids) {
		const available = new Set(ids)
		const seen = new Set()
		const spine = []
		let current = Object.keys(dag.kid).find(id => available.has(id)) || ids[0]
		while (current && !seen.has(current)) {
			spine.push(current)
			seen.add(current)
			current = (dag.kid[current] || []).find(id =>
				available.has(id) && !seen.has(id)
			)
		}
		return spine.length ? spine : ids.slice(0, 1)
	}

	static #wrap(spine, sizes) {
		const columns = []
		let column = []
		let height = 0
		for (const id of spine) {
			const addition = sizes[id].h + (column.length ? 40 : 0)
			if (column.length && height + addition > 680) {
				columns.push(column)
				column = []
				height = 0
			}
			column.push(id)
			height += sizes[id].h + (column.length > 1 ? 40 : 0)
		}
		if (column.length) columns.push(column)
		return columns.length ? columns : [[]]
	}

	static #assignColumns(ids, spineColumns, dag) {
		const spineColumn = new Map()
		spineColumns.forEach((column, index) => {
			column.forEach(id => spineColumn.set(id, index))
		})
		return new Map(ids.map(id => {
			if (spineColumn.has(id)) return [id, spineColumn.get(id)]
			const downstream = LayoutRender.#nearestSpine(id, dag.kid, spineColumn)
			const upstream = LayoutRender.#nearestSpine(id, dag.par, spineColumn)
			return [id, downstream ?? upstream ?? 0]
		}))
	}

	static #nearestSpine(start, links, spineColumn) {
		const seen = new Set([start])
		let frontier = [start]
		while (frontier.length) {
			const next = []
			for (const id of frontier) {
				for (const neighbour of (links[id] || [])) {
					if (seen.has(neighbour)) continue
					if (spineColumn.has(neighbour)) return spineColumn.get(neighbour)
					seen.add(neighbour)
					next.push(neighbour)
				}
			}
			frontier = next
		}
		return null
	}

	static #options() {
		return {
			'elk.algorithm': 'layered',
			'elk.direction': 'DOWN',
			'elk.spacing.nodeNode': '24',
			'elk.layered.spacing.nodeNodeBetweenLayers': '40',
			'elk.spacing.edgeEdge': '16',
			'elk.spacing.edgeNode': '16',
			'elk.edgeRouting': 'POLYLINE',
			'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
			'elk.layered.wrapping.strategy': 'NONE',
			'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES'
		}
	}

	static #moveEdge(edge, dx, dy) {
		const move = point => point && { ...point, x: point.x + dx, y: point.y + dy }
		return {
			...edge,
			sections: (edge.sections || []).map(section => ({
				...section,
				startPoint: move(section.startPoint),
				bendPoints: (section.bendPoints || []).map(move),
				endPoint: move(section.endPoint)
			}))
		}
	}

	static #wrapEdge(edge, position, bounds, sourceColumn, targetColumn) {
		const source = position.get(edge.sources[0])
		const target = position.get(edge.targets[0])
		const first = Math.min(sourceColumn, targetColumn)
		const last = Math.max(sourceColumn, targetColumn)
		const range = bounds.slice(first, last + 1)
		const startPoint = {
			x: source.x + source.width / 2,
			y: source.y + source.height
		}
		const endPoint = {
			x: target.x + target.width / 2,
			y: target.y
		}
		const bottom = Math.max(...range.map(column => column.bottom)) + 30
		const top = Math.max(0, Math.min(...range.map(column => column.top)) - 20)
		const gutter = sourceColumn < targetColumn
			? bounds[targetColumn].left - 40
			: bounds[targetColumn].right + 40
		return {
			...edge,
			sections: [{
				startPoint,
				bendPoints: [
					{ x: startPoint.x, y: bottom },
					{ x: gutter, y: bottom },
					{ x: gutter, y: top },
					{ x: endPoint.x, y: top }
				],
				endPoint
			}]
		}
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
