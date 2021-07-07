import React from "react"
import * as d3 from "d3"

import { GraphWrapper } from "./index"
import { truncate, formatWeight, halfDistance } from "../helpers"
import { colours } from "../styles/index"

export const ForceLayout = ({
	width,
	height,
	data,
	dispatch,
	activeNodes,
	...styles
}) => {
	// https://bl.ocks.org/mbostock/0adcc447925ffae87975a3a81628a196
	const links = [
		{ source: 18, target: 1 },
		{ source: 18, target: 12 },
		{ source: 1, target: 12 },
	]

	React.useEffect(() => {
		const tooltip = d3
			.select("body")
			.append("div")
			.attr("class", "tooltip")
			.style("position", "absolute")
			.style("visibility", "hidden")

		tooltip.append("p").attr("class", "tooltip-title")
		tooltip.append("p").attr("class", "tooltip-label")

		const link = d3
			.select("#force-layout")
			.selectAll(".link")
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
			.on(
				"click",
				(event, d) =>
					(window.location.href = `https://graduateshowcase.arts.ac.uk/projects?_q=${d.source.title}%C2%A0&%C2%A0${d.target.title}`)
			)
			.on("mouseover", (event, d) => {
				d3.select(".tooltip").style("visibility", "visible")
				d3.select(".tooltip-title").text(`This is the intersection of:`)
				d3.select(".tooltip-label").text(
					`${d.source.title} and ${d.target.title}`
				)
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
					.distance(300)
			)
			.on("tick", () => {
				const nodes = d3
					.select("#force-layout")
					.selectAll(".node")
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
								if (!event.active) simulation.alphaTarget(0)
								event.subject.fx = null
								event.subject.fy = null
							})
					)

				link.attr("transform", (d) => `translate(0, 0)`)

				button
					.attr("transform", (d) => {
						const { x, y } = halfDistance(d.source, d.target)
						return `translate(${x}, ${y})`
					})
					.attr("fill", colours.white)

				line
					.attr("x1", (d) => d.source.x)
					.attr("y1", (d) => d.source.y)
					.attr("x2", (d) => d.target.x)
					.attr("y2", (d) => d.target.y)
					.attr("stroke", colours.white)

				group
					.append("circle")
					.attr("r", (d) => formatWeight(d.weight))
					.attr("class", "circle")
					.attr("fill", colours.dark[1])
					.attr("stroke", colours.white)
					.attr("stroke-width", 2)

				group
					.append("text")
					.style("font-size", "16px")
					.attr("fill", colours.white)
					.attr("text-anchor", "middle")
					.attr("dominant-baseline", "middle")
					.attr("class", "title")
					.text((d) => truncate(d.title, formatWeight(d.weight)))
			})
		// eslint-disable-next-line
	}, [data, width, height, activeNodes])

	return (
		<GraphWrapper width={width} height={height} styles={styles}>
			<svg
				height={height}
				width={width}
				viewBox={`0 0 ${width} ${height}`}
				id="force-layout"
			></svg>
		</GraphWrapper>
	)
}
