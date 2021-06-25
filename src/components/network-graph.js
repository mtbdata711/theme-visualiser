import React from "react"
import * as d3 from "d3"

import styles from "./network-graph.module.css"

function reducer(ids, action) {
	const type = ids.includes(action.id) ? "REMOVE" : "ADD"
	const idx = ids.indexOf(action.id)

	switch (type) {
		case "ADD":
			return [...ids, action.id]
		case "REMOVE":
			return [...ids.slice(0, idx), ...ids.slice(idx + 1)]
		default:
			throw new Error()
	}
}

export default function NetworkGraph({ width, height, data }) {
	// const [links, setLinks] = React.useState(data.links)
	// const [nodes, setNodes] = React.useState(data.nodes)
	const [activeNodes, dispatch] = React.useReducer(reducer, [])

	React.useEffect(() => {
		d3.forceSimulation(data.nodes)
			.force("charge", d3.forceManyBody().strength(5))
			.force("center", d3.forceCenter(width / 2, height / 2))
			.force(
				"collision",
				d3.forceCollide().radius((d) => d.id + 5)
			)
			.on("tick", () =>
				d3
					.select("svg")
					.selectAll("circle")
					.data(data.nodes)
					.join("circle")
					.attr("id", (d) => d.id)
					.attr("r", (d) => d.id)
					.attr("cx", (d) => d.x)
					.attr("cy", (d) => d.y)
					.on("click", function (event) {
						dispatch({ id: Number(event.target.id) })
						// console.log(this)
						// d3.select(this).attr((d) => (d.fill === "red" ? "blue" : "red"))
					})
			)
	}, [data.nodes])

	console.log(activeNodes)

	// React.useEffect(() => {
	// 	d3.select("svg")
	// 		.selectAll("circle")
	// 		.filter((d) => activeNodes.inclues(d.id))
	// 		.fill("red")
	// }, [activeNodes])

	return (
		<div className={styles.wrapper}>
			<svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
				{/* {links.map((link, i) => (
					<line
						key={`line-${i}`}
						x1={link.source.x}
						y1={link.source.y}
						x2={link.target.x}
						y2={link.target.y}
						stroke="black"
					/>
				))}
				{nodes.map((node, i) => (
					<g key={`group-${i}`}>
						<circle
							key={`circle-${i}`}
							cx={node.x}
							cy={node.y}
							r={node.id}
							fill="grey"
							stroke={node.isActive ? "black" : "none"}
						></circle>
						<text x={node.x} y={node.y}>
							{node.title}
						</text>
					</g>
				))} */}
			</svg>
		</div>
	)
}
