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

export default function NetworkGraph(props) {
	const { width, height, data } = props
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
					.attr("fill", "white")
					.attr("stroke", "black")
					.on("click", function (event) {
						dispatch({ id: Number(event.target.id) })
					})
			)
	}, [data.nodes])

	console.log(activeNodes)

	return (
		<div className={styles.wrapper}>
			<svg
				height={height}
				width={width}
				viewBox={`0 0 ${width} ${height}`}
			></svg>
		</div>
	)
}
