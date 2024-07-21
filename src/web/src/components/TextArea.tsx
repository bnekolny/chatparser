import React from 'react';
import styles from './styles/TextArea.module.css';
import {TEXTAREA} from '../constants';
import {useChatContext} from '../context/ChatContext';

const TextArea: React.FC = () => {
	const {text, handleTextChange} = useChatContext();

	return (
		<textarea
			value={text}
			onChange={handleTextChange}
			className={styles.textarea}
			rows={1}
			placeholder={TEXTAREA.DEFAULT_PLACEHOLDER}
			style={{resize: 'vertical', overflow: 'hidden'}}
		/>
	);
};

export default TextArea;
