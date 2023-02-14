import { ReactElement, useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

//api
import { memberListAPI, memberDetailAPI, memberTabListAPI, memberDeleteAPI } from '../../api/member';

//antd
import { Table, Tabs, Modal, Input, Pagination } from 'antd';
const { TextArea } = Input;
import { FileImageOutlined } from '@ant-design/icons';

//interface & types
import { BoardDataInterface } from '../../interface/data';
import NormalModal from '../common/NormalModal';

//components
import NormalButton from '../_a_atom/NormalButton';
import { Key } from 'antd/lib/table/interface';

const Board = () => {
	const navigate = useNavigate();
	const BOARD_COLUMNS = [
		{
			title: '프로필 이미지',
			dataIndex: ['profile'],
			width: '6%',
			render: (profile: string[]): ReactElement => {
				return profile? (
					<img
						// 프리뷰를 보기 위한 임시 cors 처리
						crossOrigin="anonymous"
						alt="프로필 이미지"
						src={`${profile}`}
						style={{
							display: 'block',
							width: '60px',
							height: '60px',
							marginLeft: 'auto',
							marginRight: 'auto',
						}}
					/>
				) : (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							fontSize: '10px',
							fontWeight: 'bold',
						}}
					>
						<FileImageOutlined style={{ fontSize: '30px' }} />
						No Image
					</div>
				);
			},
		},
		{
			title: '닉네임',
			dataIndex: ['nickname'],
			width: '12%',
			onCell: (record: any, rowIndex: any) => {
				return {
					onClick: onClickRowCallback,
				};
			},
			render: (nickname: string) => {
				return <span style={{color:'#229bcd'}}>{nickname}</span>;
			},
		},
		{
			title: '이메일',
			dataIndex: ['email'],
			width: '15%',
			render: (email: string) => {
				return (
					<span style={{cursor:'default'}}>{email}</span>
				);
			},
		},
		{
			title: '성별',
			dataIndex: ['gender'],
			width: '6%',
			render: (gender: string) => {
				return <span style={{cursor:'default'}}>{ gender == 'FEMAIL' ? '여' : '남' }</span>;
			},
		},
		{
			title: '계정상태',
			dataIndex: ['status'],
			width: '10%',
			render: (status: string) => {
				return <span style={{cursor:'default'}}>{ status == 'JOIN' ? '가입' : '탈퇴' }</span>;
			},
		},
		{
			title: '가입일',
			dataIndex: 'createDate',
			width: '17%',
			render: (createDate: string) => {
				let getDate = ''
				if(createDate){
					const year = new Date (createDate).getFullYear()
					const month = new Date (createDate).getMonth() +1 < 10 ? ''+new Date (createDate).getMonth() +1 : new Date (createDate).getMonth() +1
					const date = new Date (createDate).getDate()
					getDate = year + '-' + month + '-' + date
				} else {
					getDate = '-'
				}
				return <span style={{cursor:'default'}}>{getDate}</span>;
			},
		},
		{
			title: '마지막 로그인',
			dataIndex: 'lastLogin',
			width: '20%',
			render: (lastLogin: string) => {
				let getDate = ''
				if(lastLogin){
					const year = new Date (lastLogin).getFullYear()
					const month = new Date (lastLogin).getMonth() +1 < 10 ? ''+new Date (lastLogin).getMonth() +1 : new Date (lastLogin).getMonth() +1
					const date = new Date (lastLogin).getDate()
					const hour = new Date (lastLogin).getHours() < 10 ? '0' + String(new Date (lastLogin).getHours()) : new Date (lastLogin).getHours()
					const minutes = new Date (lastLogin).getMinutes() < 10 ? '0' + String(new Date (lastLogin).getMinutes()) : new Date (lastLogin).getMinutes()
					const second= new Date (lastLogin).getSeconds() < 10 ? '0' + String(new Date (lastLogin).getSeconds()) : new Date (lastLogin).getSeconds()
					getDate = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + second
				} else {
					getDate = '-'
				}
				return <span style={{cursor:'default'}}>{lastLogin ? getDate : '-' }</span>;
			},
		},
		{
			title: '탈퇴구분/탈퇴일',
			dataIndex: 'leaveDate',
			width: '20%',
			render: (leaveDate: string, arr:any) => {
				let getDate = ''
				if(leaveDate){
					const year = new Date (leaveDate).getFullYear()
					const month = new Date (leaveDate).getMonth() +1 < 10 ? ''+new Date (leaveDate).getMonth() +1 : new Date (leaveDate).getMonth() +1
					const date = new Date (leaveDate).getDate()
					getDate = year + '-' + month + '-' + date
				} else {
					getDate = '-'
				}
				return <span>{(arr.leaveBy || '-') + ' / ' + getDate}</span>;
			},
		},
	];

	//component state
	const [originalData, setOriginalData] = useState([] as BoardDataInterface[]);
	const [boardData, setBoardData] = useState({} as any);
	const [tabData, setTabData] = useState([] as any);
	const [tabShowingData, setTabShowingData] = useState([] as BoardDataInterface[]);
	const [tabShowingData2, setTabShowingData2] = useState([] as BoardDataInterface[]);
	const [tabShowingData3, setTabShowingData3] = useState([] as BoardDataInterface[]);
	const [firstTabData, setFirstTabData] = useState(0);
	const [secondTabData, setSecondTabData] = useState(0);
	const [thirdTabData, setThirdTabData] = useState(0);
	const [activKey, setActivKey] = useState('1');
	const [profileImg, setProfileImg] = useState('');
	const [showingData, setShowingData] = useState([] as BoardDataInterface[]);
	const [selectedList, setSelectedList] = useState([] as BoardDataInterface[]);
	const [selectedKeyList, setSelectedKeyList] = useState([] as Key[]);
	const [clickId, setClickID] = useState(0);
	const [open, setOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [authorityData, setAuthorityData] = useState('' as any);
	const [modalState, setModalState] = useState({
		title: '',
		description: '',
		isOpen: false,
		onClickConfirm: () => {},
		onClickCancle: () => {},
		okText: '',
		cancelText: '',
	});
	

	//useEffect
	useEffect(() => {
		(async () => {
			await getContentList();
		})();
	}, []);

	//functions
	const getContentList = async () => {
		let result = await memberListAPI();
		setOriginalData(result);
		setShowingData(result);

		let idPermission = sessionStorage.getItem("authority")
		setAuthorityData(idPermission)
	};

	const onClickRowCallback = async (e: MouseEvent<HTMLElement>) => {

		// ID 저장
		const id = Number(e.currentTarget.parentElement?.getAttribute('data-row-key'));
		setClickID(id)
		setActivKey('1')

		// Tab관련 API
		let contentTab = await memberTabListAPI(id,'CONTENT')
		let designTab = await memberTabListAPI(id,'DESIGNER')
		let brandTab = await memberTabListAPI(id,'BRAND')
		// 탭 갯수 관련
		setFirstTabData(contentTab.length ? contentTab.length : 0)
		setSecondTabData(designTab.length ? designTab.length : 0)
		setThirdTabData(brandTab.length ? brandTab.length : 0)
		// Tab관련 API
		setTabShowingData(contentTab);
		setTabShowingData2(designTab);
		setTabShowingData3(brandTab);
		
		
		const firstColumn = [
			{
				title: '프로필 이미지',
				dataIndex: ['profile'],
				width: '6%',
				render: (profile: any): ReactElement => {
					
					return profile ? (
						<img
							// 프리뷰를 보기 위한 임시 cors 처리
							crossOrigin="anonymous"
							alt="프로필 이미지"
							src={`${profile}`}
							style={{
								display: 'block',
								width: '60px',
								height: '60px',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
						/>
					) : (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								fontSize: '10px',
								fontWeight: 'bold',
							}}
						>
							<FileImageOutlined style={{ fontSize: '30px' }} />
							No Image
						</div>
					);
				},
			},
			{
				title: '피드명',
				dataIndex: ['name'],
				width: '12%',
				render: (nickname: string) => {
					return <span>{nickname ? nickname : ''}</span>;
				},
			},
		];
		const secondColumn = [
			{
				title: '프로필 이미지',
				dataIndex: ['profile'],
				width: '6%',
				render: (profile: any): ReactElement => {
					return profile ? (
						<img
							// 프리뷰를 보기 위한 임시 cors 처리
							crossOrigin="anonymous"
							alt="프로필 이미지"
							src={`${profile}`}
							style={{
								display: 'block',
								width: '60px',
								height: '60px',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
						/>
					) : (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								fontSize: '10px',
								fontWeight: 'bold',
							}}
						>
							<FileImageOutlined style={{ fontSize: '30px' }} />
							No Image
						</div>
					);
				},
			},
			{
				title: '디자이너명',
				dataIndex: ['name'],
				width: '12%',
				render: (name: string) => {
					return <span>{name ? name : ''}</span>;
				},
			},
		];
		const thirdColumn = [
			{
				title: '프로필 이미지',
				dataIndex: ['profile'],
				width: '6%',
				render: (profile: any): ReactElement => {
					return profile ? (
						<img
							// 프리뷰를 보기 위한 임시 cors 처리
							crossOrigin="anonymous"
							alt="프로필 이미지"
							src={`${profile}`}
							style={{
								display: 'block',
								width: '60px',
								height: '60px',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
						/>
					) : (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								fontSize: '10px',
								fontWeight: 'bold',
							}}
						>
							<FileImageOutlined style={{ fontSize: '30px' }} />
							No Image
						</div>
					);
				},
			},
			{
				title: '브랜드 명',
				dataIndex: ['name'],
				width: '12%',
				render: (name: string) => {
					return <span>{name ? name : ''}</span>;
				},
			},
		];
		const firstItem = [
			{
				key: '1',
				label: `좋아요 한 피드(${contentTab.length})`,
				children: (
					<Table 
					rowKey={(render: any) => render.id}
					columns={firstColumn}
					dataSource={tabShowingData}
					pagination={{ pageSize: 10, position: ['bottomCenter'] }}
					bordered
					style={{ width: '100%',maxHeight:'400px',overflow:'auto' }}
					/>
				)
			},
			{
				key: '2',
				label: `팔로잉 한 디자이너(${designTab.length})`,
				children: (
					<Table 
					rowKey={(render: any) => render.id}
					columns={secondColumn}
					dataSource={tabShowingData2}
					pagination={{ pageSize: 10, position: ['bottomCenter'] }}
					bordered
					style={{ width: '100%',maxHeight:'400px',overflow:'auto' }}
					/>
				)
			},
			{
				key: '3',
				label: `팔로잉 한 브랜드(${brandTab.length})`,
				children: (
					<Table 
					rowKey={(render: any) => render.id}
					columns={thirdColumn}
					dataSource={tabShowingData3}
					pagination={{ pageSize: 10, position: ['bottomCenter'] }}
					bordered
					style={{ width: '100%',maxHeight:'400px',overflow:'auto' }}
					/>
				)
			},
		];
		setTabData(firstItem)
		let result = await memberDetailAPI(id)
		setProfileImg(result.profile)
		
		setBoardData(result)
		setOpen(true);
	};
	// 탭 변경 시
	const onChange = async (key: any) => {
		setActivKey(key)
		let id = clickId
		let contentTab = await memberTabListAPI(id,'CONTENT')
		let designTab = await memberTabListAPI(id,'DESIGNER')
		let brandTab = await memberTabListAPI(id,'BRAND')
		
		// Tab관련 API
		setTabShowingData(contentTab);
		setTabShowingData2(designTab);
		setTabShowingData3(brandTab);
		
		const firstColumn = [
			{
				title: '프로필 이미지',
				dataIndex: ['profile'],
				width: '6%',
				render: (profile: any): ReactElement => {
					
					return profile ? (
						<img
							// 프리뷰를 보기 위한 임시 cors 처리
							crossOrigin="anonymous"
							alt="프로필 이미지"
							src={`${profile}`}
							style={{
								display: 'block',
								width: '60px',
								height: '60px',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
						/>
					) : (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								fontSize: '10px',
								fontWeight: 'bold',
							}}
						>
							<FileImageOutlined style={{ fontSize: '30px' }} />
							No Image
						</div>
					);
				},
			},
			{
				title: '피드명',
				dataIndex: ['name'],
				width: '12%',
				render: (nickname: string) => {
					return <span>{nickname ? nickname : ''}</span>;
				},
			},
		];
		const secondColumn = [
			{
				title: '프로필 이미지',
				dataIndex: ['profile'],
				width: '6%',
				render: (profile: any): ReactElement => {
					return profile ? (
						<img
							// 프리뷰를 보기 위한 임시 cors 처리
							crossOrigin="anonymous"
							alt="프로필 이미지"
							src={`${profile}`}
							style={{
								display: 'block',
								width: '60px',
								height: '60px',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
						/>
					) : (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								fontSize: '10px',
								fontWeight: 'bold',
							}}
						>
							<FileImageOutlined style={{ fontSize: '30px' }} />
							No Image
						</div>
					);
				},
			},
			{
				title: '디자이너명',
				dataIndex: ['name'],
				width: '12%',
				render: (name: string) => {
					return <span>{name ? name : ''}</span>;
				},
			},
		];
		const thirdColumn = [
			{
				title: '프로필 이미지',
				dataIndex: ['profile'],
				width: '6%',
				render: (profile: any): ReactElement => {
					return profile ? (
						<img
							// 프리뷰를 보기 위한 임시 cors 처리
							crossOrigin="anonymous"
							alt="프로필 이미지"
							src={`${profile}`}
							style={{
								display: 'block',
								width: '60px',
								height: '60px',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
						/>
					) : (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								fontSize: '10px',
								fontWeight: 'bold',
							}}
						>
							<FileImageOutlined style={{ fontSize: '30px' }} />
							No Image
						</div>
					);
				},
			},
			{
				title: '브랜드 명',
				dataIndex: ['name'],
				width: '12%',
				render: (name: string) => {
					return <span>{name ? name : ''}</span>;
				},
			},
		];
		const firstItem = [
			{
				key: '1',
				label: `좋아요 한 피드(${firstTabData})`,
				children: (
					<Table 
					rowKey={(render: any) => render.id}
					columns={firstColumn}
					dataSource={tabShowingData}
					pagination={{ pageSize: 10, position: ['bottomCenter'] }}
					bordered
					style={{ width: '100%',maxHeight:'400px',overflow:'auto' }}
					/>
				)
			},
			{
				key: '2',
				label: `팔로잉 한 디자이너(${secondTabData})`,
				children: (
					<Table 
					rowKey={(render: any) => render.id}
					columns={secondColumn}
					dataSource={tabShowingData2}
					pagination={{ pageSize: 10, position: ['bottomCenter'] }}
					bordered
					style={{ width: '100%',maxHeight:'400px',overflow:'auto' }}
					/>
				)
			},
			{
				key: '3',
				label: `팔로잉 한 브랜드(${thirdTabData})`,
				children: (
					<Table 
					rowKey={(render: any) => render.id}
					columns={thirdColumn}
					dataSource={tabShowingData3}
					pagination={{ pageSize: 10, position: ['bottomCenter'] }}
					bordered
					style={{ width: '100%',maxHeight:'400px',overflow:'auto' }}
					/>
				)
			},
		];
		setTabData(firstItem)
	};

	// 삭제
	const onClickDelete = async () => {
		setModalState({
			title: '카테고리 삭제',
			description: '해당 카테고리를 삭제 하겠습니까?',
			isOpen: true,
			onClickConfirm: async () => {
				modalStateInit();
				let data = selectedKeyList?.map(ele=>{
					return {id: ele}
				})
				let res = await memberDeleteAPI(data);
				if (res.message === 'success') {
					await getContentList();
				}
			},
			onClickCancle: async ()=>{
				modalStateInit();
			},
			okText: 'Ok',
			cancelText: 'Cancel'
		});
	};

	// 모달초기화
	const modalStateInit = () => {
		setModalState({
			title: '',
			description: '',
			isOpen: false,
			onClickConfirm: () => {},
			onClickCancle: () => {},
			okText: '',
			cancelText: '',
		});
	};

	const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (value === '') {
			return setShowingData(originalData);
		}
		setSearchText(value);
	};

	const onClickSearchBtn = () => {
		const searchedList = originalData.filter((data: BoardDataInterface) =>
			data.nickname.includes(searchText)
		);
		setShowingData(searchedList);
	};
	const handleCancel = () => {
    setOpen(false);
		setActivKey('1')
  };

	return (
		<BoardContainer> 
			<NormalModal
				title={modalState.title}
				description={modalState.description}
				isOpen={modalState.isOpen}
				onClickConfirm={modalState.onClickConfirm}
				onClickCancle={modalStateInit}
				okText={'Ok'}
				cancelText={'Cancel'}

			/>
			<BoardHeader>
			<Modal
        open={open}
        title={`회원 상세정보`}
				onCancel={handleCancel}
				footer={[]}
      >
				<div style={{display:'grid',gridTemplateColumns:'120px 1fr'}}>
					<div style={{height:'120px',}}><img style={{width: '100%', height: '100%'}} src={profileImg}/></div>
					<div style={{display:'grid',gridTemplateColumns:'1fr',marginLeft:'20px'}}>
						<span><strong style={{fontWeight:'bold', fontSize:'16px'}}>닉네임 :</strong>  {boardData.nickname}</span>
						<span><strong style={{fontWeight:'bold', fontSize:'16px'}}>이메일 :</strong> {boardData.email}</span>
						<span><strong style={{fontWeight:'bold', fontSize:'16px'}}>성별 :</strong> {boardData.gender == 'FEMALE' ? '여' : '남'}</span>
					</div>
				</div>
				<div style={{marginTop:'30px'}}>

				{/* <div>
					<span style={{fontWeight:'bold', fontSize:'16px'}}>자기소개</span>
					<TextArea style={{marginTop:'10px'}}/>
				</div> */}
				</div>
				<Tabs defaultActiveKey="1" items={tabData} onChange={onChange}  activeKey={activKey} style={{marginTop:'10px'}}/>
				
      </Modal>
				<BtnColumn>
					<NormalButton
						style={{ width: '8%' }}
						title="탈퇴"
						type="primary"
						disabled={selectedList.length === 0  || authorityData == 'OPERATOR' ? true : false}
						onClick={async () => await onClickDelete()}
					/>
				</BtnColumn>
				<ListHeader>
					{/* <ListInfo>총 게시물 수 : {originalData.length}개</ListInfo> */}
					<ListInfo>총 게시물 수 : {originalData ? originalData.length: 0}개</ListInfo>
					<SearchCollumn>
						<SearchInput
							type="text"
							placeholder="검색어를 입력하세요"
							onChange={onChangeSearchInput}
						/>
						<NormalButton
							style={{ border: '1px solid grey' }}
							title="검색"
							onClick={onClickSearchBtn}
						/>
					</SearchCollumn>
				</ListHeader>
			</BoardHeader>
			<Table
				rowKey={(render: any) => render.id}
				columns={BOARD_COLUMNS}
				rowSelection={{
					type: 'checkbox',
					selectedRowKeys: selectedKeyList,
					preserveSelectedRowKeys: true,
					onChange: (selectedRowKeys: Key[], selectedArray: BoardDataInterface[]) => {
						setSelectedKeyList(selectedRowKeys);
						setSelectedList(selectedArray);
					},
				}}
				dataSource={showingData}
				pagination={{ pageSize: 10, position: ['bottomCenter'] }}
				bordered
				style={{ width: '100%' }}
			/>
		</BoardContainer>
	);
};

const BoardContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	height: 100%;
	padding: 10px 0px;
`;

const BoardHeader = styled.div`
	width: 100%;
	margin-top: 10px;
	padding: 0px 15px;
`;

const BtnColumn = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	margin-bottom: 20px;
`;

const ListHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 18px;
`;

const ListInfo = styled.span``;

const SearchCollumn = styled.div`
	display: flex;
	align-items: center;
`;

const SearchInput = styled.input`
	min-width: 380px;
	margin-right: 10px;
	padding: 5px 10px;
	font-size: 15px;
	border-radius: 10px;
	border: 1px solid grey;
	outline: none;
`;

export default Board;
