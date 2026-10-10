
/*
	Author:	Anthony John Ripa
	Date:	9/15/2026
	Layout:	A Layout class
*/

class Layout {

	static async layout(stage, dag) {
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
		const edges = Layout.#edges(dag)
		const spine = Layout.#spine(dag, ids)
		const spineColumns = Layout.#wrap(spine, id2size)
		const nodeColumn = Layout.#assignColumns(ids, spineColumns, dag)
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
				layoutOptions: Layout.#options(),
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
				Layout.#moveEdge(edge, dx, dy)
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
			routedEdges.push(Layout.#wrapEdge(
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
			const downstream = Layout.#nearestSpine(id, dag.kid, spineColumn)
			const upstream = Layout.#nearestSpine(id, dag.par, spineColumn)
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

}
