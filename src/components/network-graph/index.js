import React from "react"
import * as d3 from "d3"

import Axes from "./axes"

export default function NetworkGraph(props) {
	const { width, height, data } = props
	console.log(props)

	const margin = { top: 20, right: 0, bottom: 30, left: 0 }

	const x = d3
		.scaleLinear()
		.domain([0, 100])
		.range([height - margin.bottom, margin.top])

	return (
		<svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}></svg>
	)
}