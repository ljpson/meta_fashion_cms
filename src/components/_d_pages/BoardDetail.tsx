import { useEffect, useState, useRef, ChangeEvent, ReactElement, MouseEvent } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { TweenOneGroup } from 'rc-tween-one';

//api
import { contentDetailAPI, contentCreateAPI, contentUpdateAPI } from '../../api/contents';
import { brandListAPI } from '../../api/brand';
import { designerListAPI } from '../../api/designers';
import { categoryListAPI } from '../../api/category';

//antd
import { Switch, Tag, Upload, Input, Modal, Radio, Table } from 'antd';
const { Search } = Input;
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import type { InputRef } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

//interface & types
import { BoardDataInterface } from '../../interface/data';

//components
import ColumnHeading from '../_a_atom/ColumnHeading';
import NormalButton from '../_a_atom/NormalButton';
import NormalInput from '../_a_atom/NormalInput';
import NormalSelect from '../_a_atom/NormalSelect';
import Loading from '../common/Loading';
import NormalModal from '../common/NormalModal';

const BoardDetail = () => {
	// 프리뷰를 보기 위한 임시 cors 처리
	setTimeout(() => {
		const uploadImage = document.getElementsByClassName('ant-upload-list-item-image');
		for (let i = 0; i < uploadImage.length; i++) {
			uploadImage[i].setAttribute('crossorigin', 'annonymous');
		}
	}, 0);
	//constant state
	const CONTENTS_TYPE = [
		{ title: '일반', value: 1 },
		{ title: 'AR Fit', value: 2 },
		{ title: 'Avatar Fit', value: 3 },
		{ title: 'AR + Avatar Fit', value: 4 },
	];
	const FOLLOW_COLUMNS = [
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
			width: '35%',
			onCell: (record: any, rowIndex: any) => {
				return {
					onClick: onClickDesign,
				};
			},
			render: (name: string) => {
				return <span style={{color:'#229bcd'}}>{name}</span>;
			},
		},
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
	const DATA_FRAME: BoardDataInterface = {
		profile: '',
		showYn: '',
		contents: '',
		followers: '',
		categoryId: '0',
		isShow: 1,
		title: '',
		description: '',
		type: 'nothing',
		tags: [],
		thumbnails: [],
		deleted: 0,

		concept: {
			title: 'Concept',
			description: '',
			url: [],
		},
		media: {
			title: 'Making Film',
			description: '',
			url: [],
		},
		detail: { title: '', description: '', url: [] },
		assets: {
			info: {
				name: '',
				description: '',
				thumbnail: '',
				watermarkUrl: '',
			},
			aos: {
				avatarUrl: '',
				arUrl: '',
				updateDt: Date.now(),
			},
			ios: {
				avatarUrl: '',
				arUrl: '',
				updateDt: Date.now(),
			},
		},
		designer: {
			name: '',
			description: '',
			profileUrl: '',
		},
	};
	const tagInputRef = useRef<InputRef>(null);
	const linkInputRef = useRef<InputRef>(null);
	const navigate = useNavigate();
	const { id } = useParams();

	
	// 이미지 추가 state
	const [mainImageUpload, setMainImageUpload] = useState([] as any); // 상단 이미지 []
	const [mediaImageUpload, setMediaImageUpload] = useState([] as any); // 미디어 이미지 []
	const [conceptImageUpload, setConceptImageUpload] = useState([] as any); // 컨셉 이미지 []
	const [detailImageUpload, setDetailImageUpload] = useState([] as any); // 상세 이미지 []
	const [arContentsUpload, setArContentsUpload] = useState({} as any); // AR 컨텐츠 업로드 {}
	const [arThumbImageUpload, setArThumbImageUpload] = useState({} as any); // AR 컨텐츠 썸네일 {}
	const [avatarContentsUpload, setAvatarContentsUpload] = useState({} as any); // 아바타 콘텐츠 업로드 {}
	const [avatarThumbnailUpload, setAvatarThumbnailUpload] = useState({} as any);// 아바타 콘텐츠 썸네일 {}
	const [arWatermarkUpload, setArWatermarkUpload] = useState({} as any); // 워터마크 이미지 업로드 {}

	//component state
	const [imageDelId, setImageDelId] = useState([] as any);
	const [boardData, setBoardData] = useState({} as any);
	const [brandData, setBrandData] = useState([] as any[]);
	const [designerData, setDesignerData] = useState([] as any[]);
	const [categoryList, setCategoryList] = useState([] as any[]);
	const [brandShowingData, setBrandShowingData] = useState([] as any[]);
	const [designerShowingData, setDesignerShowingData] = useState([] as any[]);
	const [originalBoardData, setOriginalBoardData] = useState({} as any);
	const [showTagInput, setShowTagInput] = useState(false);
	const [newTagValue, setNewTagValue] = useState('');
	const [showLinkInput, setShowLinkInput] = useState(false);
	const [newLinkValue, setNewLinkValue] = useState('');
	const [categoryType, setCategoryType] = useState([] as any);
	const [tagsData, setTagsData] = useState([] as any);
	const [categoryValue, setCategoryValue] = useState(1 as any);
	const [mainImageFileList, setMainImageFileList] = useState([] as any);
	const [mediaImageFileList, setMediaImageFileList] = useState([] as any);
	const [conceptImageFileList, setConceptImageFileList] = useState([] as any);
	const [detailImageFileList, setDetailImageFileList] = useState([] as any);
	const [avatarContents, setAvatarContents] = useState({} as any);
	const [avatarThumbnail, setAvatarThumbnail] = useState({} as any);
	const [arThumbImageFile, setArThumbImageFile] = useState({} as any);
	const [arContentsFile, setArContentsFile] = useState({} as any);
	const [arWatermarkFile, setArWatermarkFile] = useState({} as any);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [contentName, setContentName] = useState('');
	const [designerOpen, setDesignerOpen] = useState(false);
	const [brandOpen, setBrandOpen] = useState(false);
	const [searchDesignerText, setSearchDesignerText] = useState('');
	const [searchBrandText, setSearchBrandText] = useState('');
	const [searchText, setSearchText] = useState('');
	const [arStyle, setArStyle] = useState(false);
	const [avatarStyle, setAvatarStyle] = useState(false);
	const [boardType, setBoardType] = useState('' as any);
	const [designerValue, setDesignerValue] = useState('' as any);
	const [brandValue, setBrandValue] = useState('' as any);
	const [gender, setGender] = useState('' as any);
	const [designerId, setDesignerId] = useState(null as any);
	const [categoryId, setCategoryId] = useState(null as any);
	const [brandId, setBrandId] = useState(null as any);
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

	//useEffect
	useEffect(() => {
		if (!id) {
			setBoardData({tags:''});
			
			(async () => {
					let brandResult = await brandListAPI();
				setBrandData(brandResult);
				setBrandShowingData(brandResult);
				setBoardData({...boardData,showYn:'N'});
				let designerResult = await designerListAPI();
				setDesignerData(designerResult);
				setDesignerShowingData(designerResult);
				setBoardType([]);
				// 카테고리 리스트
				let categoryResult = await categoryListAPI();
				let parseCategoryArr: any = []
				categoryResult.map((ele:any,index:any) => {
					parseCategoryArr.push({title:ele.name,value:index,index:ele.id})
				})
				setCategoryList(parseCategoryArr);
				setCategoryType(parseCategoryArr);
				setCategoryValue([]);


			})();
		} else {
			(async () => {
				await getDetailData();
			})();
		}
	}, []);

	useEffect(() => {
		if (id && boardData.tags) {
			if (
				JSON.stringify(originalBoardData) !== JSON.stringify(boardData) ||
				imageDelId.length > 0
			) {
				setButtonDisabled(false);
			} else {
				setButtonDisabled(true);
			}
		}
	}, [
		boardData,
		arContentsFile,
		arThumbImageFile,
		arWatermarkFile,
		avatarThumbnail,
		conceptImageFileList,
		mainImageFileList,
		detailImageFileList,
	]);

	useEffect(() => {
		if (showTagInput) {
			tagInputRef.current?.focus();
		}
	}, [showTagInput]);

	useEffect(() => {
		if (showLinkInput) {
			linkInputRef.current?.focus();
		}
	}, [showLinkInput]);

	useEffect(() => {
		if(boardData.type){
			if (boardData.type =="AVATAR") {
				setAvatarStyle(true)
				setArStyle(false)
			} else if (boardData.type == "AR") {
				setAvatarStyle(false)
				setArStyle(true)
			} else if (boardData.type == "AR + Avatar Fit"){
				setAvatarStyle(true)
				setArStyle(true)
			} else {
				setAvatarStyle(true)
				setArStyle(true)
			}
		}
	}, [boardData.type]);

	//functions
	const getBase64 = (file: RcFile): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});

	const getDetailData = async () => {
		// 브랜드 리스트
		let brandResult = await brandListAPI();
		setBrandData(brandResult);
		setBrandShowingData(brandResult);

		// 디자이너 리스트
		let designerResult = await designerListAPI();
		setDesignerData(designerResult);
		setDesignerShowingData(designerResult);

		// 카테고리 리스트
		let categoryResult = await categoryListAPI();
		// setCategoryList(categoryResult);


		let result = await contentDetailAPI(Number(id));
		if (result.message === 'no id') {
			navigate('/board');
		} else {
			let detailData = result.data;
			if(detailData){

				let type = detailData.tags.includes(',')
				let parseTagArr: any = []
				if (type){
					const tagsArr = detailData.tags.split(',')
					tagsArr.map((ele:any,index:any) => {
						parseTagArr.push({title:ele,value:index+1})
					})
				}
	
	
				let parseCategoryArr: any = []
				categoryResult.map((ele:any,index:any) => {
					parseCategoryArr.push({title:ele.name,value:index,index:ele.id})
				})
				setCategoryList(parseCategoryArr)
				let firstCategory = parseCategoryArr.findIndex((ele:any)=>{
					if(detailData.categoryName !== ''){
						return ele.title == detailData.categoryName
					} else {
						return -1
					}
				})
				setCategoryValue(firstCategory)
	
				setContentName(detailData.contentName)
				if(detailData.type == 'BOTH'){
					setBoardType('AR + Avatar Fit');
				} else if( detailData.type == 'AVATAR' ){
					setBoardType('Avatar Fit');
				} else if (detailData.type == 'AR' ) {
					setBoardType('AR Fit');
				} else if ( detailData.type == 'NORMAL' ) {
					setBoardType('일반');
				} else {
					setBoardType('');
				}
				// 디자이너 id
				setDesignerValue(detailData.designerName)
				// 브랜드 id
				setBrandValue(detailData.brandName)
				// 디자이너 id
				setDesignerId(detailData.designerId)
				// 브랜드 id
				setBrandId(detailData.brandId)
				// 카테고리 id
				setCategoryId(parseCategoryArr[firstCategory].index)
				// 카테고리
				setCategoryType(parseCategoryArr)
				// 성별
				setGender(detailData.avatarGender)
				// 태그
				setTagsData(parseTagArr)
				// 기본 데이터
				setOriginalBoardData(detailData);
				// 기본 데이터
				setBoardData(detailData);
				//AR컨텐츠 
				setArContentsFile(makeFileObject(detailData.arContents?.path,detailData.arContents?.id));
				//AR썸네일
				setArThumbImageFile(makeFileObject(detailData.arThumbnail?.path.slice(1,detailData.arThumbnail.path.length),detailData.arThumbnail?.id));
				//AR워터마크
				setArWatermarkFile(makeFileObject(detailData.watermark?.path.slice(1,detailData.watermark.path.length), detailData.watermark?.id));
				//컨셉이미지
				setConceptImageFileList(makeFileObject(detailData.conceptImages,null));
				//메인이미지
				setMainImageFileList(makeFileObject(detailData.topImages,null));
				//미디어 이미지
				setMediaImageFileList(makeFileObject(detailData.medias,null));
				//상세이미지
				setDetailImageFileList(makeFileObject(detailData.detailImages,null));
				//아바타 콘텐츠 섬네일
				setAvatarThumbnail(makeFileObject(detailData.avatarThumbnail?.path.slice(1,detailData.avatarThumbnail.path.length),detailData.avatarThumbnail?.id));
				//아바타 콘텐츠 업로드
				setAvatarContents(makeFileObject(detailData.avatarContents?.path.slice(1,detailData.avatarContents.path.length),detailData.avatarContents?.id));
			} else {
				alert('로그인을 다시 해주시길 바랍니다.')
				navigate(`/`)
			}
		}
	};

	const modalStateInit = () => {
		setModalState({
			title: '',
			description: '',
			isOpen: false,
			onClickConfirm: () => {},
		});
	};
	// 세부탭
	const onClickDesign = (e: MouseEvent<HTMLElement>) => {
		const id = Number(e.currentTarget.parentElement?.getAttribute('data-row-key'));
		setDesignerId(id)
		setDesignerValue(e.currentTarget.innerText)
		setBoardData({...boardData,designerName : e.currentTarget.innerText})
		setDesignerOpen(false)
	};
	// 세부탭
	const onClickBrand = (e: MouseEvent<HTMLElement>) => {
		const id = Number(e.currentTarget.parentElement?.getAttribute('data-row-key'));
		setBrandId(id)
		setBrandValue(e.currentTarget.innerText)
		setBoardData({...boardData, brandName : e.currentTarget.innerText})
		setBrandOpen(false)
	};

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

	const makeFileName = (category: string, name: string): string => {
		if (name) {
			let extension = name.split('.').pop();
			let filename: string = '';
			switch (category) {
				case 'top':
					filename = `topImage.${extension}`;
					break;
				case 'media':
					filename = `media.${extension}`;
					break;
				case 'concept':
					filename = `concept.${extension}`;
					break;
				case 'detail':
					filename = `detail.${extension}`;
					break;
				case 'arContent':
					filename = `arContent.${extension}`;
					break;
				case 'arThumb':
					filename = `arThumb.${extension}`;
					break;
				case 'avatarContents':
					filename = `avatarContents.${extension}`;
					break;
				case 'avatarThumbnail':
					filename = `avatarThumbnail.${extension}`;
					break;
				case 'water':
					filename = `waterMark.${extension}`;
					break;
			}
			return filename;
		}
		return '';
	};

	const onClickCancle = () => {
		navigate(-1);
	};

	const onClickNewBadgeInput = (key: string) => {
		key === 'tag' ? setShowTagInput(true) : setShowLinkInput(true);
	};

	const onChangeNewBadgeInput = (e: ChangeEvent<HTMLInputElement>, key: string) => {
		key === 'tag' ? setNewTagValue(e.target.value) : setNewLinkValue(e.target.value);
	};

	const onSubmitNewBadgeInput = (e: any, key: string) => {
		const element = e.target as HTMLInputElement;
		const newValue = element.value;
		if (key === 'tag') {
			if (!boardData.tags.includes(newValue) && newValue !== '') {
				let type = boardData.tags.includes(',')
				let tagArr: any = []
				let pushArr: any = []
				let tagDataArr : any = null
				if(tagsData.length > 0){
						let tagArr = tagsData.map((ele:any)=>{
							return ele.title
						})
						let parseTags = String(tagArr) + ',' + newValue
						const tagsArr = parseTags.split(',')
						tagsArr.map((ele:any,index:any) => {
							pushArr.push({title:ele,value:index+1})
						})
						tagDataArr = pushArr.map((ele:any) => {
							return ele.title
						})
					setBoardData({
						...boardData,
						tags: String(tagDataArr),
					});
					setTagsData(pushArr)
				} else {
					tagDataArr = [{title : newValue, value:1}]
					setBoardData({
						...boardData,
						tags: newValue,
					});
					setTagsData(tagDataArr)
				}
			}
			setShowTagInput(false);
			setNewTagValue('');
		} else {
			if (!boardData.media.url.includes(newValue) && newValue !== '') {
				setBoardData({
					...boardData,
					media: { ...boardData.media, url: [...boardData.media.url, newValue] },
				});
			}
			setShowLinkInput(false);
			setNewLinkValue('');
		}
	};

	const onChangeSelect = (value: any, key: string) => {
		if (key == 'type') {
			switch (value) {
				case '1':
					setBoardData({...boardData,type:'NORMAL'});
					setBoardType('일반');
					return;
				case '2':
					setBoardData({...boardData,type:'AR'});
					setBoardType('AR Fit');
					return;
				case '3':
					setBoardData({...boardData,type:'AVATAR'});
					setBoardType('Avatar Fit');
					return;
				case '4':
					setBoardData({...boardData,type:'AR + Avatar Fit'});
					setBoardType('AR + Avatar Fit');
					return;
			}
		}else if(key ==='categoryType'){
			let categoryIdArr = categoryList.filter(ele=>{
				if(ele.value == value){
					return ele.index
				}
			})
			setCategoryId(categoryIdArr[0].index)
			setBoardData({...boardData,categoryName:categoryIdArr[0].title});
			setBoardData({...boardData,categoryId:categoryIdArr[0].index});
			setCategoryValue(value)
		}
	};

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>, key1: string, key2?: string) => {
		const { value } = e.target;
		if (key2) {
			switch (key1) {
				case 'assets':
					setBoardData({
						...boardData,
						[key1]: { ...boardData.assets, info: { ...boardData.assets.info, [key2]: value } },
					});
					return;
				case 'contentName':
					setContentName(value)
					setBoardData({
						...boardData,
						contentName: value,
					});
					return
				case 'concept':
					setBoardData({
						...boardData,
						conceptDescription: value,
					});
					return
				case 'media':
				case 'detail':
					setBoardData({
						...boardData,
						detailDescription: value,
					});
					return;
			}
		} else {
			setBoardData({ ...boardData, [key1]: value });
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
	const validate = () => {
		if(boardData.type == 'AR'){
			if (
				!boardData.categoryId ||
				!boardData.type ||
				boardData.title == '' ||
				boardData.description == '' ||
				!designerId || !brandId || contentName == '' ||
				Object.keys(arContentsUpload).length < 1 || Object.keys(arThumbImageUpload).length < 1 || Object.keys(arWatermarkUpload).length < 1 ||mainImageUpload.length <1
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
		} else if (boardData.type == 'AVATAR'){
			if (
				!boardData.categoryId ||
				!boardData.type ||
				boardData.title == '' ||
				boardData.description == '' ||
				!designerId || !brandId || contentName == '' || gender == '' ||
				Object.keys(avatarContents).length < 1 || Object.keys(avatarThumbnail).length < 1 || Object.keys(arWatermarkUpload).length < 1 ||mainImageUpload.length <1
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
		} else if (boardData.type == 'BOTH' || boardData.type == 'NORMAL'){
			if (
				!boardData.categoryId ||
				!boardData.type ||
				boardData.title == '' ||
				boardData.description == '' ||
				!designerId || !brandId || contentName == '' || gender == '' ||
				Object.keys(arContentsUpload).length <1 || Object.keys(arThumbImageUpload).length <1 || Object.keys(avatarContents).length <1 || Object.keys(avatarThumbnail).length <1 || Object.keys(arWatermarkUpload).length <1 || mainImageUpload
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
		} 
	};

	const onSubmitAllData = async () => {
		
		if (!validate()) {
			return;
		}
		// if (conceptImageFileList.length === 0) {
		// 	setBoardData({ ...boardData, conceptImages: { ...boardData.conceptImages } });
		// }
		// if (boardData.medias.length === 0) {
		// 	setBoardData({ ...boardData, medias: { ...boardData.medias } });
		// }
		

		const formData = new FormData();
		console.log('boardData',boardData);
		// console.log('imageDelId',String(imageDelId));
		// console.log('ArContentsUpload',arContentsUpload);
		// console.log('arThumbImageUpload',arThumbImageUpload);
		// console.log('avatarContentsUpload',avatarContentsUpload);
		// console.log('avatarThumbnailUpload',avatarThumbnailUpload);

		// console.log('mainImageUpload',mainImageUpload);
		// console.log('mediaImageUpload',mediaImageUpload);
		// console.log('conceptImageUpload',conceptImageUpload);
		// console.log('detailImageUpload',detailImageUpload);

		formData.append('designerId', String(designerId));
		formData.append('brandId', String(brandId));
		formData.append('type', boardData.type);
		formData.append('title', boardData.title);
		formData.append('description', boardData.description);
		formData.append('tags', boardData.tags || '옷,가방,노트북');
		formData.append('contentName', boardData.contentName);
		formData.append('mediaDescription', boardData.mediaDescription || '미디어 설명');
		formData.append('conceptDescription', boardData.conceptDescription);
		formData.append('detailDescription', boardData.detailDescription);
		formData.append('avatarGender', gender || 'FEMALE');
		formData.append('showYn', boardData.showYn);

		// TODO map으로 돌려서 append하기
		mainImageUpload.map((item:any)=>{
			formData.append('topImage', new File([item], makeFileName('top', item.name)));
		})
		mediaImageUpload.map((item:any) => {
			formData.append('media', new File([item], makeFileName('media', item.name)));
		})
		conceptImageUpload.map((item:any) => {
			formData.append('conceptImage', new File([item], makeFileName('concept', item.name)));
		})
		detailImageUpload.map((item:any) => {
			formData.append('detailImage', new File([item], makeFileName('detail', item.name)));
		})
		formData.append('arContents', new File([arContentsUpload], makeFileName('arContent', arContentsUpload.name)));
		formData.append('arThumbnail', new File([arThumbImageUpload], makeFileName('arThumb', arThumbImageUpload.name)));
		formData.append('avatarContents', new File([avatarContentsUpload], makeFileName('avatarContents', avatarContentsUpload.name)));
		formData.append('avatarThumbnail', new File([avatarThumbnailUpload], makeFileName('avatarThumbnail', avatarThumbnailUpload.name)));
		formData.append('watermark',new File([arWatermarkUpload], makeFileName('water', arWatermarkUpload.name)));
		formData.append('categoryId', String(categoryId));
		formData.append('assetIds', String(imageDelId));
			for (let key of formData.keys()) {
				console.log(key, ":", formData.get(key));
			}
		if (id) {
			for (let key of formData.keys()) {
				console.log(key, ":", formData.get(key));
			}
			let result = await contentUpdateAPI(formData,Number(id));
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
		} else {
			for (let key of formData.keys()) {
				console.log(key, ":", formData.get(key));
			}
			let result = await contentUpdateAPI(formData,null);
			if (result.message === 'success') {
				setModalState({
					title: '등록 완료',
					description: '새 게시글 등록이 완료되었습니다.',
					isOpen: true,
					onClickConfirm: () => {
						modalStateInit();
						navigate(-1);
					},
				});
			}
		}
			setBoardData(DATA_FRAME);
			setArContentsFile({});
			setArThumbImageFile({});
			setArWatermarkFile({});
			setAvatarThumbnail({});
			setMainImageFileList([]);
			setMediaImageFileList([]);
			setConceptImageFileList([]);
			setDetailImageFileList([]);
	};
	const testDel = (file:any) =>{
		if(file.id) {
			imageDelId.push(file.id)
		} else if(file.fileList && file.fileList[0].id){
			imageDelId.push(file.fileList[0].id)
		} else {
			return
		}
		setImageDelId(imageDelId)
	}
	const onDesignerOpen = (value:any) => {
		
		if (designerValue !== '') {
			const searchedList = designerData.filter((data: BoardDataInterface) =>
			// console.log('data',data)
				data.name?.includes(designerValue)
			);
			setDesignerShowingData(searchedList);
		}
		setDesignerOpen(true)
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
	const onChangeDesigner = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setDesignerValue(value)
		if (value === '') {
			return setDesignerShowingData(designerData);
		}
		setSearchDesignerText(value);
	};
	const onChangeBrand = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setBrandValue(value)
		if (value === '') {
			return setBrandShowingData(brandData);
		}
		setSearchBrandText(value);
	};
	const onDesignerSearch = () => {
		const searchedList = designerData.filter((data: BoardDataInterface) =>
			data.name.includes(searchDesignerText)
		);
		setDesignerShowingData(searchedList);
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
		setDesignerOpen(false)
		setSearchBrandText('');
		setSearchDesignerText('');
		// setBrandValue('')
		// setDesignerValue('')
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
						open={designerOpen}
						title={`디자이너 검색`}
						onOk={handleOk}
						onCancel={handleCancel}
						footer={[]}
						className = 'TestClass'
					>
						<Search
							className='design'
							placeholder="디자이너를 입력해주세요."
							onSearch={onDesignerSearch}
							onChange={onChangeDesigner}
							maxLength={20}
							enterButton
							value={designerValue}
						/>
						<Table
							rowKey={(render: any) => render.id}
							columns={FOLLOW_COLUMNS}
							dataSource={designerShowingData}
							pagination={{ pageSize: 20, position: ['bottomCenter'],showSizeChanger:false }}
							bordered
							
							style={{ width: '100%',height:'500px',overflow:'auto' }}
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
									<ColumnHeading text="게시글 노출여부" />
									<Switch
										style={{
											width: '70px',
										}}
										checkedChildren="공개"
										unCheckedChildren="비공개"
										checked={Boolean(boardData.showYn =='Y' ? true : false)}
										onChange={(value: boolean) => {
											setBoardData({ ...boardData, showYn: value == true ? 'Y' : 'N' });
										}}
									/>
								</EachColumn>
								<EachColumn>
									<EachBlock>
										<ColumnHeading text="피드 종류" essential={true} />
										<NormalSelect
											items={CONTENTS_TYPE}
											value={boardType == '' ? [] : boardType}
											placeholder="종류를 선택하세요"
											onChange={(value: string) => {
												onChangeSelect(String(value), 'type');
											}}
										/>
									</EachBlock>
									<EachBlock style={{paddingLeft:'20px'}}>
										<ColumnHeading text="피드 카테고리" essential={true} />
										<NormalSelect
											items={categoryType}
											value={categoryValue < 0 ? [] : categoryValue}
											placeholder={"카테고리를 선택하세요"}
											onChange={(value: string) => onChangeSelect(value, 'categoryType')}
										/>
									</EachBlock>
								</EachColumn>
								<EachColumn>
									<EachBlock>
										<ColumnHeading text="피드 제목" essential={true} />
										<NormalInput
											type="text"
											placeholder="제목을 입력하세요"
											maxLength={20}
											value={boardData.title}
											onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeInput(e, 'title')}
										/>
									</EachBlock>
									</EachColumn>
								<EachColumn>
									<EachBlock>
										<ColumnHeading text="피드 내용" essential={true} />
										<NormalInput
											type="textarea"
											placeholder="콘텐츠 내용을 입력하세요"
											maxLength={50}
											value={boardData.description}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												onChangeInput(e, 'description')
											}
										/>
									</EachBlock>
								</EachColumn>
								<EachColumn style={{ marginTop: '30px' }}>
									<EachBlock>
										<ColumnHeading text="태그" />
										{showTagInput ? (
											<Input
												ref={tagInputRef}
												type="text"
												size="small"
												style={{
													width: 150,
													height: 20,
													padding: '2px',
													fontSize: '12px',
													borderRadius: '5px',
												}}
												value={newTagValue}
												placeholder="태그를 입력해 주세요"
												onChange={(e: any) => onChangeNewBadgeInput(e, 'tag')}
												onBlur={() => {
													setShowTagInput(false);
													setNewTagValue('');
												}}
												onPressEnter={(e: any) => onSubmitNewBadgeInput(e, 'tag')}
											/>
										) : (
											<Tag
												onClick={() => onClickNewBadgeInput('tag')}
												className="site-tag-plus"
												style={{
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
													height: '20px',
													width: '80px',
													fontSize: '0.9rem',
													fontWeight: 'bold',
													cursor: 'pointer',
												}}
											>
												<PlusOutlined />
												&nbsp; 태그 추가
											</Tag>
										)}
										{ boardData.tags ? (
											<TweenOneGroup
												style={{ marginTop: '8px' }}
												enter={{
													scale: 0.8,
													opacity: 0,
													type: 'from',
													duration: 100,
												}}
												onEnd={(e) => {
													if (e.type === 'appear' || e.type === 'enter') {
														(e.target as any).style = 'display: inline-block';
													}
												}}
												leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
												appear={false}
											>
												{boardData?.tags.split(',').map((tag:any, idx:any) => (
													<Tag
														color="geekblue"
														key={idx}
														closable
														onClose={(e) => {
															e.preventDefault();
															const newTags = tagsData.filter((tagItem:any) => tagItem.title !== tag);
															setTagsData(newTags)
															let tagsArr = newTags.map((ele:any)=> ele.title)

															setBoardData({
																...boardData,
																tags: String(tagsArr),
															});
														}}
													>
														{tag}
													</Tag>
												))}
											</TweenOneGroup>
										) : (
											<div style={{ height: '30px' }}></div>
										)}
									</EachBlock>
								</EachColumn>
								<EachColumn>
									<EachBlock style={{ paddingRight: '15px' }}>
											<ColumnHeading text="디자이너" essential={true} />
											<Search
												placeholder="디자이너를 입력하세요"
												onSearch={onDesignerOpen}
												maxLength={20}
												enterButton
												value={designerValue}
												onChange={e => {
													setDesignerValue(e.target.value)
												}}
											/>
										</EachBlock>
								</EachColumn>
								<EachColumn>
									<EachBlock style={{ paddingRight: '15px' }}>
										<ColumnHeading text="브랜드" essential={true} />
										<Search
												placeholder="브랜드를 입력하세요"
												onSearch={onBrandOpen}
												maxLength={20}
												enterButton
												value={brandValue}
												onChange={e => setBrandValue(e.target.value)}
											/>
									</EachBlock>
								</EachColumn>
								<EachColumn>
									<EachBlock style={{ paddingRight: '15px' }}>
										<ColumnHeading text="콘텐츠 이름" essential={true} />
										<NormalInput
											type="text"
											placeholder="의상을 입력하세요"
											maxLength={20}
											value={contentName}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												onChangeInput(e, 'contentName', 'name')
											}
										/>
									</EachBlock>
								</EachColumn>
								<div style={arStyle ? { display:'block'} : {display : 'none'}}>
									<EachColumn style={{ marginTop: '30px' }}>
										<EachBlock style={{ paddingRight: '15px' }}>
											<ColumnHeading text="AR 컨텐츠 업로드" essential={true} />
											<Upload
												style={{ display: 'inline-block' }}
												customRequest={() => {}}
												onPreview={onClickPreview}
												fileList={arContentsFile?.name && [arContentsFile]}
												onRemove={(file) =>testDel(file)}
												onChange={(file) => {
													if (file.file.status === 'removed') {
														setArContentsFile(file.fileList as any[]);
														setArContentsUpload(file.fileList as any[]);
													} else {
														if (file.file.status === 'uploading') {
															testDel(file)

															setArContentsUpload(file.file);
															file.file.status = 'done';
														}
														setArContentsFile(file.file)
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
									<EachColumn style={{ marginTop: '20px' }}>
										<EachBlock>
											<ColumnHeading text="AR 컨텐츠 썸네일" essential={true} />
											<Upload
												style={{ display: 'inline-block' }}
												customRequest={() => {}}
												fileList={arThumbImageFile?.name ? [arThumbImageFile] : []}
												onPreview={onClickPreview}
												onRemove={(file) =>testDel(file)}
												onChange={(file) => {
													if (file.file.status === 'uploading') {
														testDel(file)

														setArThumbImageUpload(file.file);
														file.file.status = 'done';
													}
													if (file.file.status === 'removed') {
														setArThumbImageFile(file.fileList as any[]);
														setArThumbImageUpload(file.fileList as any[]);
													} else { 
														setArThumbImageFile(file.file);
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
								</div>
								<div style={avatarStyle ? { display:'block'} : {display : 'none'}}>
									<EachColumn style={{ marginTop: '30px' }}>
										<EachBlock>
											<ColumnHeading text="아바타 콘텐츠 성별" essential={true} />
											<Radio checked={gender == "FEMALE"} value="FEMALE" onChange={(e)=>{
												setBoardData({...boardData, avatarGender: e.target.value})
												setGender(e.target.value)
											}}>여성</Radio>
											<Radio checked={gender != "FEMALE"} value="MALE" onChange={(e)=>{
												setBoardData({...boardData, avatarGender: e.target.value})
												setGender(e.target.value)
											}}>남성</Radio>
										</EachBlock>
									</EachColumn>
									<EachColumn style={{ marginTop: '20px' }}>
										<EachBlock>
											<ColumnHeading text="아바타 콘텐츠 업로드" essential={true} />
											<Upload
												style={{ display: 'inline-block' }}
												customRequest={() => {}}
												onPreview={onClickPreview}
												onRemove={(file) =>testDel(file)}
												fileList={avatarContents?.name && [avatarContents]}
												onChange={(file) => {
													if (file.file.status === 'removed') {
														setAvatarContents(file.fileList as any[]);
														setAvatarContentsUpload(file.fileList as any[]);
													} else {
														if (file.file.status === 'uploading') {
															testDel(file)
															setAvatarContentsUpload(file.file);
															file.file.status = 'done';
														}
														setAvatarContents(file.file)
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
									<EachColumn style={{ marginTop: '20px' }}>
										<EachBlock>
											<ColumnHeading text="아바타 콘텐츠 썸네일" essential={true} />
											<Upload
												style={{ display: 'inline-block' }}
												customRequest={() => {}}
												fileList={avatarThumbnail?.name ? [avatarThumbnail] : []}
												onPreview={onClickPreview}
												onRemove={(file) =>testDel(file)}
												onChange={(file) => {
													if (file.file.status === 'removed') {
														setAvatarThumbnail(file.fileList as any[]);
														setAvatarThumbnailUpload(file.fileList as any[]);
													} else {
														if (file.file.status === 'uploading') {
															testDel(file)
															setAvatarThumbnailUpload(file.file);
															file.file.status = 'done';
														}
														setAvatarThumbnail(file.file)
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
								</div>
							</LeftColumn>
							<Border />
							<RightColumn>
								<EachColumn>
									<EachBlock>
										<ColumnHeading text="상단 이미지" essential={true} />
										<Upload
											customRequest={() => {}}
											listType="picture-card"
											fileList={mainImageFileList}
											onPreview={onClickPreview}
											onRemove={(file) =>testDel(file)}
											onChange={(file) => {
												if (file.file.status === 'removed') {
													if (id) {
														let newThumbnails = boardData.topImages.filter((thumbnail:any) => !thumbnail.path.includes(file.file.name));
														let isUpload = file.fileList.filter((ele:any)=>ele.status)
														setMainImageUpload(isUpload);
														setBoardData({ ...boardData, topImages: newThumbnails });
													}else {
														setMainImageUpload(file.fileList as any[]);
													}
													setMainImageFileList(file.fileList as any[]);
												} else {
													if (file.fileList.length !== mainImageFileList.length) {
														if (file.file.status === 'uploading') {
															let newThumbnails = mainImageUpload.filter((ele:any) => ele?.name?.includes(file.file.name));
															if(newThumbnails.length < 1){
																mainImageUpload.push(file.file)
															}
															file.file.status = 'done';
														}
														let originFile = file.file;
														let newList = mainImageFileList.concat(originFile);
														setMainImageFileList(newList);
													}
												}
											}}
										>
											<UploadOutlined />
											파일 선택
										</Upload>
									</EachBlock>
								</EachColumn>
								<EachColumn>
									<EachBlock>
										<ColumnHeading text="미디어 이미지" />
										<Upload
											customRequest={() => {}}
											listType="picture-card"
											fileList={mediaImageFileList}
											onPreview={onClickPreview}
											onRemove={(file) =>testDel(file)}
											onChange={(file) => {
												if (file.file.status === 'removed') {
													if (id) {
														let newThumbnails = boardData.medias.filter((ele:any) => !ele.path.includes(file.file.name));
														let isUpload = file.fileList.filter((ele:any)=>ele.status)
														setMediaImageUpload(isUpload);
														setBoardData({ ...boardData, medias: newThumbnails });
													} else{
														setMediaImageUpload(file.fileList as any[]);
													}
													setMediaImageFileList(file.fileList as any[]);
												} else {
													if (file.fileList.length !== mediaImageFileList.length) {
														if (file.file.status === 'uploading') {
															let newThumbnails = mediaImageUpload.filter((ele:any) => ele?.name?.includes(file.file.name));
															if(newThumbnails.length < 1){
																mediaImageUpload.push(file.file)
															}
															file.file.status = 'done';
														}
														let originFile = file.file;
														let newList = mediaImageFileList.concat(originFile);
														setMediaImageFileList(newList);
													}
												}
											}}
										>
											<UploadOutlined />
											파일 선택
										</Upload>
									</EachBlock>
								</EachColumn>
								<EachColumn style={{ marginBottom: '0px' }}>
									<EachBlock>
										<ColumnHeading text="컨셉 이미지" />
										<Upload
											customRequest={() => {}}
											listType="picture-card"
											fileList={conceptImageFileList}
											onPreview={onClickPreview}
											onRemove={(file) =>testDel(file)}
											onChange={(file) => {
												if (file.file.status === 'removed') {
													if (id) {
														let newConcepts = boardData.conceptImages.filter((concept:any) => !concept.path.includes(file.file.name));
														let isUpload = file.fileList.filter((ele:any)=>ele.status)
														setConceptImageUpload(isUpload);
														setBoardData({...boardData,concept: { ...boardData.concept, url: newConcepts }});
													} else{
														setConceptImageUpload(file.fileList as any[]);
													}
													setConceptImageFileList(file.fileList as any[]);
												} else {
													if (file.fileList.length !== conceptImageFileList.length) {
														if (file.file.status === 'uploading') {
															let newThumbnails = conceptImageUpload.filter((ele:any) => ele?.name?.includes(file.file.name));
															if(newThumbnails.length < 1){
																conceptImageUpload.push(file.file)
															}
															file.file.status = 'done';
														}
														let newList = conceptImageFileList.concat(file.file);
														setConceptImageFileList(newList);
													}
												}
											}}
										>
											<UploadOutlined />
											파일 선택
										</Upload>
									</EachBlock>
								</EachColumn>
								<EachColumn>
									<EachBlock>
										<ColumnHeading text="컨셉 소개" />
										<NormalInput
											type="textarea"
											placeholder="소개 내용을 입력하세요"
											maxLength={50}
											value={boardData.conceptDescription}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												onChangeInput(e, 'concept', 'description')
											}
										/>
									</EachBlock>
								</EachColumn>
								<EachColumn>
									<EachBlock>
										<ColumnHeading text="상세 이미지" />
										<Upload
											customRequest={() => {}}
											listType="picture-card"
											fileList={detailImageFileList}
											onPreview={onClickPreview}
											onChange={(file) => {
												if (file.file.status === 'removed') {
													if (id) {
														let newDetails = boardData.detailImages.filter((detail:any) => !detail.path.includes(file.file.name));
														let isUpload = file.fileList.filter((ele:any)=>ele.status)
														setDetailImageUpload(isUpload);
														setBoardData({...boardData, detail: { ...boardData.detail, url: newDetails }});
													} else{
														setDetailImageUpload(file.fileList as any[]);
													}
													setDetailImageFileList(file.fileList as any[]);
												} else {
													if (file.fileList.length !== detailImageFileList.length) {
														if (file.file.status === 'uploading') {
															let newThumbnails = detailImageUpload.filter((ele:any) => ele?.name?.includes(file.file.name));
															if(newThumbnails.length < 1){
																detailImageUpload.push(file.file)
															}
															file.file.status = 'done';
														}
														let newList = detailImageFileList.concat(file.file);
														setDetailImageFileList(newList);
													}
												}
											}}
										>
											<UploadOutlined />
											파일 선택
										</Upload>
									</EachBlock>
								</EachColumn>
								<EachColumn>
									<EachBlock>
										<ColumnHeading text="상세이미지 소개" />
										<NormalInput
											type="textarea"
											placeholder="소개 내용을 입력하세요"
											maxLength={50}
											value={boardData.detailDescription}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												onChangeInput(e, 'detail', 'description')
											}
										/>
									</EachBlock>
								</EachColumn>
								<EachColumn>
									<EachBlock>
										<ColumnHeading text="워터마크 이미지 업로드" essential={true} />
										<Upload
												style={{ display: 'inline-block' }}
												customRequest={() => {}}
												onPreview={onClickPreview}
												fileList={arWatermarkFile?.name ? [arWatermarkFile] : []}
												onRemove={(file) =>testDel(file)}
												onChange={(file) => {
													if (file.file.status === 'removed') {
														setArWatermarkFile(file.fileList as any[]);
														setArWatermarkUpload(file.fileList as any[]);
													} else {
														if (file.file.status === 'uploading') {
															testDel(file)
															setArWatermarkUpload(file.file);
															file.file.status = 'done';
														}
														setArWatermarkFile(file.file)
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
