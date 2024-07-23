import React from 'react';
import Button from './Button';
import TextArea from './TextArea';
import styles from './styles/DictInputForm.module.css';
import {BUTTON_TEXT} from '../constants';
import {useChatContext} from '../context/ChatContext';

const TextInputForm: React.FC = () => {
	const {
		text,
		setText,
		previousText,
		isLoading,
		handleSendMessage,
		setResponse,
	} = useChatContext();

	const hasNewText = text !== previousText;

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		await handleSendMessage();
	};

	const handleClear = () => {
		setText('');
		setResponse('');
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<TextArea />
			<div className={styles.buttonContainer}>
			<Button
				type="submit"
				disabled={!hasNewText || isLoading}
				className={styles.submitButton}
			>
				{isLoading ? BUTTON_TEXT.LOADING : BUTTON_TEXT.SUBMIT}
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
