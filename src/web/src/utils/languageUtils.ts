import {ERROR_CAPITALIZE, ERROR_INVALID_INPUT} from '../constants';
import {Locale} from '../types';

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

// NOTE: fallback to Spanish if language code is not supported, although that
// should not happen so long as i18n.ts and types.ts (Locale) are in sync
export const shortLanguageCode = (i18nextLanguageCode: string): Locale => {
	const iso6391Code = i18nextLanguageCode.slice(0, 2).toLowerCase(); // trim to first 2 characters
	if (Object.values(Locale).map(String).includes(iso6391Code)) {
		return iso6391Code as Locale;
	} else {
		return Locale.es;
	}
}

export class JsonDebug {
	static format(json: string): string {
	  let depth = 0;
	  let result = '';
	  const length = json.length;
  
	  for (let n = 0; n < length; n++) {
		const c = json[n];
		
		if (c === '}' || c === ']') {
		  depth--;
		  result += JsonDebug.addBreak(depth);
		}
  
		result += c;
  
		if (c === '{' || c === '[') {
		  depth++;
		  result += JsonDebug.addBreak(depth);
		}
		
		if (c === ',') {
		  result += JsonDebug.addBreak(depth);
		}
	  }
  
	  return result;
	}
  
	private static addBreak(depth: number): string {
	  return "\n" + "\t".repeat(depth);
	}
  
	static parseIncompleteJson(jsonString: string): any {
	  // Remove any trailing commas
	  jsonString = jsonString.replace(/,\s*$/, '');
  
	  // Attempt to close any unclosed structures
	  let openBraces = (jsonString.match(/{/g) || []).length;
	  let closeBraces = (jsonString.match(/}/g) || []).length;
	  let openBrackets = (jsonString.match(/\[/g) || []).length;
	  let closeBrackets = (jsonString.match(/\]/g) || []).length;
  
	  jsonString += '}'.repeat(Math.max(0, openBraces - closeBraces));
	  jsonString += ']'.repeat(Math.max(0, openBrackets - closeBrackets));
  
	  try {
		return JSON.parse(jsonString);
	  } catch (error) {
		console.warn("Unable to parse JSON, attempting partial parse:", error);
		return this.parsePartial(jsonString);
	  }
	}
  
	private static parsePartial(json: string): any {
	  const result: any = {};
	  const keyRegex = /"([\w\-]+)"\s*:/g;
	  let match;
	  let lastIndex = 0;
  
	  while ((match = keyRegex.exec(json)) !== null) {
		const key = match[1];
		const valueStart = match.index + match[0].length;
		let valueEnd = json.length;
  
		// Find the end of the value
		let depth = 0;
		for (let i = valueStart; i < json.length; i++) {
		  if (json[i] === '{' || json[i] === '[') depth++;
		  if (json[i] === '}' || json[i] === ']') depth--;
		  if (depth === 0 && json[i] === ',') {
			valueEnd = i;
			break;
		  }
		}
  
		let value = json.slice(valueStart, valueEnd).trim();
  
		// Remove surrounding quotes if present
		if (value.startsWith('"') && value.endsWith('"')) {
		  value = value.slice(1, -1);
		}
  
		// Attempt to parse the value
		try {
		  result[key] = JSON.parse(value);
		} catch {
		  // If parsing fails, store as is
		  result[key] = value;
		}
  
		lastIndex = valueEnd;
	  }
  
	  return result;
	}
  }
};
