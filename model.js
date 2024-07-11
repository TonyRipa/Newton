
/*
	Author:	Anthony John Ripa
	Date:	7/8/2024
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
		return 2
	}

}
