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

	const formatWeight = (weight) => (width * 10) / weight

	React.useEffect(() => {
		const lines = d3
			.select("svg")
			.selectAll("line")
			.data(data.links)
			.enter()
			.append("line")
			.style("stroke", "#aaa")

		d3.forceSimulation(data.nodes)
			.force("charge", d3.forceManyBody().strength(-20))
			.force("center", d3.forceCenter(width / 2, height / 2))
			.force(
				"collision",
				d3.forceCollide().radius((d) => formatWeight(d.weight) + 15)
			)
			.force(
				"link",
				d3
					.forceLink()
					.id((d) => d.id)
					.links(data.links)
			)
			.on("tick", () => {
				const nodes = d3
					.select("svg")
					.selectAll("g")
					.data(data.nodes)
					.attr("transform", (d) => `translate(${d.x}, ${d.y})`)

				const group = nodes
					.enter()
					.append("g")
					.attr("id", (d) => d.id)
					.on("click", function (event) {
						dispatch({ id: Number(event.target.id) })
						console.log(this)
					})

				lines
					.attr("x1", (d) => d.source.x)
					.attr("y1", (d) => d.source.y)
					.attr("x2", (d) => d.target.x)
					.attr("y2", (d) => d.target.y)

				group
					.append("circle")
					.attr("r", (d) => formatWeight(d.weight))
					.attr("id", (d) => d.id)
					.attr("fill", "blue")
					.attr("stroke", "black")
				// .on("mouseover", (event) => console.log(event))
				// .on("mouseout", (event) => console.log(event))

				group
					.append("text")
					.attr("dx", 0)
					.attr("dy", (d) => formatWeight(d.weight) + 20)
					.attr("text-anchor", "middle")
					.text((d) => d.title)
			})
	}, [data, width, height])

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
