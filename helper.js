
/*
	Author:	Anthony John Ripa
	Date:	11/02/2024
	Helper:	A utility library
*/

let log = console.log
function last(x) { return x.slice(-1)[0] }
function show(x) { alert(JSON.stringify(x)) }
function alerto(x) { alert(JSON.stringify(x)) }
function nodot(x) { return x?.replace(/\./g,'_') }
function logo(x) { return log(JSON.stringify(x)) }
function get_input(id) { return document.getElementById(id).value }
function putval(id,val) { document.getElementById(id).value = val.replace(/\\n/g,'\n') }
function set_div(id,val) { if (!Array.isArray(val)) val = [val]; document.getElementById(id).innerHTML = val.join('<br>') }
function set_output(id,val) { if (!Array.isArray(val)) val = [val]; document.getElementById(id).innerHTML = val.join('<br>') }
function set_textarea(id,val) { if (!Array.isArray(val)) val = [val]; document.getElementById(id).value = val.join('\n') }
function colvals(data,colindex) { return [...new Set(math.transpose(data)[colindex])] }
function id2array(id,sep=',') { return csv2array(id2text(id),sep) }
function id2text(id) { return document.getElementById(id).value }
function csv2array(csv,sep=',') {
	return csv.trim().replace(new RegExp('\n'+sep+'*\n','g'),'\n').split('\n').map(row=>row.split(sep).map(e=>unquoteifposs(e)))
}
function csv2dict(csv,sep=',') {
	let [head,...rows] = csv2array(csv,sep)
	let cols = math.transpose(rows)
	return Object.fromEntries(_.unzip([head,cols]))
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