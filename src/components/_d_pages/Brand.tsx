import { ReactElement, useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

//api
import { brandListAPI, brandShowAPI, brandDeleteAPI } from '../../api/brand';

//antd
import { Table, Modal } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

//interface & types
import { BoardDataInterface } from '../../interface/data';
import { Key } from 'antd/lib/table/interface';

//components
import NormalButton from '../_a_atom/NormalButton';
import NormalModal from '../common/NormalModal';

const Board = () => {
	const navigate = useNavigate();
	const BOARD_COLUMNS = [
		{
			title: '썸네일',
			dataIndex: ['profile'],
			width: '10%',
			render: (profile: string[]): ReactElement => {
				return profile ? (
					<img
						// 프리뷰를 보기 위한 임시 cors 처리
						crossOrigin="anonymous"
						alt="썸네일 이미지"
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
			title: '브랜드명',
			dataIndex: ['name'],
			width: '35%',
			onCell: (record: any, rowIndex: any) => {
				return {
					onClick: onClickRowCallback,
				};
			},
			render: (name: string) => {
				return <span style={{color:'#229bcd'}}>{name}</span>;
			},
		},
		{
			title: '팔로워',
			dataIndex: ['followers'],
			width: '15%',
			render: (followers: string) => {
				return (
					<span>
						{followers}
					</span>
				);
			},
		},
		{
			title: '노출 여부',
			dataIndex: 'showYn',
			width: '6%',
			render: (showYn: string) => {
				return <span>{showYn=='Y' ? '노출' : '비노출'}</span>;
			},
		},
		{
			title: '작성자/작성일',
			dataIndex: 'createDate',
			width: '15%',
			render: (createDate: string, arr: any) => {
				const year = new Date (createDate).getFullYear()
				const month = new Date (createDate).getMonth() +1 < 10 ? ''+new Date (createDate).getMonth() +1 : new Date (createDate).getMonth() +1
				const date = new Date (createDate).getDate()
				const getDate = year + '-' + month + '-' + date
				return <span>{ arr.createBy + ' / ' + getDate}</span>;
			},
		},
		{
			title: '수정자/수정일',
			dataIndex: 'updateDate',
			width: '15%',
			render: (updateDate: string, arr: any) => {
				const year = new Date (updateDate).getFullYear()
				const month = new Date (updateDate).getMonth() +1 < 10 ? ''+new Date (updateDate).getMonth() +1 : new Date (updateDate).getMonth() +1
				const date = new Date (updateDate).getDate()
				const getDate = year + '-' + month + '-' + date
				return <span>{ arr.createBy+ ' / ' + getDate }</span>;
			},
		},
	];
	//component state
	const [originalData, setOriginalData] = useState([] as BoardDataInterface[]);
	const [showingData, setShowingData] = useState([] as BoardDataInterface[]);
	const [selectedList, setSelectedList] = useState([] as BoardDataInterface[]);
	const [selectedKeyList, setSelectedKeyList] = useState([] as Key[]);
	const [authorityData, setAuthorityData] = useState('' as any);
	const [searchText, setSearchText] = useState('');
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
		let result = await brandListAPI();
		console.log('result',result)
		if(result){
			setOriginalData(result);
			setShowingData(result);
			let idPermission = sessionStorage.getItem("authority")
			setAuthorityData(idPermission)
		} else {
			alert('로그인을 다시 해주시길 바랍니다.')
			navigate(`/`)
		}
	};
	
	// 노출 설정 변경 모달
	const onClickChange = async () => {
		setModalState({
			title: '게시물 노출 설정',
			description: '선택한 모든 게시물의 노출 설정을 변경 하겠습니까?',
			isOpen: true,
			onClickConfirm: async () => {
				modalStateInit();
				let data = selectedKeyList?.map(ele=>{
					return {
						id: ele,
						showYn: 'Y'
					}
				})
				let res = await brandShowAPI(data);
				if (res.message === 'success') {
					await getContentList();
				}
			},
			onClickCancle: async ()=>{
				modalStateInit();
				let data = selectedKeyList?.map(ele=>{
					return {
						id: ele,
						showYn: 'N'
					}
				})
				let res = await brandShowAPI(data);
				if (res.message === 'success') {
					await getContentList();
				}
			},
			okText: '공개',
			cancelText: '비공개'
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

	// 세부탭
	const onClickRowCallback = (e: MouseEvent<HTMLElement>) => {
		const id = Number(e.currentTarget.parentElement?.getAttribute('data-row-key'));
		navigate(`/brand/detail/${id}`);
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
				let res = await brandDeleteAPI(data);
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

	// 검색어 지울경우
	const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (value === '') {
			return setShowingData(originalData);
		}
		setSearchText(value);
	};

	// 검색
	const onClickSearchBtn = () => {
		const searchedList = originalData.filter((data: BoardDataInterface) =>
			data.name.includes(searchText)
		);
		setShowingData(searchedList);
	};

	return (
		<BoardContainer>
			{/* <NormalModal
				title = {modalState.title}
				description = {modalState.description}
				isOpen = {modalState.isOpen}
				onClickConfirm = {modalState.onClickConfirm}
				onClickCancle = {modalState.onClickCancle}
				okText = {modalState.okText}
				cancelText = {modalState.cancelText}
			/> */}
			<Modal
				centered={true}
				title={modalState.title}
				open={modalState.isOpen}
				onOk={modalState.onClickConfirm}
				closable={false}
				onCancel={modalState.onClickCancle}
				okText={modalState.okText}
				cancelText={modalState.cancelText}
				maskClosable={false}
			>
				<p>{modalState.description}</p>
			</Modal>
			<BoardHeader>
				<BtnColumn>
					<NormalButton
						style={{ width: '10%', marginRight: '15px' }}
						title="노출 설정 변경						"
						type="primary"
						disabled={selectedList.length === 0 ? true : false}
						onClick={async () => await onClickChange()}
					/>
					<NormalButton
						style={{ width: '8%', marginRight: '15px' }}
						title="삭제하기"
						type="primary"
						disabled={selectedList.length === 0 || authorityData !== 'SUPERADMIN' ? true : false}
						onClick={async () => await onClickDelete()}
					/>
					<NormalButton
						style={{ width: '8%' }}
						title="새 게시물"
						type="primary"
						onClick={() => navigate('/brand/detail')}
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
				rowSelection={{
					type: 'checkbox',
					selectedRowKeys: selectedKeyList,
					preserveSelectedRowKeys: true,
					onChange: (selectedRowKeys: Key[], selectedArray: BoardDataInterface[]) => {
						setSelectedKeyList(selectedRowKeys);
						setSelectedList(selectedArray);
					},
				}}
				columns={BOARD_COLUMNS}
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
