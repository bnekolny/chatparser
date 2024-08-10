import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import {ChatContextProvider} from './context/ChatContext';
import DictInputForm from './components/DictInputForm';
import ResultDisplay from './components/ResultDisplay';
import styles from './App.module.css';
import {useChatContext} from './context/ChatContext';
import {Mode} from './types';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';
import DevToolsPane from './components/DevTools/DevToolsPane';
import {HOSTS} from './constants';

const Dict: React.FC = () => {
	const {} = useChatContext();

	return (
		<div className={styles.container}>
			<DictInputForm />
			<ResultDisplay />
			{window?.location?.host === HOSTS.LOCAL && <DevToolsPane />}
		</div>
	);
};

export default Dict;

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<I18nextProvider i18n={i18n}>
			<ChatContextProvider value={{mode: Mode.Dictionary}}>
				<Dict />
			</ChatContextProvider>
		</I18nextProvider>
	</React.StrictMode>,
);
