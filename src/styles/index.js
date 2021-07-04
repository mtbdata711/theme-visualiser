// https://www.arts.ac.uk/our-brand/ual-brand-guidelines/our-colour-palette
export const colours = {
	black: "#000000",
	white: "#FFFFFF",
	yellow: ["#FFB400", "#FFD022", "#FFED00", "#FFFF00"],
	pink: ["#C40E64", "#E71657", "#FF1464", "#FC1890"],
	orange: ["#FF5000", "#FF8500", "#FFB400", "#FE6F06"],
	purple: ["#693EC4", "#9E65FB", "#D298FC", "#9D24F5"],
	aqua: ["#2774B6", "#20BCFF", "#00E2FF", "#19F9FF"],
	blue: ["#2E00A3", "#1F4EDC", "#006CFF", "#0000FF"],
	green: ["#00A200", "#00C73E", "#1AEB25", "#29FD2F"],
	emerald: ["#0F7574", "#19A4A3", "#2FEACF", "#00FFDC"],
	dark: ["#0A0A0A", "#171717", "#3B3B3B", "#808080"],
	bright: ["#FFFFFF", "#F6F6F6", "#D1D1D1", "#808080"],
}

export const palettes = {
	black: { body: colours.black, text: colours.white },
	white: { body: colours.white, text: colours.black },
	yellow: { body: colours.yellow[1], text: colours.black },
	aqua: { body: colours.aqua[1], text: colours.black },
	pink: { body: colours.pink[1], text: colours.white },
	blue: { body: colours.blue[1], text: colours.white },
	orange: { body: colours.orange[1], text: colours.black },
	green: { body: colours.green[1], text: colours.black },
	purple: { body: colours.purple[1], text: colours.black },
	emerald: { body: colours.emerald[1], text: colours.black },
}

export const theme = {
	sizes: [
		"0.8rem",
		"1rem",
		"1.25rem",
		"1.563rem",
		"2.441rem",
		"3.815rem",
		"5.96rem",
		"7.451rem",
		"9.313rem",
		"11.642rem",
		"14.552rem",
	],
	labelSizes: [12, 14, 16],
	spaces: [
		"0.4rem",
		"0.64rem",
		"0.8rem",
		"1.25rem",
		"1.953rem",
		"2.441rem",
		"3.815rem",
		"5.96rem",
	],
}

const size = {
	mobile: "375px",
	tablet: "768px",
	laptop: "1024px",
	desktop: "1920px",
}

export const device = {
	mobile: `(min-width: ${size.mobile})`,
	tablet: `(min-width: ${size.tablet})`,
	laptop: `(min-width: ${size.laptop})`,
	desktop: `(min-width: ${size.desktop})`,
}
