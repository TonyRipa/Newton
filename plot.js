
/*
	Author:	Anthony John Ripa
	Date:	4/10/2024
	Plot:	A plotting library
*/

class Plot {

	constructor(x,y) {	//	x is list, y is list
		this.x = x
		this.y = y
	}

	static factory1(rows) {	//	Each row's 1st entry is a list of independent variables, and 2nd entry the dependent variable
		let x = []
		let y = []
		for (let row of rows) {
			y.push(row[1])
			x.push(row[0][0])
		}
		return new Plot(x,y)
	}

	static factory2(rows) {	//	Each row's 1st entry is a list of independent variables, and 2nd entry the dependent variable
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
		z.unshift(yhead)
		z = math.transpose(z)
		z.unshift(['',...xhead])
		z = math.transpose(z)
		return Plot.table(z)
		function lookup(key,data) {
			for (let datum of data) {
				if (JSON.stringify(key)==JSON.stringify(datum[0])) return datum[1]
			}
		}
	}

	static table(rows) {
		return '<table border><tr>' + rows.map(row=>'<td>'+row.join('</td><td>')+'</td>').join('</tr><tr>') + '</tr></table>'
	}

	plot(id) {
		var trace1 = {
			x: this.x,
			y: this.y,
			mode: 'markers',
			type: 'scatter'
		}
		var data = [trace1]
		Plotly.newPlot(id, data)
	}

}