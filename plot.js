
/*
    Author: Anthony John Ripa
    Date:   2/12/2018
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

    static graph(expr, dom) {
        var f = Plot.expressiontofunction(expr);
        var board = JXG.JSXGraph.initBoard(dom, { renderer: 'canvas', boundingbox: [-5, 5, 5, -5], axis: true });
        board.create('functiongraph', [f, -10, 10]);
        return board;
    }

    static graph3(expr, dom, options) {
        var f = Plot.expressiontofunction(expr);
        var data = Plot.functiontodata(f);
        Plot.plot3__data(data, dom, options);
        return data;
    }

    static functiontodata(f) {
        if (f.length == 1) return Plot.functiontodata1(f);
        if (f.length == 2) return Plot.functiontodata2(f);
        throw new Error('Not the right amount of variables.');
    }

    static functiontodata1(f) {
        var data = new vis.DataSet();
        for (var x = -5; x < 5; x++)
            data.add({ x, y: 0, z: f(x) });
        return data;
    }

    static functiontodata2(f) {
        var data = new vis.DataSet();
        for (var x = -5; x < 5; x++)
            for (var y = -5; y < 5; y++)
                data.add({ x, y, z: f(x, y) });
        return data;
    }

    static expressiontofunction(expr) {
        var vars = Plot.getvars(expr);
        if (vars.length <= 1) return Plot.expressiontofunction1(expr);
        if (vars.length == 2) return Plot.expressiontofunction2(expr);
        throw new Error('Not the right amount of variables.');
    }

    static expressiontofunction1(expr) {
        expr = expr.replace('^', '**');
        expr = expr.replace(/[A-Za-z]/g, 'x')
        var f = x=>eval(expr);
        return f;
    }

    static expressiontofunction2(expr) {
        var vars = Plot.getvars(expr);
        expr = expr.replace('^', '**');
        expr = expr.replace(new RegExp(vars[0], 'g'), 'x');
        expr = expr.replace(new RegExp(vars[1], 'g'), 'y');
        var f = (x, y) =>eval(expr);
        return f;
    }

    static getvars(input) {
        var vars = [];
        var alphabet = 'abcdefghijklmnopqrstuvwxyz';
        for (var i = 0; i < input.length; i++) {
            var symbol = input[i];
            if (isin(symbol, alphabet)) {
                if (!isin(symbol, vars)) vars.push(symbol);
            }
        }
        return vars;
        function isin(needle, haystack) {
            return haystack.indexOf(needle) > -1;
        }
    }

}
