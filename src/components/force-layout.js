import React from "react"
import * as d3 from "d3"
import styled from "styled-components"

import { reducer, truncate, formatWeight, formatFontSize } from "./helpers"
import { colours } from "../styles/index"

export default function ForceLayout(props) {
	const { width, height, data } = props
	const [activeNodes, dispatch] = React.useReducer(reducer, [])

	React.useEffect(() => {
		const link = d3
			.select("#force-layout")
			.selectAll("line")
			.data(data.links)
			.enter()
			.append("line")
			.attr("stroke", colours.white)
			.attr("stroke-width", 2)

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
					.links(data.links)
			)
			.on("tick", () => {
				const nodes = d3
					.select("#force-layout")
					.selectAll("g")
					.data(data.nodes)
					.attr("transform", (d) => `translate(${d.x}, ${d.y})`)

				const group = nodes
					.enter()
					.append("g")
					.attr("id", (d) => d.id)
					.attr("class", "node")
					.on("click", function (event) {
						dispatch({ target: this, id: Number(this.id), event })
					})
					.on("mouseenter", (event, d) => null)
					.on("mouseleave", (event, d) => null)
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

				link
					.attr("x1", (d) => d.source.x)
					.attr("y1", (d) => d.source.y)
					.attr("x2", (d) => d.target.x)
					.attr("y2", (d) => d.target.y)

				group
					.append("circle")
					.attr("r", (d) => formatWeight(d.weight, width))
					.attr("class", "circle")
					.attr("fill", colours.black)
					.attr("stroke", colours.white)
					.attr("stroke-width", 2)

				group
					.append("text")
					.style(
						"font-size",
						(d) => `${formatFontSize(formatWeight(d.weight, width))}px`
					)
					.attr("dx", 0)
					.attr("fill", colours.white)
					.attr("text-anchor", "middle")
					.attr("dominant-baseline", "middle")
					.attr("class", "label")
					.text((d) => truncate(d.title, formatWeight(d.weight, width)))
			})
	}, [data, width, height])

	return (
		<Wrapper width={width} height={height}>
			<svg
				height={height}
				width={width}
				viewBox={`0 0 ${width} ${height}`}
				id="force-layout"
			></svg>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	border: 1px solid ${colours.white};
	width: ${(p) => `${p.width}px`};
	height: ${(p) => `${p.height}px`};

	& svg g:hover {
		cursor: grab;
	}

	& svg g:active {
		cursor: grabbing;
	}
`
