import React from 'react';
import ReactMarkdown from 'react-markdown';
import Button from './Button';
import styles from './styles/ResultDisplay.module.css';
import {BUTTON_TEXT} from '../constants';
import {useChatContext} from '../context/ChatContext';
import {useMessageApi} from '../hooks/useMessageApi';

const ResultDisplay: React.FC = () => {
	const {result, revisedMessage, isLoading} = useMessageApi();
	const {setText, setPreviousText} = useChatContext();

	const handleCopy = (textToCopy: string) => {
		navigator.clipboard.writeText(textToCopy);
	};

	const handleSubmitRevised = () => {
		setText(revisedMessage);
		setPreviousText(revisedMessage);
	};

	return (
		<>
			{result && (
				<div className={styles.result}>
					<ReactMarkdown>{result}</ReactMarkdown>
				</div>
			)}
			{revisedMessage && (
				<div className={styles.result}>
					<div className={styles.resultContent}>
						<ReactMarkdown>**Revised Message:**</ReactMarkdown>
						<ReactMarkdown>{revisedMessage}</ReactMarkdown>
					</div>
					<div className={styles.buttonContainer}>
						<Button
							type="button"
							onClick={() => handleCopy(revisedMessage)}
							className={styles.copyButton}
						>
							Copy
						</Button>
						<Button
							type="button"
							onClick={handleSubmitRevised}
							disabled={isLoading}
							className={styles.submitRevisedButton}
						>
							{isLoading ? BUTTON_TEXT.LOADING : BUTTON_TEXT.SUBMIT_REVISED}
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default ResultDisplay;
