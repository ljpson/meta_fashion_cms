import { SetStateAction, useState, RefObject, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styled from 'styled-components';

interface IEditor {
	entities: string;
	setHtmlStr: React.Dispatch<React.SetStateAction<string>>;
}

const EditorComponent = ({ entities, setHtmlStr }: IEditor) => {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	useEffect(() => {
		if (entities) {
			const blocksFromHtml = htmlToDraft(entities);
			if (blocksFromHtml) {
				const { contentBlocks, entityMap } = blocksFromHtml;
				const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
				const editorState = EditorState.createWithContent(contentState);
				setEditorState(editorState);
				convertToHtml(editorState);
			}
		}
	}, [entities]);

	const onEditorStateChange = (editorState: EditorState) => {
		setEditorState(editorState);
		convertToHtml(editorState);
	};

	const convertToHtml = (editorState: EditorState) => {
		setHtmlStr(draftToHtml(convertToRaw(editorState.getCurrentContent())));
	};

	return (
		<>
			<Editor
				editorState={editorState}
				wrapperClassName="wrapperClassName"
				toolbarClassName="toolbarClassName"
				editorClassName="editorClassName"
				wrapperStyle={{
					backgroundColor: '#fff',
					border: '1px solid #eee',
					borderRadius: '10px',
					overflow: 'hidden',
				}}
				toolbar={{
					list: { inDropdown: true },
					textAlign: { inDropdown: true },
					link: { inDropdown: true },
					history: { inDropdown: false },
				}}
				editorStyle={{ height: '380px', overflowY: 'scroll', padding: '0 10px' }}
				localization={{
					locale: 'ko',
				}}
				onEditorStateChange={onEditorStateChange}
				placeholder="내용을 작성해주세요."
				handleReturn={() => {
					return false;
				}}
			/>
			{/* <IntroduceContent dangerouslySetInnerHTML={{ __html: htmlStr }} /> */}
		</>
	);
};

const IntroduceContent = styled.div`
	position: relative;
	border: 0.0625rem solid #d7e2eb;
	border-radius: 0.75rem;
	overflow: hidden;
	padding: 1.5rem;
	width: 50%;
	margin: 0 auto;
	margin-bottom: 4rem;
`;

export default EditorComponent;
