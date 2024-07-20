import React from 'react';
import ReactMarkdown from 'react-markdown';
import Button from './Button';
import styles from './styles/ResultDisplay.module.css';

interface ResultDisplayProps {
	result: string | null;
	revisedMessage: string | null;
	isLoading: boolean;
	onCopy: (text: string) => void;
	onSubmitRevised: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
							{isLoading ? 'Loading...' : 'Submit Revised Message'}
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default ResultDisplay;
