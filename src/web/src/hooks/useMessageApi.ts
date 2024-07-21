import {MessageApiResult, Mode} from '../types';
import {
	API_ENDPOINTS,
	CONTENT_TYPES,
	ERROR_MESSAGES,
	HTTP_METHODS,
	SUBMIT_ERROR,
} from '../constants';

export const useMessageApi = () => {
	const sendMessage = async (
		text: string,
		mode: Mode,
	): Promise<MessageApiResult> => {
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

			return {
				data: data,
			};
		} catch (error) {
			console.error(`${SUBMIT_ERROR}:`, error);
			return {
				data: ERROR_MESSAGES.PROCESSING_ERROR,
			};
		}
	};

	return {
		sendMessage,
	};
};
