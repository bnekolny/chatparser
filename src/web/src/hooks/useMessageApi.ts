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
		locale: Locale,
		text: string,
		promptModeOrPromptText: string | Mode,
	): AsyncGenerator<string, void, unknown> {
		try {
			const promptObj: { custom_prompt_text?: string; system_prompt_type?: Mode } = {};
			if (!Object.values(Mode).includes(promptModeOrPromptText as Mode)) {
				promptObj.custom_prompt_text = promptModeOrPromptText;
			} else {
				promptObj.system_prompt_type = promptModeOrPromptText as Mode;
			}
			const response = await fetch('/api/ai-prompt/stream', {
				method: HTTP_METHODS.POST,
				headers: {
					...CONTENT_TYPE_HEADER.JSON
				},
				body: JSON.stringify({
					locale: locale,
					prompt: {
						...promptObj,
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
