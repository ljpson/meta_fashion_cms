import { ReactElement, useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

//api
import { adminListAPI, adminDetailAPI, addAdminAPI } from '../../api/permission';
import { designerListAPI } from '../../api/designers';
import NormalSelect from '../_a_atom/NormalSelect';
import MemberSelect from '../_a_atom/MemberSelect';

//antd
import { Table, Modal, Button, Select, Input } from 'antd';
const { Option } = Select;
const { Search } = Input;
import { FileImageOutlined } from '@ant-design/icons';
import MemberInput from '../_a_atom/MemberInput';

//interface & types
import { BoardDataInterface } from '../../interface/data';

//components
import NormalButton from '../_a_atom/NormalButton';
import { Key } from 'antd/lib/table/interface';

const Board = () => {
	const navigate = useNavigate();
	let adminSelect : any = [{
		value: '1',
		title: '디자이너',
		engTitle: 'DESIGNER'
	},{
		value: '2',
		title: '운영자',
		engTitle: 'OPERATOR'
	},{
		value: '3',
		title: '어드민',
		engTitle: 'ADMIN'
	},{
		value: '4',
		title: '슈퍼 어드민',
		engTitle: 'SUPERADMIN'
	}]
	let statusSelect : any = [{
		value: '1',
		title: '승인 대기',
		engTitle: 'READY'
	},{
		value: '2',
		title: '승인',
		engTitle: 'ACCEPT'
	},{
		value: '3',
		title: '반려',
		engTitle: 'REJECT'
	},{
		value: '4',
		title: '정지',
		engTitle: 'BLOCK'
	}]

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

	const BOARD_COLUMNS = [
		{
			title: '번호',
			dataIndex: ['id'],
			width: '6%',
			render: (id: number) => {
				return <span style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height:'60px'
				}}>{id}</span>;
			},
		},
		{
			title: '소속',
			dataIndex: ['part'],
			width: '10%',
			render: (part: string) => {
				return <span>{part}</span>;
			},
		},
		{
			title: '이름',
			dataIndex: ['name'],
			width: '18%',
			onCell: (record: any, rowIndex: any) => {
				return {
					onClick: onClickRowCallback,
				};
			},
			render: (name: string) => {
				return (
					<span style={{color:'#229bcd'}}>{name}</span>
				);
			},
		},
		{
			title: '아이디',
			dataIndex: ['account'],
			width: '18%',
			render: (account: string) => {
				return (
					<span>{account}</span>
				);
			},
		},
		{
			title: '권한',
			dataIndex: ['authority'],
			width: '12%',
			render: (authority: string, arr:any) => {
				let index = 0
				switch (authority) {
					case "DESIGNER":
						index = 0
						break;
					case "OPERATOR":
						index = 1
						break;
					case "ADMIN":
						index = 2
						break;
					case "SUPERADMIN":
						index = 3
						break;
					default:
						break;
				}
				return (
					<MemberSelect
						items={adminSelect}
						id={arr.id}
						onChange={handleChangeSelect}
						defaultValue={adminSelect[index]}
						disabled={false}
						style={{ width: '180px' }}
					/>

					// <span>{authority}</span>
				);
			},
		},
		{
			title: '상태',
			dataIndex: 'status',
			width: '12%',
			render: (status: string, arr: any) => {
				let index = 0
				switch (status) {
					case "READY":
						index = 0
						break;
					case "ACCEPT":
						index = 1
						break;
					case "REJECT":
						index = 2
						break;
					case "BLOCK":
						index = 3
						break;
					default:
						break;
				}
				let idPermission = sessionStorage.getItem("authority")
				return (
					<MemberSelect
						items={statusSelect}
						id={arr.id}
						onChange={handleChangeStatus}
						defaultValue={statusSelect[index]}
						style={{ width: '180px' }}
						disabled={idPermission == 'ADMIN' || idPermission =='SUPERADMIN' ? false : true}
					/>

				);
			},
		},
		{
			title: '수정자/수정일',
			dataIndex: 'updateDate',
			width: '15%',
			render: (updateDate: string, arr: any) => {
				let getDate = ''
				if(updateDate){
					const year = new Date (updateDate).getFullYear()
					const month = new Date (updateDate).getMonth() +1 < 10 ? ''+new Date (updateDate).getMonth() +1 : new Date (updateDate).getMonth() +1
					const date = new Date (updateDate).getDate()
					getDate = year + '-' + month + '-' + date
				} else {
					getDate = '-'
				}
				return <span>{(arr.updateBy || '-') + ' / ' + getDate}</span>;
			},
		}
	];

	//component state
	const [originalData, setOriginalData] = useState([] as any);
	const [showingData, setShowingData] = useState([] as any);
	const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
	const [partData, setPartData] = useState('');
  const [title, setTitle] = useState('');
  const [name, setNameData] = useState('');
  const [id, setIdData] = useState('');
  const [password, setPasswordData] = useState('');
  const [defaultAuth, setDefaultAuth] = useState('');

	const [designerData, setDesignerData] = useState([] as any[]);
	const [designerOpen, setDesignerOpen] = useState(false);
	const [designerValue, setDesignerValue] = useState('' as any);
	const [designerShowingData, setDesignerShowingData] = useState([] as any[]);
	const [searchDesignerText, setSearchDesignerText] = useState('');
	const [designerId, setDesignerId] = useState(null as any);
	const [styleData, setStyleData] = useState('' as any);

  const [defaultStatus, setDefaultStatus] = useState('');
  const [styleSet, setStyleSet] = useState('');
  const [idStyleSet, setIdStyleSet] = useState('');
  const [clickId, setClickId] = useState(0);
	const [selectedList, setSelectedList] = useState([] as any);
	const [selectedKeyList, setSelectedKeyList] = useState([] as Key[]);
	const [searchText, setSearchText] = useState('');
	const [authorityData, setAuthorityData] = useState('' as any);
	const [selectItem, setSelectItem] = useState([] as any);

	//useEffect
	useEffect(() => {
		(async () => {
			let idPermission = sessionStorage.getItem("authority")
			setAuthorityData(idPermission)
			if(idPermission == 'SUPERADMIN'){
				setSelectItem([{
					value: '1',
					title: '디자이너',
					engTitle: 'DESIGNER'
				},{
					value: '2',
					title: '운영자',
					engTitle: 'OPERATOR'
				},{
					value: '3',
					title: '어드민',
					engTitle: 'ADMIN'
				},{
					value: '4',
					title: '슈퍼 어드민',
					engTitle: 'SUPERADMIN'
				}])
			} else if (idPermission == 'ADMIN' ) {
				setSelectItem([{
					value: '1',
					title: '디자이너',
					engTitle: 'DESIGNER'
				},{
					value: '2',
					title: '운영자',
					engTitle: 'OPERATOR'
				}])
			} else if(idPermission == 'OPERATOR') {
				setSelectItem([{
					value: '1',
					title: '디자이너',
					engTitle: 'DESIGNER'
				}])
			}
			await getContentList();
		})();
	}, []);
	const handleChangeSelect = async (value: any,arr:any) => {
		let authority = ''
		let filterData = originalData.filter((ele:any) =>ele.id == arr.id)
		let status = filterData[0]['status']
		switch (adminSelect[value-1].title) {
			case "디자이너":
				authority = 'DESIGNER'
				break;
			case "운영자":
				authority = 'OPERATOR'
				break;
			case "어드민":
				authority = 'ADMIN'
				break;
			case "슈퍼 어드민":
				authority = 'SUPERADMIN'
				break;
			default:
				break;
		}
		let data = {
			"authority":authority,
			"status": status
		}
		await addAdminAPI(data,arr.id);
		await getContentList();
		
	};
	const handleChangeStatus = async (value: any,arr:any) => {
		let status = ''
		let filterData = originalData.filter((ele:any) =>ele.id == arr.id)
		let authority = filterData[0]['authority']
		
		switch (arr.children) {
			case "승인 대기":
				status = 'READY'
				break;
			case "승인":
				status = 'ACCEPT'
				break;
			case "반려":
				status = 'REJECT'
				break;
			case "정지":
				status = 'BLOCK'
				break;
			default:
				break;
		}
		let data = {
			"account":"kea@nari.com",
			"password":"1111",
			"name":"개나리1",
			"part":"사업부",
			"authority": authority || 'DESIGNER',
			"status": status
		}
		await addAdminAPI(data,arr.id);
		await getContentList();
		
	};
	//functions
	const getContentList = async () => {
		let result = await adminListAPI();
		if(result){
			setOriginalData(result);
			setShowingData(result);

		} else {
			alert('로그인을 다시 해주시길 바랍니다.')
			navigate('/')
		}

		let designerResult = await designerListAPI();
		setDesignerData(designerResult);
		setDesignerShowingData(designerResult);
		
	};

	const openRegister = () => {
		setDefaultAuth('디자이너')
		setStyleData('block')
		setOpen(true);
		setTitle('등록');
	}
	const onClickRowCallback = async (e: MouseEvent<HTMLElement>) => {
		if(authorityData !== 'DESIGNER' ){
			const id = Number(e.currentTarget.parentElement?.getAttribute('data-row-key'));
			let originArr = originalData.filter((ele:any) =>ele.id == id)
			// null로 떨어지는경우?
			let authorityDatas = null
			if(originArr[0].authority){
				authorityDatas = adminSelect.filter((ele:any) =>ele.engTitle == originArr[0].authority)
			} else {
				authorityDatas = adminSelect.filter((ele:any) =>ele.engTitle == 'DESIGNER')
			}
			let statusData = null
			if(originArr[0].status){
				statusData = statusSelect.filter((ele:any) =>ele.engTitle == originArr[0].status)
			} else {
				statusData = statusSelect.filter((ele:any) =>ele.engTitle == 'READY')
			}

			setTitle('수정')
			setClickId(id)
			setPartData(originArr[0].part)
			setNameData(originArr[0].name)
			setIdData(originArr[0].account)
			// setPasswordData(originArr[0].password)
			setDefaultAuth(authorityDatas[0].title)
			let style = ''

			if(originArr[0].authority === 'DESIGNER'){
				style = 'block'
			} else {
				style = 'none'
			}
			setStyleData(style)
			setDefaultStatus(statusData[0].title)
			if((document.querySelectorAll('.TestClass .ant-select-selection-item')[0] as HTMLInputElement)){
				(document.querySelectorAll('.TestClass .ant-select-selection-item')[0] as HTMLInputElement).title = authorityDatas[0].title;
				(document.querySelectorAll('.TestClass .ant-select-selection-item')[0] as HTMLInputElement).innerHTML = authorityDatas[0].title;
				(document.querySelectorAll('.TestClass .ant-select-selection-item')[1] as HTMLInputElement).title = statusData[0].title;
				(document.querySelectorAll('.TestClass .ant-select-selection-item')[1] as HTMLInputElement).innerHTML = statusData[0].title;
			}
			setOpen(true);
		} else {
			return
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
			data.name.includes(searchText)
		);
		setShowingData(searchedList);
	};

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>, key1: string, key2?: string) => {
		const { value } = e.target;
		if (key2) {
			switch (key1) {
				case 'part':
					setPartData(value)
					return;
				case 'name':
					setNameData(value)
					return;
				case 'id':
					// const idReg = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,12}$/;
					const idReg = /^[A-Za-z0-9]*.{6,12}$/;
					setIdStyleSet(value.match(idReg)==null ? 'red' : 'black')
					setIdStyleSet(value.match(idReg)!=null ? 'black' : 'red')
					setIdData(value)
					return;
				case 'password':
					const reg = /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{10,}$/;
					setStyleSet(value.match(reg)==null ? 'red' : 'black')
					setStyleSet(value.match(reg)!=null ? 'black' : 'red')
					setPasswordData(value)
					return;
			}
		} else {
		}
	};
  const handleOk = async () => {
		let auth = (document.querySelectorAll('.TestClass .ant-select-selection-item')[0] as HTMLInputElement).title;
		let status = (document.querySelectorAll('.TestClass .ant-select-selection-item')[1] as HTMLInputElement).title;
		let authData = ''
		let statusData = ''
		switch (auth) {
			case "디자이너":
				authData = 'DESIGNER'
				break;
			case "운영자":
				authData = 'OPERATOR'
				break;
			case "어드민":
				authData = 'ADMIN'
				break;
			case "슈퍼 어드민":
				authData = 'SUPERADMIN'
				break;
			default:
				break;
		}

		switch (status) {
			case "승인 대기":
				statusData = 'READY'
				break;
			case "승인":
				statusData = 'ACCEPT'
				break;
			case "반려":
				statusData = 'REJECT'
				break;
			case "정지":
				statusData = 'BLOCK'
				break;
			default:
				break;
		}
		const reg = /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{10,}$/;
		const idReg = /^[A-Za-z0-9]*.{6,12}$/;
		if(password.match(reg) == null){
			alert('패스워드를 확인해주세요.')
			return
		}
		if(id.match(idReg) == null){
			alert('아이디를 확인해주세요.')
			return
		}
		
		if(title == '수정'){
			let data = null
			if(authData == 'DESIGNER') {
				data = {
					"account": id,
					"password": password,
					"name": name,
					"part": partData,
					"authority": authData,
					"status": statusData, 
					"designerId": designerId
				}
			} else {
				data = {
					"account": id,
					"password": password,
					"passwordChangeYn": 'Y',
					"name": name,
					"part": partData,
					"authority": authData,
					"status": statusData,
				}
			}
			await addAdminAPI(data,clickId);
			await getContentList();
			window.location.reload();
		} else {
			let data = null
			if(authData == 'DESIGNER') {
				data = {
					"account": id,
					"password": password,
					"passwordChangeYn": 'Y',
					"name": name,
					"part": partData,
					"authority": authData,
					"status": statusData,
					"designerId": designerId
				}
			} else {
				data = {
					"account": id,
					"password": password,
					"passwordChangeYn": 'Y',
					"name": name,
					"part": partData,
					"authority": authData,
					"status": statusData,
				}
			}
			await addAdminAPI(data,null);
			await getContentList();
		}
		setOpen(false);
  };
  const designerCancel = () => {
		setDesignerOpen(false)
	}
  const handleCancel = () => {
		// (document.querySelector('.TestClass .ant-select-selection-item') as HTMLInputElement).title = '';
		// (document.querySelector('.TestClass .ant-select-selection-item') as HTMLInputElement).innerHTML = '';
		// (document.querySelectorAll('.TestClass .ant-select-selection-item')[1] as HTMLInputElement).title = '';
		// (document.querySelectorAll('.TestClass .ant-select-selection-item')[1] as HTMLInputElement).innerHTML = '';
		setStyleSet('black')
    setOpen(false);
		
		setTitle('')
		setPartData('')
		setNameData('')
		setIdData('')
		setPasswordData('')
		setDefaultAuth('')
  };

	const onChangeItem = (item: any) => {
		let test = selectItem.filter((ele:any)=>ele.value == item)
		let style = ''
		if(test[0].engTitle == 'DESIGNER'){
			style = 'block'
		} else {
			style = 'none'
		}
		setStyleData(style)
		setDefaultAuth(test[0].title)
	}


	// 세부탭
	const onClickDesign = (e: MouseEvent<HTMLElement>) => {
		const id = Number(e.currentTarget.parentElement?.getAttribute('data-row-key'));
		setDesignerId(id)
		setDesignerValue(e.currentTarget.innerText)
		setDesignerOpen(false)
	};
	const onChangeDesigner = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setDesignerValue(value)
		if (value === '') {
			return setDesignerShowingData(designerData);
		}
		setSearchDesignerText(value);
	};
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
	const onDesignerSearch = () => {
		const searchedList = designerData.filter((data: BoardDataInterface) =>
			data.name.includes(searchDesignerText)
		);
		setDesignerShowingData(searchedList);
	};
	return (
		<BoardContainer>
			<Modal
				open={designerOpen}
				title={`디자이너 검색`}
				onOk={handleOk}
				onCancel={designerCancel}
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
			<BoardHeader>
			<Modal
        open={open}
        title={`관리자 ${title}`}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            {`${title}하기`}
          </Button>
        ]}
				className = 'TestClass'
      >
        <div>
					소속
					<MemberInput
						type="text"
						placeholder="소속을 입력하세요"
						maxLength={20}
						disabled={false}
						value={`${partData}`}
						onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeInput(e, 'part','input')}
					/>
				</div>
        <div style={{marginTop:'20px'}}>
					이름
					<MemberInput
						type="text"
						placeholder="이름을 입력하세요"
						maxLength={20}
						value={`${name}`}
						disabled={title == '수정' ? true : false}
						onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeInput(e, 'name','input')}
					/>
					<span style={{display:`${title == '등록'? 'block' : 'none'}`, fontSize: '12px'}}>주의! 등록 후 수정 불가</span>
				</div>
        <div style={{marginTop:'20px'}}>
					아이디
					<MemberInput
						type="text"
						placeholder="아이디을 입력하세요"
						maxLength={12}
						value={`${id}`}
						disabled={title == '수정' ? true : false}
						onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeInput(e, 'id','input')}
					/>
					<span style={{display:`${title == '등록'? 'block' : 'none'}`, fontSize: '12px',color:idStyleSet}}>6~12자 영문, 숫자 사용 가능합니다. 주의! 등록 후 수정 불가</span>
				</div>
        <div style={{marginTop:'20px'}}>
					비밀번호
					<MemberInput
						type="text"
						placeholder="비밀번호를을 입력하세요"
						maxLength={20}
						disabled={false}
						value={password}
						onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeInput(e, 'password','input')}
					/>
					<span style={{fontSize: '12px',color:styleSet}}>최소 10자리 이상 : 영어 대문자, 소문자, 숫자, 특수문자 중 2종류 이상 조합</span>
				</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr', marginTop:'20px'}}>
					권한
					<div  style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
						<MemberSelect
							items={selectItem}
							id={''}
							onChange={(selectItem:any) => onChangeItem(selectItem)}
							defaultValue={defaultAuth}
							value={defaultAuth}
							disabled = {false}
							style={{ width: '180px' }}
						/>
						<Search
							style={{display:styleData}}
							placeholder="디자이너를 입력하세요"
							onSearch={onDesignerOpen}
							maxLength={20}
							enterButton
							value={designerValue}
							onChange={e => {
								setDesignerValue(e.target.value)
							}}
						/>
					</div>
				</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr', marginTop:'10px'}}>
					상태
					<MemberSelect
						items={statusSelect}
						id={''}
						onChange={''}
						disabled = {title=='등록'? true : false}
						defaultValue={defaultStatus ? defaultStatus:'승인 대기'}
						style={{ width: '180px' }}
					/>
				</div>
      </Modal>
				<BtnColumn>
					<NormalButton
						style={{ width: '8%' }}
						title="관리자 등록"
						type="primary"
						disabled={authorityData === 'DESIGNER'}
						onClick={() => openRegister()}
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
