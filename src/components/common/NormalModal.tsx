//antd
import { Modal } from 'antd';

//interface & types
import { NormalModalInterface } from '../../interface/component';

//==props==//
// title : string => 모달 상단에 보여질 제목 *필수*
// description : string => 모달 중앙에 보여질 질문 혹은 설명 *필수*
// isOpen : boolean => 모달의 노출 여부 *필수*
// onClickConfirm => 모달창에서 확인을 눌렀을 경우 실행될 callback 함수 *필수*
// onClickCancle=> 모달창에서 취소를 눌렀을 경우 실행될 callback 함수 *필수*
const NormalModal = ({
	title,
	description,
	isOpen,
	onClickConfirm,
	onClickCancle,
	okText,
	cancelText,
}: NormalModalInterface) => {
	return (
		<Modal
			style={{ textAlign: 'center' }}
			centered
			title={title}
			open={isOpen}
			onOk={onClickConfirm}
			onCancel={onClickCancle}
			cancelButtonProps={{ style: { display: 'block' } }}
			okText={okText}
			cancelText={cancelText}
		>
			{description}
		</Modal>
	);
};

export default NormalModal;
