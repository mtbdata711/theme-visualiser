import { useReducer, useState, useEffect } from "react"
import { motion } from "framer-motion"

import { SelectBox } from "./components/select-box"
import { ForceLayout } from "./components/force-layout"
import {
	UALLogo,
	Header,
	Main,
	LoadingBox,
	Title,
	Box,
	Flex,
	Tooltip,
	TooltipTitle,
	TooltipLabel,
} from "./components"
import { reducer } from "./helpers"
import { useWindowSize } from "./helpers/useWindowSize"
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
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const [tooltip, setTooltip] = useState(null)
	const [activeNodes, dispatch] = useReducer(reducer, [])
	const windowSize = useWindowSize()
	const isTablet = windowSize.width < size.laptop

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

	// console.log(tooltip)

	return (
		<>
			<Header padding={[2, 3, 4]}>
				<UALLogo />
			</Header>

			<Main>
				<Box padding={[2, 3, 4]}>
					<Title fontSize={[0, 1, 2]} fontWeight={600}>
						Graduate Showcase
					</Title>
					<Title fontSize={[4, 5, 6]}>Theme Visualiser</Title>
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
								activeNodes={activeNodes}
							/>

							<ForceLayout
								width={
									isTablet ? window.innerWidth - 40 : window.innerWidth - 400
								}
								height={0.65 * window.innerHeight}
								data={data}
								dispatch={dispatch}
								activeNodes={activeNodes}
								setTooltip={setTooltip}
							/>
						</>
					)}
				</Flex>

				{tooltip && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<Tooltip left={tooltip.x + 20} top={tooltip.y + 20}>
							<TooltipLabel fontWeight={600}>{tooltip.type}</TooltipLabel>
							<TooltipTitle>{tooltip.title}</TooltipTitle>
							<TooltipLabel>{tooltip.total} projects</TooltipLabel>
							<TooltipLabel>{tooltip.cta}</TooltipLabel>
						</Tooltip>
					</motion.div>
				)}
			</Main>
		</>
	)
}
