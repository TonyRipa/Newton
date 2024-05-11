
/*
	Author:	Anthony John Ripa
	Date:	5/10/2024
	Plot:	A plotting library
*/

class Plot {

	constructor(x,y,head) {	//	x is list, y is list, head is list
		this.x = x
		this.y = y
		this.head = head
	}

	static factory0(headrows) {	//	First row is column names
		let [head,...rows] = headrows
		let x = []
		let y = []
		for (let row of rows) {
			y.push(row[1])
			x.push(row[0][0])
		}
		return new Plot(x,y,head)
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
		let x = rows.map(row=>row[0])
		let y = rows.map(row=>math.typeOf(row[1])=='number'&&isNaN(row[1])?0:row[1])
		return new Plot(x,y)
	}

	static factory3(headrows) {	//	First row is column names
		let [head,...rows] = headrows
		let x = rows.map(row=>row[0])
		let y = rows.map(row=>math.typeOf(row[1])=='number'&&isNaN(row[1])?0:row[1])
		return new Plot(x,y,head)
	}

	static help2(rows) {	//	Each row's 1st entry is a list of independent variables, and 2nd entry the dependent variable
		let {xhead,yhead,z} = Stats.kv2matrix(rows)
		z = z.map(row => [...row,Stats.average(row)])
		z = math.transpose(z)
		z = z.map(row => [...row,Stats.average(row)])
		z = math.transpose(z)
		z.unshift([...yhead,''])
		z = math.transpose(z)
		z.unshift(['',...xhead,''])
		z = math.transpose(z)
		z = Stats.marginalsort(z)
		return Plot.table(z)
	}

	static help3(rows) {	//	Each row's 1st entry is a list of independent variables, and 2nd entry the dependent variable
		let {xhead,yhead,zhead,f} = Stats.kv2tensor(rows)
		return f.map(matrix=>Plot.table(matrix)).join()
	}

	static table(rows) {
		return '<table border><tr>' + rows.map(row=>'<td>'+row.join('</td><td>')+'</td>').join('</tr><tr>') + '</tr></table>'
	}

	plot(id) {
		var trace1 = {
			x: this.x,
			y: this.y,
			title: {text:"tello"} ,
			xaxis: {title: {text:"hello"} } ,
			yaxis: {title: {text:"jello"} } ,
			mode: 'markers',
			type: 'scatter'
		}
		var data = [trace1]
		var layout = {
			xaxis: {title: {text:this.head?.[0]?.[0]} } ,
			yaxis: {title: {text:this.head?.[1]} } ,
		}
		Plotly.newPlot(id, data, layout)
	}

	table2(id) {
		let results = _.zip(this.x,this.y)
		set_div(id,Plot.help2(results))
	}

	table3(id) {
		let results = _.zip(this.x,this.y)
		set_div(id,Plot.help3(results))
	}

	plot2(id) {
		var trace1 = {
			x: this.x.map(row=>row[1]),
			y: this.x.map(row=>row[0]),
			z: this.y,
			mode: 'markers',
			marker: {size:2} ,
			type: 'scatter3d'
		}
		var data = [trace1]
		for(var i = 0; i < trace1.x.length; i++) {
			var dropLine = {
				x: [trace1.x[i], trace1.x[i]],
				y: [trace1.y[i], trace1.y[i]],
				z: [math.min(trace1.z), trace1.z[i]],
				mode: 'lines',
				type: 'scatter3d',
				line: {
					color: 'black',
					width: 2
				}
			};
			data.push(dropLine);
		}
		let layout = {
			autosize: true ,
			margin: { l: 0, r: 0, b: 0, t: 0 } ,
			scene: {
				xaxis: {title: ''              , tickangle: 0 , nticks: 5 , showticklabels: false} ,
				yaxis: {title: this.head[0][0] , tickangle: 0 , nticks: 5 , showticklabels: true} ,
				zaxis: {title: this.head[1]    , tickangle: 0 , nticks: 5 , showticklabels: true} ,
				camera: { eye: {x: 1, y: 0, z: 0} , projection: {type: 'orthographic'} }
			} ,
			showlegend: false ,
			sliders: [{
				pad: {t: 0},
				currentvalue: {
					visible: true,
					prefix: 'Point of View: ',
					xanchor: 'right',
					font: {size: 20, color: '#666'}
				},
				steps: [
					{
						label: '1',
						method: 'relayout',
						args: [{'scene.xaxis.title':'' , 'scene.camera.eye': {x: 1, y: 0, z: 0} , 'scene.yaxis.showticklabels': true , 'scene.zaxis.showticklabels': true }]
					},
					{
						label: '',
						method: 'relayout',
						args: [{'scene.xaxis.title':this.head[0][1] , 'scene.camera.eye': {x: 1, y: -1/4, z: 1/4} , 'scene.xaxis.showticklabels': false , 'scene.yaxis.showticklabels': true , 'scene.zaxis.showticklabels': false}]
					},
					{
						label: '',
						method: 'relayout',
						args: [{'scene.xaxis.title':this.head[0][1] , 'scene.camera.eye': {x: 1, y: -2/4, z: 2/4} , 'scene.yaxis.showticklabels': false}]
					},
					{
						label: '',
						method: 'relayout',
						args: [{'scene.camera.eye': {x: 1, y: -3/4, z: 3/4}}]
					},
					{
						label: '',
						method: 'relayout',
						args: [{'scene.camera.eye': {x: 1, y: -1, z: 1}}]
					},
					{
						label: '',
						method: 'relayout',
						args: [{'scene.camera.eye': {x: 3/4, y: -1, z: 3/4}}]
					},
					{
						label: '',
						method: 'relayout',
						args: [{'scene.yaxis.title':this.head[0][0] , 'scene.camera.eye': {x: 2/4, y: -1, z: 2/4} , 'scene.xaxis.showticklabels': false}]
					},
					{
						label: '',
						method: 'relayout',
						args: [{'scene.yaxis.title':this.head[0][0] , 'scene.camera.eye': {x: 1/4, y: -1, z: 1/4} , 'scene.xaxis.showticklabels': true , 'scene.yaxis.showticklabels': false , 'scene.zaxis.showticklabels': false}]
					},
					{
						label: '2',
						method: 'relayout',
						args: [{'scene.yaxis.title':'' , 'scene.camera.eye': {x: 0.00, y: -1, z: 0.01} , 'scene.xaxis.showticklabels': true , 'scene.zaxis.showticklabels': true }]
					},
				]
			}]
		}
		Plotly.newPlot(id, data, layout)
	}

}