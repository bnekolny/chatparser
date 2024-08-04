import { describe, it, expect } from 'vitest'
import { shortLanguageCode } from '../languageUtils'
import { Locale } from '../../types'

describe('shortLanguageCode', () => {
  it.each([
    ['en-US', Locale.en],
    ['es-ES', Locale.es],
    ['fr-FR', Locale.fr],
    ['EN-GB', Locale.en],
    ['ES-MX', Locale.es],
    ['eng-US', Locale.en],
    ['spa-ES', Locale.es],
  ])('should return the correct short language code for %s', (input, expected) => {
    expect(shortLanguageCode(input)).toBe(expected)
  })

  it.each([
    ['de-DE'],
    ['ja-JP'],
    ['zh-CN'],
    ['e'],
    ['s']
  ])('should fallback to Spanish for unsupported language code %s', (languageCode) => {
    expect(shortLanguageCode(languageCode)).toBe(Locale.es)
  })

  it('should handle empty string input', () => {
    expect(shortLanguageCode('')).toBe(Locale.es)
  })
})
