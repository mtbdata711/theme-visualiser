import { SelectWrapper, Box, Title, Label, Flex } from "./index"
import { colours } from "../styles"

export const SelectBox = ({ options, dispatch, activeNodes }) => {
	// console.log(height)
	return (
		<Flex padding={[null, null, null]} flexDirection={["column", "column"]}>
			<Box backgroundColor={colours.blue} padding={[1, 1, 1]}>
				<Title fontSize={[3, 4, 5]}>Themes</Title>
			</Box>
			<SelectWrapper
				width={["100%", "300px", "400px"]}
				height={["100%", "50vh", "400px"]}
				backgroundColor={colours.dark[0]}
			>
				<Box padding={[1, 1, 1]}>
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
								<span className="checkbox-custom"></span>
								<span className="checkbox-label">{`${option.title} (${option.weight})`}</span>
							</Label>
						))}
				</Box>
			</SelectWrapper>
		</Flex>
	)
}
