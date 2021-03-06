// https://www.arts.ac.uk/our-brand/ual-brand-guidelines/our-colour-palette
export const colours = {
	black: "#000000",
	white: "#FFFFFF",
	yellow: "#FFD022",
	pink: "#E71657",
	orange: "#FF8500",
	purple: "#9E65FB",
	aqua: "#20BCFF",
	blue: "#1F4EDC",
	green: "#00C73E",
	emerald: "#19A4A3",
	dark: ["#0A0A0A", "#171717", "#3B3B3B", "#808080"],
	bright: ["#FFFFFF", "#F6F6F6", "#D1D1D1", "#808080"],
}

export const palettes = {
	black: { body: colours.black, text: colours.white },
	white: { body: colours.white, text: colours.black },
	yellow: { body: colours.yellow, text: colours.black },
	aqua: { body: colours.aqua, text: colours.black },
	pink: { body: colours.pink, text: colours.white },
	blue: { body: colours.blue, text: colours.white },
	orange: { body: colours.orange, text: colours.black },
	green: { body: colours.green, text: colours.black },
	purple: { body: colours.purple, text: colours.black },
	emerald: { body: colours.emerald, text: colours.black },
}

export const theme = {
	sizes: [
		"0.875rem",
		"1rem",
		"1.25rem",
		"1.5rem",
		"2rem",
		"3.375em",
		"4rem",
		"6rem",
	],
	spaces: [
		"0.875rem",
		"1rem",
		"1.25rem",
		"1.5rem",
		"2rem",
		"3.375em",
		"4rem",
		"6rem",
	],
	margins: [14, 16, 20, 24, 32],
}

export const size = {
	mobile: 375,
	tablet: 768,
	laptop: 1024,
	desktop: 1920,
}

export const device = {
	mobile: `(min-width: ${size.mobile}px)`,
	tablet: `(min-width: ${size.tablet}px)`,
	laptop: `(min-width: ${size.laptop}px)`,
	desktop: `(min-width: ${size.desktop}px)`,
}
