import { Select } from 'antd';
const { Option } = Select;

import { NormalSelectInterface } from '../../interface/component';

//==props==//
// style => select 스타일 지정 (inline style)
// items => select의 선택지가 될 리스트 SelectItemType의 배열 ** src/type/component.ts/SelectItemType **
// defaultValue : key[] => 기본으로 선택되어 있기 원하는 아이템의 value (배열로 감싸서 선언해주어야 함) ex) ["title"], [2]
// placeholder : string => placeholder 값 (defaultValue 값을 설정하게 되면 placeholder 값은 적용되지 않음)
// onChange => change 이벤트 핸들러 (선택한 아이템의 value값을 반환) *필수*
const NormalSelect = ({
	style,
	items,
	value,
	defaultValue,
	placeholder,
	onChange,
}: NormalSelectInterface) => {
	return (
		<Select
			placeholder={placeholder}
			defaultValue={defaultValue}
			value={value}
			style={style}
			onChange={onChange}
		>
			{items.map((item, idx) => (
				<Option key={idx} value={item.value}>
					{item.title}
				</Option>
			))}
		</Select>
	);
};

export default NormalSelect;
