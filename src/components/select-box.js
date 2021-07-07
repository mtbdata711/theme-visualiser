import { SelectWrapper, Box, Title, Label } from "./index"
import { colours } from "../styles"

export const SelectBox = ({ options, dispatch, activeNodes }) => {
	return (
		<SelectWrapper
			width={["100%", "300px", "400px"]}
			backgroundColor={colours.dark[0]}
		>
			<Box backgroundColor={colours.blue} padding={[1, 1, 1]}>
				<Title fontSize={[3, 4, 5]}>Themes</Title>
			</Box>
			<Box padding={[1, 1, 1]}>
				{options.map((option) => (
					<Label htmlFor={option.id} key={option.id} padding=".2rem 0">
						<input
							type="checkbox"
							name={option.title}
							id={option.id}
							value={option.title}
							checked={activeNodes.includes(option.id)}
							onChange={(event) =>
								dispatch({
									target: event.target,
									id: Number(event.target.id),
									event,
								})
							}
						/>
						{option.title}
					</Label>
				))}
			</Box>
		</SelectWrapper>
	)
}
