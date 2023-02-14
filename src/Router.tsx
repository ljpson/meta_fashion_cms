import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'antd/dist/antd.css';

//components
import Login from './components/_d_pages/Login';
import Template from './components/_c_template/Template';
import Board from './components/_d_pages/Board';
import Category from './components/_d_pages/Category';
import Terms from './components/_d_pages/Terms';
import Brand from './components/_d_pages/Brand';
import BrandDetail from './components/_d_pages/BrandDetail';
import Designer from './components/_d_pages/Designer';
import Member from './components/_d_pages/Member';
import Popup from './components/_d_pages/Popup';
import PopupDetail from './components/_d_pages/PopupDetail';
import Permission from './components/_d_pages/Permission';
import BoardDetail from './components/_d_pages/BoardDetail';
import DesignerDetail from './components/_d_pages/DesignerDetail';
import NotFound from './components/common/NotFound';
import { useEffect } from 'react';

const Router = () => {
	// 임시
	useEffect(() => {
		sessionStorage.setItem(
			'accessToken',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOjksImlhdCI6MTY3MDkxMzA5MywiZXhwIjoxNjcxNzc3MDkzLCJpc3MiOiJzZXJ2ZXIuY21zIiwic3ViIjoic2Vzc2lvbiJ9.3i1VYHuEWIOCsL4rMBvP7VfsgQc_zBUVu_0hz_CpO4o'
		);
	}, []);
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/" element={<Template />}>

					{/* 카테고리 */}
					<Route path="/category" element={<Category />} />

					{/* 게시판 */}
					<Route path="/board" element={<Board />} />
					<Route path="/board/detail/" element={<BoardDetail />} />
					<Route path="/board/detail/:id" element={<BoardDetail />} />

					{/* 디자이너 */}
					<Route path="/designer" element={<Designer />} />
					<Route path="/designer/detail/" element={<DesignerDetail />} />
					<Route path="/designer/detail/:id" element={<DesignerDetail />} />

					 {/* 브랜드 */}
					<Route path="/brand" element={<Brand />} />
					<Route path="/brand/detail/" element={<BrandDetail />} />
					<Route path="/brand/detail/:id" element={<BrandDetail />} />

					{/* 약관 */}
					<Route path="/terms" element={<Terms />} />

					{/* 회원 */}
					<Route path="/member" element={<Member />} />

					{/* 팝업 */}
					<Route path="/popup" element={<Popup />} />
					<Route path="/popup/detail/" element={<PopupDetail />} />
					<Route path="/popup/detail/:id" element={<PopupDetail />} />
					
					{/* 권한 */}
					<Route path="/permission" element={<Permission />} />
				</Route>
				<Route path="*" element={<NotFound />}></Route>
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
