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
