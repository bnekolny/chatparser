import React, {useState} from 'react';
import {Mode} from '../types';

interface ChatContextType {
	mode: Mode;
	setMode: (mode: Mode) => void;
}

const ChatContext = React.createContext<ChatContextType | undefined>(undefined);

const ChatContextProvider: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	const [mode, setMode] = useState<Mode>(Mode.Verify);

	const chatContext = {
		mode,
		setMode,
	};

	return (
		<ChatContext.Provider value={chatContext}>{children}</ChatContext.Provider>
	);
};

const useChatContext = (): ChatContextType => {
	const context = React.useContext(ChatContext);
	if (context === undefined) {
		throw new Error('useChatContext must be used within a ChatContextProvider');
	}
	return context;
};

export {ChatContextProvider, useChatContext};
