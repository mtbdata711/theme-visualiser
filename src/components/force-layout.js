import { useEffect, useMemo } from "react"
import * as d3 from "d3"
import pointInPolygon from "point-in-polygon"

import { GraphWrapper } from "./index"
import {
	formatWeight,
	halfDistance,
	triangleCentroid,
	closestPointOnPolygon,
	wrap,
} from "../helpers"
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
	activeNodes: activeIds,
	...styles
}) => {
	const activeNodes = useMemo(() => {
		return activeIds.map((id) => data.find((el) => el.id === id))
	}, [data, activeIds])

	console.log(activeNodes)

	const simulation = d3
		.forceSimulation(data)
		.force("charge", d3.forceManyBody().strength(20))
		.force("center", d3.forceCenter(width / 2, height / 2))
		.force(
			"collision",
			d3.forceCollide().radius((d) => formatWeight(d.total) + 10)
		)
		.force(
			"x",
			d3.forceX().x((d) => {
				if (activeNodes.length > 2) {
					const polygon = activeNodes.map((v) => [v.x, v.y])
					const inPolygon = pointInPolygon([d.x, d.y], polygon)
					if (inPolygon)
						return (closestPointOnPolygon([d.x, d.y], polygon) +
							formatWeight(d.total))[1]
				}
				return d.x
			})
		)
		.force(
			"y",
			d3.forceY().y((d) => {
				if (activeNodes.length > 2) {
					const polygon = activeNodes.map((v) => [v.x, v.y])
					const inPolygon = pointInPolygon([d.x, d.y], polygon)
					if (inPolygon)
						return (closestPointOnPolygon([d.x, d.y], polygon) +
							formatWeight(d.total))[1]
				}
				return d.y
			})
		)

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

	useEffect(() => {
		simulation.on("tick", () => {
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
				.on("mouseover", (event, d) => {
					d3.select(".tooltip").style("visibility", "visible")
					d3.select(".tooltip-title").text(d.title)
					d3.select(".tooltip-label").text(`${d.total} projects`)
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

			group
				.append("circle")
				.attr("r", (d) => formatWeight(d.total))
				.attr("class", "circle")
				.attr("fill", colours.dark[1])
				.attr("stroke", colours.white)
				.attr("stroke-width", 2)
				.attr("stroke-opacity", 0.3)

			group
				.append("text")
				.attr("class", "label")
				.attr("fill", colours.white)
				.attr("text-anchor", "middle")
				.attr("dominant-baseline", "middle")
				.text((d) => d.title)
				.call(wrap, 10)
		})
		// eslint-disable-next-line
	}, [data, width, height, activeIds])

	useEffect(() => {
		d3.select("#force-layout")
			.selectAll(".node")
			.select("circle")
			.attr("fill", colours.dark[1])
			.filter((d) => activeIds.includes(d.id))
			.attr("fill", colours.orange)

		if (activeIds?.length > 1) {
			let links = []

			for (const id of activeIds) {
				const targets = activeIds
					.map((d, i) =>
						d !== id && i % 2 === 0 ? { source: id, target: d } : null
					)
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
				.attr("stroke", colours.dark[1])
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
				.on("mousemove", (event) =>
					d3
						.select(".tooltip")
						.style("top", `${event.pageY + 10}px`)
						.style("left", `${event.pageX + 10}px`)
				)
				.on("mouseout", (event) => {
					d3.select(".tooltip").style("visibility", "hidden")
					d3.select(event.target).attr("stroke", colours.dark[1])
				})

			const intersection = d3
				.select("#force-layout")
				.append("g")
				.attr("class", "intersection")

			const triangle = intersection
				.append("polygon")
				.attr("class", "triangle")
				.attr("points", "-15,-15 15,-15 0,15")
				.attr("fill", colours.orange)
				.attr("stroke", colours.dark[1])
				.attr("stroke-width", 3)
				.on("click", () => {
					const [n1, n2, n3] = activeNodes
					window.location.href = `https://graduateshowcase.arts.ac.uk/projects?_q=${n1.title}%C2%A0&%C2%A0${n2.title}%C2%A0&%C2%A0${n3.title}`
				})
				.on("mouseover", (event) => {
					const [n1, n2, n3] = activeNodes
					d3.select(".tooltip").style("visibility", "visible")
					d3.select(".tooltip-title").text(
						`This is the intersection of: ${n1.title}, ${n2.title} and ${n3.title}`
					)
					d3.select(".tooltip-label").text(null)
					d3.select(".tooltip-cta").text("Click to explore these projects")
					d3.select(event.target).attr("stroke", colours.white)
				})
				.on("mousemove", (event) =>
					d3
						.select(".tooltip")
						.style("top", `${event.pageY + 10}px`)
						.style("left", `${event.pageX + 10}px`)
				)
				.on("mouseout", (event) => {
					d3.select(".tooltip").style("visibility", "hidden")
					d3.select(event.target).attr("stroke", colours.dark[1])
				})

			const intersectionLine = intersection
				.selectAll(".intersection-line")
				.data(activeNodes)
				.enter()
				.append("line")
				.attr("class", "intersection-line")
				.attr("stroke-width", 2)
				.attr("stroke", colours.orange)

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
					link.attr("transform", (d) => `translate(0, 0)`)

					button.attr("transform", (d) => {
						const { x, y } = halfDistance(d.source, d.target)
						return `translate(${x}, ${y})`
					})

					if (activeIds?.length === 3) {
						const polygon = activeNodes.map((v) => [v.x, v.y])
						const { x, y } = triangleCentroid(polygon)

						intersectionLine
							.attr("x1", (d) => d.x)
							.attr("x2", x)
							.attr("y1", (d) => d.y)
							.attr("y2", y)

						triangle.attr("transform", () => `translate(${x}, ${y})`)
					}

					line
						.attr("x1", (d) => d.source.x)
						.attr("y1", (d) => d.source.y)
						.attr("x2", (d) => d.target.x)
						.attr("y2", (d) => d.target.y)
				})
		}

		// eslint-disable-next-line
	}, [activeIds, simulation])

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
