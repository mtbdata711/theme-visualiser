/**
 * Reducer method that takes the ID of the selected node (theme)
 * and either adds or removes the ID to a state array.
 * @param {Array} ids
 * @param {Object} action
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
 * Distance method to calculate the position of the intersection-
 * buttons in the force layout graph. It takes two vectors, both
 * holding (x, y) coördinates. It returns the vector of the
 * point halfway between the two given vectors.
 * @param {Object} v1
 * @param {Object} v2
 */
export const halfDistance = (v1, v2) => {
	const vx = (v2.x - v1.x) / 2
	const vy = (v2.y - v1.y) / 2
	return { x: v1.x + vx, y: v1.y + vy }
}

/**
 *
 * @param {Array} triangle
 */
export const triangleCentroid = (triangle) => {
	var cx = (triangle[0][0] + triangle[1][0] + triangle[2][0]) / 3
	var cy = (triangle[0][1] + triangle[1][1] + triangle[2][1]) / 3

	return { x: cx, y: cy }
}

/**
 * A bunch of helper functions needed for closestPointOnPolygon()
 */
const vlen = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1])
const vnegate = (v) => [-v[0], -v[1]]
const vadd = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]]
const vsub = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1]]
const vscale = (v, f) => [v[0] * f, v[1] * f]
const vnorm = (v) => [-v[1], v[0]]

/**
 * https://gis.stackexchange.com/questions/104161/how-can-i-find-closest-point-on-a-polygon-from-a-point
 * @param {Array} point
 * @param {Array} poly
 */
export const closestPointOnPolygon = (point, poly) => {
	// console.log(point, poly)
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
