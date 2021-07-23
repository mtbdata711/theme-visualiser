import styled from "styled-components"
import { theme, device, colours } from "../styles/index"

export const Header = ({ children, ...styles }) => (
	<StyledHeader styles={styles}>{children}</StyledHeader>
)

const StyledHeader = styled.header`
	background-color: ${() => colours.black};

	@media ${device.mobile} {
		padding: ${(p) => theme.spaces[p.styles.padding[0]]};
	}

	@media ${device.laptop} {
		padding: ${(p) => theme.spaces[p.styles.padding[1]]};
	}

	@media ${device.desktop} {
		padding: ${(p) => theme.spaces[p.styles.padding[2]]};
	}
`

export const Main = ({ children, ...styles }) => (
	<StyledMain styles={styles}>{children}</StyledMain>
)

const StyledMain = styled.main`
	width: 100%;
`

export const Box = ({ children, ...styles }) => (
	<StyledBox styles={styles}>{children}</StyledBox>
)

const StyledBox = styled.div`
	background-color: ${(p) => p.styles.backgroundColor};

	@media ${device.mobile} {
		padding: ${(p) => theme.spaces[p.styles.padding[0]]};
	}

	@media ${device.laptop} {
		padding: ${(p) => theme.spaces[p.styles.padding[1]]};
	}

	@media ${device.desktop} {
		padding: ${(p) => theme.spaces[p.styles.padding[2]]};
	}
`

export const Flex = ({ children, className, ...styles }) => (
	<StyledFlex className={className} styles={styles}>
		{children}
	</StyledFlex>
)

const StyledFlex = styled.div`
	display: flex;
	justify-content: ${(p) => p.styles.justifyContent ?? null};

	@media ${device.mobile} {
		padding: ${(p) => theme.spaces[p.styles.padding[0]]};
		flex-direction: ${(p) => p.styles.flexDirection[0]};
		gap: ${(p) => theme.spaces[p.styles.gap[0]]};
	}

	@media ${device.laptop} {
		padding: ${(p) => theme.spaces[p.styles.padding[1]]};
		flex-direction: ${(p) => p.styles.flexDirection[1]};
		gap: ${(p) => theme.spaces[p.styles.gap[1]]};
	}

	@media ${device.desktop} {
		padding: ${(p) => theme.spaces[p.styles.padding[2]]};
		gap: ${(p) => theme.spaces[p.styles.gap[2]]};
	}
`

export const Title = ({ children, ...styles }) => (
	<StyledTitle styles={styles}>{children}</StyledTitle>
)

const StyledTitle = styled.h1`
	color: ${() => colours.white};
	margin: 0;
	font-weight: ${(p) => p.fontWeight ?? "auto"};

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

export const SelectWrapper = ({ children, ...styles }) => {
	return <StyledSelectWrapper styles={styles}>{children}</StyledSelectWrapper>
}

const StyledSelectWrapper = styled.div`
	background-color: ${() => colours.dark[1]};
	overflow: scroll;
	border-top: ${() => `1px solid ${colours.white}`};
	border-bottom: ${() => `1px solid ${colours.white}`};

	@media ${device.mobile} {
		width: ${(p) => p.styles.width[0]};
		height: ${(p) => p.styles.height[0]};
	}

	@media ${device.laptop} {
		width: ${(p) => p.styles.width[1]};
		height: ${(p) => p.styles.height[1]};
	}

	@media ${device.desktop} {
		width: ${(p) => p.styles.width[2]};
		height: ${(p) => p.styles.height[2]};
	}
`

export const GraphWrapper = ({ children, width, height }) => {
	return (
		<StyledGraphWrapper width={width} height={height}>
			{children}
		</StyledGraphWrapper>
	)
}

const StyledGraphWrapper = styled.div`
	width: ${(p) => `${p.width}px`};
	height: ${(p) => `${p.height}px`};

	& svg .node:hover {
		cursor: pointer;
	}

	& svg .button:hover {
		cursor: pointer;
	}
`

export const Label = ({ children, className, ...styles }) => (
	<StyledLabel className={className} styles={styles}>
		{children}
	</StyledLabel>
)

const StyledLabel = styled.label`
	color: ${() => colours.white};
	display: block;
	padding: ${(p) => p.styles.padding};
	display: flex;
	align-items: center;
`

export const UALLogo = () => (
	<svg
		aria-hidden="true"
		role="img"
		aria-label="UAL"
		width="62"
		height="28"
		viewBox="0 0 62 28"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		id="ual-logo"
	>
		<path
			d="M18.6227 27.4446H13.4497V24.6673H13.3236C11.9357 26.8892 9.5637 27.9748 7.24217 27.9748C1.46357 27.9748 0 24.7178 0 19.7945V7.57446H5.45055V18.8098C5.45055 22.0668 6.40944 23.6827 8.95808 23.6827C11.9105 23.6827 13.1722 22.0416 13.1722 18.0019V7.57446H18.6227V27.4446V27.4446Z"
			fill="white"
		></path>
		<path
			d="M22.258 13.6844C22.5608 8.58432 27.1281 7.04419 31.5945 7.04419C35.5563 7.04419 40.3255 7.92787 40.3255 12.6997V23.0514C40.3255 24.8693 40.5274 26.6619 41.0068 27.4698H35.4806C35.2787 26.8638 35.1273 26.2074 35.1021 25.551C33.3609 27.3688 30.8375 28 28.4151 28C24.6552 28 21.6523 26.1064 21.6523 22.0415C21.6523 17.5473 25.0337 16.4617 28.4151 16.0072C31.746 15.5023 34.875 15.6285 34.875 13.3814C34.875 11.0334 33.26 10.6799 31.3422 10.6799C29.273 10.6799 27.9104 11.5131 27.7337 13.6844H22.258ZM34.8497 17.7241C33.9161 18.532 31.9983 18.5573 30.3076 18.8855C28.6169 19.239 27.0777 19.8197 27.0777 21.8143C27.0777 23.8593 28.6422 24.3391 30.4086 24.3391C34.6731 24.3391 34.8245 20.9558 34.8245 19.7692V17.7241H34.8497Z "
			fill="white"
		></path>
		<path d="M44.4883 0H49.9388V27.4446H44.4883V0Z" fill="white"></path>
		<path
			d="M61.9997 13.836H55.9688V7.90271H61.9997V13.836ZM55.9688 21.5114H61.9997V27.4194H55.9688V21.5114Z"
			fill="white"
		></path>
	</svg>
)
