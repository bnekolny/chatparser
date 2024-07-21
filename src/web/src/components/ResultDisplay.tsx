import React from 'react';
import ReactMarkdown from 'react-markdown';
import Button from './Button';
import styles from './styles/ResultDisplay.module.css';
import {BUTTON_TEXT} from '../constants';

interface ResultDisplayProps {
	result: string | null;
	revisedMessage: string | null;
	isLoading: boolean;
	onCopy: (text: string) => void;
	onSubmitRevised: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
	result,
	revisedMessage,
	isLoading,
	onCopy,
	onSubmitRevised,
}) => {
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
							onClick={() => onCopy(revisedMessage)}
							className={styles.copyButton}
						>
							Copy
						</Button>
						<Button
							type="button"
							onClick={onSubmitRevised}
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
