
/*
	Author:	Anthony John Ripa
	Date:	10/10/2022
	Plot.js: A plot library
*/

class Plot {

	//static plot(points, dom) {																					//	-2022.10
	//	var board = JXG.JSXGraph.initBoard(dom, { renderer: 'canvas', boundingbox: [-5, 5, 5, -5], axis: true });	//	-2022.10
	static plot(points, dom, options = { renderer: 'canvas', boundingbox: [-5, 5, 5, -5], axis: true }) {			//	+2022.10
		var board = JXG.JSXGraph.initBoard(dom, options);															//	+2022.10
		for (var i = 0; i < points.length; i++) {
			board.create('point', points[i], { name: '', size: .1 });
		}
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
		//var f = Plot.expressiontofunction(expr);		//	-2021.9
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
