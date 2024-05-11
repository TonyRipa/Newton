
/*
	Author:	Anthony John Ripa
	Date:	5/10/2024
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
	/*
	static oddschain2oddstable(r) {	//	-2024.5
		let ret = ''
		for (let i = 0 ; i <= r.length ; i++) {
			for (let j = 0 ; j <= r.length ; j++) {
				let odds
				if (i==j) {
					odds = 1
				} else if (i==j-1) {
					odds = r[i]
				} else if (i==j-2) {
					odds = r[i]*r[i+1]
				} else if (i==j-3) {
					odds = r[i]*r[i+1]*r[i+2]
				} else if (i==j+1) {
					odds = 1/r[j]
				} else if (i==j+2) {
					odds = 1/(r[j]*r[j+1])
				} else if (i==j+3) {
					odds = 1/(r[j]*r[j+1]*r[j+2])
				}
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
	*/
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
		if (order==+1) body.sort((Ra,Rb)=>Rb.slice(-1)[0]<Ra.slice(-1)[0])
		if (order==-1) body.sort((Ra,Rb)=>Rb.slice(-1)[0]>Ra.slice(-1)[0])
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
