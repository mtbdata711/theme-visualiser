import { colours, theme } from "../styles/index"

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
	circle.setAttribute("stroke", colours.orange[1])
	text.setAttribute("fill", colours.orange[1])
}

const deselect = (d) => {
	const circle = d.children[0]
	const text = d.children[1]
	circle.setAttribute("fill", colours.dark[1])
	text.setAttribute("fill", colours.white)
}

export const truncate = (t, r, f = 5) =>
	t.length > r / f ? `${t.substring(0, r / f)}…` : t

export const formatWeight = (weight, f = 10) => weight / f

export const formatFontSize = (r, bp = [30, 50]) =>
	r > bp[1]
		? theme.labelSizes[2]
		: r > bp[1]
		? theme.labelSizes[1]
		: theme.labelSizes[0]
