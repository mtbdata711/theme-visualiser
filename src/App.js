import { useReducer } from "react"
import { SelectBox } from "./components/select-box"
import { ForceLayout } from "./components/force-layout"
import { UALLogo, Header, Nav, Main, Flex, Title, Subtitle } from "./components"
import { reducer } from "./helpers"
import { data } from "./data"
// import { size } from "./styles"

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
	// const [windowSize, setWindowSize] = React.useState({
	// 	width: 400,
	// 	height: 400,
	// })

	// React.useEffect(() => {
	// 	function handleResize() {
	// 		setWindowSize({
	// 			width: window.innerWidth,
	// 			height: window.innerHeight,
	// 		})
	// 	}

	// 	window.addEventListener("resize", handleResize)
	// 	handleResize()
	// 	return () => window.removeEventListener("resize", handleResize)
	// }, [])

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
					flexDirection={["column-reverse", "row"]}
					gap={[2, 3, 4]}
				>
					<SelectBox
						options={data}
						dispatch={dispatch}
						activeNodes={activeNodes}
					/>
					<ForceLayout
						width={1000}
						height={500}
						data={data}
						dispatch={dispatch}
						activeNodes={activeNodes}
					/>
				</Flex>
			</Main>
		</>
	)
}
