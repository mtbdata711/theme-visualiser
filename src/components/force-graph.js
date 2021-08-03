import { useEffect, useMemo } from "react"
import {
	forceSimulation,
	forceManyBody,
	forceCenter,
	forceCollide,
	forceLink,
	forceX,
	forceY,
} from "d3-force"
import { select } from "d3-selection"
import { max } from "d3-array"
import { scaleLinear } from "d3-scale"
import { drag } from "d3-drag"
// import { zoom } from "d3-zoom"

import pointInPolygon from "point-in-polygon"

import { GraphWrapper } from "./index"
import {
	halfDistance,
	triangleCentroid,
	closestPointOnPolygon,
	dragFunction,
} from "../helpers"
import { colours } from "../styles/index"

export const ForceGraph = ({ width, height, data, dispatch, activeIds }) => {
	const activeNodes = useMemo(
		() => activeIds.map((id) => data.find((el) => el.id === id)),
		[data, activeIds]
	)

	/**
	 *  Assignments to the 'links' variable from inside React Hook useEffect will be lost after each render. To preserve the value over time, store it in a useRef Hook and keep the mutable value in the '.current' property. Otherwise, you can move this variable directly inside useEffect  react-hooks/exhaustive-deps
	 */
	let links = []

	const scale = scaleLinear([0, max(data.map((el) => el.total))], [40, 80])

	const simulation = forceSimulation(data)
		.force("charge", forceManyBody().strength(20))
		.force("center", forceCenter(width / 2, height / 2))
		.force(
			"collision",
			forceCollide().radius((d) => scale(d.total) + 10)
		)

	useEffect(() => {
		const svg = select("#force-graph")
		const nodes = svg
			.selectAll(".node")
			.data(data)
			.enter()
			.append("g")
			.attr("class", "node")
			.attr("id", (d) => d.id)
			.on("click", function () {
				dispatch({
					id: Number(this.id),
				})
			})
			.on("mouseover", (event, d) => {
				select(".tooltip-wrapper")
					.style("visibility", "visible")
					.style("top", `${event.clientY + 10}px`)
					.style("left", `${event.clientX + 10}px`)
				select(".tooltip-type").text("theme")
				select(".tooltip-title").text(d.title)
				select(".tooltip-label").text(`${d.total} projects`)
				select(".tooltip-cta").text("click to select the theme")
			})
			.on("mousemove", (event, d) => {
				select(".tooltip-wrapper")
					.style("top", `${event.clientY + 10}px`)
					.style("left", `${event.clientX + 10}px`)
			})
			.on("mouseout", () =>
				select(".tooltip-wrapper").style("visibility", "hidden")
			)
			.call(dragFunction(simulation, drag))

		nodes
			.append("circle")
			.attr("r", (d) => scale(d.total))
			.attr("class", "circle")
			.attr("fill", colours.dark[1])
			.attr("stroke", colours.white)
			.attr("stroke-width", 2)
			.attr("stroke-opacity", 0.3)

		nodes
			.append("foreignObject")
			.attr("id", (d) => d.id)
			.attr("x", -45)
			.attr("y", -10)
			.attr("width", 90)
			.attr("height", 60)
			.append("xhtml:div")
			.style("color", colours.white)
			.style("text-align", "center")
			.attr("class", "label")
			.html((d) => d.title)

		if (activeIds.length > 1) {
			for (const node of activeNodes) {
				const targets = activeNodes
					.map((d, i) =>
						d !== node && i % 2 === 0 ? { source: node, target: d } : null
					)
					.filter(Boolean)

				// eslint-disable-next-line
				links = [...links, ...targets]
			}

			const link = select("#force-graph")
				.selectAll(".link")
				.data(links)
				.enter()
				.append("g")
				.attr("class", "link")

			link
				.append("line")
				.attr("class", "line")
				.attr("stroke-width", 2)
				.attr("stroke", colours.orange)

			link
				.append("circle")
				.attr("class", "button")
				.attr("r", 12)
				.attr("fill", colours.orange)
				.attr("stroke", colours.dark[1])
				.attr("stroke-width", 3)
				.on("mouseover", (event, d) => {
					select(event.target).attr("stroke", colours.white)
					select(".tooltip-wrapper")
						.style("visibility", "visible")
						.style("top", `${event.clientY + 10}px`)
						.style("left", `${event.clientX + 10}px`)
					select(".tooltip-type").text("intersection")
					select(".tooltip-title").text(
						`${d.source.title} and ${d.target.title}`
					)
					select(".tooltip-label").text(
						`${d.source.total + d.target.total} projects`
					)
					select(".tooltip-cta").text("click to explore this intersection")
				})
				.on("mousemove", (event) => {
					select(".tooltip-wrapper")
						.style("top", `${event.clientY + 10}px`)
						.style("left", `${event.clientX + 10}px`)
				})
				.on("mouseout", (event) => {
					select(event.target).attr("stroke", colours.dark[1])
					select(".tooltip-wrapper").style("visibility", "hidden")
				})
				.on(
					"click",
					(_, d) =>
						(window.location.href = `https://graduateshowcase.arts.ac.uk/projects?_q=${d.source.title}%C2%A0&%C2%A0${d.target.title}`)
				)

			const intersection = select("#force-graph")
				.selectAll(".intersection")
				.data(activeNodes)
				.enter()
				.append("g")
				.attr("class", "intersection")

			intersection
				.append("line")
				.attr("class", "intersection-line")
				.attr("stroke-width", 2)
				.attr("stroke", colours.orange)

			intersection
				.append("polygon")
				.attr("class", "triangle")
				.attr("points", "-15,-15 15,-15 0,10")
				.attr("fill", colours.orange)
				.attr("stroke", colours.dark[1])
				.attr("stroke-width", 3)
				.on("mouseover", (event) => {
					select(event.target).attr("stroke", colours.white)
					const [n1, n2, n3] = activeNodes

					select(".tooltip-wrapper")
						.style("visibility", "visible")
						.style("top", `${event.clientY + 10}px`)
						.style("left", `${event.clientX + 10}px`)
					select(".tooltip-type").text("intersection")
					select(".tooltip-title").text(
						`${n1.title}, ${n2.title} and ${n3.title}`
					)
					select(".tooltip-label").text(
						`${n1.total + n2.total + n3.total} projects`
					)
					select(".tooltip-cta").text("click to explore this intersection")
				})
				.on("mousemove", (event) => {
					select(".tooltip-wrapper")
						.style("top", `${event.clientY + 10}px`)
						.style("left", `${event.clientX + 10}px`)
				})
				.on("mouseout", (event) => {
					select(event.target).attr("stroke", colours.dark[1])
					select(".tooltip-wrapper").style("visibility", "hidden")
				})
				.on("click", () => {
					const [n1, n2, n3] = activeNodes
					window.location.href = `https://graduateshowcase.arts.ac.uk/projects?_q=${n1.title}%C2%A0&%C2%A0${n2.title}%C2%A0&%C2%A0${n3.title}`
				})

			simulation
				.force(
					"link",
					forceLink(links)
						.id((d) => d.id)
						.distance(200)
				)
				.force(
					"x",
					forceX().x((d) => {
						if (activeIds.length > 2) {
							const polygon = activeNodes.map((v) => [v.x, v.y])
							const inPolygon = pointInPolygon([d.x, d.y], polygon)
							if (inPolygon)
								return closestPointOnPolygon([d.x, d.y], polygon)[0][0]
						}
						return d.x
					})
				)
				.force(
					"y",
					forceY().y((d) => {
						if (activeIds.length > 2) {
							const polygon = activeNodes.map((v) => [v.x, v.y])
							const inPolygon = pointInPolygon([d.x, d.y], polygon)
							if (inPolygon)
								return closestPointOnPolygon([d.x, d.y], polygon)[0][1]
						}
						return d.y
					})
				)
		}

		simulation
			.on("tick", () => {
				nodes.attr("transform", (d) => `translate(${d.x}, ${d.y})`)
				const link = select("#force-graph").selectAll(".link")

				link
					.select("line")
					.attr("x1", (d) => d.source.x)
					.attr("y1", (d) => d.source.y)
					.attr("x2", (d) => d.target.x)
					.attr("y2", (d) => d.target.y)

				link.select("circle").attr("transform", (d) => {
					const { x, y } = halfDistance(d.source, d.target)
					return `translate(${x}, ${y})`
				})

				if (activeIds.length > 2) {
					const intersection = select("#force-graph").selectAll(".intersection")
					const polygon = activeNodes.map((v) => [v.x, v.y])

					intersection
						.select("line")
						.attr("x1", (d) => d.x)
						.attr("x2", () => triangleCentroid(polygon).x)
						.attr("y1", (d) => d.y)
						.attr("y2", () => triangleCentroid(polygon).y)

					intersection.select("polygon").attr("transform", () => {
						const { x, y } = triangleCentroid(polygon)
						return `translate(${x}, ${y})`
					})
				}
			})
			.alphaTarget(0.5)
			.restart()
	}, [simulation, data, activeIds])

	useEffect(() => {
		const nodes = select("#force-graph").selectAll(".node")

		nodes
			.select("circle")
			.attr("fill", colours.dark[1])
			.filter((d) => activeIds.includes(d.id))
			.attr("fill", colours.orange)

		nodes.select("foreignObject").filter((d) => activeIds.includes(d.id))

		select("#force-graph").selectAll(".link")
	}, [activeIds])

	return (
		<GraphWrapper width={width} height={height}>
			<svg
				height={height}
				width={width}
				viewBox={`0 0 ${width} ${height}`}
				id="force-graph"
			></svg>
		</GraphWrapper>
	)
}
