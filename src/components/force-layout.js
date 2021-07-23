import { useEffect } from "react"
import * as d3 from "d3"

import { GraphWrapper } from "./index"
import { formatWeight, halfDistance, truncate } from "../helpers"
import { colours } from "../styles/index"

/**
 * Force-layout component that holds all logic of positioning the
 * nodes in a cartesian coordinate system using d3.js.
 */
export const ForceLayout = ({
	width,
	height,
	data,
	dispatch,
	activeNodes,
	...styles
}) => {
	const simulation = d3
		.forceSimulation(data)
		.force("charge", d3.forceManyBody().strength(20))
		.force("center", d3.forceCenter(width / 2, height / 2))
		.force(
			"collision",
			d3.forceCollide().radius((d) => formatWeight(d.weight) + 10)
		)

	/**
	 * This effect-hook appends the entire d3 graph to the body element.
	 */
	useEffect(() => {
		/**
		 * The tooltip is a div element that holds three <p> elements
		 * all having a unique class.
		 */
		const tooltip = d3
			.select("body")
			.append("div")
			.attr("class", "tooltip")
			.style("position", "absolute")
			.style("visibility", "hidden")

		tooltip.append("p").attr("class", "tooltip-title")
		tooltip.append("p").attr("class", "tooltip-label")
		tooltip.append("p").attr("class", "tooltip-cta")

		/**
		 * The simulation holds all of the force layout logic. In here,
		 * the force is set to the centerpoint of the graph and a collision
		 * is set to be equal to the radius of each node plus a little margin
		 * (or whitespace) set equal to 10. Furthermore, the distance of the links
		 * is a fixed constant that is set to 300.
		 */

		simulation.on("tick", () => {
			/**
			 * For every entry in the data a node is appended. A node is a
			 * group element that holds a className of "node". Instead of
			 * directly rendering circles in the force-layout, we render
			 * group elements with a transform-translate attribute.
			 */
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
				// .call(
				// 	d3
				// 		.drag()
				// 		.on("start", (event) => {
				// 			d3.select(".tooltip").style("visibility", "hidden")
				// 			if (!event.active) simulation.alphaTarget(0).restart()
				// 			event.subject.fx = event.subject.x
				// 			event.subject.fy = event.subject.y
				// 		})
				// 		.on("drag", (event) => {
				// 			event.subject.fx = event.x
				// 			event.subject.fy = event.y
				// 		})
				// 		.on("end", (event) => {
				// 			if (!event.active) simulation.alphaTarget(0)
				// 			event.subject.fx = null
				// 			event.subject.fy = null
				// 		})
				// )
				.on("mouseover", (event, d) => {
					d3.select(".tooltip").style("visibility", "visible")
					d3.select(".tooltip-title").text(d.title)
					d3.select(".tooltip-label").text(`${d.weight} projects`)
					d3.select(".tooltip-cta").text("Click to connect two themes")
				})
				.on("mousemove", (event, d) =>
					d3
						.select(".tooltip")
						.style("top", `${event.pageY + 10}px`)
						.style("left", `${event.pageX + 10}px`)
				)
				.on("mouseout", () => {
					d3.select(".tooltip").style("visibility", "hidden")
				})
				.on("click", function () {
					dispatch({
						id: Number(this.id),
					})
				})

			/**
			 * Every group holds both a circle and a text. The circle
			 * holds a radius-attribute to show the weight of the theme
			 * (based off the data).
			 *
			 * The text element functions as a label and shows the title
			 * of the theme. This title is positioned in the centre of the circle
			 * and the text is returned from a truncate function.
			 */
			group
				.append("circle")
				.attr("r", (d) => formatWeight(d.weight))
				.attr("class", "circle")
				.attr("fill", colours.dark[1])
				.attr("stroke", colours.white)
				.attr("stroke-width", 2)
				.attr("stroke-opacity", 0.3)

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
	}, [data, width, height])

	useEffect(() => {
		if (activeNodes.length === 0) {
			d3.select("#force-layout")
				.selectAll("circle")
				.attr("fill", colours.dark[1])
			return
		}
		d3.select("#force-layout")
			.selectAll("circle")
			.filter((d) => activeNodes.includes(d.id))
			.attr("fill", colours.orange)

		if (activeNodes.length > 1) {
			let links = []

			for (const id of activeNodes) {
				const targets = activeNodes
					.map((d) => (d !== id ? { source: id, target: d } : null))
					.filter(Boolean)
				links = [...links, ...targets]
			}

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
				.attr("stroke", colours.orange)

			const button = link
				.append("circle")
				.attr("class", "button")
				.attr("r", 12)
				.attr("fill", colours.orange)
				.attr("stroke-width", 3)
				.on(
					"click",
					(event, d) =>
						(window.location.href = `https://graduateshowcase.arts.ac.uk/projects?_q=${d.source.title}%C2%A0&%C2%A0${d.target.title}`)
				)
				.on("mouseover", (event, d) => {
					d3.select(".tooltip").style("visibility", "visible")
					d3.select(".tooltip-title").text(
						`This is the intersection of: ${d.source.title} and ${d.target.title}`
					)
					d3.select(".tooltip-label").text(null)
					d3.select(".tooltip-cta").text("Click to explore these projects")
					d3.select(event.target).attr("stroke", colours.white)
				})
				.on("mousemove", (event, d) =>
					d3
						.select(".tooltip")
						.style("top", `${event.pageY + 10}px`)
						.style("left", `${event.pageX + 10}px`)
				)
				.on("mouseout", (event, d) => {
					d3.select(".tooltip").style("visibility", "hidden")
					d3.select(event.target).attr("stroke", colours.orange)
				})

			simulation
				.force(
					"link",
					d3
						.forceLink()
						.id((d) => d.id)
						.links(links)
						.distance(200)
				)
				.on("tick", () => {
					/**
					 * Because the groups will move based on the force layout logic,
					 * we reset its position on every tick back to (0, 0).
					 */
					link.attr("transform", (d) => `translate(0, 0)`)

					/**
					 * The buttons are positioned halfway between the source-
					 * and target-positions.
					 */
					button.attr("transform", (d) => {
						const { x, y } = halfDistance(d.source, d.target)
						return `translate(${x}, ${y})`
					})

					line
						.attr("x1", (d) => d.source.x)
						.attr("y1", (d) => d.source.y)
						.attr("x2", (d) => d.target.x)
						.attr("y2", (d) => d.target.y)
				})
		}
		// eslint-disable-next-line
	}, [activeNodes])

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
