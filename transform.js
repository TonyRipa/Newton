
/*
    Author: Anthony John Ripa
    Date:   6/10/2020
    Transform: A data transformer
*/


class Transform {												//	+2020.6

	//function transform(points) {								//	-2020.6
	static transform(points) {									//	+2020.6
		//if (!vm.trans) return points;	//	2019.3	vm.trans	//	-2020.6
		if (vm.trans==0) return points;							//	+2020.6
		var ret, ret2, sum;
		ret = points.slice();
		ret.sort((xy1,xy2)=>xy1[0]-xy2[0]);
		return laplace(ret);

		function laplace(points) {
			return [1.5,2,3,4].map(s=>laplace1(points,s));
		}
		function laplace1(points, s) {
			return [s, integratedef(points.map(xy=>[xy[0],xy[1]*Math.exp(-s*xy[0])]))];
		}
		function integratedef(points) {
			return integrate(points).slice(-1)[0][1];
		}
		function integrate(points) {
			var ret = [];
			var sum = 0;
			for(var i = 1; i<points.length; i++) {
				var da = (points[i][1]) * (points[i][0]-points[i-1][0]);	//	2018.9	Added DeltaArea
				if (!isNaN(da)) sum += da;									//	2018.9	Added NaN Check
				ret.push([points[i][0], sum]);
			}
			return ret;
		}
	}

}
