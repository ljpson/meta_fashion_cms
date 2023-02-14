import { useRef, useState } from 'react';
import styled from 'styled-components';

//antd
import { Tabs } from 'antd';

//components
import NormalButton from '../_a_atom/NormalButton';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';

import { TermsInterface } from '../../interface/terms';

const Terms = () => {
	//component state
	const [tab, setTab] = useState('tos');
	const tosRef = useRef<TermsInterface>(null);
	const privacyRef = useRef<TermsInterface>(null);
	//constant state
	let TAB = [
		{
			key: 'tos',
			title: '이용약관',
			children: tab == 'tos' ? <TermsOfService ref={tosRef} /> : '' ,
		},
		{
			key: 'privacy',
			title: '개인정보처리방침',
			children: tab == 'privacy' ? <PrivacyPolicy ref={privacyRef} /> : '',
		},
	];

	const save = () => {
		if (tab === 'tos' && tosRef.current) tosRef.current?.showAlert();
		else privacyRef.current?.showAlert();
	};
	const tabClick = (key: any) =>{
		setTab(key)
	}
	return (
		<TermsContainer>
			<Tabs
				style={{ width: '100%' }}
				defaultActiveKey="tos"
				tabBarExtraContent={
					<ButtonColumn>
						{/* <NormalButton
							style={{ marginRight: '15px', width: '100px' }}
							title="취소"
							onClick={() => {}}
						/> */}
						<NormalButton style={{ width: '100px' }} title="등록" type="primary" onClick={save} />
					</ButtonColumn>
				}
				items={TAB.map((item, idx) => {
					return {
						label: <span>{item.title}</span>,
						key: item.key,
						children: item.children,
					};
				})}
				onTabClick={(key) => {
					tabClick(key)
				}}
			/>
		</TermsContainer>
	);
};

const TermsContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	height: 100%;
	padding: 10px 10px;
`;

const ButtonColumn = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 100%;
`;

export default Terms;
