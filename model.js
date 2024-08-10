
/*
	Author:	Anthony John Ripa
	Date:	7/30/2024
	Model:	A model library
*/

class Model {

	constructor(frame) {
		this.frame = frame
	}

	get_noncontrol_names() {
		let noncontrolnames = [...this.frame.head()]
		noncontrolnames.splice(this.get_control_index(),1)
		return noncontrolnames
	}

	get_control_name() {
		return this.frame.head()[this.get_control_index()]
	}

	get_control_index() {
		let head = this.frame.head()
		for (let i = 0 ; i < head.length ; i++ ) {
			if (head[i].includes('*')) return i
		}
		return this.control_by_depend() ?? 2
	}

	control_by_depend() {
		try { let m = this.conditionalcorrelation(0,1,2) ; if (m<.03) return 2 } catch(e) { }
		try { let m = this.conditionalcorrelation(0,2,1) ; if (m<.03) return 1 } catch(e) { }
		try { let m = this.conditionalcorrelation(1,2,0) ; if (m<.03) return 0 } catch(e) { }
		if (this.cov(0,1)==0) return 2
		if (this.cov(0,2)==0) return 1
		if (this.cov(1,2)==0) return 0
		return undefined
	}

	correlation(col1key,col2key) {
		return this.covariance(col1key,col2key) / this.standev(col1key,col1key) / this.standev(col2key,col2key)
	}

	conditionalcorrelation(col1key,col2key,condcolkey) {
		let ret = 0
		let values = this.frame.values(condcolkey)
		for (let value of values) {
			let frame = this.frame.where(condcolkey,value)
			ret += new Model(frame).correlation(col1key,col2key)
		}
		return ret / values.length
	}

	conditionalcovariance(col1key,col2key,condcolkey) {
		let ret = 0
		let values = this.frame.values(condcolkey)
		for (let value of values) {
			let frame = this.frame.where(condcolkey,value)
			ret += new Model(frame).covariance(col1key,col2key)
		}
		return ret / values.length
	}

	standev(col1key,col2key) {
		return math.sqrt(this.covariance(col1key,col2key))
	}

	covariance(col1key,col2key) {
		let col1 = this.frame.getcol(col1key)
		let col2 = this.frame.getcol(col2key)
		let e1 = math.mean(col1)
		let e2 = math.mean(col2)
		let sum = 0
		let n = col1.length
		for (let rowindex = 0 ; rowindex < n ; rowindex++ ) {
			sum += (col1[rowindex] - e1) * (col2[rowindex] - e2)
		}
		return sum / n
	}

	cov(col1key,col2key) {
		let col1 = this.frame.getcol(col1key)
		let col2 = this.frame.getcol(col2key)
		let frame = Frame.fromDict({[col1key]:col1,[col2key]:col2})
		let compact = frame.compact()
		let count = compact.getcol('_Count')
		return count.every(x=>x==1) ? 0 : 1
	}

}
