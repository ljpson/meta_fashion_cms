import styled, { keyframes } from 'styled-components';

const Loading = () => {
	return (
		<LoadingContainer>
			<SpinBody>
				<Dot style={{ animationDelay: '0.05s' }} />
				<Dot style={{ animationDelay: '0.1s' }} />
				<Dot style={{ animationDelay: '0.15s' }} />
				<Dot style={{ animationDelay: '0.2s' }} />
				<Dot style={{ animationDelay: '0.25s' }} />
				<Dot style={{ animationDelay: '0.3s' }} />
				<Dot style={{ animationDelay: '0.35s' }} />
				<Dot style={{ animationDelay: '0.4s' }} />
			</SpinBody>
		</LoadingContainer>
	);
};

const LoadingAnimation = keyframes`
    0%{
        transform: rotate(0deg)
    }
    100%{
        transform: rotate(360deg)
    }
`;

const LoadingContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
`;

const SpinBody = styled.div`
	display: inline-block;
	position: relative;
	width: 40px;
	height: 40px;
`;

const Dot = styled.div`
	display: block;
	position: absolute;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background-color: #1891ff;
	transform-origin: 22px 22px;
	animation: ${LoadingAnimation} 1.3s infinite;
`;

export default Loading;
