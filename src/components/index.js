import styled from "styled-components"
import { theme, device } from "../styles/theme"

export const Flex = ({ children, ...styles }) => (
	<StyledFlex styles={styles}>{children}</StyledFlex>
)

const StyledFlex = styled.div`
	display: flex;
	width: ${(p) => p.styles.width};
	margin: ${(p) => p.styles.margin};
	justify-content: ${(p) => p.styles.justifyContent};

	@media ${device.mobile} {
		gap: ${() => theme.spaces[0]};
		flex-direction: ${(p) => p.styles.flexDirection[0]};
	}

	@media ${device.tablet} {
		gap: ${() => theme.spaces[2]};
		flex-direction: ${(p) => p.styles.flexDirection[1]};
	}
`

export const FlexCell = ({ children, ...styles }) => (
	<StyledFlexCell styles={styles}>{children}</StyledFlexCell>
)

const StyledFlexCell = styled.div`
	flex-basis: ${(p) => p.styles.flexBasis};
`

export const Caption = ({ children, ...styles }) => (
	<StyledCaption styles={styles}>{children}</StyledCaption>
)

const StyledCaption = styled.p`
	width: 100%;
	font-size: ${(p) => theme.sizes[1]};
	color: ${({ theme }) => theme.transparent};
	margin: ${() => theme.spaces[0]} auto;
`

export const Title = ({ children, ...styles }) => (
	<StyledTitle styles={styles}>{children}</StyledTitle>
)

const StyledTitle = styled.h1`
	margin: ${() => theme.spaces[1]} auto;

	@media ${device.mobile} {
		font-size: ${(p) => theme.sizes[p.styles.fontSize[0]]};
	}

	@media ${device.laptop} {
		font-size: ${(p) => theme.sizes[p.styles.fontSize[1]]};
	}

	@media ${device.desktop} {
		font-size: ${(p) => theme.sizes[p.styles.fontSize[2]]};
	}
`

export const Description = ({ children, ...styles }) => (
	<StyledDescription styles={styles}>{children}</StyledDescription>
)

const StyledDescription = styled.p`
	margin: 0;
	max-width: 38rem;

	@media ${device.mobile} {
		font-size: ${(p) => theme.sizes[p.styles.fontSize[0]]};
	}

	@media ${device.laptop} {
		font-size: ${(p) => theme.sizes[p.styles.fontSize[1]]};
	}

	@media ${device.desktop} {
		font-size: ${(p) => theme.sizes[p.styles.fontSize[2]]};
	}
`

export const Button = ({ children, ...styles }) => (
	<StyledButton styles={styles}>{children}</StyledButton>
)

const StyledButton = styled.a`
	background-color: ${({ theme }) => theme.body};
	border: 1px solid;
	color: ${({ theme }) => theme.transparent};
	border-color: ${({ theme }) => theme.transparent};
	transition: all 0.25s linear;
	border-radius: 8px;
	color: inherit;
	text-decoration: none;
	text-align: center;

	& :hover {
		border-color: ${({ theme }) => theme.text};
		color: ${({ theme }) => theme.text};
	}
`
