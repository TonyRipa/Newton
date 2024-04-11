
/*
	Author:	Anthony John Ripa
	Date:	4/10/2024
	Stats:	A statistics library
*/

class Stats {

	static p(query,data) {
		let [colindex,condition] = query.split('|')
		if (condition == undefined) {
			return Stats.pcol(colindex,data)
		} else if (condition?.includes('=')) {
			let [conditioncolindex,conditioncolvalue] = condition.split('=')
			data = Stats.filter(data,[conditioncolindex])[conditioncolvalue]
			return Stats.pcol(colindex,data)
		} else {
			return Stats.pcols(data,condition,colindex).sort((r1,r2)=>isNaN(r1[1])?+1:isNaN(r2[1])?-1:r2[1]-r1[1]).map(xy=>[JSON.parse(xy[0]),xy[1]])
		}
	}
	static pcol(colindex,data) {
		let s = 0;
		let count = 0
		for (let r = 0 ; r < data.length ; r++ ) {
			let row = data[r]
			s += Number(row[colindex])
			count += Number(row[0])
		}
		return s / count
	}
	static pcols(data,condition,output_index) {
		let colindexes = condition.split(',').map(Number)
		let filtered = Stats.filter(data,colindexes)
		let valsi = colindexes.map(colindex=>colvals(data,colindex))
		let cp = cartesianProductOf(...valsi)
		let groups = cp.map(val=>Stats.pcol(output_index,filtered[JSON.stringify(val)]))
		return math.transpose([cp.map(JSON.stringify),groups])
	}
	static filter(data,colindexes) {
		if (!colindexes) return data
		let valsi = colindexes.map(colindex=>colvals(data,colindex))
		let cp = cartesianProductOf(...valsi)
		let ret = {}
		for (let val of cp)
			ret[JSON.stringify(val)] = []
		for (let r = 0 ; r < data.length ; r++ ) {
			let row = data[r]
			let val = '[' + colindexes.map(colindex=>quoteifmust(row[colindex])).join(',') + ']'
			ret[val].push(row)
		}
		return ret
	}

}
