import { useState, useCallback, MouseEvent, KeyboardEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, DropResult, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

//api
import { categoryListAPI, categoryUpdateAPI, categoryDeleteAPI } from '../../api/category';

//interface
import { CategoryDataInterface } from '../../interface/data';

//component
import NormalButton from '../_a_atom/NormalButton';
import { AlignLeftOutlined } from '@ant-design/icons';

import DeleteButton from '../_a_atom/DeleteButton';
import { useNavigate } from 'react-router-dom';
interface ICategoryList {
	isDraggingOver: boolean;
}
interface IContainer {
	isDragging: boolean;
}

const Category = () => {
	const navigate = useNavigate();
	const [categoryList, setCategoryList] = useState<CategoryDataInterface[]>([]);
	const [authorityData, setAuthorityData] = useState('' as any);
	//react-query state
	const queryClient = useQueryClient();
	const { data, isLoading, isSuccess } = useQuery(
		['categoryList'],
		(): Promise<CategoryDataInterface[]> => categoryListAPI(),
		{
			onSuccess: (data) => {
				setCategoryList(data);
				let idPermission = sessionStorage.getItem("authority")
				setAuthorityData(idPermission)
			},
			onError: (err) => {
				alert('로그인을 다시 해주시길 바랍니다.')
				navigate(`/`)
			}
		}
	);
	const updateMutation = useMutation((data: CategoryDataInterface[]) => categoryUpdateAPI(data), {
		onSuccess: () => {
			queryClient.invalidateQueries(['categoryList']);
		},
	});
	const deleteMutation = useMutation((id: number) => categoryDeleteAPI(id), {
		onSuccess: () => {
			console.log('react query success');
			queryClient.invalidateQueries(['categoryList']);
		},
	});

	//functions
	const onDragEnd = useCallback(
		(result: DropResult) => {
			const { destination, source, draggableId, type } = result;
			if (!destination) return; // destination는 드래그 후 결과값, source는 드래그 전 이전값
			const originData = [...categoryList];
			const [reorderedData] = originData.splice(source.index, 1); //선택한거 삭제하고
			originData.splice(destination.index, 0, reorderedData); // 새로운 인덱스에 다시 집어넣고
			setCategoryList(originData);
		},
		[categoryList]
	);

	const addCategory = () => {
		const originData = [...categoryList];
		let addIndex = originData.length;
		let newIndex = 0;

		if (addIndex > 0) {
			var maxId = originData.reduce(function (previous, current) {
				return Number(previous.id) > Number(current.id) ? previous : current;
			});
			newIndex = Number(maxId.id) + 1;
		}

		const newObj: CategoryDataInterface = {
			id: newIndex,
			name: '',
		};
		originData.splice(addIndex, 0, newObj);
		setCategoryList(originData);
	};

	const delCategory = (idx: number, id: any, newCategory: boolean | undefined) => {
		const originData = [...categoryList];
		let dataLength = originData.length;
		if (dataLength === 1) {
			alert('카테고리는 1개 이상이여야 합니다.');
			return false;
		}
		var result = confirm('해당 카테고리를 삭제하겠습니까?');
		if (result) {
			if (newCategory) {
				const originData = [...categoryList];
				originData.splice(idx, 1);
				setCategoryList(originData);
			} else {
				deleteMutation.mutate(id);
			}
		}
	};

	const onKeyupHandler = (e: any) => {
		if (e.keyCode == 13) {
			e.target.blur();
		}
	};
	const onMouseLeaveHandler = (e: any) => {
		e.target.blur();
	};

	const saveCategory = (e: any) => {
		e.preventDefault();
		const originData = [...categoryList];
		const formData = Array.from(e.target.title); // name이 title인 input

		let isSave = true;
		formData.map((data: any, index) => {
			if (data.value === '') {
				isSave = false;
			}
			originData[index].name = data.value;
			originData[index].position = index + 1;

			// if (originData[index].newCategory) {
			// 	originData[index].id = null;
			// }
		});

		if (!isSave) {
			alert('카테고리명을 입력해주세요');
			return false;
		}
		updateMutation.mutate(originData);
	};

	return (
		<CategoryContainer onSubmit={saveCategory}>
			<CategoryHeader>
				<ButtonColumn>
					<NormalButton
						style={{ width: '8%', marginRight: '15px' }}
						title="항목추가"
						disabled={authorityData == 'ADMIN' || authorityData == 'SUPERADMIN' ? false : true}
						onClick={addCategory}
					/>
					<SaveButtin disabled={authorityData == 'ADMIN' || authorityData == 'SUPERADMIN' ? false : true}>저장</SaveButtin>
				</ButtonColumn>
			</CategoryHeader>
			<DragSection>
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId="category" type="categoryList">
						{(provided, snapshot) => (
							<>
								<CategoryList
									{...provided.droppableProps}
									ref={provided.innerRef}
									isDraggingOver={snapshot.isDraggingOver}
								>
									<Title>콘텐츠 카테고리</Title>
									<>
										{isSuccess &&
											categoryList?.map((item, idx) => (
												<Draggable
													key={item.id}
													draggableId={`${item.id}`}
													index={idx}
												>
													{(provided, snapshot) => (
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
																		onKeyUp={(e) => onKeyupHandler(e)}
																		onMouseLeave={(e) => onMouseLeaveHandler(e)}
																		placeholder="카테고리명을 입력해주세요"
																	/>
																</CateRow>
																<DeleteButton
																	onClick={() => {
																		authorityData == 'SUPERADMIN' ? delCategory(idx, item.id, item.newCategory) : '';
																	}}
																	
																/>
															</CategoryItem>
														</Container>
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
		</CategoryContainer>
	);
};

const CategoryContainer = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	height: 100%;
	padding: 10px 0px;
`;

const CategoryHeader = styled.div`
	width: 100%;
	margin-top: 10px;
	padding: 0px 15px;
`;

const DragSection = styled.div`
	width: 100%;
`;

const ButtonColumn = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	margin-bottom: 20px;
`;

const SaveButtin = styled.button`
	width: 8%;
	height: 32px;
	margin-right: 15px;
	border-radius: 10px;
	outline: 0;
	cursor: pointer;
	border: 1px solid #1890ff;
	font-size: 14px;
	background: #1890ff;
	color: #fff;
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
const Title = styled.h3`
	padding: 8px;
`;

const CategoryList = styled.div<ICategoryList>`
	padding: 8px;
	//background-color: ${(props) => (props.isDraggingOver ? 'white' : 'EFF2F5')};
	flex-grow: 1;
	height: 100%;
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

export default Category;
