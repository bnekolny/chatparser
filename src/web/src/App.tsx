import React, {useEffect, useState} from 'react';
import TextInputForm from './components/TextInputForm';
import ResultDisplay from './components/ResultDisplay';
import ModeSelector from './components/ModeSelector';
import styles from './App.module.css';
import {DESCRIPTION_TEXT} from './constants';
import {Mode} from './types';
import {useChatContext} from './context/ChatContext';
import LandscapeBlocker from './components/LandscapeBlocker';

const App: React.FC = () => {
	const {mode, setMode} = useChatContext();
	const [isLandscape, setIsLandscape] = useState<boolean>(false);

	useEffect(() => {
		const checkOrientation = () => {
			setIsLandscape(window.innerWidth > window.innerHeight);
		};

		window.addEventListener('resize', checkOrientation);
		checkOrientation();

		return () => window.removeEventListener('resize', checkOrientation);
	}, []);

	useEffect(() => {
		const hash = window.location.hash.slice(1) as Mode;
		if (hash === Mode.Improve || hash === Mode.Verify) {
			setMode(hash);
		}
	}, []);

	useEffect(() => {
		window.location.hash = mode;
	}, [mode]);

	if (isLandscape && window.innerWidth >= 600 && window.innerWidth <= 1050) {
		return <LandscapeBlocker />;
	}

	return (
		<div className={styles.container}>
			<div className={styles.modeAndDescription}>
				<p className={styles.description}>{DESCRIPTION_TEXT}</p>
				<ModeSelector />
			</div>
			<TextInputForm />
			<ResultDisplay />
		</div>
	);
};

export default App;
