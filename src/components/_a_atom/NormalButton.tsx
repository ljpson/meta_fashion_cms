//antd
import { Button } from 'antd';

//interface & types
import { NormalButtonInterface } from '../../interface/component';

//==props==//
// title : string => 버튼 텍스트 *필수*
// type : string => 버튼 타입 (primary / dashed / text / link / default) 기본값 default
// size (string) => 버튼 사이즈 (large / middle / small) 기본값 middle
// disabled => 버튼 활성화 비활성화 유무 (true / false) 기본값 false
// style => 버튼 스타일 지정 (inline style)
// icon : ReactElement => 버튼내 포함될 아이콘
// onClick => click 이벤트 핸들러 *필수*
const NormalButton = ({
	title,
	type,
	size,
	disabled,
	style,
	icon,
	onClick,
}: NormalButtonInterface) => {
	return (
		<Button
			style={{ ...style, borderRadius: '10px' }}
			type={type}
			size={size}
			disabled={disabled}
			onClick={onClick}
		>
			{icon}
			{title}
		</Button>
	);
};

export default NormalButton;
