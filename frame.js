
/*
	Author:	Anthony John Ripa
	Date:	6/1/2024
	Stats:	A data-frame library
*/

class Frame {

	constructor(rows,head) {	//	x is list, y is list, head is list
		this.rows = rows
		this.head = head
	}

	static arr2frame(headrows) {	//	First row is column names
		let [head,...rows] = headrows
		return new Frame(rows,head)
	}

	static str2frame(headrows) {	//	First row is column names
		let arr = csv2array(headrows)
		return Frame.arr2frame(arr)
	}

	toString() {
		return this.head + '\n' + this.rows.join('\n')
	}

	get(colindex,value) {	//	return a frame of a subselection of the rows (actual rows not copy)
		let rows = []
		for (let i = 0 ; i < this.rows.length ; i++ ) {
			if (this.rows[i][colindex] == value)
				rows.push(this.rows[i])
		}
		return new this.constructor(rows,this.head)
	}

	apply(colindex,f) {	//	modify a certain column using a certain function
		for (let i = 0 ; i < this.rows.length ; i++) {
			this.rows[i][colindex] = f(this.rows[i][colindex])
		}
	}

}
