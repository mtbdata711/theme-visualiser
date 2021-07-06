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

const select = (d) => {
	const [circle, text] = d.children
	circle.setAttribute("fill", colourize(d.id))
	text.setAttribute("fill", colours.dark[1])
}

const deselect = (d) => {
	const [circle, text] = d.children
	circle.setAttribute("fill", colours.dark[1])
	text.setAttribute("fill", colourize(d.id))
}

export const truncate = (text, radius, f = 8) =>
	text.length > radius / f ? `${text.substring(0, radius / f)}…` : text

export const formatWeight = (weight, f = 10) => weight / f

export const colourize = (id) => {
	const entries = Object.entries(colours.tones)
	const values = Object.values(colours.tones)

	const quantile = d3
		.scaleQuantile()
		.domain([0, data.length])
		.range(Array.from({ length: entries.length }, (d, i) => i))

	return values[quantile(id)][1]
}

export const halfDistance = (v1, v2) => {
	const vx = (v2.x - v1.x) / 2
	const vy = (v2.y - v1.y) / 2
	return { x: v1.x + vx, y: v1.y + vy }
}

export const gradients = () => {
	const c = Object.values(colours.tones)
	const pairs = []

	for (let x = 0; x < c.length; x++) {
		for (let y = 0; y < c.length; y++) {
			pairs.push({ x: c[x][1], y: c[y][1] })
		}
	}

	return pairs
}
