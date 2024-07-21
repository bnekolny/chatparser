// API Related Constants
export const API_ENDPOINTS = {
	MESSAGE: (mode: string) => `/api/message/${mode}`,
};

export const HTTP_METHODS = {
	POST: 'POST',
};

export const CONTENT_TYPES = {
	TEXT_PLAIN: 'text/plain',
};

// Error Handling Constants
export const ERROR_MESSAGES = {
	HTTP_ERROR: (status: number) => `HTTP error! status: ${status}`,
	PROCESSING_ERROR: 'An error occurred while processing your request.',
};

export const ERROR_INVALID_INPUT = 'Input must be a non-empty string';
export const ERROR_CAPITALIZE = 'Error in capitalizeFirstLetter:';

// Regular Expressions
export const REGEX = {
	REVISED_MESSAGE: /[\*]*Revised Message:[\*]*([\s\S]*)/,
};

// UI Text Constants
export const DESCRIPTION_TEXT =
	'This page helps with composing messages in Spanish as a learner. Input a message that you want to send either to "verify" it has the intended meaning, or to "improve" and push your abilities.';

export const BUTTON_TEXT = {
	SUBMIT: 'Submit',
	LOADING: 'Loading...',
	COPY: 'Copy',
	CLEAR: 'Clear',
	SUBMIT_REVISED: 'Submit Revised Text',
};

// Environment Constants
export const HOSTS = {
	LOCAL: 'local.chatparser.xyz',
};

// TextArea Constants
export const TEXTAREA = {
	DEFAULT_PLACEHOLDER: 'Enter your text here',
};