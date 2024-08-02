import { describe, it, expect, jest } from '@jest/globals'
import { aiRequestStream } from '../useMessageApi'
import { Mode, ERROR_MESSAGES } from '../../constants'
import fetchMock from 'jest-fetch-mock'

describe('aiRequestStream', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should yield characters from the stream when successful', async () => {
    const mockResponse = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('Hello'))
        controller.enqueue(new TextEncoder().encode(' World'))
        controller.close()
      },
    })

    fetchMock.mockResponseOnce(() => Promise.resolve({ body: mockResponse, status: 200 }))

    const generator = aiRequestStream('Test input', Mode.Verify)
    const result = []

    for await (const char of generator) {
      result.push(char)
    }

    expect(result.join('')).toBe('Hello World')
    expect(fetchMock).toHaveBeenCalledWith('/api/ai-prompt/stream', expect.any(Object))
  })

  it('should handle custom prompt text', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: 'success' }))

    const generator = aiRequestStream('Test input', 'Custom prompt')
    await generator.next()

    expect(fetchMock).toHaveBeenCalledWith('/api/ai-prompt/stream', expect.objectContaining({
      body: expect.stringContaining('"custom_prompt_text":"Custom prompt"'),
    }))
  })

  it('should handle system prompt type', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: 'success' }))

    const generator = aiRequestStream('Test input', Mode.Dictionary)
    await generator.next()

    expect(fetchMock).toHaveBeenCalledWith('/api/ai-prompt/stream', expect.objectContaining({
      body: expect.stringContaining('"system_prompt_type":"dictionary"'),
    }))
  })

  it('should yield error message on HTTP error', async () => {
    fetchMock.mockResponseOnce('', { status: 500 })

    const generator = aiRequestStream('Test input', Mode.Verify)
    const result = await generator.next()

    expect(result.value).toBe(ERROR_MESSAGES.PROCESSING_ERROR)
  })

  it('should yield error message on network failure', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'))

    const generator = aiRequestStream('Test input', Mode.Verify)
    const result = await generator.next()

    expect(result.value).toBe(ERROR_MESSAGES.PROCESSING_ERROR)
  })
})
