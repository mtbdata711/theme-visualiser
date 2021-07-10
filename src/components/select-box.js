import { useState } from "react"
import { SelectWrapper, Box, Title, Label, Flex } from "./index"
import { colours, size } from "../styles"
import { useWindowSize } from "../helpers/useWindowSize"

/**
 * The Select Box component renders the menu that holds the
 * checkboxes for the themes and allows the user to select themes.
 * This component uses the dispatch function to pass
 * the selected themes (activeNodes) upstream (back to App.js)
 * so that this updates the selected nodes in the force layout
 * graph.
 *
 * When the screen size is that of a tablet or mobile, a menu-button
 * is rendered in the top of the select-box. Indicating that the user
 * can toggle this button to view or hide the menu.
 *
 * The options are sorted based on weight (descending, or high-to-low),
 * and for each option a checkbox and label are rendered.
 */
export const SelectBox = ({ options, dispatch, activeNodes }) => {
	const { width } = useWindowSize()
	const isTablet = width < size.laptop
	const [showMenu, setShowMenu] = useState(false)

	return (
		<Flex
			padding={[null]}
			flexDirection={["column", "column"]}
			gap={[null]}
			className={showMenu ? "select-box-show" : "select-box-hide"}
		>
			<Box backgroundColor={colours.blue} padding={[1, null]}>
				<Flex
					padding={[null]}
					flexDirection={["row", null]}
					gap={[null]}
					justifyContent="space-between"
				>
					<Title fontSize={[3, 4, 5]}>Themes</Title>
					{isTablet && (
						<MenuButton showMenu={showMenu} setShowMenu={setShowMenu} />
					)}
				</Flex>
			</Box>

			<SelectWrapper
				width={["100%", "300px", null]}
				height={["100%", "55vh", null]}
				backgroundColor={colours.dark[0]}
			>
				<Box padding={[1, null]}>
					{options
						.sort((a, b) => b.weight - a.weight)
						.map((option) => (
							<Label
								htmlFor={option.id}
								key={option.id}
								padding=".2rem 0"
								className={
									activeNodes.includes(option.id) ? "selected" : "not-selected"
								}
							>
								<input
									type="checkbox"
									className="checkbox"
									name={option.title}
									id={option.id}
									value={option.title}
									checked={activeNodes.includes(option.id)}
									onChange={(event) =>
										dispatch({
											target: event.target,
											id: Number(event.target.id),
										})
									}
								/>
								<span className="checkbox-label">{`${option.title} (${option.weight})`}</span>
							</Label>
						))}
				</Box>
			</SelectWrapper>
		</Flex>
	)
}

/**
 * Menu-button component that is only rendered on mobile and tablet.
 */
const MenuButton = ({ showMenu, setShowMenu }) => (
	<button onClick={() => setShowMenu(!showMenu)} className="menu-toggle">
		<Box backgroundColor={colours.white} padding={[1, null]}>
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className={showMenu ? "menu-icon-up" : "menu-icon-down"}
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M0 8L1.41 9.41L7 3.83V16H9V3.83L14.58 9.42L16 8L8 0L0 8Z"
					fill={colours.blue}
				/>
			</svg>
		</Box>
	</button>
)
