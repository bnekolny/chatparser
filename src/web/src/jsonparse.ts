export class JsonParser {
    static parseIncompleteJson(jsonString: string): any {
      const parser = new PartialJsonParser(jsonString);
      return parser.parse();
    }
  }
  
  class PartialJsonParser {
    private pos: number = 0;
    private json: string;
  
    constructor(json: string) {
      this.json = json;
    }
  
    parse(): any {
      this.skipWhitespace();
      if (this.json[this.pos] === '{') {
        return this.parseObject();
      } else if (this.json[this.pos] === '[') {
        return this.parseArray();
      } else {
        throw new Error('Invalid JSON: must start with { or [');
      }
    }
  
    private parseObject(): any {
      const obj: any = {};
      this.pos++; // Skip opening brace
      
      while (this.pos < this.json.length) {
        this.skipWhitespace();
        
        if (this.json[this.pos] === '}') {
          this.pos++; // Skip closing brace
          return obj;
        }
        
        const key = this.parseString();
        this.skipWhitespace();
        
        if (this.pos >= this.json.length || this.json[this.pos] !== ':') {
          return obj; // Incomplete, return what we have
        }
        
        this.pos++; // Skip colon
        this.skipWhitespace();
        
        const value = this.parseValue();
        obj[key] = value;
        
        this.skipWhitespace();
        if (this.json[this.pos] === ',') {
          this.pos++; // Skip comma
        } else if (this.json[this.pos] !== '}') {
          return obj; // Incomplete, return what we have
        }
      }
      
      return obj; // Reached end of input
    }
  
    private parseArray(): any[] {
      const arr: any[] = [];
      this.pos++; // Skip opening bracket
      
      while (this.pos < this.json.length) {
        this.skipWhitespace();
        
        if (this.json[this.pos] === ']') {
          this.pos++; // Skip closing bracket
          return arr;
        }
        
        const value = this.parseValue();
        arr.push(value);
        
        this.skipWhitespace();
        if (this.json[this.pos] === ',') {
          this.pos++; // Skip comma
        } else if (this.json[this.pos] !== ']') {
          return arr; // Incomplete, return what we have
        }
      }
      
      return arr; // Reached end of input
    }
  
    private parseValue(): any {
      this.skipWhitespace();
      const char = this.json[this.pos];
      
      if (char === '{') {
        return this.parseObject();
      } else if (char === '[') {
        return this.parseArray();
      } else if (char === '"') {
        return this.parseString();
      } else if (char === 't' && this.json.slice(this.pos, this.pos + 4) === 'true') {
        this.pos += 4;
        return true;
      } else if (char === 'f' && this.json.slice(this.pos, this.pos + 5) === 'false') {
        this.pos += 5;
        return false;
      } else if (char === 'n' && this.json.slice(this.pos, this.pos + 4) === 'null') {
        this.pos += 4;
        return null;
      } else {
        return this.parseNumber();
      }
    }
  
    private parseString(): string {
      let result = '';
      this.pos++; // Skip opening quote
      
      while (this.pos < this.json.length) {
        const char = this.json[this.pos];
        if (char === '"' && this.json[this.pos - 1] !== '\\') {
          this.pos++; // Skip closing quote
          return result;
        }
        result += char;
        this.pos++;
      }
      
      return result; // Incomplete string, return what we have
    }
  
    private parseNumber(): number {
      const start = this.pos;
      while (this.pos < this.json.length && /[\d.+\-eE]/.test(this.json[this.pos])) {
        this.pos++;
      }
      return parseFloat(this.json.slice(start, this.pos));
    }
  
    private skipWhitespace(): void {
      while (this.pos < this.json.length && /\s/.test(this.json[this.pos])) {
        this.pos++;
      }
    }
  }