import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import {ChatContextProvider} from './context/ChatContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChatContextProvider>
			<App />
		</ChatContextProvider>
	</React.StrictMode>,
);
