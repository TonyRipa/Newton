
/*
	Author:	Anthony John Ripa
	Date:	8/4/2024
	Stats:	A data-frame library
*/

class Frame {

	constructor(dict) {
		if (arguments.length != 1) alert('Frame.constructor() expects 1 argument but got ' + arguments.length)
		this.dict = dict
	}

	static dict2frame(dict) {
		return new Frame(dict)
	}

	static str2frame(str) {
		let dict = csv2dict(str)
		return Frame.dict2frame(dict)
	}

	static fromString(str) { return Frame.str2frame(str) }
	static fromstr(str) { return Frame.fromString(str) }

	static fromDict(str) {
		return Frame.dict2frame(str)
	}

	static headCols2dict(head,cols) { return Object.fromEntries(_.unzip([head,cols])) }

	static fromHeadCols(head,cols) { return Frame.dict2frame(Frame.headCols2dict(head,cols)) }

	head() { return Object.keys(this.dict) }

	cols() { return Object.values(this.dict) }

	rows() { return math.transpose(this.cols()) }

	toString() {
		return this.head() + '\n' + this.rows().join('\n')
	}

	numcols() {
		return this.head().length
	}

	getcol(key) {
		if (math.typeOf(key) == 'number') return this.getcolbyint(key)
		if (math.typeOf(key) == 'string') return this.getcolbystr(key)
		alert('Frame.getcol() key should be int or string')
	}
	getcolbyint(colindex) {
		return this.dict[this.head()[colindex]]
	}
	getcolbystr(colname) {
		return this.dict[colname]
	}

	getcols() {
		return Object.values(this.dict)
	}

	getcolsdict() {
		return this.dict
	}

	colindex(colname) {
		return this.head().indexOf(colname)
	}

	set_colname_rowindex_value(colname,rowindex,value) {
		this.dict[colname][rowindex] = value
	}

	removecol(key) {
		if (math.typeOf(key) == 'number') return this.removecolbyint(key)
		if (math.typeOf(key) == 'string') return this.removecolbystr(key)
		alert('Frame.removecol() key should be int or string')
	}
	removecolbyint(colindex) {
		let colname = this.head()[colindex]
		return this.removecolbystr(colname)
	}
	removecolbystr(colname) {
		delete this.dict[colname]
		return this
	}

	where(key,value) {
		if (arguments.length == 1 && math.typeOf(arguments[0]) == 'string' && arguments[0].includes('=')) [key,value] = arguments[0].split('=')
		if (math.typeOf(key) == 'number') return this.wherebyint(key,value)
		if (math.typeOf(key) == 'string') return this.wherebystr(key,value)
		alert('Frame.where() key should be int or string, but is ' + math.typeOf(key))
	}
	wherebystr(colname,value) {
		let colindex = this.head().indexOf(colname)
		return this.wherebyint(colindex,value)
	}
	wherebyint(colindex,value) {	//	return a frame of a subselection of the rows (actual rows not copy)
		let colname = this.head()[colindex]
		let oldrows = this.rows()
		let rows = []
		for (let i = 0 ; i < this.dict[colname].length ; i++ ) {
			if (this.dict[colname][i] == value)
				rows.push(oldrows[i])
		}
		return Frame.fromHeadCols(this.head(),math.transpose(rows))
	}

	apply(colindex,f) {	//	modify a certain column using a certain function
		let colname = this.head()[colindex]
		for (let i = 0 ; i < this.dict[colname].length ; i++) {
			this.dict[colname][i] = f(this.dict[colname][i])
		}
		return this
	}

	copy() { return Frame.fromString(this.toString()) }

	multiplicity() {
		let rowsstr = this.toString()
		let rowstrs = rowsstr.split('\n')
		let ret = rowstrs.slice(1).map(rowstr=>this.multiplicity1(rowstr,rowstrs))
		return ret
	}

	multiplicity1(rowstr,rowstrs) {
		let matches = rowstrs.filter(r=>r==rowstr)
		return matches.length
	}

	colsum(colindex) {
		return math.sum(this.getcol(colindex))
	}

	normalize(key) {
		if (math.typeOf(key) == 'number') return this.normalizebyint(key)
		if (math.typeOf(key) == 'string') return this.normalizebystr(key)
		alert('Frame.normalize() key should be int or string')
	}
	normalizebystr(colname) {
		let names = [...this.head()]
		names.splice(names.indexOf(colname),1)
		let vals = this.valuesdict()
		let cols = this.getcolsdict()
		for (let colnamevalue of vals[colname]) {
			let count = {}
			let n = 0
			for (let rowindex = 0 ; rowindex < cols[colname].length ; rowindex++)
				if (cols[colname][rowindex] == colnamevalue) {
					if (count[cols[names[1]][rowindex]] == undefined) {
						count[cols[names[1]][rowindex]] = cols[names[0]][rowindex]
						n += cols[names[0]][rowindex]
					} else {
						count[cols[names[1]][rowindex]] += cols[names[0]][rowindex]
						n += cols[names[0]][rowindex]
					}
				}
			for (let rowindex = 0 ; rowindex < cols[colname].length ; rowindex++) {
				if (cols[colname][rowindex] == colnamevalue) {
					this.set_colname_rowindex_value(names[0],rowindex,count[cols[names[1]][rowindex]]/n)
				}
			}
		}
		return this
	}
	normalizebyint(index) {
		let indexes = [0,1,2]
		indexes.splice(index,1)
		let vals = this.values()
		for (let colindexvalue of vals[index]) {
			let count = {}
			let n = 0
			for (let rowindex = 0 ; rowindex < this.rows.length ; rowindex++)
				if (this.rows[rowindex][index] == colindexvalue) {
					if (count[this.rows[rowindex][indexes[1]]] == undefined) {
						count[this.rows[rowindex][indexes[1]]] = this.rows[rowindex][indexes[0]]
						n += this.rows[rowindex][indexes[0]]
					} else {
						count[this.rows[rowindex][indexes[1]]] += this.rows[rowindex][indexes[0]]
						n += this.rows[rowindex][indexes[0]]
					}
				}
			for (let rowindex = 0 ; rowindex < this.rows.length ; rowindex++) {
				if (this.rows[rowindex][index] == colindexvalue) {
					this.rows[rowindex][indexes[0]] = count[this.rows[rowindex][indexes[1]]] / n
				}
			}
		}
		return this
	}

	prependcol(col,head) {
		this.dict = {[head]:col , ...this.dict}
		return this
	}

	prependmultiplicity() {
		this.prependcol(this.multiplicity(),'_Count')
		return this
	}

	compact() {
		this.prependmultiplicity()
		let oldrows = this.rows()
		let rows = []
		let rowstr = []
		for (let i = 0 ; i < oldrows.length ; i++ ) {
			if (rowstr.includes(JSON.stringify(oldrows[i]))) {
			} else {
				rows.push(oldrows[i])
				rowstr.push(JSON.stringify(oldrows[i]))
			}
		}
		this.dict = Frame.headCols2dict(this.head(),math.transpose(rows))
		return this
	}

	uncompact() {
		let head = this.head().slice(1)
		let oldrows = this.rows()
		let rows = []
		for (let i = 0 ; i < oldrows.length ; i++ ) {
			let n = oldrows[i][0]
			for (let j = 0 ; j < n ; j++ )
				rows.push(oldrows[i].slice(1))
		}
		this.dict = Frame.headCols2dict(head,math.transpose(rows))
		return this
	}

	values(colindex) {
		if (colindex == undefined) {
			return this.getcols().map(col=>[...new Set(col)])
		} else {
			return this.values()[colindex]
		}
	}

	valuesdict() {
		return Object.fromEntries(_.unzip([this.head(),this.values()]))
	}

}
