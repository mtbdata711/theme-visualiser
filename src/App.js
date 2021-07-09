import React from "react"
import { SelectBox } from "./components/select-box"
import { ForceLayout } from "./components/force-layout"
import { UALLogo, Header, Nav, Main, Flex, Title, Subtitle } from "./components"
import { reducer } from "./helpers/"
// import { useWindowSize } from "./helpers/useWindowSize"
import { data } from "./data"
import { size } from "./styles"

export const App = () => {
	const [activeNodes, dispatch] = React.useReducer(reducer, [])
	// const { width, height } = useWindowSize()

	const width =
		window.innerWidth <= size.laptop
			? window.innerWidth - 50
			: (3 / 4) * window.innerWidth

	const height =
		window.innerHeight <= size.laptop ? (3 / 4) * window.innerHeight : 700

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

				<Flex
					padding={[2, 3, 4]}
					flexDirection={["column", "row"]}
					gap={[2, 3, 4]}
				>
					<SelectBox
						options={data}
						dispatch={dispatch}
						activeNodes={activeNodes}
					/>

					<ForceLayout
						width={width}
						height={height}
						data={data}
						dispatch={dispatch}
						activeNodes={activeNodes}
					/>
				</Flex>
			</Main>
		</>
	)
}
