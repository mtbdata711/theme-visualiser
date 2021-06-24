import React, { useEffect } from "react"
import * as d3 from "d3"

const width = 1200
const height = 600

var numNodes = 31
var nodes = d3.range(numNodes).map((d) => ({ radius: Math.random() * 25 }))

function ticked() {
	var u = d3
		.select("svg")
		.selectAll("circle")
		.data(nodes)
		.join("circle")
		.attr("r", (d) => d.radius)
		.attr("cx", (d) => d.x)
		.attr("cy", (d) => d.y)
}

export default function App() {
	d3.forceSimulation(nodes)
		.force("charge", d3.forceManyBody().strength(5))
		.force("center", d3.forceCenter(width / 2, height / 2))
		.force(
			"collision",
			d3.forceCollide().radius((d) => d.radius + 5)
		)
		.on("tick", ticked)

	// var simulation = d3
	// 	.forceSimulation(nodes)
	// 	.force("charge", d3.forceManyBody().strength(-100))
	// 	.force("center", d3.forceCenter(width / 2, height / 2))
	// 	.force("link", d3.forceLink().links(links))
	// 	.on("tick", ticked)

	return (
		<div>
			<svg id="area" height={height} width={width}></svg>
		</div>
	)
}
