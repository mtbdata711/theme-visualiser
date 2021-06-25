import React from "react"
import * as d3 from "d3"

export default function NetworkGraphAxes(props) {
	const { width, height, data } = props
	console.log(props)

	const margin = { top: 20, right: 0, bottom: 30, left: 0 }

	const x = d3
		.scaleLinear()
		.domain([0, 100])
		.range([height - margin.bottom, margin.top])

	d3.select("svg")
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(
			d3
				.axisBottom(x)
				.ticks(d3.timeMonth.every(3))
				.tickFormat((d) => (d <= d3.timeYear(d) ? d.getFullYear() : null))
		)
		.call((g) => g.select(".domain").remove())

	return (
		<svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}></svg>
	)
}
