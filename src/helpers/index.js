import * as d3 from "d3"

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
			return [...ids, action.id]
		case "REMOVE":
			return [...ids.slice(0, idx), ...ids.slice(idx + 1)]
		default:
			throw new Error()
	}
}

/**
 * Formatting method that returns the size of a circle in the
 * force layout graph. It takes a weight (as defined in the data),
 * and a optional factor and returns the fraction of the two.
 * @param {*} weight
 * @param {*} f
 */
export const formatWeight = (value, f = 8) => {
	const min = 40
	return d3.max([min, value / f])
}

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

function vlen(vector) {
	return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
}

function vnegate(v) {
	return [-v[0], -v[1]]
}

function vadd(v1, v2) {
	return [v1[0] + v2[0], v1[1] + v2[1]]
}

function vsub(v1, v2) {
	return [v1[0] - v2[0], v1[1] - v2[1]]
}

function vscale(vector, factor) {
	return [vector[0] * factor, vector[1] * factor]
}

function vnorm(v) {
	return [-v[1], v[0]]
}
export function closestPointOnPolygon(point, poly) {
	let shortestDist = Number.MAX_VALUE
	let closestPointOnPoly = poly[0]

	poly.forEach(function (p1, i) {
		var prev = (i === 0 ? poly.length : i) - 1,
			p2 = poly[prev],
			line = vsub(p2, p1)

		if (vlen(line) === 0) return vlen(vsub(point, p1))

		var norm = vnorm(line),
			x1 = point[0],
			x2 = norm[0],
			x3 = p1[0],
			x4 = line[0],
			y1 = point[1],
			y2 = norm[1],
			y3 = p1[1],
			y4 = line[1],
			j = (x3 - x1 - (x2 * y3) / y2 + (x2 * y1) / y2) / ((x2 * y4) / y2 - x4)

		let currentDistanceToPoly
		let currentPointToPoly
		if (j < 0 || j > 1) {
			const a = vsub(point, p1)
			const aLen = vlen(a)
			const b = vsub(point, p2)
			const bLen = vlen(b)
			if (a < b) {
				currentPointToPoly = vnegate(a)
				currentDistanceToPoly = aLen
			} else {
				currentPointToPoly = vnegate(b)
				currentDistanceToPoly = bLen
			}
		} else {
			const i = (y3 + j * y4 - y1) / y2

			currentPointToPoly = vscale(norm, i)
			currentDistanceToPoly = vlen(currentPointToPoly)
		}

		if (currentDistanceToPoly < shortestDist) {
			closestPointOnPoly = vadd(point, currentPointToPoly)
			shortestDist = currentDistanceToPoly
		}
	})

	return [closestPointOnPoly, shortestDist]
}

// https://bl.ocks.org/mbostock/7555321
export function wrap(text, width) {
	text.each(function () {
		let text = d3.select(this),
			words = text.text().split(" ").reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 0.5, // ems
			y = text.attr("y"),
			dy = 0,
			tspan = text
				.text(null)
				.append("tspan")
				.attr("x", 0)
				.attr("y", y)
				.attr("dy", dy + "em")

		while ((word = words.pop())) {
			line.push(word)
			tspan.text(line.join(" "))

			if (tspan.node().getComputedTextLength() > width) {
				line.pop()
				tspan.text(line.join(" "))
				line = [word]
				tspan = text
					.append("tspan")
					.attr("x", 0)
					.attr("y", y)
					.attr("dy", ++lineNumber * lineHeight + dy + "em")
					.text(word)
			}
		}
	})
}
