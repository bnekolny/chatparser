import React, {useEffect} from 'react';
import TextInputForm from './components/TextInputForm';
import ResultDisplay from './components/ResultDisplay';
import ModeSelector from './components/ModeSelector';
import TestTextButton from './components/TestTextButton';
import styles from './App.module.css';
import {DESCRIPTION_TEXT, HOSTS} from './constants';
import {Mode} from './types';
import {useChatContext} from './context/ChatContext';

const App: React.FC = () => {
	const {mode, setMode} = useChatContext();

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
			<TextInputForm />
			<ResultDisplay />
			<div className={styles.modeAndDescription}>
				<ModeSelector />
				<p className={styles.description}>{DESCRIPTION_TEXT}</p>
			</div>
			{window?.location?.host === HOSTS.LOCAL ? <TestTextButton /> : null}
		</div>
	);
};

export default App;
