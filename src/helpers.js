import { colours } from "./styles/index"

export const reducer = (ids, action) => {
	const type = ids.includes(action.id) ? "REMOVE" : "ADD"
	const idx = ids.indexOf(action.id)

	switch (type) {
		case "ADD":
			action.target.type !== "checkbox" && select(action.target)
			return [...ids, action.id]
		case "REMOVE":
			action.target.type !== "checkbox" && deselect(action.target)
			return [...ids.slice(0, idx), ...ids.slice(idx + 1)]
		default:
			throw new Error()
	}
}

const select = (d) => {
	const [circle, text] = d.children
	circle.setAttribute("fill", colours.orange)
	circle.setAttribute("stroke", colours.orange)
	text.setAttribute("fill", colours.dark[1])
}

const deselect = (d) => {
	const [circle, text] = d.children
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
