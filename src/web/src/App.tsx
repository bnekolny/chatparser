import React, {useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import TextInputForm from './components/TextInputForm';
import ResultDisplay from './components/ResultDisplay';
import ModeSelector from './components/ModeSelector';
import DevToolsPane from './components/DevTools/DevToolsPane';
import styles from './App.module.css';
import {HOSTS} from './constants';
import {Mode} from './types';
import {useChatContext} from './context/ChatContext';

const App: React.FC = () => {
	const { t } = useTranslation();
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
				<p className={styles.description}>{t('app_description_text')}</p>
			</div>
			{window?.location?.host === HOSTS.LOCAL ? <DevToolsPane /> : null}
		</div>
	);
};

export default App;
