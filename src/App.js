import React from "react"
import ForceLayout from "./components/force-layout"
import { themes, links } from "./data/themes"

export default function App() {
	return (
		<main>
			{/* <h1>UAL Theme Visualiser</h1> */}
			<ForceLayout
				width={window.innerWidth}
				height={window.innerHeight}
				data={{ nodes: themes, links }}
			/>
		</main>
	)
}
