import {MessageApiResult, Mode} from '../types';
import {
	CONTENT_TYPE_HEADER,
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
			const response = await fetch(`/api/message/${mode}`, {
				method: HTTP_METHODS.POST,
				headers: {
					...CONTENT_TYPE_HEADER.TEXT
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

	const aiRequestStream = async function* (
		text: string,
		mode: Mode,
	): AsyncGenerator<string, void, unknown> {
		try {
			const response = await fetch('/api/ai-prompt/stream', {
				method: HTTP_METHODS.POST,
				headers: {
					...CONTENT_TYPE_HEADER.JSON
				},
				body: JSON.stringify({
					prompt: {
						system_prompt_type: Mode.Improve,
						//custom_prompt_text: customPromptText
					},
					input_text: text
				}),
			});

			if (!response.ok) {
				throw new Error(ERROR_MESSAGES.HTTP_ERROR(response.status));
			}

			const reader = response.body?.getReader();
			const decoder = new TextDecoder();

			while (reader) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });
				for (const char of chunk) {
					yield char;
				}
			}
		} catch (error) {
			console.error(`${SUBMIT_ERROR}:`, error);
			yield ERROR_MESSAGES.PROCESSING_ERROR;
		}
	};

	return {
		sendMessage,
		aiRequestStream,
	};
};
