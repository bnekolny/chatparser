import React from 'react';
import {useTranslation} from 'react-i18next';
import styles from './styles/TextArea.module.css';
import {useChatContext} from '../context/ChatContext';

const TextArea = React.forwardRef<HTMLTextAreaElement, {}>((_, ref) => {
	const {t} = useTranslation();
	const {text, handleTextChange} = useChatContext();

	return (
		<textarea
			ref={ref}
			value={text}
			onChange={handleTextChange}
			className={styles.textarea}
			rows={1}
			placeholder={t('textarea_default_placeholder')}
			style={{resize: 'vertical', overflow: 'hidden'}}
		/>
	);
});
export default TextArea;
