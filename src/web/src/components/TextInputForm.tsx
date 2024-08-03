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
		isLoading,
		handleSendMessage,
		setResponse,
		mode,
		revisedMessage,
		handleSubmitRevisedText,
		setRevisedMessage,
		hasNewText,
	} = useChatContext();

	const handleSubmit = async () => {
		if (mode === Mode.Verify && revisedMessage) {
			await handleSubmitRevisedText();
		} else {
			await handleSendMessage();
		}
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(text);
	};

	const handleClear = () => {
		setText('');
		setResponse('');
		setRevisedMessage('');
	};

	const getButtonText = () => {
		if (isLoading) return BUTTON_TEXT.LOADING;
		if (mode === Mode.Verify && revisedMessage)
			return BUTTON_TEXT.SUBMIT_REVISED;
		return BUTTON_TEXT.SUBMIT;
	};

	return (
		<div className={styles.mainContainer}>
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
					disabled={isLoading || !hasNewText}
					onClick={
						mode === Mode.Verify && revisedMessage
							? handleSubmitRevisedText
							: handleSubmit
					}
					className="submit"
				>
					{getButtonText()}
				</Button>
				<Button type="button" onClick={handleCopy} className="copy">
					{BUTTON_TEXT.COPY}
				</Button>
				<Button type="button" onClick={handleClear} className="clear">
					{BUTTON_TEXT.CLEAR}
				</Button>
				{window?.location?.host === HOSTS.LOCAL ? <TestTextButton /> : null}
			</div>
		</div>
	);
};

export default TextInputForm;
