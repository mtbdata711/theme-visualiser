import React from "react"

import ForceLayout from "./components/force-layout"
import { UALLogo, Header, Main, Title } from "./components"
import { data, links } from "./data"

export default function App() {
	const [state, setState] = React.useState(new Object())

	return (
		<>
			<Header padding={[1, 2, 3]}>
				<UALLogo />
				<Title>Theme Visualiser</Title>
			</Header>
			<Main padding={[1, 2, 3]}>
				<ForceLayout width={800} height={800} data={{ nodes: data, links }} />
			</Main>
		</>
	)
}
