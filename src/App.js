import React from "react"
import NetworkGraph from "./components/network-graph"
import { themes, links } from "./data/themes"

export default function App() {
	return (
		<main>
			<h1>UAL Theme Visualiser</h1>
			<NetworkGraph width={500} height={500} data={{ nodes: themes, links }} />
		</main>
	)
}
