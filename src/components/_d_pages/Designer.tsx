import { ReactElement, useState, useEffect, ChangeEvent, MouseEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DragDropContext, Droppable, DropResult, Draggable } from 'react-beautiful-dnd';
import NormalModal from '../common/NormalModal';
//interface
import { CategoryDataInterface } from '../../interface/data';
//api
import { designerListAPI, designerDeleteAPI, designerPositionAPI, designerTopAPI, designerShowAPI, designerFilterAPI } from '../../api/designers';

//antd
import { Table, Modal, Select } from 'antd';
const Option = Select.Option;
import { FileImageOutlined } from '@ant-design/icons';
import { AlignLeftOutlined } from '@ant-design/icons';
import DeleteButton from '../_a_atom/DeleteButton';

//interface & types
import { BoardDataInterface } from '../../interface/data';

//components
import NormalButton from '../_a_atom/NormalButton';
import { Key } from 'antd/lib/table/interface';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
interface ICategoryList {
	isDraggingOver: boolean;
}
interface IContainer {
	isDragging: boolean;
}
const Board = () => {
	const navigate = useNavigate();
	// const CONTENTS_CATEGORY = [
	// 	{ title: '상의', value: 1 },
	// 	{ title: '하의', value: 2 },
	// 	{ title: '자켓', value: 3 },
	// 	{ title: '원피스', value: 4 },
	// ];
	// const CONTENTS_TYPE = [
	// 	{ title: '일반', value: 1 },
	// 	{ title: 'AR Fit', value: 2 },
	// 	{ title: 'Avatar Fit', value: 3 },
	// 	{ title: 'AR + Avatar Fit', value: 4 },
	// ];
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
			title: '디자이너명',
			dataIndex: ['name'],
			width: '5%',
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
			title: '메시지(안 읽음/전체)',
			dataIndex: ['contactAll'],
			width: '12%',
			render: (contactAll: string, arr: any) => {
				const notRead = Number(contactAll) - Number(arr.contactRead)
				return (
					<span>
						{(notRead || 0) +' / ' + (contactAll || 0)}
					</span>
				);
			},
		},
		{
			title: '상단노출(TOP 디자이너)',
			dataIndex: ['topYn'],
			width: '24%',
			render: (topYn: string) => {
				return (
					<span>
						{topYn=="Y" ? "TOP": ""}
					</span>
				);
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
				return <span>{showYn=="Y" ? '노출' : '비노출'}</span>;
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
				return <span>{arr.createBy + ' / ' + getDate}</span>;
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
				return <span>{getDate + ' / ' + arr.createBy}</span>;
			},
		},
	];

	//component state
	const [originalData, setOriginalData] = useState([] as BoardDataInterface[] | any);
	const [showingData, setShowingData] = useState([] as BoardDataInterface[] | any);
	const [selectedList, setSelectedList] = useState([] as BoardDataInterface[]);
	const [selectedKeyList, setSelectedKeyList] = useState([] as Key[]);
	const [searchText, setSearchText] = useState('');
	const [authorityData, setAuthorityData] = useState('' as any);
	const [open, setOpen] = useState(false);
	const [modalState, setModalState] = useState({
		isOpen: false,
		onClickConfirm: () => {},
	});
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
			setModalState({
				isOpen: false,
				onClickConfirm: () => {},
			});
			setAddModalState({
				title: '',
				description: '',
				isOpen: false,
				onClickConfirm: () => {},
				onClickCancle: () => {},
				okText: '',
				cancelText: '',
			});
			await getContentList();
		})();
	}, []);

	//functions
	const getContentList = async () => {
		let result = await designerListAPI();
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
		navigate(`/designer/detail/${id}`);
	};

	const onClickDelete = async () => {
		let data  = selectedKeyList.map((ele:any)=>{
			return {id: ele}
		})
		let res = await designerDeleteAPI(data);
		if (res.message === 'success') {
			await getContentList();
		}
	};
	const onClickShowChange = async () => {
		setAddModalState({
			title: '디자이너 노출 설정',
			description: '선택한 디자이너의 노출 설정을 변경 하겠습니까?',
			isOpen: true,
			onClickConfirm: async () => {
				let data = selectedKeyList?.map(ele=>{
					return {
						id: ele,
						showYn: 'Y'
					}
				})
				let res = await designerShowAPI(data);
				if (res.message === 'success') {
					let result = await designerListAPI();
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
				let res = await designerShowAPI(data);
				if (res.message === 'success') {
					let result = await designerListAPI();
					setOriginalData(result);
					setShowingData(result);
					modalStateInit()
				}
			},
			okText: '공개',
			cancelText: '비공개'
		});
	};

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
	// TOP 디자이너 노출 순서 관리 닫기
	const closeTopDesigner = () =>{
		setModalState({
			isOpen: false,
			onClickConfirm: () => {},
		});
	}
	// TOP 디자이너 노출 순서 관리 열기
	const onClickChangeDesigner = () =>{
		setOpen(true)
		setModalState({
			isOpen: true,
			onClickConfirm: () => {},
		});
	}
	// TOP 디자이너 추가
	const onClickAddDesigner = () =>{
		setAddModalState({
			title: 'TOP 디자이너 추가',
			description: '선택한 디자이너를 TOP디자이너에	추가 하겠습니까?',
			isOpen: true,
			onClickConfirm: async () => {
				let data  = selectedKeyList.map((ele:any)=>{
					return {id: ele, topYn: "Y"}
				})
				let res = await designerTopAPI(data)
				if (res.message == 'success') {
					let res = await designerListAPI();
					setOriginalData(res);
					setShowingData(res);
					modalStateInit()
				}
			},
			onClickCancle: () => {},
			okText: '확인',
			cancelText: '취소',
		});
	}
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
	// 드래그 끝날 경우
	const onDragEnd = useCallback(async (result: DropResult) => {
			const { destination, source, draggableId, type } = result;
			if (!destination) return; // destination는 드래그 후 결과값, source는 드래그 전 이전값
			const originData = [...originalData];
			const [reorderedData] = originData.splice(source.index, 1); //선택한거 삭제하고
			originData.splice(destination.index, 0, reorderedData); // 새로운 인덱스에 다시 집어넣고
			let data = originData.map((ele:any,index:number)=>{
				return {id:ele.id,topPosition:index+1}
			})
			setOriginalData(originData);
			let res = await designerPositionAPI(data)
			if (res.message === 'success') {
				let test = await designerListAPI();
			}
		},
		[originalData]
	);
	const queryClient = useQueryClient();
	const deleteMutation = useMutation((id: any) => designerDeleteAPI(id), {
		onSuccess: () => {
			queryClient.invalidateQueries(['originData']);
		},
	});

	const delCategory = async (idx: number, id: any) => {
		const originData = [...originalData];
		let dataLength = originData.length;
		if (dataLength === 1) {
			alert('카테고리는 1개 이상이여야 합니다.');
			return false;
		}
		var result = confirm('해당 카테고리를 삭제하겠습니까?');
		if (result) {
			let data = [{id:id}]
			let res = await designerDeleteAPI(data);
			if (res.message === 'success') {
				await getContentList();
			}
		}
	};
	const onChangeSet = async (value: any) => {
		if(value=='NORMAL'){
			const type = 'NORMAL'
			let result = await designerFilterAPI(type);
			setOriginalData(result.data);
			setShowingData(result.data);
		} else if (value=='TOP') {
			const type = 'TOP'
			let result = await designerFilterAPI(type);
			setOriginalData(result.data);
			setShowingData(result.data);
		} else {
			await getContentList();
		}
  };
	const handleCancel = () => {
    setOpen(false);
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
			<Modal
					title={'TOP디자이너 노출 순서 관리'}
					open={open}
					onCancel={handleCancel}
					footer={[]}
				>
				<DragSection>
					<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId="category" type="originData">
							{(provided, snapshot) => (
								<>
								<CategoryList
									{...provided.droppableProps}
									ref={provided.innerRef}
									isDraggingOver={snapshot.isDraggingOver}
								>
								<>
									{ originalData?.map((item:any, idx:any) => (
										
													<Draggable
														key={item.id}
														draggableId={`${item.id}`}
														index={idx}
														
													>
														
														{(provided, snapshot) => (
															<div style={{display: 'grid',
																gridTemplateColumns: '20px 1fr',
																alignItems: 'center'}}>
																<span>{idx+1}</span>
																<Container
																
																	ref={provided.innerRef}
																	isDragging={snapshot.isDragging}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																>
																	<CategoryItem>
																	
																		<CateRow>
																			<AlignLeftOutlined />
																			
																			<CateTitle
																				type="text"
																				name="title"
																				defaultValue={item.name}
																				disabled
																			/>
																		</CateRow>
																		<DeleteButton
																			onClick={() => {
																				delCategory(idx, item.id);
																			}}
																		/>
																	</CategoryItem>
																</Container>
															</div>
														)}
													</Draggable>
												))}
								</>
								</CategoryList>
								{provided.placeholder}
								</>
							)}
						</Droppable>
					</DragDropContext>
				</DragSection>
			</Modal>
				<div style={{display:"flex"}}>
					<BtnColumn style={{justifyContent: "start"}}>
						<NormalButton
							style={{ width: '210px', marginRight: '15px', justifyContent: "start"}}
							title="TOP디자이너 노출 순서 관리"
							type="primary"
							onClick={async () => onClickChangeDesigner()}
						/>
						<NormalButton
							style={{ width: '145px' }}
							title="TOP디자이너 추가"
							type="primary"
							disabled={selectedList.length === 0 ? true : false}
							onClick={async () => onClickAddDesigner()}
						/>
					</BtnColumn>
					<BtnColumn style={{justifyContent: "end"}}>
						<NormalButton
							style={{ width: '15%', marginRight: '15px' }}
							title="노출 설정 변경"
							type="primary"
							disabled={selectedList.length === 0 ? true : false} // Select Box 선택 1개 이상 선택 시
							onClick={async () => await onClickShowChange()}
						/>
						<NormalButton
							style={{ width: '110px', marginRight: '15px' }}
							title="삭제하기"
							type="primary"
							disabled={selectedList.length === 0 || authorityData !== 'SUPERADMIN' ? true : false}
							onClick={async () => await onClickDelete()}
						/>
						<NormalButton
							style={{ width: '110px' }}
							title="새 디자이너"
							type="primary"
							onClick={() => navigate('/designer/detail')}
						/>
					</BtnColumn>
				</div>
				<ListHeader>
					{/* <ListInfo>총 게시물 수 : {originalData.length}개</ListInfo> */}
					<ListInfo>총 게시물 수 : {originalData ? originalData.length: 0}개</ListInfo>
					<SearchCollumn>
						<Select
							style={{width: 180,marginRight:'20px',}}
							placeholder={'노출 설정 변경'}
							defaultValue={'전체'}
							onChange={(value) => onChangeSet(value)}
						>
							<Option value="ALL">전체</Option>
							<Option value="TOP">TOP 디자이너</Option>
							<Option value="NORMAL">일반</Option>
						</Select>
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
	justify-content: space-around;
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
const Title = styled.span`
	font-weight:bold
`;
const CategoryList = styled.div<ICategoryList>`
	padding: 8px;
	//background-color: ${(props) => (props.isDraggingOver ? 'white' : 'EFF2F5')};
	flex-grow: 1;
	height: 100%;
`;

const Container = styled.div<IContainer>`
	border: 1px solid lightgrey;
	border-radius: 2px;
	padding: 8px;
	margin-bottom: 8px;
	transition: background-color 0.2s ease;
	background-color: ${(props) => (props.isDragging ? 'rgba(245,245,245, 0.75)' : 'white')};
	box-shadow: ${(props) =>
		props.isDragging
			? 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
			: ''}; ;
`;
const CategoryItem = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 16px;
`;
const CateRow = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
`;

const CateTitle = styled.input`
	width: 100%;
	border: none;
	outline: none;
	padding-left: 8px;
	background-color: inherit;
	:focus {
		width: 100%;
	}
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
const DragSection = styled.div`
	width: 100%;
`;
export default Board;
