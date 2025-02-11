
/*
	Author:	Anthony John Ripa
	Date:	2/10/2025
	Graph:	A graph library
*/

class Graph {

	static str2dag(str) {
		let par = {}
		let kid = {}
		let edges = str.split(';')
		for (let edge of edges) {
			let ids = edge.split('→')
			for (let i = 0 ; i < ids.length ; i++) {
				if (i != 0) {
					if (par[ids[i]] == undefined) par[ids[i]] = [ids[i-1]]
					else par[ids[i]].push(ids[i-1])
				}
				if (i != ids.length-1) {
					if (kid[ids[i]] == undefined) kid[ids[i]] = [ids[i+1]]
					else kid[ids[i]].push(ids[i+1])
				}
			}
		}
		return {par,kid}
	}

	static net2ids(str) {
		let ids = []
		let nodes = str2nodes(str)
		let graph = Graph.str2dag(str)
		if (nodes.length < 2) return nodes
		while (nodes.length > 1) {
			let nodeskids = nodes.map(node=>graph.kid[node])
			let node
			for (let i = 0; i < nodes.length ; i++) {
				if (nodeskids[i]==undefined || nodeskids[i].length==0) {
					node = nodes[i]
					ids.unshift(node)
					nodes = nodes.filter(n=>n!=node)
					let pars = graph.par[node]
					if (pars != undefined) pars.map(function(par){graph.kid[par]=graph.kid[par].filter(k=>k!=node)})
				}
			}
		}
		ids = [...nodes,...ids]
		return ids
		function str2nodes(str) {
			let paths = str.split(';')
			paths.reverse()
			let nodes = paths.map(path=>path.split('→')).flat()
			return [...new Set(nodes)]
		}
	}

	static dag2rank(dag) {
		let graph = dag.kid
		let levels = assignBalancedLevels(graph)
		let ret = []
		for (let [node,level] of Object.entries(levels)) {
			while (ret.length <= level)
				ret.push([])
			ret[level].push(node)
		}
		return ret

		//	GPT
		/**
		 * Computes the minimal level for each node in a DAG given as an adjacency list.
		 * Here, every node gets the smallest possible level satisfying level(child) ≥ level(parent)+1,
		 * with sources fixed to level 0.
		 *
		 * @param {Object} graph - Adjacency list (each key is a node; value is an array of its children)
		 * @returns {Object} levels - An object mapping each node to its level.
		 */
		function assignMinimalLevels(graph) {
			const levels = {};
			const inDegree = {};

			// Initialize inDegree for every node (considering both keys and children)
			for (const node in graph) {
				if (graph.hasOwnProperty(node)) {
					if (!(node in inDegree)) {
						inDegree[node] = 0;
					}
					graph[node].forEach(child => {
						if (!(child in inDegree)) {
							inDegree[child] = 0;
						}
						inDegree[child]++;
					});
				}
			}

			// Queue all nodes with inDegree 0 (sources)
			const queue = [];
			for (const node in inDegree) {
				if (inDegree[node] === 0) {
					levels[node] = 0;
					queue.push(node);
				}
			}

			// Process nodes in topological order.
			while (queue.length > 0) {
				const node = queue.shift();
				const currentLevel = levels[node];

				if (graph[node]) {
					graph[node].forEach(child => {
						// The child must be at least currentLevel+1.
						if (levels[child] === undefined || levels[child] < currentLevel + 1) {
							levels[child] = currentLevel + 1;
						}
						inDegree[child]--;
						if (inDegree[child] === 0) {
							queue.push(child);
						}
					});
				}
			}

			return levels;
		}

		/**
		 * Attempts to assign levels to nodes in a DAG so that every edge satisfies
		 * level(child) === level(parent) + 1.
		 *
		 * This is only possible if the DAG is gradeable. In our example (A→B→C, D→C),
		 * one acceptable solution is A=0, B=1, D=1, C=2.
		 *
		 * If a consistent assignment is not possible, the function falls back to the minimal assignment.
		 *
		 * @param {Object} graph - Adjacency list of the DAG.
		 * @returns {Object} levels - An object mapping each node to its (balanced) level.
		 */
		function assignBalancedLevels(graph) {
			// Build a "parents" map.
			const parents = {};
			// Ensure every node appears in parents (even if it has no parents).
			for (const node in graph) {
				if (graph.hasOwnProperty(node)) {
					if (!(node in parents)) {
						parents[node] = [];
					}
					graph[node].forEach(child => {
						if (!(child in parents)) {
							parents[child] = [];
						}
						parents[child].push(node);
					});
				}
			}

			const levels = {};
			let gradeable = true;  // Will remain true if we can force every edge to be exactly +1.

			// A DFS that propagates level constraints in both directions.
			function dfs(node, lvl) {
				// If we've already assigned a level, check for consistency.
				if (node in levels) {
					if (levels[node] !== lvl) {
						gradeable = false;
					}
					return;
				}
				levels[node] = lvl;

				// Propagate to children: each child must be exactly lvl+1.
				if (graph[node]) {
					graph[node].forEach(child => {
						dfs(child, lvl + 1);
					});
				}
				// Propagate to parents: each parent must be exactly lvl-1.
				if (parents[node]) {
					parents[node].forEach(p => {
						dfs(p, lvl - 1);
					});
				}
			}

			// Process every node (the graph might be disconnected).
			// If a node has not been visited, arbitrarily start it at level 0.
			for (const node in parents) {
				if (!(node in levels)) {
					dfs(node, 0);
				}
			}
		  
			if (gradeable) {
				// Shift levels so that the minimum level is 0.
				const minLevel = Math.min(...Object.values(levels));
				for (const node in levels) {
					levels[node] -= minLevel;
				}
				return levels;
			} else {
				// If the graph isn’t gradeable (i.e. no solution exists with every edge being exactly +1),
				// fall back to the minimal leveling.
				return assignMinimalLevels(graph);
			}
		}
	}

}
