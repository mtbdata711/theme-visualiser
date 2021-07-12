// import { useState } from "react"
import { SelectWrapper, Box, Title, Label } from "./index"
// import { useWindowSize } from "../helpers/useWindowSize"

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
	return (
		<SelectWrapper
			width={["100%", "300px", null]}
			height={["100%", "65vh", null]}
		>
			<Title fontSize={[0, 1, 2]} fontWeight={600}>
				Select themes
			</Title>
			<Box padding={[null]}>
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
	)
}

/**
 * Menu-button component that is only rendered on mobile and tablet.
 */
// const MenuButton = ({ showMenu, setShowMenu }) => (
// 	<button onClick={() => setShowMenu(!showMenu)} className="menu-toggle">
// 		<Box backgroundColor={colours.white} padding={[1, null]}>
// 			<svg
// 				width="16"
// 				height="16"
// 				viewBox="0 0 16 16"
// 				fill="none"
// 				xmlns="http://www.w3.org/2000/svg"
// 				className={showMenu ? "menu-icon-up" : "menu-icon-down"}
// 			>
// 				<path
// 					fillRule="evenodd"
// 					clipRule="evenodd"
// 					d="M0 8L1.41 9.41L7 3.83V16H9V3.83L14.58 9.42L16 8L8 0L0 8Z"
// 					fill={colours.blue}
// 				/>
// 			</svg>
// 		</Box>
// 	</button>
// )
