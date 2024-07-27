import React, {useState} from 'react';
import {Mode} from '../types';
import {useMessageApi} from '../hooks/useMessageApi';
import {CHAT_CONTEXT_ERROR} from '../constants';

interface ChatContextType {
	mode: Mode;
	setMode: (mode: Mode) => void;
	handleTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	text: string;
	setText: (text: string) => void;
	previousText: string;
	setPreviousText: (text: string) => void;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	handleSendMessage: (inputText?: string) => Promise<void>;
	response: string;
	setResponse: (response: string) => void;
}

const ChatContext = React.createContext<ChatContextType | undefined>(undefined);

const ChatContextProvider: React.FC<{children: React.ReactNode, value?: Partial<ChatContextType>}> = ({
	children,
	value = {},
}) => {
	const [mode, setMode] = useState<Mode>(value.mode || Mode.Verify);//Mode.Verify);
	const [text, setText] = useState<string>('');
	const [previousText, setPreviousText] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [response, setResponse] = useState<string>('');

	const {sendMessage} = useMessageApi();

	const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(event.target.value);
		const target = event.target;
		target.style.height = 'auto';
		target.style.height = target.scrollHeight + 'px';
	};

	const handleSendMessage = async (inputText?: string): Promise<void> => {
		setPreviousText(inputText || text);
		setIsLoading(true);
		try {
			const stream = await sendMessage(text);
			if (stream) {
				const reader = stream.getReader();
				const decoder = new TextDecoder();
				let fullResponse = '';

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value, { stream: true });
					for (let i = 0; i < chunk.length; i++ ) {
						fullResponse += chunk[i];
						setResponse(fullResponse);
						// Add a small delay to create a typing effect
						await new Promise(resolve => setTimeout(resolve, 1));
					}
					//partialResponse += decoder.decode(value, { stream: true });
					//setResponse(partialResponse);
				}
			}
			else {
				setResponse('doh! something went wrong');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const chatContext = {
		mode,
		setMode,
		handleTextChange,
		text,
		setText,
		previousText,
		setPreviousText,
		handleSendMessage,
		response,
		setResponse,
		isLoading,
		setIsLoading,
	};

	return (
		<ChatContext.Provider value={chatContext}>{children}</ChatContext.Provider>
	);
};

const useChatContext = (): ChatContextType => {
	const context = React.useContext(ChatContext);
	if (context === undefined) {
		throw new Error(CHAT_CONTEXT_ERROR);
	}
	return context;
};

export {ChatContextProvider, useChatContext};
