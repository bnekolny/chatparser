import React from 'react';
import Button from './Button';
import TextArea from './TextArea';
import styles from './styles/TextInputForm.module.css';
import {BUTTON_TEXT, HOSTS} from '../constants';
import {useChatContext} from '../context/ChatContext';
import {Mode} from '../types';
import TestTextButton from './TestTextButton';

const TextInputForm: React.FC = () => {
	const {
		text,
		setText,
		previousText,
		isLoading,
		handleSendMessage,
		setResponse,
		mode,
		revisedMessage,
		handleSubmitRevisedText,
		setRevisedMessage,
	} = useChatContext();

	const hasNewText = text !== previousText;

	const handleSubmit = async () => {
		await handleSendMessage();
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(text);
	};

	const handleClear = () => {
		setText('');
		setResponse('');
		setRevisedMessage('');
	};

	return (
		<>
			<form
				onSubmit={e => {
					e.preventDefault();
					handleSendMessage();
				}}
				className={styles.form}
			>
				<TextArea />
			</form>

			<div className={styles.buttonContainer}>
				<Button
					type="submit"
					disabled={
						(mode !== Mode.Verify || !revisedMessage) &&
						(!hasNewText || isLoading)
					}
					onClick={
						mode === Mode.Verify && revisedMessage
							? handleSubmitRevisedText
							: handleSubmit
					}
					className="submit"
				>
					{isLoading
						? BUTTON_TEXT.LOADING
						: mode === Mode.Verify && revisedMessage
						? BUTTON_TEXT.SUBMIT_REVISED
						: BUTTON_TEXT.SUBMIT}
				</Button>
				<Button type="button" onClick={handleCopy} className="copy">
					{BUTTON_TEXT.COPY}
				</Button>
				<Button type="button" onClick={handleClear} className="clear">
					{BUTTON_TEXT.CLEAR}
				</Button>
				{window?.location?.host === HOSTS.LOCAL ? <TestTextButton /> : null}
			</div>
		</>
	);
};

export default TextInputForm;
