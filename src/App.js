import React from "react"
import ForceLayout from "./components/force-layout"
import { themes } from "./data/themes"

export default function App() {
	const margin = { top: 20, right: 20, bottom: 20, left: 20 }
	return (
		<main>
			<ForceLayout
				width={window.innerWidth - margin.left - margin.right}
				height={window.innerHeight - margin.top - margin.bottom}
				data={{ nodes: themes }}
			/>
		</main>
	)
}
