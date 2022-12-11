
/*
	Author:	Anthony John Ripa
	Date:	12/10/2022
	Plot.js: A plot library
*/

class Plot {

	//static plot(points, dom) {																					//	-2022.10
	//	var board = JXG.JSXGraph.initBoard(dom, { renderer: 'canvas', boundingbox: [-5, 5, 5, -5], axis: true });	//	-2022.10
	//static plot(points, dom, options = { renderer: 'canvas', boundingbox: [-5, 5, 5, -5], axis: true }) {			//	+2022.10	//	-2022.12
	//	var board = JXG.JSXGraph.initBoard(dom, options);															//	+2022.10
	//	for (var i = 0; i < points.length; i++) {
	//		board.create('point', points[i], { name: '', size: .1 });
	//	}
	//}

	static plot(points, dom, options) {																								//	+2022.12

		let tooltip = d3.select("body").append("div").style("opacity","0").style("position","absolute").style("background-color","grey")

		d3.select('#'+dom).select('svg').remove()

		let width = 325
		let height = 325

		let margin = {left:50,right:50,top:50,bottom:50}

		let ymin = d3.min(points.map(xy=>xy[1]))
		let ymax = d3.max(points.map(xy=>xy[1]))
		if (ymin == ymax) { ymin-- ; ymax++ }

		let xmin = d3.min(points.map(xy=>xy[0]))
		let xmax = d3.max(points.map(xy=>xy[0]))
		if (xmin == xmax) { xmin-- ; xmax++ }

		if (options && options.boundingbox) [xmin, ymax, xmax, ymin] = options.boundingbox

		let y = d3.scaleLinear().domain([ymin, ymax]).range([height, 0])
		let yAxis = d3.axisLeft(y).ticks(3)

		let x = d3.scaleLinear().domain([xmin, xmax]).range([0,width])
		let xAxis = d3.axisBottom(x).ticks(3)

		var svg = d3.select('#'+dom).append('svg')
			.attr('height','100%').attr('width','100%')
			.attr('viewBox',`0 0 ${width} ${height}`).attr('preserveAspectRatio','none')

		svg.selectAll('circle')
			.data(points)
			.enter().append('circle')
			.attr('cx', function(d) { return x(d[0]) })
			.attr('cy', function(d) { return y(d[1]) })
			.attr('r' , 5)
			.attr('fill', 'red')
			.on('mousemove',function(event, d) {
				d3.select(this).attr('r',10).attr('fill','cyan')
				tooltip.style("opacity","1")
				.style("left",(event.pageX+ 1)+"px")
				.style("top" ,(event.pageY-30)+"px")
				tooltip.html(d)
			})
			.on('mouseout',function(event, d) {
				d3.select(this).attr('r',5).attr('fill','red')
				tooltip.style("opacity","0")
			})

		svg.append('g').attr('transform', `translate(${margin.left},0)`)
			.call(yAxis)

		svg.append('g').attr('transform', `translate(0,${height-margin.top})`)
			.call(xAxis)
	}

	static plot3(points, dom, options) {
		var data = new vis.DataSet();
		for (var i = 0; i < points.length; i++) {
			//data.add({ x: points[i][0], y: points[i][1], z: points[i][2] });				//	-2022.06
			data.add({ x: points[i][0], y: points[i][1], z: math.round(points[i][2],4) });	//	+2022.06
		}
		Plot.plot3__data(data, dom, options);
	}

	static plot3__data(data, dom, options) {
		//new vis.Graph3d(document.getElementById(dom), data, options || {});				//	-2022.06
		Plot.g3 = new vis.Graph3d(document.getElementById(dom), data, options || {});		//	+2022.06
	}

	static graph(expr, dom) {
		assert(expr !== undefined, "Plot.graph Arg1 is undefined")	//	2018.8
		var f = Expression.expressiontofunction(expr);	//	+2021.9
		var board = JXG.JSXGraph.initBoard(dom, { renderer: 'canvas', boundingbox: [-5, 5, 5, -5], axis: true });
		board.create('functiongraph', [f, -10, 10]);
		return board;
	}

	static graph3(expr, dom, options) {
		var f = Expression.expressiontofunction(expr);	//	+2021.9
		return Plot.graph3f(f, dom, options);
	}

	static graph3f(f, dom, options) {
		var data = Plot.functiontovisdata(f);
		Plot.plot3__data(data, dom, options);
		return data;
	}

	static functiontovisdata(f) {
		if (f.length == 1) return functiontovisdata1(f);
		if (f.length == 2) return functiontovisdata2(f);
		throw new Error('Not the right amount of variables.');
		function functiontovisdata1(f) {
			var data = new vis.DataSet();
			for (var x = -5; x < 5; x++)
				data.add({ x, y: 0, z: f(x) });
			return data;
		}
		function functiontovisdata2(f) {
			var data = new vis.DataSet();
			for (var x = -5; x < 5; x++)
				for (var y = -5; y < 5; y++)
					data.add({ x, y, z: f(x, y) });
			return data;
		}
	}

}
