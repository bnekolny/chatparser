export const API_ENDPOINTS = {
	MESSAGE: (mode: string) => `/api/message/${mode}`,
};

export const HTTP_METHODS = {
	POST: 'POST',
};

export const CONTENT_TYPES = {
	TEXT_PLAIN: 'text/plain',
};

export const ERROR_MESSAGES = {
	HTTP_ERROR: (status: number) => `HTTP error! status: ${status}`,
	PROCESSING_ERROR: 'An error occurred while processing your request.',
};

export const REGEX = {
	REVISED_MESSAGE: /[\*]*Revised Message:[\*]*([\s\S]*)/,
};

export const DESCRIPTION_TEXT =
	'This page helps with composing messages in Spanish as a learner. Input a message that you want to send either to "verify" it has the intended meaning, or to "improve" and push your abilities.';
