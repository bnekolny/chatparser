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

	const [hasLoaded, setHasLoaded] = useState<boolean>(false);
	React.useEffect(() => {
		const initialValue = getInputQueryParamValue()
		setText(initialValue);
	}, [])
	React.useEffect(() => {
		// checking these should ensure this only runs once
		if (text && !previousText && !hasLoaded) {
			handleSendMessage();
		} else {
			// Set hasLoaded otherwise it will run on the first character submit
			setHasLoaded(true);
		}
	}, [text]) // we need to wait for the state to set, or  we face a race condition

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
