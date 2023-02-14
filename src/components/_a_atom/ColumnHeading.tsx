import { Typography } from 'antd';
const { Title, Text } = Typography;

//interface & types
import { ColumnHeadingInterface } from '../../interface/component';

//==props==//
// style => Title 스타일 지정 (inline style)
// text : string => Title 내용 *필수*
const ColumnHeading = ({ style, text, essential }: ColumnHeadingInterface) => {
	return (
		<Title style={{ ...style, display: 'flex', alignItems: 'center' }} level={5}>
			{text}
			{essential ? (
				<Text
					style={{
						marginLeft: '5px',
						color: 'red',
						fontSize: '11px',
					}}
				>
					(필수)
				</Text>
			) : (
				<></>
			)}
		</Title>
	);
};

export default ColumnHeading;
