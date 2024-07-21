import React from 'react';
import Button from './Button';
import TextArea from './TextArea';
import styles from './styles/TextInputForm.module.css';
import {BUTTON_TEXT} from '../constants';
import {useChatContext} from '../context/ChatContext';

const TextInputForm: React.FC = () => {
	const {
		text,
		setText,
		previousText,
		mode,
		isLoading,
		handleSendMessage,
		setResponse,
	} = useChatContext();

	const hasNewText = text !== previousText;

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		await handleSendMessage(text, mode);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(text);
	};

	const handleClear = () => {
		setText('');
		setResponse('');
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<TextArea />
			<Button
				type="submit"
				disabled={!hasNewText || isLoading}
				className={styles.submitButton}
			>
				{isLoading ? BUTTON_TEXT.LOADING : BUTTON_TEXT.SUBMIT}
			</Button>
			<div className={styles.buttonContainer}>
				<Button
					type="button"
					onClick={handleCopy}
					className={styles.copyButton}
				>
					{BUTTON_TEXT.COPY}
				</Button>
				<Button
					type="button"
					onClick={handleClear}
					className={styles.clearButton}
				>
					{BUTTON_TEXT.CLEAR}
				</Button>
			</div>
		</form>
	);
};

export default TextInputForm;
