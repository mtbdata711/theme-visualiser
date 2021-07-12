/**
 * The links are the lines that function as connections
 * between the force layout nodes (the intersections).
 * Since we want to render both lines and circles (the buttons)
 * we declare the link as a group-element (<g>) so we can append
 * both a line and a button to the link group.
 */
const link = d3
	.select("#force-layout")
	.selectAll(".link")
	.data(links)
	.enter()
	.append("g")
	.attr("class", "link")

/**
 * This is the line of the link
 */
const line = link
	.append("line")
	.attr("class", "line")
	.attr("stroke-width", 2)
	.attr("stroke", colours.orange)

/**
 * This is the button (circle) of the link. Also carrying the
 * functionality of tooltip-content and an on-click method that
 * redirects the user to the graduate showcase page with the
 * corresponding search queries.
 */
const button = link
	.append("circle")
	.attr("class", "button")
	.attr("r", 12)
	.attr("fill", colours.orange)
	.attr("stroke-width", 3)
	.on(
		"click",
		(event, d) =>
			(window.location.href = `https://graduateshowcase.arts.ac.uk/projects?_q=${d.source.title}%C2%A0&%C2%A0${d.target.title}`)
	)
	.on("mouseover", (event, d) => {
		d3.select(".tooltip").style("visibility", "visible")
		d3.select(".tooltip-title").text(
			`This is the intersection of: ${d.source.title} and ${d.target.title}`
		)
		d3.select(".tooltip-label").text(null)
		d3.select(".tooltip-cta").text("Click to explore these projects")
		d3.select(event.target).attr("stroke", colours.white)
	})
	.on("mousemove", (event, d) =>
		d3
			.select(".tooltip")
			.style("top", `${event.pageY + 10}px`)
			.style("left", `${event.pageX + 10}px`)
	)
	.on("mouseout", (event, d) => {
		d3.select(".tooltip").style("visibility", "hidden")
		d3.select(event.target).attr("stroke", colours.orange)
	})
