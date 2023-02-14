import { ReactElement, useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

//api
import { popupListAPI, popupDetailAPI,addPopupAPI } from '../../api/popup';

//antd
import { Table } from 'antd';
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
			dataIndex: ['image'],
			width: '10%',
			render: (image: string[]): ReactElement => {
				return image ? (
					<img
						// 프리뷰를 보기 위한 임시 cors 처리
						crossOrigin="anonymous"
						alt="썸네일 이미지"
						src={`${image}`}
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
			title: '제목',
			dataIndex: ['title'],
			width: '24%',
			onCell: (record: any, rowIndex: any) => {
				return {
					onClick: onClickRowCallback,
				};
			},
			render: (title: number) => {
				return <span style={{color:'#229bcd'}}>{title}</span>;
			},
		},
		{
			title: '상태',
			dataIndex: ['status'],
			width: '6%',
			render: (status: string) => {
				return (
					<span>
						{status=="PUBLISH" ? '게시' : '종료'}
					</span>
				);
			},
		},
		{
			title: '게시 시작 일시',
			dataIndex: ['showFrom'],
			width: '15%',
			render: (showFrom: string) => {
				let getDate = ''
				if (showFrom){
					const year = new Date (showFrom).getFullYear()
					const month = new Date (showFrom).getMonth() +1 < 10 ? ''+new Date (showFrom).getMonth() +1 : new Date (showFrom).getMonth() +1
					const date = new Date (showFrom).getDate()
					const toHour = new Date (showFrom).getHours() < 10 ? '0' + String(new Date (showFrom).getHours()) : new Date (showFrom).getHours()
					const toMinutes = new Date (showFrom).getMinutes() < 10 ? '0' + String(new Date (showFrom).getMinutes()) : new Date (showFrom).getMinutes()
					const toSecond= new Date (showFrom).getSeconds()
					getDate = year + '-' + month + '-' + date + ' ' + toHour + ':' + toMinutes + ':' + toSecond
				} else {
					getDate = '-'
				}
				return (
					<span>
						{getDate}
					</span>
				);
			},
		},
		{
			title: '게시 종료 일시',
			dataIndex: ['showTo'],
			width: '15%',
			render: (showTo: string) => {
				let getDate = ''
				if (showTo){
					const year = new Date (showTo).getFullYear()
					const month = new Date (showTo).getMonth() +1 < 10 ? ''+new Date (showTo).getMonth() +1 : new Date (showTo).getMonth() +1
					const date = new Date (showTo).getDate()
					const toHour = new Date (showTo).getHours() < 10 ? '0' + String(new Date (showTo).getHours()) : new Date (showTo).getHours()
					const toMinutes = new Date (showTo).getMinutes() < 10 ? '0' + String(new Date (showTo).getMinutes()) : new Date (showTo).getMinutes()
					const toSecond= new Date (showTo).getSeconds()
					getDate = year + '-' + month + '-' + date + ' ' + toHour + ':' + toMinutes + ':' + toSecond
				} else {
					getDate = '-'
				}
				return (
					<span>
						{getDate}
					</span>
				);
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
				const toHour = new Date (createDate).getHours() < 10 ? '0' + String(new Date (createDate).getHours()) : new Date (createDate).getHours()
				const toMinutes = new Date (createDate).getMinutes() < 10 ? '0' + String(new Date (createDate).getMinutes()) : new Date (createDate).getMinutes()
				const toSecond= new Date (createDate).getSeconds()
				const getDate = year + '-' + month + '-' + date + ' ' + toHour + ':' + toMinutes + ':' + toSecond
				return <span>{(arr.createBy || '') + ' / ' + getDate}</span>;
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
	const [originalData, setOriginalData] = useState([] as BoardDataInterface[]);
	const [showingData, setShowingData] = useState([] as BoardDataInterface[]);
	const [selectedList, setSelectedList] = useState([] as BoardDataInterface[]);
	const [selectedKeyList, setSelectedKeyList] = useState([] as Key[]);
	const [searchText, setSearchText] = useState('');

	//useEffect
	useEffect(() => {
		(async () => {
			await getContentList();
		})();
	}, []);

	//functions
	const getContentList = async () => {
		let result = await popupListAPI();
		if(result){
			setOriginalData(result);
			setShowingData(result);
		} else {
			alert('로그인을 다시 해주시길 바랍니다.')
			navigate('/')
		}
	};

	const onClickRowCallback = (e: MouseEvent<HTMLElement>) => {
		const id = Number(e.currentTarget.parentElement?.getAttribute('data-row-key'));
		navigate(`/popup/detail/${id}`);
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
			<BoardHeader>
				<BtnColumn>
					<NormalButton
						style={{ width: '8%' }}
						title="등록"
						type="primary"
						onClick={() => navigate('/popup/detail')}
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
