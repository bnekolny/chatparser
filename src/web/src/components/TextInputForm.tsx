import React from 'react';
import Button from './Button';
import TextArea from './TextArea';
import styles from './styles/TextInputForm.module.css';
import {BUTTON_TEXT, TEXTAREA} from '../constants';

interface TextInputFormProps {
	text: string;
	onTextChange: (text: string) => void;
	onSubmit: (event: React.FormEvent) => void;
	onCopy: (text: string) => void;
	onClear: () => void;
	isLoading: boolean;
	hasNewText: boolean;
}

const TextInputForm: React.FC<TextInputFormProps> = ({
	text,
	onTextChange,
	onSubmit,
	onCopy,
	onClear,
	isLoading,
	hasNewText,
}) => {
	return (
		<form onSubmit={onSubmit} className={styles.form}>
			<TextArea
				value={text}
				onChange={e => onTextChange(e.target.value)}
				placeholder={TEXTAREA.DEFAULT_PLACEHOLDER}
			/>
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
					onClick={() => onCopy(text)}
					className={styles.copyButton}
				>
					{BUTTON_TEXT.COPY}
				</Button>
				<Button type="button" onClick={onClear} className={styles.clearButton}>
					{BUTTON_TEXT.CLEAR}
				</Button>
			</div>
		</form>
	);
};

export default TextInputForm;
