export const reducer = (ids, action) => {
	const type = ids.includes(action.id) ? "REMOVE" : "ADD"
	const idx = ids.indexOf(action.id)

	switch (type) {
		case "ADD":
			return [...ids, action.id]
		case "REMOVE":
			return [...ids.slice(0, idx), ...ids.slice(idx + 1)]
		default:
			throw new Error()
	}
}

export const truncate = (t, r) =>
	t.length > r / 5 ? `${t.substring(0, r / 5)}…` : t

export const formatWeight = (weight, width) => (width * 10) / weight

export const formatFontSize = (r) => (r > 40 ? 16 : r > 30 ? 14 : 12)
