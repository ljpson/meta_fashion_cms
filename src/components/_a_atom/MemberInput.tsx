import { Input } from 'antd';
const { TextArea } = Input;

//interface & types
import { MemberInputInterface } from '../../interface/component';

//==props==//
// type : string => input 타입 (textarea 혹은 나머지(text, password, etc...)) *필수*
// style => input 스타일 지정 (inline style)
// placeholder : string => placeholder 값 *필수*
// value : string | number => input value *필수*
// maxLength : number => 최대 글자 수 *필수*
// onChange => change 이벤트 핸들러
const NormalInput = ({
	type,
	style,
	placeholder,
	maxLength,
	value,
	disabled,
	onChange,
}: MemberInputInterface) => {
	return type === 'textarea' ? (
		<TextArea
			style={{ ...style, resize: 'none' }}
			showCount
			placeholder={placeholder}
			value={value}
			maxLength={maxLength}
			onChange={onChange}
		/>
	) : (
		<Input
			type={type}
			style={style}
			showCount
			placeholder={placeholder}
			value={value}
			maxLength={maxLength}
			disabled={disabled}
			onChange={onChange}
		/>
	);
};

export default NormalInput;
