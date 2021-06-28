import React from "react"
import * as d3 from "d3"

import styles from "./force-layout.module.css"

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

export default function ForceLayout(props) {
	const { width, height, data } = props
	const [activeNodes, dispatch] = React.useReducer(reducer, [])

	React.useEffect(() => {
		d3.forceSimulation(data.nodes)
			.force("charge", d3.forceManyBody().strength(5))
			.force("center", d3.forceCenter(width / 2, height / 2))
			.force(
				"collision",
				d3.forceCollide().radius((d) => d.id + width / 50)
			)
			.on("tick", () => {
				var nodes = d3
					.select("svg")
					.selectAll("g")
					.data(data.nodes)
					.attr("transform", (d) => `translate(${d.x}, ${d.y})`)

				var g = nodes.enter().append("g")

				g.append("circle")
					.attr("r", (d) => d.id)
					.attr("id", (d) => d.id)
					.on("click", (event) => dispatch({ id: Number(event.target.id) }))

				g.append("text")
					.attr("dx", 12)
					.attr("dy", ".35em")
					.text((d) => d.title)
			})
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
