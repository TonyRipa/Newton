/*
    Author: Anthony John Ripa
    Date:   12/31/2017
    Newton: An A.I. for Math
*/

class Newton {
    static simplify(input) {
        return Newton.ab2poly(Newton.projects(input));
    }
    static ab2poly(ab) {
        var a = round(ab[0])
        var b = round(ab[1])
        var c = round(ab[2])
        return a + '*x ' + (b == 0 ? '' : b == 1 ? ' + h ' : ' + ' + b + '*h ') + (c == 0 ? '' : ' + ' + c);
        function round(x) {
            return Math.round(x * 100) / 100;
        }
    }
    static projects(input) {
        var x1s = Array(4).fill(0).map(Math.random);
        var x2s = Array(4).fill(0).map(Math.random);
        var ys = [];
        for (var i = 0; i < x1s.length; i++)
            ys.push(math.eval(Newton.projecth(Newton.projectx(input, x1s[i]), x2s[i])));
        var b = math.transpose(math.matrix([ys]));
        var ones = Array(x1s.length).fill(1);
        var AT = [x1s, x2s, ones];
        AT = math.matrix(AT);
        var A = math.transpose(AT);
        var ab = Newton.solve(A, b);
        return ab;
    }
    static solve(A, b) {
        var AT = math.transpose(A);
        var ATA = math.multiply(AT, A);
        var ATA = math.multiply(AT, A);
        var ATAinv = math.divide(math.eye(A.valueOf()[0].length), ATA);
        var ATb = math.multiply(AT, b);
        var x = math.multiply(ATAinv, ATb);
        return x.valueOf();
    }
    static projectx(input, x) {
        return input.replace(/x/g, x);
    }
    static projecth(input, h) {
        return input.replace(/h/g, h);
    }
}
