import * as d3 from "d3"
import { colours } from "../styles/index"

/**
 * Reducer method that takes the ID of the selected node (theme)
 * and either adds or removes the ID to a state array.
 * @param {*} ids
 * @param {*} action
 */
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

/**
 * Select function that sets the style of the target element;
 * when the user clicks on a checkbox in the select-box, this method
 * will target the node (group holding a circle and text) in the
 * force layout graph (svg), and change its style to represent an
 * active state, showing the user this theme is now selected.
 * @param {*} target
 */
const select = (target) => {
	const [circle, text] =
		target.type === "checkbox"
			? d3.select(`#group-${target.id}`)._groups[0][0].children
			: target.children

	circle.setAttribute("fill", colours.orange)
	circle.setAttribute("stroke", colours.orange)
	text.setAttribute("fill", colours.dark[1])
}

/**
 * Deselect function that works similar to the Select function
 * stated above, the only difference is that this method changes
 * the style to indicate that the theme is not selected; changing
 * it style back to its default state.
 * @param {*} target
 */
const deselect = (target) => {
	const [circle, text] =
		target.type === "checkbox"
			? d3.select(`#group-${target.id}`)._groups[0][0].children
			: target.children
	circle.setAttribute("fill", colours.dark[1])
	circle.setAttribute("stroke", colours.white)
	text.setAttribute("fill", colours.white)
}

/**
 * Truncation method that takes a text, a radius (or half-width)
 * of the node and a 'factor' variable that holds a default of 8.
 * When the length of the text exceeds that of a specified aspect
 * of the radius, the inputted text will be truncated. If the text
 * has enough space, this method just returns the original text.
 * @param {*} text
 * @param {*} radius
 * @param {*} f
 */
export const truncate = (text, radius, f = 8) =>
	text.length > radius / f ? `${text.substring(0, radius / f)}…` : text

/**
 * Formatting method that returns the size of a circle in the
 * force layout graph. It takes a weight (as defined in the data),
 * and a optional factor and returns the fraction of the two.
 * @param {*} weight
 * @param {*} f
 */
export const formatWeight = (weight, f = 12) => weight / f

/**
 * Distance method to calculate the position of the intersection-
 * buttons in the force layout graph. It takes two vectors, both
 * holding (x, y) coördinates. It returns the vector of the
 * point halfway between the two given vectors.
 * @param {*} v1
 * @param {*} v2
 */
export const halfDistance = (v1, v2) => {
	const vx = (v2.x - v1.x) / 2
	const vy = (v2.y - v1.y) / 2
	return { x: v1.x + vx, y: v1.y + vy }
}
