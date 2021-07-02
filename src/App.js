import React from "react"
import styled from "styled-components"

import ForceLayout from "./components/force-layout"
import UALLogo from "./components/ual-logo"
import { data, links } from "./data"
import { theme, device } from "./styles/theme"
import { colours } from "./styles/index"

export default function App() {
	return (
		<>
			<Header padding={[1, 2, 3]}>
				<UALLogo />
				<Title>Theme Visualiser</Title>
			</Header>
			<PageWrapper padding={[1, 2, 3]}>
				<ForceLayout width={800} height={800} data={{ nodes: data, links }} />
			</PageWrapper>
		</>
	)
}

const Header = styled.header`
	width: 100%;
	display: flex;

	@media ${device.mobile} {
		padding: ${(p) => theme.spaces[p.padding[0]]};
	}

	@media ${device.laptop} {
		padding: ${(p) => theme.spaces[p.padding[1]]};
	}

	@media ${device.desktop} {
		padding: ${(p) => theme.spaces[p.padding[2]]};
	}
`

const Title = styled.h1`
	color: ${() => colours.white};
	margin: 0;
	margin-top: -4px;
	margin-left: 12px;
	font-size: 30px;
`

const PageWrapper = styled.main`
	width: 100%;

	@media ${device.mobile} {
		padding: ${(p) => theme.spaces[p.padding[0]]};
	}

	@media ${device.laptop} {
		padding: ${(p) => theme.spaces[p.padding[1]]};
	}

	@media ${device.desktop} {
		padding: ${(p) => theme.spaces[p.padding[2]]};
	}
`
