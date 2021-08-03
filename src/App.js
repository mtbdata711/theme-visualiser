import { useReducer, useState, useEffect } from "react"
import { SelectBox } from "./components/select-box"
import { ForceGraph } from "./components/force-graph"
import {
	UALLogo,
	Header,
	Main,
	LoadingBox,
	Flex,
	Tooltip,
	Title,
	Box,
} from "./components"
import { reducer, calculateMargins } from "./helpers"
import { useWindowSize } from "./helpers/useWindowSize"
import { size, theme } from "./styles"

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
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [activeIds, dispatch] = useReducer(reducer, [])
	const windowSize = useWindowSize()

	useEffect(() => {
		fetch(
			"https://integrations.arts.ac.uk/showcase-staging/v2/public/api/data/sum_themes"
		)
			.then((response) => {
				if (response.ok) return response.json()
				throw response
			})
			.then((data) => setData(data))
			.catch((error) => {
				console.error(error)
				setError(error)
			})
			.finally(() => setLoading(false))
	}, [])

	const margin = calculateMargins(windowSize.width, Object.values(size), [
		theme.margins[2],
		theme.margins[3],
		theme.margins[4],
	])

	const width = window.innerWidth - margin.right - margin.left
	const height = window.innerHeight - margin.top - margin.bottom

	return (
		<>
			<Header padding={[2, 3, 4]}>
				<UALLogo />
			</Header>

			<Main>
				<Box padding={[2, 3, 4]}>
					<Title fontSize={[1, 2, 3]}>Graduate Show</Title>
					<Title fontSize={[3, 4, 5]}>Theme Visualizer</Title>
				</Box>

				<Flex
					padding={[2, 3, 4]}
					flexDirection={["column-reverse", "row"]}
					gap={[2, 3, 4]}
				>
					{loading && <LoadingBox />}
					{!loading && !error && (
						<>
							<SelectBox
								options={data}
								dispatch={dispatch}
								activeIds={activeIds}
								height={height}
							/>

							<ForceGraph
								width={windowSize.width >= size.laptop ? width - 240 : width}
								height={height}
								data={data}
								dispatch={dispatch}
								activeIds={activeIds}
							/>
						</>
					)}
				</Flex>

				<Tooltip />
			</Main>
		</>
	)
}
