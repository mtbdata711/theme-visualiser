import * as d3 from "d3"
import { colours } from "./styles/index"

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

const select = (target) => {
	// console.log(target)
	const [circle, text] =
		target.type === "checkbox"
			? d3.select(`#group-${target.id}`)._groups[0][0].children
			: target.children
	circle.setAttribute("fill", colours.orange)
	circle.setAttribute("stroke", colours.orange)
	text.setAttribute("fill", colours.dark[1])
}

const deselect = (target) => {
	const [circle, text] =
		target.type === "checkbox"
			? d3.select(`#group-${target.id}`)._groups[0][0].children
			: target.children
	circle.setAttribute("fill", colours.dark[1])
	circle.setAttribute("stroke", colours.white)
	text.setAttribute("fill", colours.white)
}

export const truncate = (text, radius, f = 8) =>
	text.length > radius / f ? `${text.substring(0, radius / f)}…` : text

export const formatWeight = (weight, f = 10) => weight / f

export const halfDistance = (v1, v2) => {
	const vx = (v2.x - v1.x) / 2
	const vy = (v2.y - v1.y) / 2
	return { x: v1.x + vx, y: v1.y + vy }
}
