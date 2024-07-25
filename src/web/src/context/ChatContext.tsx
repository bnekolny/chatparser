import React, {useEffect, useState} from 'react';
import {Mode} from '../types';
import {useMessageApi} from '../hooks/useMessageApi';
import {CHAT_CONTEXT_ERROR, REGEX} from '../constants';

// TODO: talk to Brett about dividing this file
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
	revisedMessage: string;
	setRevisedMessage: (text: string) => void;
	handleSubmitRevisedText: () => void;
	isLandscape: boolean;
	setIsLandscape: (isLandscape: boolean) => void;
}

const ChatContext = React.createContext<ChatContextType | undefined>(undefined);

const ChatContextProvider: React.FC<{
	children: React.ReactNode;
	value?: Partial<ChatContextType>;
}> = ({children, value = {}}) => {
	const [mode, setMode] = useState<Mode>(value.mode || Mode.Verify); //Mode.Verify);
	const [text, setText] = useState<string>('');
	const [previousText, setPreviousText] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [response, setResponse] = useState<string>('');
	const [revisedMessage, setRevisedMessage] = useState<string>('');
	const [isLandscape, setIsLandscape] = useState<boolean>(false);

	const {sendMessage} = useMessageApi();

	useEffect(() => {
		if (mode === Mode.Verify && response) {
			const extractedMessage = extractRevisedMessage(response);
			setRevisedMessage(extractedMessage);
		}
	}, [mode, response]);

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
			const response = await sendMessage(inputText || text, mode);
			setResponse(response.data);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmitRevisedText = async (): Promise<void> => {
		setText(revisedMessage);
		await handleSendMessage();
	};

	const extractRevisedMessage = (response: string): string => {
		const match = response.match(REGEX.REVISED_MESSAGE);
		return match ? match[1].trim() : '';
		return '';
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
		revisedMessage,
		handleSubmitRevisedText,
		setRevisedMessage,
		isLandscape,
		setIsLandscape,
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
