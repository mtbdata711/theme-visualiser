import React from "react"
import * as d3 from "d3"

import { GraphWrapper } from "../components"
import { reducer, truncate, formatWeight, color, halfDistance } from "./helpers"
import { colours } from "../styles/index"

export const ForceLayout = (props) => {
	const { width, height, data, ...styles } = props
	const [activeNodes, dispatch] = React.useReducer(reducer, [])

	// https://bl.ocks.org/mbostock/0adcc447925ffae87975a3a81628a196
	const links = [
		{ source: 18, target: 1 },
		{ source: 18, target: 10 },
		{ source: 1, target: 10 },
	]

	// console.log(activeNodes)

	React.useEffect(() => {
		const tooltip = d3
			.select("body")
			.append("div")
			.attr("class", "tooltip")
			.style("position", "absolute")
			.style("visibility", "hidden")

		tooltip.append("p").attr("class", "tooltip-title")
		tooltip.append("p").attr("class", "tooltip-label")

		// const link = d3
		// 	.select("#force-layout")
		// 	.selectAll("line")
		// 	.data(links)
		// 	.enter()
		// 	.append("line")
		// 	.attr("class", "link")
		// 	.attr("stroke-width", 2)

		const link = d3
			.select("#force-layout")
			.selectAll("g")
			.data(links)
			.enter()
			.append("g")
			.attr("class", "link")

		const line = link
			.append("line")
			.attr("class", "line")
			.attr("stroke-width", 2)

		const button = link
			.append("circle")
			.attr("class", "button")
			.attr("r", 12)
			.attr("fill", "white")

		// const line = link
		// 	.append("line")
		// 	.data(links)
		// 	.attr("stroke-width", 2)
		// 	.attr("class", "line")

		// const link = d3
		// 	.select("#force-layout")
		// 	.append("g")
		// 	.attr("transform", `translate(0, 0)`)
		// 	.attr("class", "link")
		// 	.selectAll("line")
		// 	.data(links)
		// 	.join("line")
		// 	.attr("stroke-width", 2)

		const simulation = d3
			.forceSimulation(data)
			.force("charge", d3.forceManyBody().strength(20))
			.force("center", d3.forceCenter(width / 2, height / 2))
			.force(
				"collision",
				d3.forceCollide().radius((d) => formatWeight(d.weight) + 10)
			)
			.force(
				"link",
				d3
					.forceLink()
					.id((d) => d.id)
					.links(links)
					.distance(200)
			)
			.on("tick", () => {
				const nodes = d3
					.select("#force-layout")
					.selectAll("g")
					.data(data)
					.attr("transform", (d) => `translate(${d.x}, ${d.y})`)

				const group = nodes
					.enter()
					.append("g")
					.attr("id", (d) => d.id)
					.attr("class", "node")
					.on("click", function (event) {
						dispatch({ target: this, id: Number(this.id), event })
					})
					.on("mouseover", (event, d) => {
						d3.select(".tooltip").style("visibility", "visible")
						d3.select(".tooltip-title").text(d.title)
						d3.select(".tooltip-label").text(d.weight)
					})
					.on("mousemove", (event, d) =>
						d3
							.select(".tooltip")
							.style("top", `${event.pageY + 10}px`)
							.style("left", `${event.pageX + 10}px`)
					)
					.on("mouseout", (event, d) => {
						d3.select(".tooltip").style("visibility", "hidden")
					})
					.call(
						d3
							.drag()
							.on("start", (event) => {
								d3.select(".tooltip").style("visibility", "hidden")
								if (!event.active) simulation.alphaTarget(0.3).restart()
								event.subject.fx = event.subject.x
								event.subject.fy = event.subject.y
							})
							.on("drag", (event) => {
								event.subject.fx = event.x
								event.subject.fy = event.y
							})
							.on("end", (event) => {
								if (!event.active) simulation.alphaTarget(0.3)
								event.subject.fx = null
								event.subject.fy = null
							})
					)

				link.attr("transform", (d) => `translate(0, 0)`)

				button.attr("transform", (d) => {
					const { x, y } = halfDistance(d.source, d.target)
					return `translate(${x}, ${y})`
				})
				line
					.attr("x1", (d) => d.source.x)
					.attr("y1", (d) => d.source.y)
					.attr("x2", (d) => d.target.x)
					.attr("y2", (d) => d.target.y)
					.attr("stroke", colours.white)
				// .attr("stroke", "url(#linear)")

				group
					.append("circle")
					.attr("r", (d) => formatWeight(d.weight))
					.attr("class", "circle")
					.attr("fill", colours.dark[1])
					.attr("stroke", (d) => color(d.id))
					.attr("stroke-width", 2)

				group
					.append("text")
					.style("font-size", "16px")
					.attr("fill", (d) => color(d.id))
					.attr("text-anchor", "middle")
					.attr("dominant-baseline", "middle")
					.attr("class", "title")
					.text((d) => truncate(d.title, formatWeight(d.weight)))
			})
		// eslint-disable-next-line
	}, [data, width, height])

	return (
		<GraphWrapper width={width} height={height} styles={styles}>
			<svg
				height={height}
				width={width}
				viewBox={`0 0 ${width} ${height}`}
				id="force-layout"
			>
				{/* <defs>
					<linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#fff" />
						<stop offset="100%" stopColor="#000" />
					</linearGradient>
				</defs> */}
			</svg>
		</GraphWrapper>
	)
}
