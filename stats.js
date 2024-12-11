
/*
	Author:	Anthony John Ripa
	Date:	11/23/2024
	Stats:	A statistics library
*/

class Stats {

	static p(query,data) {
		let [head,...body] = data
		let weighted = head[0] == '_Count'
		body = Stats.pbody(query, body, weighted)
		if (!Array.isArray(body)) body = [body]
		return [Stats.phead(query).map(i=>head[i]), ...body]
	}
	static phead(query) {
		if (query.includes('|')) {
			let [colindex,condition] = query.split('|')
			return [...condition.split(','),colindex]
		} else {
			return [query]
		}
	}
	static pbody(query,data,weighted) {
		let [colindex,condition] = query.split('|')
		if (condition == undefined) {
			return Stats.pcol(colindex,data,weighted)
		} else if (condition?.includes('=')) {
			let [conditioncolindex,conditioncolvalue] = condition.split('=')
			data = Stats.filter(data,[conditioncolindex])[conditioncolvalue]
			return Stats.pcol(colindex,data,weighted)
		} else {
			return Stats.pcols(data,condition,colindex,weighted).sort((r1,r2)=>isNaN(r1[1])?+1:isNaN(r2[1])?-1:r2[1]-r1[1]).map(xy=>[JSON.parse(xy[0]),xy[1]])
		}
	}
	static pcol(colindex,data,weighted = false) {
		let s = 0;
		let count = 0
		for (let r = 0 ; r < data.length ; r++ ) {
			let row = data[r]
			s += Number(row[colindex])
			count += weighted ? Number(row[0]) : 1
		}
		return s / count
	}
	static pcols(data,condition,output_index,weighted) {
		let colindexes = condition.split(',').map(Number)
		let filtered = Stats.filter(data,colindexes)
		let valsi = colindexes.map(colindex=>colvals(data,colindex))
		let cp = cartesianProductOf(...valsi)
		let groups = cp.map(val=>Stats.pcol(output_index,filtered[JSON.stringify(val)],weighted))
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
	static average(list) {
		let unit = list.every(e=>e.endsWith('‰')) ? '‰' : ''
		if (unit=='‰') list = list.map(e=>e.slice(0,-1))
		let mean = calcmean(list)
		mean = math.round(mean,2)
		return mean + unit
		function calcmean(list) {
			let count = 0
			let sum = 0
			for (let i = 0 ; i < list.length ; i++) {
				if (!isNaN(list[i])) {
					sum += Number(list[i])
					count++
				}
			}
			return sum / count
		}
	}
	static oddschain2oddstable(r) {	//	+2024.5
		let ret = ''
		for (let i = 0 ; i <= r.length ; i++) {
			for (let j = 0 ; j <= r.length ; j++) {
				let odds = 1
				if (i==j) { odds *= 1 }
				if (i<=j-1) { odds *= r[i] }
				if (i<=j-2) { odds *= r[i+1] }
				if (i<=j-3) { odds *= r[i+2] }
				if (i>=j+1) { odds /= r[j] }
				if (i>=j+2) { odds /= r[j+1] }
				if (i>=j+3) { odds /= r[j+2] }
				odds = isNaN(odds) ? '%' : odds
				odds = odds==1/0 ? '∞' : odds
				odds = odds==-1/0 ? '-∞' : odds
				ret += odds
				if (j<r.length) ret += '\t'
			}
			if (i<r.length) ret += '\n'
		}
		return ret
	}
	static kv2marginalmatrix(rows) {	//	+2024.5
		let {xhead,yhead,z} = Stats.kv2matrix(rows)
		z = z.map(row => [...row,Stats.average(row)])
		z = math.transpose(z)
		z = z.map(row => [...row,Stats.average(row)])
		z = math.transpose(z)
		z.unshift([...yhead,''])
		z = math.transpose(z)
		z.unshift(['',...xhead,''])
		z = math.transpose(z)
		return z
	}
	static headmatrix2marginalmatrix(head,matrix) {	//	+2024.6
		let {xhead,yhead,title} = head
		let z = matrix
		z = z.map(row => [...row,Stats.average(row)])
		z = math.transpose(z)
		z = z.map(row => [...row,Stats.average(row)])
		z = math.transpose(z)
		z.unshift([...yhead,''])
		z = math.transpose(z)
		z.unshift([title,...xhead,''])
		z = math.transpose(z)
		return z
	}
	static marginalsort(matrix,order=-1) {
		let ret = Stats.rowmarginalsort(matrix,order)
		ret = math.transpose(ret)
		ret = Stats.rowmarginalsort(ret,order)
		return math.transpose(ret)
	}
	static rowmarginalsort(matrix,order=-1) {
		let head = matrix[0]
		let body = matrix.slice(1,-1)
		let marg = matrix.slice(-1)[0]
		console.log(body)
		if (order==+1) body.sort((Ra,Rb)=>str2num(last(Rb))<str2num(last(Ra)))
		if (order==-1) body.sort((Ra,Rb)=>str2num(last(Rb))>str2num(last(Ra)))
		return [head,...body,marg]
	}
	static kv2matrix(rows) {
		let xhead = [], yhead = []
		for (let i=0; i<rows.length; i++) {
			let row = rows[i]
			let [x,y] = row[0]
			if (!xhead.includes(x)) xhead.push(x)
			if (!yhead.includes(y)) yhead.push(y)
		}
		let z = []
		for (let x=0; x<xhead.length; x++) {
			z.push([])
			for (let y=0; y<yhead.length; y++) {
				z[x][y] = math.round(lookup([xhead[x],yhead[y]],rows)*1000,2)+'‰'
			}
		}
		return {xhead,yhead,z}
	}
	static kv2tensor(rows) {
		let xhead = [], yhead = [], zhead = []
		for (let i=0; i<rows.length; i++) {
			let row = rows[i]
			let [x,y,z] = row[0]
			if (!xhead.includes(x)) xhead.push(x)
			if (!yhead.includes(y)) yhead.push(y)
			if (!zhead.includes(z)) zhead.push(z)
		}
		let f = []
		for (let x=0; x<xhead.length; x++) {
			f.push([])
			for (let y=0; y<yhead.length; y++) {
				f[x].push([])
				for (let z=0; z<zhead.length; z++) {
					f[x][y][z] = math.round(lookup([xhead[x],yhead[y],zhead[z]],rows)*1000,2)+'‰'
				}
			}
		}
		return {xhead,yhead,zhead,f}
	}

}
