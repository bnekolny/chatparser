import {ERROR_CAPITALIZE, ERROR_INVALID_INPUT} from './constants';

// TODO: write unit tests for this function
export const capitalizeFirstLetter = (str: string): string => {
	try {
		if (typeof str !== 'string' || str.length === 0) {
			throw new Error(ERROR_INVALID_INPUT);
		}
		return str.charAt(0).toUpperCase() + str.slice(1);
	} catch (error: any) {
		// TODO: type error
		console.error(`${ERROR_CAPITALIZE} ${error.message}`);
		return str;
	}
};
