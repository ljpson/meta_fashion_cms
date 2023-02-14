import { useState, RefObject, forwardRef, useImperativeHandle } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

//components
import NormalSelect from '../_a_atom/NormalSelect';
import NormalInput from '../_a_atom/NormalInput';
import EditorComponent from '../common/EditorComponent';

//antd
import { DatePicker, Space } from 'antd';
import moment from 'moment';

//html-entities
import { encode, decode } from 'html-entities';

//interface
import { PolicyDataInterface } from '../../interface/data';
import { TermsInterface } from '../../interface/terms';

//api
import { policyAPI, policyUpdateAPI, policyListAPI } from '../../api/policies';
import { useNavigate } from 'react-router-dom';
// import { noticeListAPI, noticeCreateAPI } from '../../api/notice';
let VERSION_LIST = [{
	value: '1',
	title: '2023-01-11' + '~' + '현재',
}];
const TermsOfService = forwardRef<TermsInterface>((props, ref) => {
	const navigate = useNavigate();
	const [selectedVal, setSelectedVal] = useState('1');
	const [description, setDescription] = useState('');
	const [htmlStr, setHtmlStr] = useState<string>('');

	//react-query state
	const queryClient = useQueryClient();
	const { data, isLoading, isSuccess } = useQuery(
		['termsList'],
		(): Promise<any> => policyListAPI('PRIVACY'),
		{
			onSuccess: (data) => {
				VERSION_LIST = []
				data.map((data:any)=>{
					const createDate = new Date(data.showFrom)
					const year = createDate.getFullYear()
					const month = createDate.getMonth() +1 < 10 ? '0' + Number(createDate.getMonth() +1) : createDate.getMonth()+1
					const date = createDate.getDate()
					const hour = createDate.getHours()
					const minutes = createDate.getMinutes() < 10 ? '0' + String(createDate.getMinutes()) : createDate.getMinutes()
					const second= createDate.getSeconds()
					const getDate = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + second
	
					const toDate = new Date(data.showTo)
					const toYear = toDate.getFullYear()
					const toMonth = toDate.getMonth() +1 < 10 ? '0'+Number(toDate.getMonth()+1) : toDate.getMonth() +1
					const toGetDate = toDate.getDate()
					const toHour = toDate.getHours()
					const toMinutes = toDate.getMinutes() < 10 ? '0' + String(toDate.getMinutes()) : toDate.getMinutes()
					const toSecond= toDate.getSeconds()
					const getToDate = toYear + '-' + toMonth + '-' + toGetDate + ' ' + toHour + ':' + toMinutes + ':' + toSecond
					VERSION_LIST.push({
						value: data.id,
						title: getToDate + '~' + getDate,
						// title: getDate + '~' + getToDate,
					})
				})

				setDescription(decode(data[0].contents));
			},
			onError: (err) => {
				alert('로그인을 다시 해주시길 바랍니다.')
				navigate(`/`)
			}
		}
	);
	const createMutation = useMutation((data: any) => policyUpdateAPI(data), {
		onSuccess: () => {
			queryClient.invalidateQueries(['data']);
		},
	});
	const createMutation1 = useMutation((data: any) => policyAPI(data), {
		onSuccess: (dataSet) => {
			setDescription(decode(dataSet.contents));
			queryClient.invalidateQueries(['data']);
		},
	});

	useImperativeHandle(ref, () => ({
		showAlert() {
			//html 엔티티로 변환
			const htmlToEntity = encode(htmlStr);
			const createDate = new Date()
			const year = createDate.getFullYear()
			const month = createDate.getMonth() +1 < 10 ? ''+createDate.getMonth() +1 : createDate.getMonth() +1
			const date = createDate.getDate()
			const hour = createDate.getHours()
			const minutes = createDate.getMinutes() < 10 ? '0' + String(createDate.getMinutes()) : createDate.getMinutes()
			const second= createDate.getSeconds()
			const showFromDate = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + second
			const showToDate = (document.querySelector('.ant-picker-input input') as HTMLInputElement).title
			
			//등록
			createMutation.mutate({
				type: 'PRIVACY',
				contents: htmlToEntity,
				showFrom: showFromDate,
				showTo: showToDate,
			});
		},
	}));

	const handleChangeSelect = (value: string) => {
		setSelectedVal(value);
		createMutation1.mutate(value);
	};
	return (
		<TosContainer>
			<TosContents>
				<TosInfo>
					<Label>버전관리</Label>
					<NormalSelect
						items={VERSION_LIST}
						onChange={handleChangeSelect}
						defaultValue={VERSION_LIST[0]}
						style={{ width: '280px' }}
					/>
				</TosInfo>
				<TosInfo>
					<Label>수정 일자</Label>
					<StyledSpace direction="vertical" size={100}>
						<DatePicker defaultValue={moment()} format="YYYY-MM-DD" />
					</StyledSpace>
				</TosInfo>
				<TosInfo>
					<Label>약관내용</Label>
					<EditorComponent entities={description} setHtmlStr={setHtmlStr} />
				</TosInfo>
			</TosContents>
		</TosContainer>
	);
});

const TosContainer = styled.div``;

const TosContents = styled.div``;

const TosInfo = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 20px;
`;

const Label = styled.span`
	display: inline-block;
	padding: 10px 0;
	font-weight: 500;
`;

const StyledSpace = styled(Space)`
	.ant-picker {
		border-radius: 10px;
		display: block;
	}
`;

export default TermsOfService;
