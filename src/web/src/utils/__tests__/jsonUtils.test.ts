import { describe, it, expect } from 'vitest'
import { JsonUtils } from '../jsonUtils'

describe('JsonUtils', () => {
  describe('parseIncompleteJson', () => {
    it('should parse a complete JSON string', () => {
      const input = '{"name": "John", "age": 30}'
      const result = JsonUtils.parseIncompleteJson(input)
      expect(result).toEqual({ name: 'John', age: 30 })
    })

    it('should handle trailing commas', () => {
      const input = '{"name": "John", "age": 30,}'
      const result = JsonUtils.parseIncompleteJson(input)
      expect(result).toEqual({ name: 'John', age: 30 })
    })

    it('should close unclosed braces', () => {
      const input = '{"name": "John", "age": 30'
      const result = JsonUtils.parseIncompleteJson(input)
      expect(result).toEqual({ name: 'John', age: 30 })
    })

    it('should close unclosed brackets', () => {
      const input = '{"items": ["apple", "banana"'
      const result = JsonUtils.parseIncompleteJson(input)
      expect(result).toEqual({ items: ['apple', 'banana'] })
    })

    it('should handle nested structures', () => {
      const input = '{"person": {"name": "John", "address": {"city": "New York"'
      const result = JsonUtils.parseIncompleteJson(input)
      expect(result).toEqual({ person: { name: 'John', address: { city: 'New York' } } })
    })

    it('should fall back to partial parsing for invalid JSON', () => {
      const input = '{"name": "John", "age": invalid}'
      const result = JsonUtils.parseIncompleteJson(input)
      expect(result).toEqual({ name: 'John', age: 'invalid' })
    })

    it('should handle empty input', () => {
      const input = ''
      const result = JsonUtils.parseIncompleteJson(input)
      expect(result).toEqual({})
    })

    it('should handle input with only opening structures', () => {
      const input = '{{'
      const result = JsonUtils.parseIncompleteJson(input)
      expect(result).toEqual({})
    })

    describe('parseIncompleteJson', () => {
      it.each([
        [
            '{"name": "John", "age": 30, "isStudent": true, "grades": [95, 87, 92',
            { name: 'John', age: 30, isStudent: true, grades: [95, 87, 92] },
        ],
        [
            '{"n',
            {},
        ],
        [
            '{"name"',
            {},
        ],
        [
            '{"name":',
            {},
        ],
        [
            '{"name": "',
            {},
        ],
        [
            '{"name": "John',
            {},
        ],
        [
            '{"name": "John"',
            { name: 'John' },
        ],
        [
            '{"name": "John",',
            { name: 'John' },
        ],
        [
            '{"name": "John", "a',
            { name: 'John' },
        ],
        [
            '{"name": "John", "age"',
            { name: 'John' },
        ],
        [
            '{"name": "John", "age":',
            { name: 'John' },
        ],
        [
            '{"name": "John", "age": 30',
            { name: 'John', age: 30 },
        ],
        [
            '{"name": "John", "age": 30, "',
            { name: 'John', age: 30 },
        ],
        //'{"name": "John", "age": 30, "isStudent": true, "grades": [95, 87, 92',
        [
            '{"name": "John", "age": 30, "isStudent": tru',
            { name: 'John', age: 30 },
        ],
        [
            '{"name": "John", "age": 30, "isStudent": true, "grades": [',
            { name: 'John', age: 30, isStudent: true },
        ],
        [
            '{"name": "John", "age": 30, "isStudent": true, "grades": [95',
            { name: 'John', age: 30, isStudent: true },
        ],
        [
            '{"name": "John", "age": 30, "isStudent": true, "grades": [95, 87',
            { name: 'John', age: 30, isStudent: true },
        ],
      ])('should parse $input', (input: string, expected: object) => {
        const result = JsonUtils.parseIncompleteJson(input)
        expect(result).toEqual(expected)
      })
    })
  })
})
