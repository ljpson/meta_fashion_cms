import { useEffect, useState, useRef, ChangeEvent, useCallback, ReactElement } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FileImageOutlined } from '@ant-design/icons';
//api
import { popupDetailAPI, addPopupAPI } from '../../api/popup';

//antd
import { Switch, Upload, Modal, Calendar, TimePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';

//components
import ColumnHeading from '../_a_atom/ColumnHeading';
import NormalButton from '../_a_atom/NormalButton';
import NormalInput from '../_a_atom/NormalInput';
import NormalModal from '../common/NormalModal';

import dayjs from 'dayjs'

const BoardDetail = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	// 프리뷰를 보기 위한 임시 cors 처리
	const uploadImage = document.getElementsByClassName('ant-upload-list-item-image');
	for (let i = 0; i < uploadImage.length; i++) {
		uploadImage[i].setAttribute('crossorigin', 'annonymous');
	}
	let dateTest:any = []

	const toHour = new Date ().getHours() < 10 ? '0' + String(new Date ().getHours()) : new Date ().getHours()
	const toMinutes = new Date ().getMinutes() < 10 ? '0' + String(new Date ().getMinutes()) : new Date ().getMinutes()
	const toSecond= new Date ().getSeconds() < 10 ? '0' + String(new Date ().getSeconds()) : new Date ().getSeconds()

	const year = new Date ().getFullYear()
	const month = new Date ().getMonth() +1 < 10 ? ''+new Date ().getMonth() +1 : new Date ().getMonth() +1
	const date = new Date ().getDate() < 10 ? '0'+String (new Date ().getDate()) : new Date ().getDate()
	
	let beginStartYear =  year + '-' + month + '-' + date + ' '
	let beginStartData =  toHour + ':' + toMinutes + ':' + toSecond

	//component state
	const [selectYear, setSelectYear] = useState(beginStartYear as any);
	const [selectStartTime, setSelectStartTime] = useState(beginStartData as any);
	const [valueTest, setValueTest] = useState(() => dayjs('2017-01-25'));
	const [selectEndYear, setSelectEndYear] = useState(beginStartYear as any);
	const [selectEndTime, setSelectEndTime] = useState(beginStartData as any);
	const [boardData, setBoardData] = useState({} as any);
	const [originalBoardData, setOriginalBoardData] = useState({} as any);
	const [arThumbImageFile, setArThumbImageFile] = useState({} as any); 
	const [profileFile, setProfileFile] = useState({} as any);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [modalState, setModalState] = useState({
		title: '',
		description: '',
		isOpen: false,
		onClickConfirm: () => {},
	});
	const [previewState, setPreviewState] = useState({
		image: '',
		isOpen: false,
		title: '',
		onCancel: () => {},
	});
	// TODO : 추후 통합
	// 게시일시 
	const onStartSelect = (data:any) => {
		const firstDate = data.$d
		const year = new Date (firstDate).getFullYear()
		const month = new Date (firstDate).getMonth() +1 < 10 ? ''+new Date (firstDate).getMonth() +1 : new Date (firstDate).getMonth() +1
		const date = new Date (firstDate).getDate() < 10 ? '0'+String (new Date (firstDate).getDate()) : new Date (firstDate).getDate()
		const getDate = year + '-' + month + '-' + date + ' '
		setSelectYear(getDate)
		setBoardData({
			...boardData,
			showFrom: getDate,
		});
  };
	const startTimeSelect = (data:any) => {
		const firstTime = data._d
		const toHour = new Date (firstTime).getHours() < 10 ? '0' + String(new Date (firstTime).getHours()) : new Date (firstTime).getHours()
		const toMinutes = new Date (firstTime).getMinutes() < 10 ? '0' + String(new Date (firstTime).getMinutes()) : new Date (firstTime).getMinutes()
		const toSecond= new Date (firstTime).getSeconds() < 10 ? '0' + String(new Date (firstTime).getSeconds()) : new Date (firstTime).getSeconds()
		const getStartTime =  toHour + ':' + toMinutes + ':' + toSecond
		setSelectStartTime(getStartTime)
  };

	// 종료일시
	const onEndSelect = (data:any) => {
		const endDate = data.$d
		const year = new Date (endDate).getFullYear()
		const month = new Date (endDate).getMonth() +1 < 10 ? ''+new Date (endDate).getMonth() +1 : new Date (endDate).getMonth() +1
		const date = new Date (endDate).getDate() < 10 ? '0'+String (new Date (endDate).getDate()) : new Date (endDate).getDate()
		const getDate = year + '-' + month + '-' + date + ' '
		setSelectEndYear(getDate)
		setBoardData({
			...boardData,
			showTo: getDate,
		});
	};
  const endTimeSelect = (data:any) => {
		const endTime = data._d
		const toHour = new Date (endTime).getHours() < 10 ? '0' + String(new Date (endTime).getHours()) : new Date (endTime).getHours()
		const toMinutes = new Date (endTime).getMinutes() < 10 ? '0' + String(new Date (endTime).getMinutes()) : new Date (endTime).getMinutes()
		const toSecond= new Date (endTime).getSeconds() < 10 ? '0' + String(new Date (endTime).getSeconds()) : new Date (endTime).getSeconds()
		const getStartTime =  toHour + ':' + toMinutes + ':' + toSecond
		setSelectEndTime(getStartTime)
  };
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
			let result = await popupDetailAPI(Number(id));
			let detailData = result.data;
			if(detailData){

				setOriginalBoardData(detailData);
				setBoardData(detailData);
				setProfileFile(makeFileObject(detailData.image, detailData.image?.id));
	
				// 초기 날짜
				const firstDate = detailData.showFrom
				const endDate = detailData.showTo
				const year = new Date (firstDate).getFullYear()
				const month = new Date (firstDate).getMonth() +1 < 10 ? ''+new Date (firstDate).getMonth() +1 : new Date (firstDate).getMonth() +1
				const date = new Date (firstDate).getDate() < 10 ? '0'+String (new Date (firstDate).getDate()) : new Date (firstDate).getDate()
				const getDate = year + '-' + month + '-' + date + ' '
	
				const toHour = new Date (firstDate).getHours() < 10 ? '0' + String(new Date (firstDate).getHours()) : new Date (firstDate).getHours()
				const toMinutes = new Date (firstDate).getMinutes() < 10 ? '0' + String(new Date (firstDate).getMinutes()) : new Date (firstDate).getMinutes()
				const toSecond= new Date (firstDate).getSeconds() < 10 ? '0' + String(new Date (firstDate).getSeconds()) : new Date (firstDate).getSeconds()
				const getStartTime =  toHour + ':' + toMinutes + ':' + toSecond
	
				const endYear = new Date (endDate).getFullYear()
				const endMonth = new Date (endDate).getMonth() +1 < 10 ? ''+new Date (endDate).getMonth() +1 : new Date (endDate).getMonth() +1
				const endDatePick = new Date (endDate).getDate() < 10 ? '0'+String (new Date (endDate).getDate()) : new Date (endDate).getDate()
				const endGetDate = endYear + '-' + endMonth + '-' + endDatePick + ' '
				
	
				const endToHour = new Date (endDate).getHours() < 10 ? '0' + String(new Date (endDate).getHours()) : new Date (endDate).getHours()
				const endToMinutes = new Date (endDate).getMinutes() < 10 ? '0' + String(new Date (endDate).getMinutes()) : new Date (endDate).getMinutes()
				const endToSecond= new Date (endDate).getSeconds() < 10 ? '0' + String(new Date (endDate).getSeconds()) : new Date (endDate).getSeconds()
				const endGetStartTime =  endToHour + ':' + endToMinutes + ':' + endToSecond
				
				setSelectYear(getDate)
				setSelectStartTime(getStartTime)
				setSelectEndYear(endGetDate)
				setSelectEndTime(endGetStartTime)
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
				case 'title':
					setBoardData({
						...boardData,
						title: value,
					});
					return;
			}
		} else {
			setBoardData({ ...boardData, [key2]: value });
		}
		
	};

	const validate = () => {
		if ( (boardData.title === '' || !boardData.title) || (boardData.image === '' || !boardData.image) ) {
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

	const onSubmitAllData = async () => {
		if (!validate()) {
			return;
		}

		// 기존 게시물 수정
		if (id) {
			const showFrom = selectYear + selectStartTime 
			const showTo = selectEndYear + selectEndTime
			// let data = {
			// 	title : boardData.title ? boardData.title : '',
			// 	showFrom: showFrom,
			// 	showTo: showTo,
			// 	image: boardData.profile ? boardData.profile : '',
			// 	showYn: boardData.showYn ? boardData.showYn : 'N'
			// }
			// console.log('data',data);
			// console.log('boardDAta',boardData)

			const formData = new FormData();
			formData.append('title', boardData.title ? boardData.title : '');
			formData.append('showFrom', showFrom);
			formData.append('showTo', showTo);
			formData.append('image', new File([profileFile], profileFile.name));
			formData.append('showYn', boardData.showYn ? boardData.showYn : 'N');
			
			let result = await addPopupAPI(formData,id);
			if (result.message === 'success') {
				setModalState({
					title: '수정 완료',
					description: '수정이 완료되었습니다.',
					isOpen: true,
					onClickConfirm: async () => {
						modalStateInit();
						await getDetailData();
						navigate('/popup')
					},
				});
			}
		} else { // 새 게시물 등록
			const showFrom = selectYear + selectStartTime 
			const showTo = selectEndYear + selectEndTime
			// let data = {
			// 	title : boardData.title ? boardData.title : '',
			// 	showFrom: showFrom,
			// 	showTo: showTo,
			// 	image: boardData.profile ? boardData.profile : '',
			// 	showYn: boardData.showYn ? boardData.showYn : 'N'
			// }
			// console.log('data',data)
			const formData = new FormData();
			formData.append('title', boardData.title ? boardData.title : '');
			formData.append('showFrom', showFrom);
			formData.append('showTo', showTo);
			formData.append('image', new File([profileFile], profileFile.name));
			formData.append('showYn', boardData.showYn ? boardData.showYn : 'N');
			let result = await addPopupAPI(formData,null);
			if (result.message === 'success') {
				setModalState({
					title: '등록 완료',
					description: '등록이 완료되었습니다.',
					isOpen: true,
					onClickConfirm: async () => {
						modalStateInit();
						await getDetailData();
						navigate('/popup')
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
								<ColumnHeading text="팝업 노출여부"/>
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
									<ColumnHeading text="팝업 이미지" essential={true} />
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
												setBoardData({ ...boardData, image:file.file });
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
									<ColumnHeading text="제목" essential={true}/>
									<NormalInput
										type="input"
										placeholder="제목을 입력하세요"
										maxLength={50}
										value={boardData.title}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											onChangeInput(e, 'popup', 'title')
										}
									/>
								</EachBlock>
							</EachColumn>
							<EachColumn style={{width: '900px'}}>
								<EachBlock> 
									<div className='test' style={{ display: 'grid',gridAutoColumns:'1fr'}}>
										<div style={{ display: 'flex', justifyContent:'center'}}>
											<span style={{fontWeight:'bold', fontSize:'18px', padding:'20px 40px'}}>게시일시 {selectYear} {selectStartTime}</span>
											<span style={{fontWeight:'bold', fontSize:'18px', margin:'0 48px', padding:'20px 0'}}>~</span>
											<span style={{fontWeight:'bold', fontSize:'18px', padding:'20px 20px 20px 30px'}}>종료일시 {selectEndYear} {selectEndTime}</span>
										</div>
										<div style={{ display: 'flex', justifyContent:'center'}}>
											<div style={{ display: 'grid',gridAutoColumns:'1fr', justifyItems:'center'}}>
												<Calendar onSelect={onStartSelect} onPanelChange={onStartSelect} value={dayjs(boardData.showFrom ? boardData.showFrom : new Date())} />
												<TimePicker onSelect={startTimeSelect} status="warning" style={{marginTop: '25px', width: '100%'}}/>
											</div>
											<div style={{ display: 'grid',gridAutoColumns:'1fr', justifyItems:'center'}}>
												<Calendar onSelect={onEndSelect} onPanelChange={onEndSelect} style={{marginLeft:'30px'}} value={dayjs(boardData.showTo ? boardData.showTo : new Date())} 
												 disabledDate={(date) => {
													// 게시일시 > 종료일시가 되는 조건
													if (date.endOf('d').valueOf() < new Date(boardData.showFrom).getTime()) {
														return true;
													}
													return false;
												}}
												/>
												<TimePicker onSelect={endTimeSelect} status="warning" style={{marginLeft:'30px', marginTop:'25px', width: '100%'}}/>
											</div>
										</div>
									</div>
								</EachBlock>
							</EachColumn>
						</LeftColumn>
						<RightColumn>
							
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
