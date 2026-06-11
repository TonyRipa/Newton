
/*
	Author:	Anthony John Ripa
	Date:	6/05/2026
	UI:	A user interface library
*/

class UI {

	static draw(stageid, net) {
		let stage = $(stageid)
		LayoutRender.unwatch(stage)
		stage.empty()
		net = Graph.prepro(net)
		let ids = Graph.net2ids(net)
		let dag = Graph.str2dag(net)
		let rank = Graph.dag2rank(dag)
		ids = rank.flat()  // Rebuild ids from flattened rank to match fs order
		let fs = makes()
		for (let i = ids.length-1 ; i >= 0 ; i--) {
			let id = ids[i]
			let numpars = dag.par[id]?.length
			let row = rank.filter(r=>r.includes(id))[0]
			if (numpars > 0)
				makego(id,fs.slice(i-ids.length),numpars,row)
		}
		LayoutRender.draw(stage, dag).then(() => LayoutRender.watch(stage, dag))
		function makes() {
			let fs = []
			let tempids = []
			for (let row of rank) {
				for (let col of row) {
					if (!tempids.includes(col)) {
						tempids.push(col)
						fs.push(make(col))
					}
				}
			}
			return fs
			function make(id) {
				let view = new View(dag,id)
				let $cont = LayoutRender.node(id)
				stage.append($cont)
				$cont.append(view.html)
				return view.f
			}
		}
		function makego(id0,fs,numpars,row) {
			id0 = id0?.split(',').slice(-1)[0]
			let id = math.randomInt(1,9999)
			let arrows = ['','↓','↘ ↙'][numpars]
			$(`<button id='${id}' title='${arrows}\n${id0}'>${arrows}</button><br>`).insertBefore('#'+id0)
			$('#'+id).on('click',()=>{fs.map(f=>f())})
		}
	}

}
