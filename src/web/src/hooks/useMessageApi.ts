import {useState} from 'react';
import {MessageApiResult} from '../types';
import {
	API_ENDPOINTS,
	CONTENT_TYPES,
	ERROR_MESSAGES,
	HTTP_METHODS,
	REGEX,
} from '../constants';

export const useMessageApi = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [result, setResult] = useState<string>('');
	const [revisedMessage, setRevisedMessage] = useState<string>('');

	const sendMessage = async (
		text: string,
		mode: string,
	): Promise<MessageApiResult> => {
		setIsLoading(true);

		try {
			const response = await fetch(API_ENDPOINTS.MESSAGE(mode), {
				method: HTTP_METHODS.POST,
				headers: {
					'Content-Type': CONTENT_TYPES.TEXT_PLAIN,
				},
				body: text,
			});

			if (!response.ok) {
				throw new Error(ERROR_MESSAGES.HTTP_ERROR(response.status));
			}

			const data = await response.text();
			const [resultWithoutRevision, revisedMsg] = parseResponse(data);

			setResult(resultWithoutRevision);
			setRevisedMessage(revisedMsg);

			return {
				result: resultWithoutRevision,
				revisedMessage: revisedMsg,
				isLoading: false,
			};
		} catch (error) {
			console.error('Error submitting text:', error);
			setResult(ERROR_MESSAGES.PROCESSING_ERROR);
			return {
				result: ERROR_MESSAGES.PROCESSING_ERROR,
				revisedMessage: '',
				isLoading: false,
			};
		} finally {
			setIsLoading(false);
		}
	};

	const parseResponse = (data: string): [string, string] => {
		const revisedMessageMatch = data.match(REGEX.REVISED_MESSAGE);
		const revisedMessage = revisedMessageMatch
			? revisedMessageMatch[1].trim()
			: '';
		const resultWithoutRevision = data
			.replace(REGEX.REVISED_MESSAGE, '')
			.trim();
		return [resultWithoutRevision, revisedMessage];
	};

	return {sendMessage, result, revisedMessage, isLoading};
};
