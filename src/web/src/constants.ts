// API Related
export const HTTP_METHODS = {
	POST: 'POST',
};

export const CONTENT_TYPE_HEADER = {
	TEXT: {'Content-Type': 'text/plain'},
	JSON: {'Content-Type': 'application/json'},
};

// Error Handling
export const ERROR_MESSAGES = {
	HTTP_ERROR: (status: number) => `HTTP error! status: ${status}`,
	PROCESSING_ERROR: 'An error occurred while processing your request.',
};

export const ERROR_INVALID_INPUT = 'Input must be a non-empty string';
export const ERROR_CAPITALIZE = 'Error in capitalizeFirstLetter:';
export const SUBMIT_ERROR = 'Error submitting text';

// Regular Expressions
export const REGEX = {
	REVISED_MESSAGE: /[\*]*Revised Message:[\*]*([\s\S]*)/,
};

// Environment
export const HOSTS = {
	LOCAL: 'local.chatparser.xyz',
};

// Context
export const CHAT_CONTEXT_ERROR =
	'useChatContext must be used within a ChatContextProvider';
