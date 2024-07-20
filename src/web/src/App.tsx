import React, {useState, useEffect} from 'react';
import {useMessageApi} from './hooks/useMessageApi';
import TextInputForm from './components/TextInputForm';
import ResultDisplay from './components/ResultDisplay';
import ModeSelector from './components/ModeSelector';
import TestTextButton from './components/TestTextButton';
import styles from './App.module.css';
import {DESCRIPTION_TEXT} from './constants';
import {Mode} from './types';

const App: React.FC = () => {
	const [previousText, setPreviousText] = useState<string>('');
	const [text, setText] = useState<string>('');
	const [mode, setMode] = useState<Mode>(Mode.Verify);
	const {sendMessage, result, revisedMessage, isLoading} = useMessageApi();

	const hasNewText = (): boolean => {
		return text !== previousText;
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setPreviousText(text);
		await sendMessage(text, mode);
	};

	const handleTextChange = (newText: string) => {
		setText(newText);
	};

	const handleCopy = (textToCopy: string) => {
		navigator.clipboard.writeText(textToCopy);
	};

	const handleSubmitRevised = () => {
		setText(revisedMessage || '');
		sendMessage(revisedMessage || '', mode);
		window.scrollTo(0, 0);
	};

	useEffect(() => {
		const hash = window.location.hash.slice(1) as Mode;
		if (hash === Mode.Improve || hash === Mode.Verify) {
			setMode(hash);
		}
	}, []);

	useEffect(() => {
		window.location.hash = mode;
	}, [mode]);

	return (
		<div className={styles.container}>
			<TextInputForm
				text={text}
				onTextChange={handleTextChange}
				onSubmit={handleSubmit}
				onCopy={handleCopy}
				onClear={() => setText('')}
				isLoading={isLoading}
				hasNewText={hasNewText()}
			/>
			<ResultDisplay
				result={result}
				revisedMessage={revisedMessage}
				isLoading={isLoading}
				onCopy={handleCopy}
				onSubmitRevised={handleSubmitRevised}
			/>
			<div className={styles.modeAndDescription}>
				<ModeSelector mode={mode} setMode={setMode} />
				<p className={styles.description}>{DESCRIPTION_TEXT}</p>
			</div>
			{ window?.location?.host == 'local.chatparser.xyz' ?
			<TestTextButton
				setTextFunction={setText}
				sendMessageFunction={sendMessage}
			/> : null
			}
		</div>
	);
};

export default App;
