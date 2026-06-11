
/*
	Author:	Anthony John Ripa
	Date:	6/10/2026
	Helper:	A utility library
*/

let log = console.log
function last(x) { return x.slice(-1)[0] }
function show(x) { alert(JSON.stringify(x)) }
function alerto(x) { alert(JSON.stringify(x)) }
function logo(x) { return log(JSON.stringify(x)) }
function colvals(data,colindex) { return [...new Set(math.transpose(data)[colindex])] }
function csv2array(csv,sep=',') {
	return csv.trim().replace(new RegExp('\n'+sep+'*\n','g'),'\n').split('\n').map(row=>row.split(sep).map(e=>unquoteifposs(e)))
}
function csv2dict(csv,sep=',') {
	let [head,...rows] = csv2array(csv,sep)
	let cols = math.transpose(rows)
	return Object.fromEntries(_.unzip([head,cols]))
}
function isCSV(str) {
	if (!str.includes(',')) return false
	if (!str.includes('\n') && str.includes('|')) return false
	let rows = str.trim().split('\n')
	let counts = rows.map(row => (row.match(/,/g)||[]).length)
	return new Set(counts).size == 1
}
function dim(x) {
	if (x == undefined) return -1
	if (!Array.isArray(x)) return 0
 	return 1 + dim(x[0])
}
function unquoteifposs(x) {
	let ret
	try {
		ret = JSON.parse(x)
	} catch(e) {
		ret = x
	}
	if (ret == Number(ret)) ret = Number(ret)
	return ret
}
function quoteifmust(x) {
	if (x==="") return '"' + x + '"'
	if (x==Number(x)) return x
	if (Array.isArray(x)) return x
	return '"' + x + '"'
}
function cartesianProductOf() {//https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
	return _.reduce(arguments, function(a, b) {
		return _.flatten(_.map(a, function(x) {
			return _.map(b, function(y) {
				return x.concat([y]);
			});
		}), true);
	}, [ [] ]);
}
function lookup(key,data) {
	for (let datum of data) {
		if (JSON.stringify(key)==JSON.stringify(datum[0])) return datum[1]
	}
}
function str2num(str) {
	if (math.typeOf(str) == 'Array') return str.map(str2num)
	if (math.typeOf(str) == 'number') return str
	if (str.endsWith('‰')) return str2num(str.slice(0,-1))
	return Number(str)
}