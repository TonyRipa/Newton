
/*
	Author:	Anthony John Ripa
	Date:	7/10/2024
	Plot:	A plotting library
*/

class Plot {

	constructor(frame) {
		this.frame = frame
		this.head = this.frame.head()
		this.x = math.transpose(this.frame.getcols().slice(0,-1))
		this.y = this.frame.getcols().slice(-1)[0]
	}

	static fromString(str) {
		return Plot.fromFrame(Frame.fromString(str))
	}

	static fromFrame(frame) {
		return new Plot(frame)
	}

	static factory(headrows) {	//	First row is column names
		let [head,...rows] = headrows
		let x = rows.map(row=>row[0])
		let y = rows.map(row=>math.typeOf(row[1])=='number'&&isNaN(row[1])?0:row[1])
		return new Plot(x,y,head)
	}

	static help2(rows) {	//	Each row's 1st entry is a list of independent variables, and 2nd entry the dependent variable
		let z = Stats.kv2marginalmatrix(rows)
		z = Stats.marginalsort(z)
		return Plot.table(z)
	}

	static help3(rows) {	//	Each row's 1st entry is a list of independent variables, and 2nd entry the dependent variable
		let {xhead,yhead,zhead,f} = Stats.kv2tensor(rows)
		return f.map(
				(matrix,i)=> {
					let z = Stats.headmatrix2marginalmatrix({xhead:yhead,yhead:zhead},matrix)
					return Plot.table(z)
				}
			).join()
	}

	static table(rows) {
		return '<table border><tr>' + rows.map(row=>'<td>'+row.join('</td><td>')+'</td>').join('</tr><tr>') + '</tr></table>'
	}

	table2(id) {
		let results = _.zip(this.x,this.y)
		set_div(id,Plot.help2(results))
	}

	table3(id) {
		let results = _.zip(this.x,this.y)
		set_div(id,Plot.help3(results))
	}

	plot1(id) {
		var trace1 = {
			x: this.x.map(x=>x[0]),
			y: this.y,
			mode: 'markers',
			type: 'scatter'
		}
		var data = [trace1]
		var layout = {
			xaxis: {title: {text:this.head?.[0]} } ,
			yaxis: {title: {text:this.head?.[1]} } ,
			width: 500 ,
		}
		Plotly.newPlot(id, data, layout)
	}

	plot2(id) {
		var trace1 = {
			x: this.x.map(row=>row[1]),
			y: this.x.map(row=>row[0]),
			z: this.y,
			mode: 'markers',
			marker: {
				size: 2,
				color: this.x.map(row=>row[0]).map(x=>x=='F'?'red':'blue')
			} ,
			type: 'scatter3d'
		}
		var data = [trace1]
		if (trace1.z[0]==Number(trace1.z[0]))
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
		let nticks = trace1.x[0] == Number(trace1.x[0]) ? 5 : 10
		let layout = {
			autosize: true ,
			margin: { l: 0, r: 0, b: 0, t: 0 } ,
			scene: {
				xaxis: {title: ''           , tickangle: -90 , nticks: nticks , showticklabels: false} ,
				yaxis: {title: this.head[0] , tickangle: 0   , nticks: 5      , showticklabels: true} ,
				zaxis: {title: this.head[2] , tickangle: 0   , nticks: 5      , showticklabels: true} ,
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
						args: [{'scene.xaxis.title':this.head[1] , 'scene.camera.eye': {x: 1, y: -1/4, z: 1/4} , 'scene.xaxis.showticklabels': false , 'scene.yaxis.showticklabels': true , 'scene.zaxis.showticklabels': false}]
					},
					{
						label: '',
						method: 'relayout',
						args: [{'scene.xaxis.title':this.head[1] , 'scene.camera.eye': {x: 1, y: -2/4, z: 2/4} , 'scene.xaxis.showticklabels': false , 'scene.yaxis.showticklabels': true , 'scene.zaxis.showticklabels': false}]
					},
					{
						label: '',
						method: 'relayout',
						args: [{'scene.xaxis.title':this.head[1] , 'scene.camera.eye': {x: 1, y: -3/4, z: 3/4} , 'scene.yaxis.showticklabels': false}]
					},
					{
						label: '',
						method: 'relayout',
						args: [{'scene.camera.eye': {x: 1, y: -1, z: 1}}]
					},
					{
						label: '',
						method: 'relayout',
						args: [{'scene.yaxis.title':this.head[0] , 'scene.camera.eye': {x: 3/4, y: -1, z: 3/4} , 'scene.xaxis.showticklabels': false}]
					},
					{
						label: '',
						method: 'relayout',
						args: [{'scene.yaxis.title':this.head[0] , 'scene.camera.eye': {x: 2/4, y: -1, z: 2/4} , 'scene.xaxis.showticklabels': true , 'scene.yaxis.showticklabels': false , 'scene.zaxis.showticklabels': false}]
					},
					{
						label: '',
						method: 'relayout',
						args: [{'scene.yaxis.title':this.head[0] , 'scene.camera.eye': {x: 1/4, y: -1, z: 1/4} , 'scene.xaxis.showticklabels': true , 'scene.yaxis.showticklabels': false , 'scene.zaxis.showticklabels': false}]
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

	plot23(id) {

		let data = new vis.DataSet()
		let xs = []
		let ys = []
		for (let i = 0 ; i < this.y.length ; i++ ) {
			let [x,y,z] = [...this.x[i],this.y[i]]
			//x = x=='F' ? 0 : x=='M' ? 3 : x
			if (x != Number(x)) {
				if (!xs.includes(x)) xs.push(x)
				x = xs.indexOf(x) * 3
			}
			if (y != Number(y)) {
				if (!ys.includes(y)) ys.push(y)
				y = ys.indexOf(y)
			}
			data.add([{x,y,z}])
		}

		var options = {
			width:  '600px',
			height: '600px',
			style: 'dot',
			showPerspective: false,
			showGrid: true,
			showShadow: false,
			keepAspectRatio: true,
			verticalRatio: 0.5,
			xLabel: 'x = ' + this.head[0],
			yLabel: 'y = ' + this.head[1],
			zLabel: 'z = ' + this.head[2],
			xValueLabel: x=>x==0?'♀':x==3?'♂':'' ,
		}

		$('#'+id).append(`<table><tr><td id='q123'></td></tr><tr><td><input type="range" min='0' max='20' value="0" oninput='Plot.plot23helper(this.value,${JSON.stringify(this.head)})' id="goer" style='width:500px'></td></tr></table>`)

		var container = document.getElementById('q123')
		Plot.graph = new vis.Graph3d(container, data, options)
		//graph.on('cameraPositionChange', onCameraPositionChange)
		Plot.plot23helper(0)

	}

	static plot23helper(i=0,head) {
		let q = 3.14159 / 2
		let horizontal = [0,-.07,-.15,-.20,-.24,-.25,-.24,-.20,-.15,-.07, 0,-.1,-.2,-.3,-.4,-.5,-.6,-.7,-.8,-.9,-1].map(c=>c*q)[i]
		let   vertical = [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1, .9, .8, .7, .6, .5, .4, .3, .2, .1, 0].map(c=>c*q)[i]
		let   distance = 1.7
		Plot.graph.setCameraPosition({horizontal,vertical,distance})
		if (i==0) {
			Plot.graph.setOptions({yLabel:'',yValueLabel: x=>''})
		} else if (i==1) {
			Plot.graph.setOptions({yLabel:'y = '+head[1],yValueLabel: x=>x})
		} else if (i==9) {
			Plot.graph.setOptions({zLabel:'z = '+head[2],zValueLabel: x=>x})
		} else if (i==10) {
			Plot.graph.setOptions({zLabel:'',zValueLabel: x=>''})
		} else if (i==11) {
			Plot.graph.setOptions({zLabel:'z = '+head[2],zValueLabel: x=>x})
		} else if (i==19) {
			Plot.graph.setOptions({xLabel:'x = '+head[0],xValueLabel: x=>x==0?'♀':x==3?'♂':''})
		} else if (i==20) {
			Plot.graph.setOptions({xLabel:'',xValueLabel: x=>''})
		}
		//onCameraPositionChange()
	}

	plot2layer(id) {
		let valuesdict = this.frame.valuesdict()
		let compactframe = this.frame.copy().compact()
		let controlname = new Model(this.frame).get_control_name()
		let noncontrolnames = new Model(this.frame).get_noncontrol_names()
		let xhead = noncontrolnames[0]
		let yhead = noncontrolnames[1]
		let zhead = controlname
		let xvalues = valuesdict[xhead]
		let yvalues = valuesdict[yhead]
		let zvalues = valuesdict[zhead]
		let compactframemarginal = this.frame.copy().removecol(controlname).compact()
		let data = [gettrace(compactframemarginal)]
		let steps = []
		steps.push(gettrace(compactframemarginal,'All'))
		for (let value of zvalues) {
			steps.push(gettrace(compactframe.where(controlname,value).copy(),value,xvalues,yvalues))
		}
		log(steps)
		let layout = {
			// autosize: true ,
			//margin: { l: 0, r: 0, b: 0, t: 0 } ,
			xaxis: { title: {text:xhead} , categoryorder: 'array' , categoryarray: xvalues , range: getrange(xvalues) } ,
			yaxis: { title: {text:yhead} , categoryorder: 'array' , categoryarray: yvalues , range: getrange(yvalues) } ,
			showlegend: false ,
			sliders: [{
				pad: {t: 40},
				currentvalue: {
					visible: true,
					prefix: zhead + ': ',
					xanchor: 'right',
					font: {size: 20, color: '#666'}
				},
				steps: steps ,
			}]
		}
		Plotly.newPlot(id, data, layout , {displayModeBar:false})
		function getrange(values) {
			if (values[0] == Number(values[0])) {
				let [min,max] = [math.min(values), math.max(values)]
				return [min - .2*(max-min) , max + .2*(max-min)]
			}
			return values
		}
		function gettrace(frame, label, xvalues, yvalues) {

			let hovertext1 = frame.getcol('_Count')
			let hovertext2 = frame.copy().normalize(xhead).getcol('_Count').map(x=>math.round(x*100)+'%')
			let hovertext = _.unzip([hovertext1,hovertext2]).map(x=>x[0]+'='+x[1])

			let size = frame.getcol('_Count').map(x=>math.sqrt(x))
			if (math.max(size)<10) size = size.map(x=>x*8)

			let x = frame.getcol(xhead)
			let y = frame.getcol(yhead)
			if (xvalues != undefined)
				for (let xvalue of xvalues)
					if (!(x.includes(xvalue))) {
						x.push(xvalue)
						y.push(null)
					}
			if (yvalues != undefined)
				for (let yvalue of yvalues)
					if (!(y.includes(yvalue))) {
						y.push(yvalue)
						x.push(null)
					}

			let   trace = {'x':  x , 'y':  y , 'hovertext':  hovertext  , 'mode': 'markers', 'marker': {'size': size} }
			let retrace = {'x': [x], 'y': [y], 'hovertext': [hovertext] , 'mode': 'markers', 'marker': {'size': size} }
			if (label == undefined) {
				return trace
			}
			
			return ({ label: label, method: 'restyle', args: [retrace] })

		}
	}

}