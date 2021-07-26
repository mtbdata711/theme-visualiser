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
import pointInPolygon from "point-in-polygon"

import { GraphWrapper } from "./index"
import {
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
	setTooltip,
	...styles
}) => {
	const activeNodes = useMemo(() => {
		return activeIds.map((id) => data.find((el) => el.id === id))
	}, [data, activeIds])

	console.log(activeIds, activeNodes)

	const scale = scaleLinear()
		.domain([0, max(data.map((el) => el.total))])
		.range([40, 100])

	const simulation = forceSimulation(data)
		.force("charge", forceManyBody().strength(20))
		.force("center", forceCenter(width / 2, height / 2))
		.force(
			"collision",
			forceCollide().radius((d) => scale(d.total) + 10)
		)
		.force(
			"x",
			forceX().x((d) => {
				if (activeNodes.length > 2) {
					const polygon = activeNodes.map((v) => [v.x, v.y])
					const inPolygon = pointInPolygon([d.x, d.y], polygon)
					if (inPolygon)
						return (closestPointOnPolygon([d.x, d.y], polygon) +
							scale(d.total))[1]
				}
				return d.x
			})
		)
		.force(
			"y",
			forceY().y((d) => {
				if (activeNodes.length > 2) {
					const polygon = activeNodes.map((v) => [v.x, v.y])
					const inPolygon = pointInPolygon([d.x, d.y], polygon)
					if (inPolygon)
						return (closestPointOnPolygon([d.x, d.y], polygon) +
							scale(d.total))[1]
				}
				return d.y
			})
		)

	useEffect(() => {
		simulation.on("tick", () => {
			const nodes = select("#force-layout")
				.selectAll(".node")
				.data(data)
				.attr("transform", (d) => `translate(${d.x}, ${d.y})`)

			const group = nodes.enter().append("g").attr("class", "node")

			group
				.append("circle")
				.attr("id", (d) => d.id)
				.attr("r", (d) => scale(d.total))
				.attr("class", "circle")
				.attr("fill", colours.dark[1])
				.attr("stroke", colours.white)
				.attr("stroke-width", 2)
				.attr("stroke-opacity", 0.3)
				.on("mouseover", (_, d) =>
					setTooltip({
						title: d.title,
						total: d.total,
						x: d.x,
						y: d.y,
						type: "theme",
						cta: "click to select the theme",
					})
				)
				.on("mouseout", () => setTooltip(null))
				.on("click", function () {
					dispatch({
						id: Number(this.id),
					})
				})

			group
				.append("text")
				.attr("class", "label")
				.attr("fill", colours.white)
				.attr("text-anchor", "middle")
				.attr("dominant-baseline", "middle")
				.text((d) => d.title)
				.call(wrap, 20)
		})
		// eslint-disable-next-line
	}, [data, width, height])

	useEffect(() => {
		select("#force-layout")
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

			const link = select("#force-layout")
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
				.on("mouseover", (event, d) => {
					select(event.target).attr("stroke", colours.white)
					setTooltip({
						title: `${d.source.title} and ${d.target.title}`,
						total: d.source.total + d.target.total,
						x: event.clientX,
						y: event.clientY,
						type: "intersection",
						cta: "click to explore this intersection",
					})
				})
				.on("mouseout", (event) => {
					select(event.target).attr("stroke", colours.dark[1])
					setTooltip(null)
				})
				.on(
					"click",
					(_, d) =>
						(window.location.href = `https://graduateshowcase.arts.ac.uk/projects?_q=${d.source.title}%C2%A0&%C2%A0${d.target.title}`)
				)

			const intersection = select("#force-layout")
				.append("g")
				.attr("class", "intersection")

			const triangle = intersection
				.append("polygon")
				.attr("class", "triangle")
				.attr("points", "-15,-15 15,-15 0,10")
				.attr("fill", colours.orange)
				.attr("stroke", colours.dark[1])
				.attr("stroke-width", 3)
				.on("mouseover", (event, d) => {
					select(event.target).attr("stroke", colours.white)
					const [n1, n2, n3] = activeNodes

					setTooltip({
						title: `${n1.title}, ${n2.title} and ${n3.title}`,
						total: n1.total + n2.total + n3.total,
						x: event.clientX,
						y: event.clientY,
						type: "intersection",
						cta: "click to explore this intersection",
					})
				})
				.on("mouseout", (event) => {
					select(event.target).attr("stroke", colours.dark[1])
					setTooltip(null)
				})
				.on("click", () => {
					const [n1, n2, n3] = activeNodes
					window.location.href = `https://graduateshowcase.arts.ac.uk/projects?_q=${n1.title}%C2%A0&%C2%A0${n2.title}%C2%A0&%C2%A0${n3.title}`
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

					forceLink()
						.id((d) => d.id)
						.links(links)
						.distance(200)
				)
				.on("tick", () => {
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
