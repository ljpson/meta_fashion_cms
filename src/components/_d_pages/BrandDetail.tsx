import { useEffect, useState, useRef, ChangeEvent, ReactElement } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FileImageOutlined } from '@ant-design/icons';
import { Table } from 'antd';
//api
import { brandDetailAPI, addBrandAPI, followAPI, brandFeedAPI } from '../../api/brand';

//antd
import { Switch, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { RcFile } from 'antd/lib/upload';

//interface & types
import { BoardDataInterface } from '../../interface/data';

//components
import ColumnHeading from '../_a_atom/ColumnHeading';
import NormalButton from '../_a_atom/NormalButton';
import NormalInput from '../_a_atom/NormalInput';
import NormalModal from '../common/NormalModal';
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
	// for (let index = 0; index < 100; index++) {
	// 	FOLLOW_TEST_DATA.push({
	// 		id: index,
	// 		name : "박재덕 닉네임",
	// 		email : "qwerty@naver.gmail",
	// 		gender : "남"	
	// 	})
	// };
	const navigate = useNavigate();
	const { id } = useParams();

	// 프리뷰를 보기 위한 임시 cors 처리
	const uploadImage = document.getElementsByClassName('ant-upload-list-item-image');
	for (let i = 0; i < uploadImage.length; i++) {
		uploadImage[i].setAttribute('crossorigin', 'annonymous');
	}

	//component state
	const [boardData, setBoardData] = useState({} as BoardDataInterface);
	const [followData, setFollowData] = useState([] as any);
	const [originalBoardData, setOriginalBoardData] = useState({} as BoardDataInterface);	
	const [arThumbImageFile, setArThumbImageFile] = useState({} as any); 
	const [buttonDisabled, setButtonDisabled] = useState(true); 
	const [profileFile, setProfileFile] = useState({} as any);
	const [selectedList, setSelectedList] = useState([] as BoardDataInterface[]);
	const [feedData, setFeedData] = useState([] as any);
	// 기존 모달
	const [modalState, setModalState] = useState({
		title: '',
		description: '',
		isOpen: false,
		onClickConfirm: () => {},
	});
	// 팔로워 모달
	const [followerModalState, setFollowerModalState] = useState({
		title: '팔로워 리스트(브랜드명)',
		isOpen: false,
		onCancel: () => {},
	});
	// 이미지 preview 모달
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

	//functions

	const getDetailData = async () => {
		if(id){
			let result = await brandDetailAPI(Number(id));
			if(result){
				let detailData = result.data;
				setProfileFile(makeFileObject(detailData.profile, detailData.profile?.id));
				setOriginalBoardData(detailData);
				setBoardData(detailData);
				let feedResult = await brandFeedAPI(Number(id));
				setFeedData(feedResult)
			} else {
				alert('로그인을 다시 해주시길 바랍니다.')
				navigate(`/`)
			}
		}
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

	const modalStateInit = () => {
		setModalState({
			title: '',
			description: '',
			isOpen: false,
			onClickConfirm: () => {},
		});
		setFollowerModalState({
			title: '',
			isOpen: false,
			onCancel: () => {},
		});
	};

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>, key1: string | any, key2?: string | any) => {
		const { value } = e.target;
		if (key1) {
			switch (key2) {
				case 'type':
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
	const onSubmitAllData = async () => {
		if (!validate()) {
			return;
		}

		// 기존 게시물 수정
		if (id) {
			const formData = new FormData();
			formData.append('description', String(boardData.contents));
			formData.append('profile', new File([profileFile], profileFile.name));
			formData.append('showYn', boardData.showYn || 'N');
			formData.append('name', String(boardData.type));
			
			let result = await addBrandAPI(formData,id);
			if (result.message === 'success') {
				setModalState({
					title: '수정 완료',
					description: '수정이 완료되었습니다.',
					isOpen: true,
					onClickConfirm: async () => {
						modalStateInit();
						await getDetailData();
						navigate(-1);
					},
				});
			}
		} else { // 새 게시물 등록
			const formData = new FormData();
			formData.append('description', String(boardData.contents));
			formData.append('profile', new File([profileFile], profileFile.name));
			formData.append('showYn', boardData.showYn || 'N');
			formData.append('name', String(boardData.type));
			let result = await addBrandAPI(formData,null);
			if (result.message === 'success') {
				setModalState({
					title: '등록 완료',
					description: '등록이 완료되었습니다.',
					isOpen: true,
					onClickConfirm: async () => {
						modalStateInit();
						await getDetailData();
						navigate(-1);
					},
				});
			}
		}
	};
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
				<NormalModal
					title={modalState.title}
					description={modalState.description}
					isOpen={modalState.isOpen}
					onClickConfirm={modalState.onClickConfirm}
					onClickCancle={modalStateInit}
					okText = {'Ok'}
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
								<ColumnHeading text="브랜드 노출여부"/>
								<Switch
									style={{
										width: '82px',
									}}
									checkedChildren="공개"
									unCheckedChildren="비공개"
									defaultChecked={false}
									checked={Boolean(boardData.showYn =='Y' ? true : false)}
									onChange={(value: boolean) => {
										console.log('value',value)
										setBoardData({ ...boardData, showYn: value ? 'Y' : 'N' });
									}}
								/>
							</EachColumn>
							<EachColumn style={{marginTop:'40px' }}>
								<EachBlock style={{ paddingRight: '15px'}}>
									<ColumnHeading text="브랜드 프로필 이미지" essential={true} />
									<Upload
										style={{ display: 'inline-block' }}
										customRequest={() => {}}
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
							<EachColumn style={{ marginTop:'20px' }}>
								<EachBlock> 
									<ColumnHeading text="브랜드 이름" essential={true}/>
									<NormalInput
										type="text"
										placeholder="브랜드 이름을 입력하세요"
										maxLength={20}
										value={boardData.type}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											onChangeInput(e, 'brand', 'type')
										}
									/>
								</EachBlock>
							</EachColumn>
							<EachColumn style={{ marginTop:'50px' }}>
								<EachBlock> 
									<ColumnHeading text="브랜드 소개" essential={true}/>
									<NormalInput
										type="textarea"
										placeholder="소개 내용을 입력하세요"
										maxLength={50}
										value={boardData.contents}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											onChangeInput(e, 'brand', 'contents')
										}
									/>
								</EachBlock>
							</EachColumn>
						</LeftColumn>
						<Border />
						<RightColumn>
							<EachColumn>
								<EachBlock> 
									<ColumnHeading text="팔로워"/>
									<div style={{display:'flex',justifyContent:'space-between'}}>
										<span>{boardData.followers || 0}</span>
										<button 
											style={{cursor:'pointer', backgroundColor:'#fff', border: '1px solid gray', borderRadius: '15px', height: '35px', width: '192px'}}
											onClick={()=>openFollower()}
										>
											팔로워 리스트 보기
										</button>
									</div>
								</EachBlock>
							</EachColumn>
							<EachColumn style={{ marginTop:'25px' }}>
								<EachBlock> 
									<ColumnHeading text="브랜드 피드"/>
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
export default BoardDetail;
