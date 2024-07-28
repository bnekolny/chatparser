import React from 'react';
import styles from './styles/TextArea.module.css';
import {TEXTAREA} from '../constants';
import {useChatContext} from '../context/ChatContext';

const TextArea = React.forwardRef<HTMLTextAreaElement, {}>((_, ref) => {
	const {text, handleTextChange} = useChatContext();

	return (
		<textarea
			ref={ref}
			value={text}
			onChange={handleTextChange}
			className={styles.textarea}
			rows={1}
			placeholder={TEXTAREA.DEFAULT_PLACEHOLDER}
		/>
	);
});
export default TextArea;
