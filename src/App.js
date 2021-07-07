import React from "react"
import { SelectBox } from "./components/select-box"
import { ForceLayout } from "./components/force-layout"
import { UALLogo, Header, Nav, Main, Flex, Title, Subtitle } from "./components"
import { reducer } from "./helpers"
import { data } from "./data"

export const App = () => {
	const [activeNodes, dispatch] = React.useReducer(reducer, [])

	console.log(activeNodes)

	return (
		<>
			<Header padding={[2, 3, 4]}>
				<UALLogo />
			</Header>

			<Main>
				<Nav padding={[2, 3, 4]}>
					<Subtitle fontSize={[0, 1, 2]}>Graduation Showcase</Subtitle>
					<Title fontSize={[4, 5, 6]}>Theme Visualiser</Title>
				</Nav>

				<Flex padding={[2, 3, 4]} flexDirection={["column", "row"]}>
					<SelectBox options={data} dispatch={dispatch} />

					<ForceLayout
						width={(2 / 3) * window.innerWidth}
						height={700}
						data={data}
						activeNodes={activeNodes}
					/>
				</Flex>
			</Main>
		</>
	)
}
