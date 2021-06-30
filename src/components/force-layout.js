import React from "react"
import * as d3 from "d3"

import styles from "./force-layout.module.css"
import { reducer, truncate, formatWeight, formatFontSize } from "./helpers"

export default function ForceLayout(props) {
	const { width, height, data } = props
	const [activeNodes, dispatch] = React.useReducer(reducer, [])

	var links = [
		{ source: 1, target: 2 },
		{ source: 1, target: 3 },
		{ source: 2, target: 3 },
	]

	React.useEffect(() => {
		const lines = d3
			.select("svg")
			.selectAll("line")
			.data(links)
			.enter()
			.append("line")
			.style("stroke", "#000")

		const simulation = d3
			.forceSimulation(data.nodes)
			.force("charge", d3.forceManyBody().strength(10))
			.force("center", d3.forceCenter(width / 2, height / 2))
			.force(
				"collision",
				d3.forceCollide().radius((d) => formatWeight(d.weight, width) + 10)
			)
			.force(
				"link",
				d3
					.forceLink()
					.id((d) => d.id)
					.links(links)
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

						d3.select(this)
							.select("circle")
							.attr("fill", activeNodes.includes(this.id) ? "blue" : "red")
					})
					.call(
						d3
							.drag()
							.on("start", (event) => {
								if (!event.active) simulation.alphaTarget(0.3).restart()
								event.subject.fx = event.subject.x
								event.subject.fy = event.subject.y
							})
							.on("drag", (event) => {
								event.subject.fx = event.x
								event.subject.fy = event.y
							})
							.on("end", (event) => {
								if (!event.active) simulation.alphaTarget(0)
								event.subject.fx = null
								event.subject.fy = null
							})
					)

				lines
					.attr("x1", (d) => d.source.x)
					.attr("y1", (d) => d.source.y)
					.attr("x2", (d) => d.target.x)
					.attr("y2", (d) => d.target.y)

				group
					.append("circle")
					.attr("r", (d) => formatWeight(d.weight, width))
					.attr("id", (d) => d.id)
					.attr("fill", "blue")
				// .on("mouseover", (event) => showTooltip)
				// .on("mouseout", (event) => hideTooltip)

				group
					.append("text")
					.style(
						"font",
						(d) =>
							`${formatFontSize(formatWeight(d.weight, width))}px sans-serif`
					)
					.attr("dx", 0)
					.attr("fill", "white")
					.attr("text-anchor", "middle")
					.attr("dominant-baseline", "middle")
					.text((d) => truncate(d.title, formatWeight(d.weight, width)))
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
