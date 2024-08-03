export class JsonParser {
	static format(json: string): string {
	  let depth = 0;
	  let result = '';
	  const length = json.length;
  
	  for (let n = 0; n < length; n++) {
		const c = json[n];
		
		if (c === '}' || c === ']') {
		  depth--;
		  result += JsonParser.addBreak(depth);
		}
  
		result += c;
  
		if (c === '{' || c === '[') {
		  depth++;
		  result += JsonParser.addBreak(depth);
		}
		
		if (c === ',') {
		  result += JsonParser.addBreak(depth);
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