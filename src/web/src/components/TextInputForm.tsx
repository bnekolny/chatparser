import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import TextArea from './TextArea';
import styles from './styles/TextInputForm.module.css';
import {useChatContext} from '../context/ChatContext';


const TextInputForm: React.FC = () => {
	const { t } = useTranslation();

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
				{isLoading ? t('button_loading') : t('button_submit')}
			</Button>
			<div className={styles.buttonContainer}>
				<Button
					type="button"
					onClick={handleCopy}
					className={styles.copyButton}
				>
					{t('button_copy')}
				</Button>
				<Button
					type="button"
					onClick={handleClear}
					className={styles.clearButton}
				>
					{t('button_clear')}
				</Button>
			</div>
		</form>
	);
};

export default TextInputForm;
