import React, {useEffect, useState} from 'react';
import {Mode, Locale} from '../types';
import {useMessageApi} from '../hooks/useMessageApi';
import {CHAT_CONTEXT_ERROR, REGEX} from '../constants';
import {useTranslation} from 'react-i18next';

interface ChatContextType {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	mode: Mode;
	setMode: (mode: Mode) => void;
	handleTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	text: string;
	setText: (text: string) => void;
	previousText: string;
	setPreviousText: (text: string) => void;
	prompt: string;
	setPrompt: (text: string) => void;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	handleSendMessage: (inputText?: string) => Promise<void>;
	response: string;
	setResponse: (response: string) => void;
	revisedMessage: string;
	setRevisedMessage: (text: string) => void;
	handleSubmitRevisedText: () => void;
}

const ChatContext = React.createContext<ChatContextType | undefined>(undefined);

const ChatContextProvider: React.FC<{
	children: React.ReactNode;
	value?: Partial<ChatContextType>;
}> = ({children, value = {}}) => {
	const {i18n} = useTranslation();

	const [locale, setLocale] = useState<Locale>(i18n.language as Locale);
	const [mode, setMode] = useState<Mode>(value.mode || Mode.Verify);
	const [text, setText] = useState<string>('');
	const [previousText, setPreviousText] = useState<string>('');
	const [prompt, setPrompt] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [response, setResponse] = useState<string>('');
	const [revisedMessage, setRevisedMessage] = useState<string>('');

	const {aiRequestStream} = useMessageApi();

	useEffect(() => {
		setLocale(i18n.language as Locale);
	}, [i18n.language]);

	useEffect(() => {
		if (mode === Mode.Verify && response) {
			const extractedMessage = extractRevisedMessage(response);
			setRevisedMessage(extractedMessage);
		}
	}, [mode, response]);

	const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(event.target.value);
	};

	const handleSendMessage = async (inputText?: string): Promise<void> => {
		var submitText = inputText || text;

		setPreviousText(submitText);
		setIsLoading(true);
		try {
			const messageStream = aiRequestStream(locale, submitText, prompt || mode);
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
		locale,
		setLocale,
		mode,
		setMode,
		handleTextChange,
		text,
		setText,
		previousText,
		setPreviousText,
		prompt,
		setPrompt,
		handleSendMessage,
		response,
		setResponse,
		isLoading,
		setIsLoading,
		revisedMessage,
		handleSubmitRevisedText,
		setRevisedMessage,
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
