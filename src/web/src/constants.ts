// API Related
export const API_ENDPOINTS = {
	MESSAGE: (mode: string) => `/api/message/${mode}`,
};

export const HTTP_METHODS = {
	POST: 'POST',
};

export const CONTENT_TYPES = {
	TEXT_PLAIN: 'text/plain',
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

// UI Text
// export const DESCRIPTION_TEXT =
// 	'This page helps with composing messages in Spanish as a learner. Input a message that you want to send either to "verify" it has the intended meaning, or to "improve" and push your abilities.';
export const DESCRIPTION_TEXT =
	'Spanish writing assistant: Check or level up your messages';

export const BUTTON_TEXT = {
	SUBMIT: 'Submit',
	LOADING: 'Loading...',
	COPY: 'Copy',
	CLEAR: 'Clear',
	SUBMIT_REVISED: 'Submit Revised Text',
};

// Environment
export const HOSTS = {
	LOCAL: 'local.chatparser.xyz',
};

// TextArea
export const TEXTAREA = {
	DEFAULT_PLACEHOLDER: 'Enter your text here',
};

// Context
export const CHAT_CONTEXT_ERROR =
	'useChatContext must be used within a ChatContextProvider';
