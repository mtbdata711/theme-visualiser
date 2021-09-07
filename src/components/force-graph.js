import { useEffect, useMemo } from "react"
import {
	forceSimulation,
	forceManyBody,
	forceCenter,
	forceCollide,
	forceLink,
} from "d3-force"
import { select } from "d3-selection"
import { max } from "d3-array"
import { scaleLinear } from "d3-scale"
import { drag } from "d3-drag"

import { GraphWrapper } from "./index"
import { halfDistance, triangleCentroid, dragFunction } from "../helpers"
import { colours } from "../styles"

/**
 * The ForceGraph component renders the d3 force graph.
 * @param {*} param0
 */
export const ForceGraph = ({ width, height, data, dispatch, activeIds }) => {
	const activeNodes = useMemo(
		() => activeIds.map((id) => data.find((el) => el.id === id)),
		[data, activeIds]
	)



	const scale = scaleLinear([0, max(data.map((el) => el.total))], [40, 70])
	const fontScale = scaleLinear(
		[0, max(data.map((el) => el.title.length))],
		[18, 10]
	)

	const links = useMemo(() => {
		const links = []
		if (activeNodes.length <= 1) return links

		console.log({activeNodes});

		for (let [i, node] of activeNodes.entries()) {
			if (activeNodes.length === 2) {
				links.push({ source: node.id, target: activeNodes[i + 1].id })
				break
			}

			if (i === activeNodes.length - 1) {
				links.push({ source: node.id, target: activeNodes[0].id })
			} else {
				links.push({ source: node.id, target: activeNodes[i + 1].id })
			}
		}

		return links
	}, [activeNodes])

	const intersections = useMemo(() => {
		const intersections = []

		if (links.length === 3) {
			for (let { source, target } of links) {
				const entry = data.find((el) => el.id === source)
				intersections.push({ source, target, entry })
			}
		}

		return intersections
	}, [links, data])

	const simulation = useMemo(() => {
		return forceSimulation(data)
			.force("charge", forceManyBody().strength(15))
			.force("center", forceCenter(width / 2, height / 2))
			.force(
				"collision",
				forceCollide().radius((d) => scale(d.total) + 10)
			)
			.force(
				"link",
				forceLink(links)
					.id((d) => d.id)
					.distance(200)
			)
			.on("tick", () => {
				const nodes = select("#force-graph").selectAll(".node")
				const link = select("#force-graph").selectAll(".link")

				nodes.attr("transform", (d) => `translate(${d.x}, ${d.y})`)

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

				const intersection = select("#force-graph").selectAll(".intersection")
				const polygon = links.map((d) => [d.source.x, d.source.y])

				if (links.length < 3) return

				intersection
					.select("line")
					.attr("x1", (d) => d.entry.x)
					.attr("x2", () => triangleCentroid(polygon).x)
					.attr("y1", (d) => d.entry.y)
					.attr("y2", () => triangleCentroid(polygon).y)

				intersection.select("polygon").attr("transform", () => {
					const { x, y } = triangleCentroid(polygon)
					return `translate(${x}, ${y})`
				})
			})
	}, [links, data, width, height, scale])

	useEffect(() => {
		select("#force-graph").selectAll(".node").remove()

		const nodes = select("#force-graph")
			.selectAll(".node")
			.data(data)
			.join("g")
			.attr("class", "node")
			.attr("id", (d) => d.id)

		nodes
			.append("circle")
			.attr("id", (d) => d.id)
			.attr("r", (d) => scale(d.total))
			.attr("class", "circle")
			.attr("fill", colours.dark[1])
			.attr("stroke", colours.white)
			.attr("stroke-width", 2)
			.attr("stroke-opacity", 0.2)

		nodes
			.append("foreignObject")
			.attr("x", -40)
			.attr("y", -10)
			.attr("width", 80)
			.attr("height", 60)
			.append("xhtml:div")
			.attr("id", (d) => d.id)
			.style("color", colours.white)
			.style("text-align", "center")
			.style("font-size", (d) => `${fontScale(d.title.length)}px`)
			.attr("class", "label")
			.html((d) => d.title)

		nodes
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
			.on("mousemove", (event) => {
				select(".tooltip-wrapper")
					.style("top", `${event.clientY + 10}px`)
					.style("left", `${event.clientX + 10}px`)
			})
			.on("mouseout", () =>
				select(".tooltip-wrapper").style("visibility", "hidden")
			)
			.call(dragFunction(simulation, drag))

		nodes
			.filter((d) => activeNodes.some((el) => el.id === d.id))
			.selectAll("circle")
			.attr("fill", colours.orange)

		const link = select("#force-graph")
			.selectAll(".link")
			.data(links)
			.join("g")
			.attr("class", "link")
			.lower()

		link
			.append("line")
			.attr("class", "line")
			.attr("stroke-width", 2)
			.attr("stroke", colours.orange)

		link
			.append("a")
			.attr(
				"xlink:href",
				(d) =>
					`https://graduateshowcase.arts.ac.uk/projects?_q=${d.source.title}%C2%A0&%C2%A0${d.target.title}`
			)
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
				select(".tooltip-title").text(`${d.source.title} and ${d.target.title}`)
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

		// link.exit().remove()

		const intersection = select("#force-graph")
			.selectAll(".intersection")
			.data(intersections)
			.join("g")
			.attr("class", "intersection")
			.lower()

		intersection
			.append("line")
			.attr("class", "intersection-line")
			.attr("stroke-width", 2)
			.attr("stroke", colours.orange)

		intersection
			.append("a")
			.attr("xlink:href", () => {
				const [n1, n2, n3] = intersections.map((el) => el.entry)
				return `https://graduateshowcase.arts.ac.uk/projects?_q=${n1?.title}%C2%A0&%C2%A0${n2?.title}%C2%A0&%C2%A0${n3?.title}`
			})
			.append("polygon")
			.attr("class", "triangle")
			.attr("points", "-15,-15 15,-15 0,10")
			.attr("fill", colours.orange)
			.attr("stroke", colours.dark[1])
			.attr("stroke-width", 3)
			.on("mouseover", (event) => {
				select(event.target).attr("stroke", colours.white)
				const [n1, n2, n3] = intersections.map((el) => el.entry)

				select(".tooltip-wrapper")
					.style("visibility", "visible")
					.style("top", `${event.clientY + 10}px`)
					.style("left", `${event.clientX + 10}px`)
				select(".tooltip-type").text("intersection")
				select(".tooltip-title").text(
					`${n1?.title}, ${n2?.title} and ${n3?.title}`
				)
				select(".tooltip-label").text(
					`${n1?.total + n2?.total + n3?.total} projects`
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

		return () => {
			simulation.stop()
		}
	}, [
		data,
		activeNodes,
		links,
		intersections,
		dispatch,
		scale,
		fontScale,
		width,
		height,
		simulation,
	])

	const handleClick = event => {
		const { id, parentNode } = event.target
		const { length } = activeIds
		const selectedId = id ? id : parentNode.id
		const selectedIdAsNumber = Number(selectedId)

		if( ! selectedId || Number.isNaN( selectedIdAsNumber ) ){
			return
		}

		if( length >= 3 && activeIds.includes(selectedIdAsNumber) ){
			return dispatch( { id: selectedIdAsNumber } )
		}

		if( length < 3 ){
			return dispatch( { id: selectedIdAsNumber } )
		}
	}

	return (
		<GraphWrapper width={width} height={height}> 
			<svg
				height={height}
				width={width}
				viewBox={`0 0 ${width} ${height}`}
				id="force-graph"
				onClick={handleClick}
			></svg>
		</GraphWrapper>
	)
}
