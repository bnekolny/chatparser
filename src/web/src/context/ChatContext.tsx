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

	const {aiRequestStream} = useMessageApi();

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
			const messageStream = aiRequestStream(text, mode);
			let fullResponse = '';
			let currentWord = '';

			for await (const char of messageStream) {
				fullResponse += char;
				currentWord += char;

				// this is spitting out words at a time which runs significantly
				// faster than character at a time is able to do
				if (/\s/.test(char)) {
					setResponse(fullResponse);
					await new Promise(resolve => setTimeout(resolve, 0));
					currentWord = '';
				} else if (currentWord.length >= 5) {
					setResponse(fullResponse);
					currentWord = '';
				}
			}
			setResponse(fullResponse);
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
