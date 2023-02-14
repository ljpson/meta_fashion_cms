import { useNavigate, useLocation, Outlet, redirect } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

//antd
import { Layout, Menu, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
const { Header, Sider, Content } = Layout;

const Template = () => {
	//constant state
	const navigate = useNavigate();
	const { pathname } = useLocation();

	//component state
	const [selectedKey, setSelectedKey] = useState(1);
	const [authority, setAuthority] = useState('' as any);
	const [userId, setUserId] = useState('' as any);
	const [sideMenu, setSideMenu] = useState([
		{ id: 1, title: '카테고리 관리', route: '/category' },
		{ id: 2, title: '게시글 관리', route: '/board' },
		{ id: 3, title: '디자이너 관리', route: '/designer' },
		{ id: 4, title: '브랜드 관리', route: '/brand' },
		{ id: 5, title: '약관 관리', route: '/terms' },
		{ id: 6, title: '회원 관리', route: '/member' },
		{ id: 7, title: '팝업 관리', route: '/popup' },
		{ id: 8, title: '권한 관리', route: '/permission' },
	] as any);

	//useEffect
	useEffect(() => {
		let authorityData =  sessionStorage.getItem('authority');
		let userId =  sessionStorage.getItem('userId');
		setAuthority(authorityData)
		setUserId(userId)
		if(authorityData != 'DESIGNER'){
			if (pathname === '/') {
				navigate('/category');
			} else {
				const key = sideMenu.filter((item:any) => pathname.includes(item.route) === true)[0].id;
				setSelectedKey(key);
			}
		} else {
			setSideMenu([{ id: 1, title: '게시글 관리', route: '/board' }])
			setSelectedKey(1);
		}
	}, [pathname]);
	const onClickLogout = () =>{
		sessionStorage.removeItem('accessToken');
		sessionStorage.removeItem('password');
		sessionStorage.removeItem('userId');
		sessionStorage.removeItem('authority');
		navigate('/');
	}
	const onClickMenu = (item:any) => {
		if(authority != 'DESIGNER'){
			navigate(item)
		} else {
			alert('메뉴 권한이 없습니다.')
			return 
		}
	}
	return (
		<Layout className="site-layout" style={{ minHeight: '100vh' }}>
			<Sider collapsedWidth="0">
				<div style={{ width: '100%', height: '64px', backgroundImage: 'url(/public_assets/test.jpg)', backgroundSize: 'cover' }}></div>
				<Menu
					theme="dark"
					mode="inline"
					defaultSelectedKeys={[`${selectedKey}`]}
					selectedKeys={[`${selectedKey}`]}
					items={sideMenu.map((elem:any) => ({
						key: elem.id,
						label: elem.title,
						onClick: () => onClickMenu(elem.route),
					}))}
				/>
			</Sider>
			<Layout>
				<Header
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						backgroundColor: '#EFF2F5',
						padding: '0px 15px',
					}}
				>
					<HeaderTitle>{sideMenu[selectedKey - 1].title}</HeaderTitle>
					<HeaderInfo>
						안녕하세요&nbsp;<span style={{ fontWeight: 'bold' }}>{userId}</span>&nbsp;님
						<Button
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								marginLeft: '15px',
								border: '1px solid red',
								background: 'transparent',
							}}
							danger
							shape="circle"
							onClick={() => onClickLogout()}
						>
							<LogoutOutlined />
						</Button>
					</HeaderInfo>
				</Header>
				<Content>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
};

const HeaderTitle = styled.div`
	font-weight: bold;
	font-size: 1.2rem;
`;
const HeaderInfo = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export default Template;
