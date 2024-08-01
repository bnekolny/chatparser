import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import TextArea from './TextArea';
import styles from './styles/DictInputForm.module.css';
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

	React.useEffect(() => {
		const initialValue = getInputQueryParamValue()
		setText(initialValue);
		handleSendMessage(initialValue);
	}, [])

	const inputQueryParamName = 'text';

	function getInputQueryParamValue() {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(inputQueryParamName) || '';
	}

	function updateQueryString(value: string) {
		const url = new URL(window.location.href);
		if (value) {
			url.searchParams.set(inputQueryParamName, value);
		} else {
			url.searchParams.delete(inputQueryParamName)
		}
		window.history.pushState({}, '', url.toString());
	}

	const hasNewText = text !== previousText;

	const handleSubmit = async (event?: React.FormEvent) => {
		if (event) {
			event.preventDefault();
		}
		updateQueryString(text);
		await handleSendMessage();
	};

	const handleClear = () => {
		setText('');
		setResponse('');
		updateQueryString('');
		textAreaRef.current?.focus();
	};

	const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<TextArea ref={textAreaRef} />
			<div className={styles.buttonContainer}>
			<Button
				type="submit"
				disabled={!hasNewText || isLoading}
				className={styles.submitButton}
			>
				{isLoading ? t('button_loading') : t('button_submit')}
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
