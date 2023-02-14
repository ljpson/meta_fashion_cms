import { useEffect, useState, useRef, ChangeEvent, useCallback, ReactElement, MouseEvent } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { DragDropContext, Droppable, DropResult, Draggable } from 'react-beautiful-dnd';
import { FileImageOutlined } from '@ant-design/icons';
import { AlignLeftOutlined } from '@ant-design/icons';
//api
import { designerDetailAPI, addDesignerAPI, followAPI, messageListAPI, designerFeedAPI, messageReadAPI } from '../../api/designers';
import { brandListAPI } from '../../api/brand';
//antd
import { Switch, Upload, Modal, Collapse, Table, Pagination, Dropdown, Input } from 'antd';
const { Search } = Input;
const { Panel } = Collapse;
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';

//interface & types
import { BoardDataInterface } from '../../interface/data';

//components
import ColumnHeading from '../_a_atom/ColumnHeading';
import NormalButton from '../_a_atom/NormalButton';
import NormalInput from '../_a_atom/NormalInput';
import NormalModal from '../common/NormalModal';
interface ICategoryList {
	isDraggingOver: boolean;
}
interface IContainer {
	isDragging: boolean;
}
const BoardDetail = () => {
	const BOARD_COLUMNS = [
		{
			title: '썸네일',
			dataIndex: ['thumbnail'],
			width: '12.5%',
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
			title: '콘텐츠 종류',
			dataIndex: ['type'],
			width: '12.5%',
			render: (type: string) => {
				return <span>{type}</span>;
			},
		},
		{
			title: '제목',
			dataIndex: ['title'],
			width: '70%',
			render: (title: string) => {
				return (
					<span>
						{title}
					</span>
				);
			},
		}
	];
	const BRAND_COLUMNS = [
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
					onClick: onClickBrand,
				};
			},
			render: (name: string) => {
				return <span style={{color:'#229bcd'}}>{name}</span>;
			},
		},
	];
	const FOLLOW_COLUMNS = [
		{
			title: '닉네임',
			dataIndex: ['name'],
			width: '33%',
			render: (name: string[]): ReactElement => {
				return <span> {name} </span>
			},
		},
		{
			title: '이메일',
			dataIndex: ['email'],
			width: '37%',
			render: (email: string) => {
				return <span> {email} </span>;
			},
		},
		{
			title: '성별',
			dataIndex: ['gender'],
			width: '30%',
			render: (gender: string) => {
				return (
					<span> {gender} </span>
				);
			},
		}
	];
	let messageArr:any = []
	//constant state
	const navigate = useNavigate();
	const { id } = useParams();
	
	// 프리뷰를 보기 위한 임시 cors 처리
	const uploadImage = document.getElementsByClassName('ant-upload-list-item-image');
	for (let i = 0; i < uploadImage.length; i++) {
		uploadImage[i].setAttribute('crossorigin', 'annonymous');
	}

	//component state
	const [brandData, setBrandData] = useState([] as any[]);
	const [brandShowingData, setBrandShowingData] = useState([] as any[]);
	const [listData, setListData] = useState([] as any);
	const [messageData, setMessageData] = useState([] as any);
	const [parseMessage, setParseMessage] = useState([] as any);
	const [totalMessage, setTotalMessage] = useState([] as any);
	const [boardData, setBoardData] = useState({} as any);
	const [followData, setFollowData] = useState([] as any);
	const [originalBoardData, setOriginalBoardData] = useState({} as any);
	const [arThumbImageFile, setArThumbImageFile] = useState({} as any); 
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [detailImageFileList, setDetailImageFileList] = useState([] as any);
	const [selectedList, setSelectedList] = useState([] as BoardDataInterface[]);
	const [searchText, setSearchText] = useState('');
	const [feedData, setFeedData] = useState([] as any);
	const [profileFile, setProfileFile] = useState({} as any);
	const [showingData, setShowingData] = useState([] as BoardDataInterface[]);
	const [brandOpen, setBrandOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchBrandText, setSearchBrandText] = useState('');
	const [brandValue, setBrandValue] = useState('' as any);
	const [brandId, setBrandId] = useState(null as any);
	const [modalState, setModalState] = useState({
		title: '',
		description: '',
		isOpen: false,
		onClickConfirm: () => {},
	});
	// 팔로워 모달
	const [followerModalState, setFollowerModalState] = useState({
		title: '팔로워 리스트(디자이너명)',
		isOpen: false,
		onCancel: () => {},
	});
	const [messageState, setMessageState] = useState({
		title: '(디자이너명)님의 받은 메시지(안 읽음 0 / 전체 0)',
		isOpen: false,
		onCancel: () => {},
	});
	const [previewState, setPreviewState] = useState({
		image: '',
		isOpen: false,
		title: '',
		onCancel: () => {},
	});

	//useEffect
	useEffect(() => {
		(async () => {
			await getDetailData();
		})();
	}, []);

	useEffect(() => {
		if (id) {
			if ( JSON.stringify(originalBoardData) !== JSON.stringify(boardData) ) {
				setButtonDisabled(false);
			} else {
				setButtonDisabled(true);
			}
		}
	}, [
		boardData,
		arThumbImageFile,
	]);

	const getDetailData = async () => {
		if(id){

			let brandResult = await brandListAPI();
			setBrandData(brandResult);
			setBrandShowingData(brandResult);

			let result = await designerDetailAPI(Number(id));
			let detailData = result.data;
			if(detailData){
				setProfileFile(makeFileObject(detailData.profile, detailData.profile?.id));
				setOriginalBoardData(detailData);
				setBoardData(detailData);
				setShowingData(detailData.brands)
	
				let feedResult = await designerFeedAPI(Number(id));
				setFeedData(feedResult)
	
				
				// setDetailImageFileList(makeFileObject(detailData.arContents?.path));

			} else {
				alert('로그인을 다시 해주시길 바랍니다.')
				navigate(`/`)
			}
		} else {
			let brandResult = await brandListAPI();
			setBrandData(brandResult);
			setBrandShowingData(brandResult);
		}
	};

	const modalStateInit = async () => {
		setCurrentPage(1)
		setModalState({
			title: '',
			description: '',
			isOpen: false,
			onClickConfirm: () => {},
		});
		setFollowerModalState({
			title: '',
			isOpen: false,
			onCancel: () => {
				setFollowData([])
			},
		});
		setMessageState({
			title: '',
			isOpen: false,
			onCancel: async() => {
				setParseMessage
				setMessageData([])
			},
		});
	};

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>, key1: string | any, key2?: string | any) => {
		const { value } = e.target;
		if (key1) {
			switch (key2) {
				case 'name':
					setBoardData({
						...boardData,
						type: value,
					});
					return;
				case 'contents':
					setBoardData({
						...boardData,
						contents: value,
					});
					return;
			}
		} else {
			setBoardData({ ...boardData, [key2]: value });
		}
	};

	const validate = () => {
		if (
			(boardData.type === '' || !boardData.type) || (boardData.contents === '' || !boardData.contents) ||
			(boardData.profile === '' || !boardData.profile)
		) {
			setModalState({
				title: '필수값 입력',
				description: '필수값을 입력해주세요',
				isOpen: true,
				onClickConfirm: modalStateInit,
			});
			return false;
		} else {
			return true;
		}
	};
	const onClickCancle = () => {
		navigate(-1);
	};
	const openFollower = async () =>{
		let result = await followAPI(Number(id));
		result.map((item:any) => {
			followData.push({
				id: item.id || 1,
				name : item.nickname|| '',
				email : item.email || '',
				gender : item.gender == "FEMAL" ? '여' : '남'
			})
		})
		await setFollowerModalState({
			title: `팔로워 리스트(${boardData.type || ''})`,
			isOpen: true,
			onCancel: modalStateInit
		});
	}
	// 세부탭
	const onClickBrand = (e: MouseEvent<HTMLElement>) => {
		const id = Number(e.currentTarget.parentElement?.getAttribute('data-row-key'));
		let test = brandData.filter((ele:any)=>ele.id == id)
		setBrandId(id)
		setBrandValue(e.currentTarget.innerText)
		setBoardData({...boardData, brandName : e.currentTarget.innerText})
		showingData.push(test[0])
		setBoardData({...boardData, brands : showingData})
		setBrandOpen(false)
	};
	//functions
	const getBase64 = (file: RcFile): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
	});
	const makeFileObject = (url: string | string[] | any, id:any) => {
		if(url){
			if (typeof url !== 'object') {
				return {
					uid: `${url}`,
					url: `${url}`,
					name: url.split('/').pop(),
					id: id ? id : url.id
				};
			} else {
				return url?.map((url:any) => {
					let parseUrl = url.path
					return {
						uid: `${parseUrl}`,
						url: `${parseUrl}`,
						name: parseUrl.split('/')[6],
						id: id ? id : url.id
					};
				});
			}
		}
	};
	const onClickPreview = async (file: any) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as RcFile);
		}
		setPreviewState({
			image: file.url || (file.preview as string),
			isOpen: true,
			title: file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
			onCancel: () => setPreviewState({ ...previewState, isOpen: false }),
		});
	};

	const onSubmitAllData = async () => {
		if (!validate()) {
			return;
		}
		// 기존 게시물 수정
		if (id) {
			let brandId = boardData.brands.map((ele:any)=>ele.id);
			const formData = new FormData();
			formData.append('description', String(boardData.contents));
			formData.append('profile', new File([profileFile], profileFile.name));
			formData.append('brands', String(brandId));
			formData.append('showYn', boardData.showYn || 'N');
			formData.append('name', String(boardData.type));
			for (let key of formData.keys()) {
				console.log(key, ":", formData.get(key));
			}
			
			let result = await addDesignerAPI(formData,id);
			if (result.message === 'success') {
				setModalState({
					title: '수정 완료',
					description: '수정이 완료되었습니다.',
					isOpen: true,
					onClickConfirm: async () => {
						modalStateInit();
						await getDetailData();
						navigate('/designer');
					},
				});
			}
		} else { // 새 게시물 등록
			const formData = new FormData();
			formData.append('profile', new File([profileFile], 'profile.png'));
			formData.append('name', String(boardData.type));
			if(boardData.brands){
				let brandId = boardData.brands.map((ele:any)=>ele.id);
				formData.append('brands', String(brandId));
			}
			formData.append('description', String(boardData.contents));
			formData.append('showYn', boardData.showYn || 'N');
			for (let key of formData.keys()) {
				console.log(key, ":", formData.get(key));
			}
			let result = await addDesignerAPI(formData,null);
			if (result.message === 'success') {
				setModalState({
					title: '등록 완료',
					description: '등록이 완료되었습니다.',
					isOpen: true,
					onClickConfirm: async () => {
						modalStateInit();
						await getDetailData();
						navigate('/designer');
					},
				});
			}
		}
	};
	const onBrandOpen = (value:any) => {
		if (brandValue !== '') {
			const searchedList = brandData.filter((data: BoardDataInterface) =>
				data.name?.includes(brandValue)
				// data.name.includes(brandValue)
			);
			setBrandShowingData(searchedList);
		}
		setBrandOpen(true)
	};
	const onChangeBrand = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setBrandValue(value)
		if (value === '') {
			return setBrandShowingData(brandData);
		}
		setSearchBrandText(value);
	};
	const onBrandSearch = () => {
		const searchedList = brandData.filter((data: BoardDataInterface) =>
			data.name?.includes(searchBrandText)
		);
		setBrandShowingData(searchedList);
	};
	const handleOk = async () => {

	}
	const handleCancel = () => {
		setBrandOpen(false)
		setSearchBrandText('');
  };
	
	// 드래그 끝날 경우
	const onDragEnd = useCallback(
		(result: DropResult) => {
			const { destination, source, draggableId, type } = result;
			if (!destination) return; // destination는 드래그 후 결과값, source는 드래그 전 이전값
			const originData = [...showingData];
			const [reorderedData] = originData.splice(source.index, 1); //선택한거 삭제하고
			originData.splice(destination.index, 0, reorderedData); // 새로운 인덱스에 다시 집어넣고
			setShowingData(originData)
			setBoardData({...boardData, brands : showingData})
		},
		[showingData]
	);
	const messageHeader = (data:any,index:number) => {
		let messageLength = data.message.length > 26 ? true : false
		let parseMessage = messageLength ? data.message.slice(0,25)+'....'  : data.message
		messageArr.push({message : parseMessage})
		return(
		<>
			<span> <span style={{fontWeight:'bold'}}>no:</span> {data.id}　　　 <span style={{fontWeight:'bold'}}>time :</span> {data.createDate}　　　<span style={{fontWeight:'bold'}}>이름 :</span>{data.name}</span>
			<p> <span style={{fontWeight:'bold'}}>내용</span> {messageArr[index].message}</p>
		</>
	)};
	const messageContents = (data:any) => {
		return(
		<>
			<p>
				<span style={{fontWeight:'bold'}}>내용 : </span>
				<span>{data.message}</span>
			</p>
			<p>
				<span style={{fontWeight:'bold'}}>ID : </span>
				<span>{data.account}</span>
			</p>
			<p>
				<span style={{fontWeight:'bold'}}>연락처 : </span>
				<span>{data.phone}</span>
			</p>
			<p>
				<span style={{fontWeight:'bold'}}>이메일 : </span>
				<span>{data.email}</span>
			</p>
		</>
	)};
	const openMessage = async () =>{

		let result = await messageListAPI(Number(id));
		// let testResult = [{
		// 	id: 1,
		// 	name: '개나리',
		// 	account: '아이디',
		// 	email: '이메일',
		// 	phone: '0100000',
		// 	message: '메세지다아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ메세지다아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ메세지다아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ메세지다아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ',
		// 	readYn: 'Y',
		// 	createDate: '23.01.13',
		// 	contactRead: 1 ,
		// 	contactAll: 3
		// },{
		// 	id: 2,
		// 	name: '개나리2',
		// 	account: '아이디2',
		// 	email: '이메일2',
		// 	phone: '0102222',
		// 	message: '우아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅁ',
		// 	readYn: 'Y',
		// 	createDate: '23.01.13',
		// 	contactRead: 1 ,
		// 	contactAll: 3
		// }]
		
		setMessageData(result)
		setTotalMessage(result)
		console.log('result',result)
		let arr = []
		for (let i = 0; i < result.length; i += 10) {
			arr.push(result.slice(i, i + 10));
		}
		console.log('arr',arr)
		setParseMessage(arr[0])
		console.log('ParseMessage',parseMessage)
		if(result.length>0){
			setMessageState({
				title: `${boardData.type || ''}님의 받은 메시지(안 읽음 ${boardData.contactAll - boardData.contactRead || 0} / 전체 ${boardData.contactAll || 0})`,
				isOpen: true,
				onCancel: modalStateInit
			});
		} else {
			setModalState({
				title: '메시지 보기',
				description: '받은 메시지가 없습니다.',
				isOpen: true,
				onClickConfirm: modalStateInit,
			});
		}
	}
	const onChangeCollapse = async (key : any) =>{
		// result를 10개씩 쪼개서 누르는 번호랑 보여주기?
		if(Number(key)){
			let readMessage = await messageReadAPI(id,Number(key))
			console.log('readMessage',readMessage)
			if(readMessage.message == "success"){
				// await getDetailData();
			}
		}
	}
	const clickPage = async (e: any) => {
		console.log(e);
		setCurrentPage(e)
		const arr = [];
    
		for (let i = 0; i < messageData.length; i += 10) {
			arr.push(messageData.slice(i, i + 10));
		}
		setParseMessage(arr[e-1])
	}
	
	const MessageDrop = () =>{
		return  (
			<>
				{/* <Collapse onChange={onChangeCollapse} style={{ width: '100%',height:'500px',overflow:'auto' }}> */}
				<Collapse onChange={onChangeCollapse} accordion>
					{parseMessage?.map((item:any,index:any)=>(
						<Panel header={messageHeader(item,index)} key={item.id}>
							{messageContents(item)}
						</Panel>
					))}
				</Collapse>
				<Pagination style={{display:'flex',justifyContent:'center',marginTop:'30px'}} defaultCurrent={1} current={currentPage} total={totalMessage ? totalMessage.length : 0} onChange={(e:any)=>clickPage(e)}/>
			</>
		)
	}
	const DragPopup = () => {
		return  (
			<div>
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
									{ showingData?.map((item : any, idx : any) => (
										
													<Draggable
														key={item.id}
														draggableId={`${item.id}`}
														index={idx}
													>
														
														{(provided, snapshot) => (
															<div style={{display: 'grid',
																gridTemplateColumns: '1fr',
																alignItems: 'center'}}>
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
																				onKeyUp={(e) => {}}
																				onMouseLeave={(e) => {}}
																				placeholder="카테고리명을 입력해주세요"
																			/>
																		</CateRow>
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
			</div>
		)
	}
	return (
		<>
			<>
				<Modal
					title={previewState.title}
					open={previewState.isOpen}
					footer={null}
					onCancel={previewState.onCancel}
				>
					<img
						// 프리뷰를 보기 위한 임시 cors 처리
						crossOrigin="anonymous"
						style={{ width: '100%' }}
						src={previewState.image}
					/>
				</Modal>
				<Modal
						open={brandOpen}
						title={`브랜드 검색`}
						onOk={handleOk}
						onCancel={handleCancel}
						footer={[]}
						className = 'TestClass'
					>
						<Search
							className='brand'
							placeholder="브랜드를 입력해주세요."
							onSearch={onBrandSearch}
							onChange={onChangeBrand}
							maxLength={20}
							enterButton
							value={brandValue}
						/>
						<Table
							rowKey={(render: any) => render.id}
							columns={BRAND_COLUMNS}
							dataSource={brandShowingData}
							pagination={{ pageSize: 20, position: ['bottomCenter'],showSizeChanger:false }}
							bordered
							
							style={{ width: '100%',height:'500px',overflow:'auto' }}
						/>
					</Modal>
				<Modal
					title={followerModalState.title}
					open={followerModalState.isOpen}
					footer={null}
					onCancel={followerModalState.onCancel}
				>
					<Table
						rowKey={(render: any) => render.id}
						columns={FOLLOW_COLUMNS}
						dataSource={followData}
						pagination={{ pageSize: 50, position: ['bottomCenter'],showSizeChanger:false }}
						bordered
						
						style={{ width: '100%',height:'500px',overflow:'auto' }}
					/>
				</Modal>
				<Modal
					title={messageState.title}
					open={messageState.isOpen}
					footer={null}
					onCancel={messageState.onCancel}
				>
					<MessageDrop/>
				</Modal>
				<NormalModal
					title={modalState.title}
					description={modalState.description}
					isOpen={modalState.isOpen}
					onClickConfirm={modalState.onClickConfirm}
					onClickCancle={modalStateInit}
					okText={'Ok'}
					cancelText={'Cancel'}
				/>
				<BoardDetailContainer>
					<ButtonColumn>
						<NormalButton
							style={{ marginRight: '20px', width: '8%', fontWeight: 'bold' }}
							type="primary"
							title="취소"
							onClick={onClickCancle}
						/>
						<NormalButton
							style={{ width: '8%', fontWeight: 'bold' }}
							type="primary"
							disabled={id ? buttonDisabled : false}
							title={id ? '수정' : '등록'}
							onClick={onSubmitAllData}
						/>
					</ButtonColumn>
					<MainContainer>
						<LeftColumn>
							<EachColumn>
								<ColumnHeading text="디자이너 노출여부"/>
								<Switch
									style={{
										width: '82px',
									}}
									checkedChildren="공개"
									unCheckedChildren="비공개"
									defaultChecked={false}
									checked={Boolean(boardData.showYn =='Y' ? true : false)}
									onChange={(value: boolean) => {
										setBoardData({ ...boardData, showYn: value ? 'Y' : 'N' });
									}}
								/>
							</EachColumn>
							<EachColumn>
								<EachBlock style={{ paddingRight: '15px' }}>
									<ColumnHeading text="디자이너 프로필 이미지" essential={true} />
									<Upload
										style={{ display: 'inline-block' }}
											customRequest={() => {}}
											// fileList={[boardData.profile]}
											fileList={profileFile ? [profileFile] : []}
											onPreview={onClickPreview}
											onChange={(file) => {
												if (file.file.status === 'removed') {
													setProfileFile(file.fileList as any[]);
												} else {
													if (file.file.status === 'uploading') {
														file.file.status = 'done';
													}
													setProfileFile(file.file);
													setBoardData({ ...boardData, profile:file.file });
												}
											}}
									>
										<NormalButton
											style={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												color: '#1d39c4',
											}}
											icon={<UploadOutlined />}
											title="파일 선택"
										/>
									</Upload>
								</EachBlock>
							</EachColumn>
							<EachColumn>
								<EachBlock> 
									<ColumnHeading text="디자이너 이름" essential={true}/>
									<NormalInput
										type="text"
										placeholder="디자이너명을 입력하세요"
										maxLength={20}
										value={boardData.type || ''}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											onChangeInput(e, 'designer', 'name')
										}
									/>
								</EachBlock>
							</EachColumn>
							<EachColumn>
								<EachBlock> 
									<ColumnHeading text="디자이너 소개" essential={true}/>
									<NormalInput
										type="textarea"
										placeholder="소개 내용을 입력하세요"
										maxLength={50}
										value={boardData.contents}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											onChangeInput(e, 'designer', 'contents')
										}
									/>
								</EachBlock>
							</EachColumn>
							<EachColumn>
								<EachBlock> 
									<ColumnHeading text="소속 브랜드"/>
									<div style={{display:'flex'}}>
										<Search
											placeholder="브랜드를 입력하세요"
											onSearch={onBrandOpen}
											maxLength={20}
											enterButton
											value={brandValue}
											onChange={e => setBrandValue(e.target.value)}
										/>
									</div>
									<DragPopup/>
								</EachBlock>
							</EachColumn>
						</LeftColumn>
						<Border />
						<RightColumn>
							<EachColumn>
								<EachBlock> 
									<ColumnHeading text="팔로워"/>
									<div style={{display:'flex',justifyContent:'space-between'}}>
										<span>{(boardData.followers || 0)}</span>
										<button 
											style={{cursor:'pointer', backgroundColor:'#fff', border: '1px solid gray', borderRadius: '15px', height: '35px', width: '192px'}}
											onClick={()=>openFollower()}
										>
											팔로워 리스트 보기
										</button>
									</div>
								</EachBlock>
							</EachColumn>
							<EachColumn>
								<EachBlock> 
									<ColumnHeading text="받은 메시지"/>
									<div style={{display:'flex',justifyContent:'space-between'}}>
										<span>{Number(boardData.contactAll-boardData.contactRead) || 0 +' / '+ (boardData.contactAll || 0) }</span>
										<button
										 	style={{cursor:'pointer', backgroundColor:'#fff', border: '1px solid gray', borderRadius: '15px', height: '35px', width: '192px'}}
											onClick={()=>openMessage()}
										>
											메시지 보기
										</button>
									</div>
								</EachBlock>
							</EachColumn>
							<EachColumn>
								<EachBlock> 
									<ColumnHeading text="디자이너 피드"/>
								</EachBlock>
							</EachColumn>
							<EachColumn>
								<EachBlock>
								<ListInfo>총 게시물 수 : {feedData ? feedData.length: 0}개</ListInfo>
								<Table
									rowKey={(render: any) => render.id}
									columns={BOARD_COLUMNS}
									dataSource={feedData}
									pagination={{ pageSize: 10, position: ['bottomCenter'] }}
									bordered
									style={{ width: '100%' }}
								/>
								</EachBlock>
							</EachColumn>
						</RightColumn>
					</MainContainer>
				</BoardDetailContainer>
			</>
		</>
	);
};

const BoardDetailContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	padding: 15px;
`;

const ButtonColumn = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 100%;
`;
const Border = styled.div`
	width: 1px;
	height: 100%;
	background-color: grey;
`;

const MainContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
`;

const LeftColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: top;
	width: 100%;
	height: 100%;
	padding: 0px 30px;
`;
const ListInfo = styled.span``;
const RightColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: top;
	width: 100%;
	height: 100%;
	padding: 0px 30px;
`;

const EachColumn = styled.div`
	display: flex;
	justify-content: space-between;
	margin: 5px 0px;
`;

const EachBlock = styled.div`
	display: flex;
	flex-direction: column;
	align-items: left;
	width: 100%;
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
export default BoardDetail;
