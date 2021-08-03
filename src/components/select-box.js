import { SelectWrapper, Box, Label } from "./index"

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
 * The options are sorted based on total (descending, or high-to-low),
 * and for each option a checkbox and label are rendered.
 */
export const SelectBox = ({ options, dispatch, activeIds }) => (
	<SelectWrapper width={["100%", null]} height={["100%", null]}>
		<Box padding={[null]}>
			{options
				.sort((a, b) => b.total - a.total)
				.map((option) => (
					<Label htmlFor={option.id} key={option.id} padding=".2rem 0">
						<input
							type="checkbox"
							className="checkbox"
							name={option.title}
							id={option.id}
							value={option.title}
							checked={activeIds.includes(option.id)}
							onChange={(event) =>
								dispatch({
									target: event.target,
									id: Number(event.target.id),
								})
							}
						/>
						<span className="checkbox-label">{`${option.title} (${option.total})`}</span>
					</Label>
				))}
		</Box>
	</SelectWrapper>
)
