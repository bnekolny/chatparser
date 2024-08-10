import React from 'react';
import {useTranslation} from 'react-i18next';
import Button from './Button';
import TextArea from './TextArea';
import styles from './styles/TextInputForm.module.css';
import {useChatContext} from '../context/ChatContext';

import {Mode} from '../types';
import TestTextButton from './TestTextButton';

const TextInputForm: React.FC = () => {
	const {t} = useTranslation();

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
						? t('button_loading')
						: mode === Mode.Verify && revisedMessage
						? t('button_submit_revised')
						: t('button_submit')}
				</Button>
				<Button type="button" onClick={handleCopy} className="copy">
					{t('button_copy')}
				</Button>
				<Button type="button" onClick={handleClear} className="clear">
					{t('button_clear')}
				</Button>
				{window?.location?.host === HOSTS.LOCAL ? <TestTextButton /> : null}
			</div>
		</div>
	);
};

export default TextInputForm;
