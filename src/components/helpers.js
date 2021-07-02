import { colours, palettes } from "../styles/index"

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
	const circle = d.children[0]
	const text = d.children[1]
	circle.setAttribute("fill", colours.white)
	text.setAttribute("fill", colours.black)
}

const deselect = (d) => {
	const circle = d.children[0]
	const text = d.children[1]
	circle.setAttribute("fill", colours.black)
	text.setAttribute("fill", colours.white)
}

export const truncate = (t, r, f = 5) =>
	t.length > r / f ? `${t.substring(0, r / f)}…` : t

export const formatWeight = (weight, width, f = 20) => (width * f) / weight

export const formatFontSize = (r) => (r > 40 ? 16 : r > 30 ? 14 : 12)
