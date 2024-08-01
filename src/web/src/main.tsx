import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import {ChatContextProvider} from './context/ChatContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<I18nextProvider i18n={i18n}>
			<ChatContextProvider>
				<App />
			</ChatContextProvider>
		</I18nextProvider>
	</React.StrictMode>,
);
