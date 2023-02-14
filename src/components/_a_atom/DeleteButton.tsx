//antd
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

//interface & types
import { DeleteButtonInterface } from '../../interface/component';

//==props==//
// size (string) => 버튼 사이즈 (large / middle / small) 기본값 middle
// style => 버튼 스타일 지정 (inline style)
// onClick => click 이벤트 핸들러 *필수*
const DeleteButton = ({ size, style, onClick }: DeleteButtonInterface) => {
	return (
		<Button danger size={size} shape="circle" style={style} onClick={onClick}>
			<DeleteOutlined />
		</Button>
	);
};

export default DeleteButton;
