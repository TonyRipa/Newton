
/*
    Author: Anthony John Ripa
    Date:   4/26/2018
    Plot.js: A plot library
*/

class Plot {

    static plot(points, dom) {
        var board = JXG.JSXGraph.initBoard(dom, { renderer: 'canvas', boundingbox: [-5, 5, 5, -5], axis: true });
        for (var i = 0; i < points.length; i++) {
            board.create('point', points[i], { name: '', size: .1 });
        }
    }

    static plot3(points, dom, options) {
        var data = new vis.DataSet();
        for (var i = 0; i < points.length; i++) {
            data.add({ x: points[i][0], y: points[i][1], z: points[i][2] });
        }
        Plot.plot3__data(data, dom, options);
    }

    static plot3__data(data, dom, options) {
        new vis.Graph3d(document.getElementById(dom), data, options || {});
    }

    static plot3__datas(datas, dom, options) {
        new Plotly.newPlot(dom, [datas], options);
    }

    static graph(expr, dom) {
        var f = Plot.expressiontofunction(expr);
        var board = JXG.JSXGraph.initBoard(dom, { renderer: 'canvas', boundingbox: [-5, 5, 5, -5], axis: true });
        board.create('functiongraph', [f, -10, 10]);
        return board;
    }

    static graph3(expr, dom, options) {
        var f = Plot.expressiontofunction(expr);
        return Plot.graph3f(f, dom, options);
    }

    static graph3f(f, dom, options) {
        var data = Plot.functiontovisdata(f);
        Plot.plot3__data(data, dom, options);
        return data;
    }

    static graph3s(expr, dom, options) {
        var f = Plot.expressiontofunction(expr);
        var data1 = Plot.functiontoplotlydata(f);
        Plot.plot3__datas(data1, dom, { scene: { aspectratio: { x: 1, y: 1, z: 1 } } });
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

    static functiontoplotlydata(f) {
        if (f.length == 1) return functiontoplotlydata1(f);
        if (f.length == 2) return functiontoplotlydata2(f);
        throw new Error('Not the right amount of variables.');
        function functiontoplotlydata1(f) {
            var y = [];
            for (var x = -5; x < 5; x++)
                y.push(f(x));
            return {y};
        }
        function functiontoplotlydata2(f) {
            var z = []
            for (var x = -5; x < 5; x++) {
                var row = []
                for (var y = -5; y < 5; y++) {
                    row.push(f(x, y));
                }
                z.push(row)
            }
            return {x:[-5,-4,-3,-2,-1,0,1,2,3,4,5],y:[-5,-4,-3,-2,-1,0,1,2,3,4,5],z, type: 'surface'};
        }
    }

    static expressiontofunction(expr) {
        var vars = Plot.getvars(expr);
        if (vars.length <= 1) return Plot.expressiontofunction1(expr);
        if (vars.length == 2) return Plot.expressiontofunction2(expr);
        throw new Error('Not the right amount of variables: expr = ' + expr);
    }

    static expressiontofunction1(expr) {
        expr = expr.replace(new RegExp('\\^', 'g'), '**');
        expr = expr.replace(/[A-Za-z]/g, 'x')
        var f = x=>eval(expr);
        return f;
    }

    static expressiontofunction2(expr) {
        var vars = Plot.getvars(expr);
        expr = expr.replace(/\^/g, '**');
        expr = expr.replace(new RegExp(vars[0], 'g'), 'x');
        expr = expr.replace(new RegExp(vars[1], 'g'), 'y');
        var f = (x, y) =>eval(expr);
        return f;
    }

    static getvars(input) {
        var vars = [];
        var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let symbol of input) {
            if (alphabet.includes(symbol)) {
                if (!vars.includes(symbol)) vars.push(symbol);
            }
        }
        return vars;
    }

}
