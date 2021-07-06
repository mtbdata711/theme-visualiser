import { ForceLayout } from "./components/force-layout"
import { UALLogo, Header, Nav, Main, Title, Subtitle } from "./components"
import { data } from "./data"

export const App = () => (
	<>
		<Header padding={[3, 4, 5]}>
			<UALLogo />
		</Header>

		<Main>
			<Nav padding={[3, 4, 5]}>
				<Subtitle fontSize={[0, 1, 2]}>Graduation Showcase</Subtitle>
				<Title fontSize={[4, 5, 6]}>Theme Visualiser</Title>
			</Nav>

			<ForceLayout width={window.innerWidth} height={800} data={data} />
		</Main>
	</>
)
