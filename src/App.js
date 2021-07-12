import { useReducer } from "react"
import { SelectBox } from "./components/select-box"
import { ForceLayout } from "./components/force-layout"
import { UALLogo, Header, Main, Title, Box, Flex } from "./components"
import { reducer } from "./helpers"
import { useWindowSize } from "./helpers/useWindowSize"
import { data } from "./data"
import { size } from "./styles"

/**
 * This is the main page that holds all the components of the app.
 *
 * App does the following:
 * - It keeps track of the selected themes (activeNodes) through a useReducer method,
 *	 the reducer method is defined in the helpers file (helpers/index.js).
 * - App imports the functional components used on the page; these are
 *   SelectBox and ForceLayout.
 * - App imports the styled components from the components file (components/index.js),
 *   and renders these on the page.
 */
export const App = () => {
	const [activeNodes, dispatch] = useReducer(reducer, [])
	const windowSize = useWindowSize()
	const isTablet = windowSize.width < size.laptop

	return (
		<>
			<Header padding={[2, 3, 4]}>
				<UALLogo />
			</Header>

			<Main>
				<Box padding={[2, 3, 4]}>
					<Title fontSize={[0, 1, 2]} fontWeight={600}>
						Graduation Showcase
					</Title>
					<Title fontSize={[4, 5, 6]}>Theme Visualiser</Title>
				</Box>

				<Flex
					padding={[2, 3, 4]}
					flexDirection={["column-reverse", "row"]}
					gap={[2, 3, 4]}
				>
					<SelectBox
						options={data}
						dispatch={dispatch}
						activeNodes={activeNodes}
					/>

					<ForceLayout
						width={isTablet ? window.innerWidth - 40 : window.innerWidth - 400}
						height={0.65 * window.innerHeight}
						data={data}
						dispatch={dispatch}
						activeNodes={activeNodes}
					/>
				</Flex>
			</Main>
		</>
	)
}
