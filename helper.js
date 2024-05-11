
/*
	Author:	Anthony John Ripa
	Date:	4/10/2024
	Helper:	A utility library
*/

let log = console.log
function show(x) { alert(JSON.stringify(x)) }
function get_input(id) { return document.getElementById(id).value }
function set_div(id,val) { if (!Array.isArray(val)) val = [val]; document.getElementById(id).innerHTML = val.join('<br>') }
function set_output(id,val) { if (!Array.isArray(val)) val = [val]; document.getElementById(id).innerHTML = val.join('<br>') }
function set_textarea(id,val) { if (!Array.isArray(val)) val = [val]; document.getElementById(id).value = val.join('\n') }
function colvals(data,colindex) { return [...new Set(math.transpose(data)[colindex])] }
function id2array(id,sep='\t') { return tsv2array(id2text(id),sep) }
function id2text(id) { return document.getElementById(id).value }
function tsv2array(tsv,sep='\t') {
	return tsv.trim().replace(new RegExp('\n\t*\n','g'),'\n').split('\n').map(row=>row.split(sep).map(e=>unquoteifposs(e)))
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
