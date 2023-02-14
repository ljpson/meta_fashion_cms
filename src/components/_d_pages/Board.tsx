import { ReactElement, useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

//api
import { contentListAPI, contentDeleteAPI, contentShowAPI } from '../../api/contents';
import NormalModal from '../common/NormalModal';
//antd
import { Table, Modal } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

//interface & types
import { BoardDataInterface } from '../../interface/data';

//components
import NormalButton from '../_a_atom/NormalButton';
import { Key } from 'antd/lib/table/interface';

const Board = () => {
	const navigate = useNavigate();
	const BOARD_COLUMNS = [
		{
			title: '썸네일',
			dataIndex: ['thumbnail'],
			width: '6%',
			render: (thumbnail: string[]): ReactElement => {
				return thumbnail ? (
					<img
						// 프리뷰를 보기 위한 임시 cors 처리
						crossOrigin="anonymous"
						alt="썸네일 이미지"
						src={`${thumbnail}`}
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
			title: '카테고리',
			dataIndex: ['categoryName'],
			width: '8%',
			render: (categoryName: number) => {
				return <span>{categoryName || '-'}</span>;
			},
		},
		{
			title: '컨텐츠 종류',
			dataIndex: ['type'],
			width: '6%',
			render: (type: string) => {
				let typeData = ''
				if(type == 'BOTH'){
					typeData = 'AR Fit Avatar Fit'
					return (
						<>
							<p>{'AR Fit'}</p>
							<p>{'Avatar Fit'}</p>
						</>
					);
				} else if (type == 'AR') {
					typeData = 'AR Fit'
				} else if (type == 'AVATAR') {
					typeData = 'Avatar Fit'
				} else {
					typeData = '일반'
				}
				return (
					<span>{typeData}</span>
				);
			},
		},
		{
			title: '제목',
			dataIndex: ['title'],
			width: '30%',
			onCell: (record: any, rowIndex: any) => {
				return {
					onClick: onClickRowCallback,
				};
			},
			render: (title: string) => {
				return <span style={{color:'#229bcd'}}>{title || '-'}</span>
			}
		},
		{
			title: '디자이너 명',
			dataIndex: ['designerName'],
			width: '15%',
			render: (designerName: string) => {
				return <span>{designerName || '-'}</span>
			}
		},
		{
			title: '노출 여부',
			dataIndex: 'showYn',
			width: '6%',
			render: (showYn: any) => {
				return <span>{showYn == "Y" ? '노출' : '비노출'}</span>;
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
	const [searchText, setSearchText] = useState('');
	const [authorityData, setAuthorityData] = useState('' as any);
	const [addModalState, setAddModalState] = useState({
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
		let result = await contentListAPI();
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

	const onClickRowCallback = (e: MouseEvent<HTMLElement>) => {
		const id = Number(e.currentTarget.parentElement?.getAttribute('data-row-key'));
		navigate(`/board/detail/${id}`);
	};

	const onClickShowChange = async () => {

		setAddModalState({
			title: '게시글 노출 설정',
			description: '선택한 모든 게시글의 노출 설정을 변경 하겠습니까?',
			isOpen: true,
			onClickConfirm: async () => {
				let data = selectedKeyList?.map(ele=>{
					return {
						id: ele,
						showYn: 'Y'
					}
				})
				let res = await contentShowAPI(data);
				if (res.message === 'success') {
					let result = await contentListAPI();
					setOriginalData(result);
					setShowingData(result);
					modalStateInit()
				}
			},
			onClickCancle: async ()=>{
				let data = selectedKeyList?.map(ele=>{
					return {
						id: ele,
						showYn: 'N'
					}
				})
				let res = await contentShowAPI(data);
				if (res.message === 'success') {
					let result = await contentListAPI();
					setOriginalData(result);
					setShowingData(result);
					modalStateInit()
				}
			},
			okText: '공개',
			cancelText: '비공개'
		});
		
	};
	const modalStateInit = () => {
		setAddModalState({
			title: '',
			description: '',
			isOpen: false,
			onClickConfirm: () => {},
			onClickCancle: () => {},
			okText: '',
			cancelText: '',
		});
	};
	const onClickDelete = async () => {
		let data  = selectedKeyList.map((ele:any)=>{
			return {id: ele}
		})
		let res = await contentDeleteAPI(data);
		if (res.message === 'success') {
			await getContentList();
		}

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
			data.title.includes(searchText)
		);
		setShowingData(searchedList);
	};

	return (
		<BoardContainer>
			{/* <NormalModal
				title={addModalState.title}
				description={addModalState.description}
				isOpen={addModalState.isOpen}
				onClickConfirm={addModalState.onClickConfirm}
				onClickCancle={addModalState.onClickCancle}
				okText={addModalState.okText}
				cancelText={addModalState.cancelText}
				maskClosable={false}
			/> */}
			<Modal
				centered={true}
				title={addModalState.title}
				open={addModalState.isOpen}
				onOk={addModalState.onClickConfirm}
				closable={false}
				onCancel={addModalState.onClickCancle}
				okText={addModalState.okText}
				cancelText={addModalState.cancelText}
				maskClosable={false}
			>
				<p>{addModalState.description}</p>
			</Modal>
			<BoardHeader>
				<BtnColumn>
					<NormalButton
						style={{ width: '10%', marginRight: '15px' }}
						title="노출 설정 변경"
						type="primary"
						disabled={selectedList.length === 0 || authorityData === 'DESIGNER' ? true : false} // Select Box 선택 1개 이상 선택 시
						onClick={async () => await onClickShowChange()}
					/>
					<NormalButton
						style={{ width: '8%', marginRight: '15px' }}
						title="삭제하기"
						type="primary"
						disabled={selectedList.length === 0 || authorityData !== 'SUPERADMIN'  ? true : false}
						onClick={async () => await onClickDelete()}
					/>
					<NormalButton
						style={{ width: '8%' }}
						title="새 게시물"
						type="primary"
						onClick={() => navigate('/board/detail')}
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
