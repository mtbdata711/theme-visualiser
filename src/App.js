import React from "react"

import ForceLayout from "./components/force-layout"
import { UALLogo, Header, Nav, Main, Title, Subtitle } from "./components"
import { data, links } from "./data"

export default function App() {
	return (
		<>
			<Header padding={[3, 4, 5]}>
				<UALLogo />
			</Header>

			<Main>
				<Nav padding={[3, 4, 5]}>
					<Subtitle fontSize={[2, 3, 4]}>Graduation Showcase</Subtitle>
					<Title fontSize={[4, 5, 6]}>Theme Visualiser</Title>
				</Nav>

				<ForceLayout width={800} height={800} data={{ nodes: data, links }} />
			</Main>
		</>
	)
}
