//import {MessageApiResult, Mode} from '../types';
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
		//mode: Mode,
	): Promise<ReadableStream<Uint8Array> | null> => {
		try {
			const response = await fetch(`/api/ai-response/stream`, {
				method: HTTP_METHODS.POST,
				headers: {
					'Content-Type': CONTENT_TYPES.TEXT_PLAIN,
				},
				body: text,
			});

			if (!response.ok) {
				throw new Error(ERROR_MESSAGES.HTTP_ERROR(response.status));
			}

			return response.body;
			/*const data = response.text();

			return {
				data: data,
			};*/
		} catch (error) {
			console.error(`${SUBMIT_ERROR}:`, error);
			return null;
		}
	};

	return {
		sendMessage,
	};
};
