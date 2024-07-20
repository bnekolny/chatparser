import React, {useState, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import {useMessageApi} from '../hooks/useMessageApi';

const TextInputForm: React.FC = () => {
	const [previousText, setPreviousText] = useState<string>('');
	const [text, setText] = useState<string>('');
	const [mode, setMode] = useState<string>('verify');
	const {sendMessage, result, revisedMessage, isLoading} = useMessageApi();

	const hasNewText = (): boolean => {
		console.log(`previousText: ${previousText}`);
		return text !== previousText;
	};

	const handleSubmit = async (event: React.FormEvent) => {
		setPreviousText(text);
		event.preventDefault();
		await sendMessage(text, mode);
	};

	const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(event.target.value);
	};

	useEffect(() => {
		const hash = window.location.hash.slice(1);
		if (hash === 'improve' || hash === 'verify') {
			setMode(hash);
		}
	}, []);

	useEffect(() => {
		window.location.hash = mode;
	}, [mode]);

	return (
		<div className="container">
			<form onSubmit={handleSubmit} className="form">
				<textarea
					value={text}
					onChange={handleTextChange}
					className="textarea"
					rows={1}
					placeholder="Enter your text here"
					style={{resize: 'vertical', overflow: 'hidden'}}
					onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
						const target = e.currentTarget;
						target.style.height = 'auto';
						target.style.height = target.scrollHeight + 'px';
					}}
				></textarea>
				<button
					type="submit"
					className="button"
					disabled={!hasNewText() || isLoading}
				>
					{isLoading ? 'Loading...' : 'Submit'}
				</button>
				<div className="button-container">
					<button
						type="button"
						className="button copy-button"
						onClick={() => navigator.clipboard.writeText(text)}
						style={{width: '48%', backgroundColor: '#81C784'}}
					>
						Copy
					</button>
					<button
						type="button"
						className="button clear-button"
						onClick={() => setText('')}
						style={{width: '48%', backgroundColor: '#E57373'}}
					>
						Clear
					</button>
				</div>
			</form>
			{result && (
				<div className="result">
					<ReactMarkdown>{result}</ReactMarkdown>
				</div>
			)}
			{revisedMessage && (
				<div className="result">
					<div className="result-content">
						<ReactMarkdown>**Revised Message:**</ReactMarkdown>
						<ReactMarkdown>{revisedMessage}</ReactMarkdown>
					</div>
					<div className="button-container">
						<button
							type="button"
							className="button copy-button"
							onClick={() => navigator.clipboard.writeText(text)}
							style={{width: '48%', backgroundColor: '#81C784'}}
						>
							Copy
						</button>
						<button
							type="button"
							className="button clear-button"
							onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
								setText(revisedMessage);
								handleSubmit(event as unknown as React.FormEvent<Element>);
								window.scrollTo({
									top: 0,
									left: 0,
									behavior: 'auto',
								});
							}}
							disabled={isLoading}
							style={{width: '48%'}}
						>
							{isLoading ? 'Loading...' : 'Submit Revised Message'}
						</button>
					</div>
				</div>
			)}
			<div className="mode-and-description">
				<div className="mode-selector">
					<input
						type="radio"
						id="verify"
						name="mode"
						value="verify"
						checked={mode === 'verify'}
						onChange={() => setMode('verify')}
					/>
					<label htmlFor="verify">Verify</label>

					<input
						type="radio"
						id="improve"
						name="mode"
						value="improve"
						checked={mode === 'improve'}
						onChange={() => setMode('improve')}
					/>
					<label htmlFor="improve">Improve</label>
				</div>
				<p className="description">
					This page helps with composing messages in Spanish as a learner. Input
					a message that you want to send either to "verify" it has the intended
					meaning, or to "improve" and push your abilities.
				</p>
			</div>
		</div>
	);
};

export default TextInputForm;
