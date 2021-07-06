import * as d3 from "d3"
import { colours } from "../styles/index"
import { data } from "../data"

export const reducer = (ids, action) => {
	const type = ids.includes(action.id) ? "REMOVE" : "ADD"
	const idx = ids.indexOf(action.id)

	switch (type) {
		case "ADD":
			select(action.target)
			return [...ids, action.id]
		case "REMOVE":
			deselect(action.target)
			return [...ids.slice(0, idx), ...ids.slice(idx + 1)]
		default:
			throw new Error()
	}
}

const select = ({ children }) => {
	const [circle, text] = children
	circle.setAttribute("fill", colours.white)
	text.setAttribute("fill", colours.dark[1])
}

const deselect = ({ children }) => {
	const [circle, text] = children
	circle.setAttribute("fill", colours.dark[1])
	text.setAttribute("fill", colours.white)
}

export const truncate = (text, radius, f = 6) =>
	text.length > radius / f ? `${text.substring(0, radius / f)}…` : text

export const formatWeight = (weight, f = 8) => weight / f

export const color = (id) => {
	const entries = Object.entries(colours.tones)
	const values = Object.values(colours.tones)

	const quantile = d3
		.scaleQuantile()
		.domain([0, data.length])
		.range(Array.from({ length: entries.length }, (d, i) => i))

	return values[quantile(id)][1]
}
