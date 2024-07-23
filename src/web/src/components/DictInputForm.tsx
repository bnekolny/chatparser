import React, { useState } from 'react';
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

	const inputQueryParamName = 'text';
	const [inputQueyrParam, setInputQueryParam] = useState(getInputQueryParamValue);
	React.useEffect(() => {
		const initialValue = getInputQueryParamValue()
		setText(initialValue);
	}, [])
	React.useEffect(() => {
		// checking !previousText should ensure this only runs once
		if (text && !previousText) {
			handleSendMessage();
		}
	}, [text]) // we need to wait for the state to set, or  we face a race condition

	function getInputQueryParamValue() {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(inputQueryParamName) || '';
	}

	function updateQueryString(value: string) {
		const url = new URL(window.location.href);
		url.searchParams.set(inputQueryParamName, value);
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
