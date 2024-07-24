import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import {ChatContextProvider} from './context/ChatContext';
import DictInputForm from './components/DictInputForm';
import ResultDisplay from './components/ResultDisplay';
import styles from './App.module.css';
import {useChatContext} from './context/ChatContext';
import {Mode} from './types';

const Dict: React.FC = () => {
	const {} = useChatContext();

	return (
		<div className={styles.container}>
			<DictInputForm />
			<ResultDisplay />
		</div>
	);
};

export default Dict;

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChatContextProvider value={{mode: Mode.Dictionary}}>
			<Dict />
		</ChatContextProvider>
	</React.StrictMode>,
);
