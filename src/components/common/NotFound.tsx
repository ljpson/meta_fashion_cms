import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

//components
import NormalButton from '../_a_atom/NormalButton';

const NotFound = () => {
	//constant state
	const navigate = useNavigate();

	return (
		<NotFoundContainer>
			존재하지 않는 페이지 입니다.
			<NormalButton
				style={{ marginTop: '40px', fontWeight: 'bold' }}
				title="홈으로"
				type="primary"
				size="large"
				onClick={() => navigate('/')}
			/>
		</NotFoundContainer>
	);
};

const NotFoundContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100vh;
	font-size: 1.6rem;
	font-weight: bold;
`;

export default NotFound;
