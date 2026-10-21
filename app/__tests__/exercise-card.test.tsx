// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react'
import React from 'react'

const toastMock = vi.fn()

vi.mock('@/hooks/use-toast', () => ({ toast: (...args: unknown[]) => toastMock(...args) }))
vi.mock('next-auth/react', () => ({ useSession: () => ({ data: null, status: 'unauthenticated' }) }))
vi.mock('framer-motion', () => {
  const strip = ({ initial, animate, exit, transition, whileHover, ...rest }: any) => rest
  return {
    motion: new Proxy(
      {},
      { get: (_t, tag: string) => (props: any) => React.createElement(tag, strip(props)) }
    ),
  }
})

import { ExerciseCard } from '@/components/topics/exercise-card'

const exercise = {
  id: 'ex-1',
  title: 'Show, Don’t Tell',
  prompt: 'Describe a rainy street.',
  instructions: 'Use sensory detail.',
  order: 1,
}

const SUBMIT_URL = `/api/exercises/${exercise.id}/submit`
const SUCCESS_TOAST = {
  title: 'Exercise Completed!',
  description: 'Your response has been saved successfully.',
}
const FAILURE_TOAST = {
  title: 'Save Failed',
  description: 'Your response could not be saved. Please try again.',
  variant: 'destructive',
}

type SubmitImpl = () => Promise<Response>
let submitImpl: SubmitImpl
const fetchMock = vi.fn()

function okResponse(body: unknown = {}, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => {
  toastMock.mockReset()
  fetchMock.mockReset()
  fetchMock.mockImplementation((url: string) => {
    if (url === SUBMIT_URL) return submitImpl()
    // Initial "load existing submission" call: nothing saved yet.
    return Promise.resolve(okResponse({ submission: null }))
  })
  vi.stubGlobal('fetch', fetchMock)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

async function renderAndFill(text = 'Rain hissed on the cobbles.') {
  render(<ExerciseCard exercise={exercise} exerciseNumber={1} topicSlug="craft" />)
  // Wait for the mount-time submission lookup to settle.
  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(`/api/exercises/${exercise.id}/submission`))
  // First button is the expand/collapse toggle.
  fireEvent.click(screen.getAllByRole('button')[0])
  fireEvent.change(screen.getByRole('textbox'), { target: { value: text } })
}

function submitCalls() {
  return fetchMock.mock.calls.filter(([url]) => url === SUBMIT_URL)
}

describe('ExerciseCard handleSubmit persistence', () => {
  it('success path: saves, then shows success toast and completed state', async () => {
    submitImpl = () => Promise.resolve(okResponse({ success: true }))
    await renderAndFill()

    fireEvent.click(screen.getByRole('button', { name: /complete exercise/i }))

    await waitFor(() => expect(toastMock).toHaveBeenCalledWith(SUCCESS_TOAST))
    expect(screen.getByText('Completed')).toBeTruthy()
    expect(screen.getByRole('button', { name: /update response/i })).toBeTruthy()

    const calls = submitCalls()
    expect(calls).toHaveLength(1)
    const [, init] = calls[0]
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ content: 'Rain hissed on the cobbles.', isPublic: false })
    expect(toastMock).not.toHaveBeenCalledWith(expect.objectContaining({ title: 'Save Failed' }))
  })

  it('failure path (network error): shows error toast and does NOT mark completed', async () => {
    submitImpl = () => Promise.reject(new TypeError('Failed to fetch'))
    await renderAndFill()

    fireEvent.click(screen.getByRole('button', { name: /complete exercise/i }))

    await waitFor(() => expect(toastMock).toHaveBeenCalledWith(FAILURE_TOAST))
    expect(toastMock).not.toHaveBeenCalledWith(SUCCESS_TOAST)
    expect(screen.queryByText('Completed')).toBeNull()
    // Loading cleared; user can retry and their text is preserved.
    const retry = screen.getByRole('button', { name: /complete exercise/i }) as HTMLButtonElement
    expect(retry.disabled).toBe(false)
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('Rain hissed on the cobbles.')
  })

  it('failure path (non-ok response): shows error toast and does NOT mark completed', async () => {
    submitImpl = () => Promise.resolve(okResponse({ error: 'boom' }, 500))
    await renderAndFill()

    fireEvent.click(screen.getByRole('button', { name: /complete exercise/i }))

    await waitFor(() => expect(toastMock).toHaveBeenCalledWith(FAILURE_TOAST))
    expect(toastMock).not.toHaveBeenCalledWith(SUCCESS_TOAST)
    expect(screen.queryByText('Completed')).toBeNull()
    expect((screen.getByRole('button', { name: /complete exercise/i }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('await behavior: success state is not set until the save request resolves', async () => {
    let resolveSubmit!: (r: Response) => void
    submitImpl = () => new Promise<Response>((resolve) => { resolveSubmit = resolve })
    await renderAndFill()

    fireEvent.click(screen.getByRole('button', { name: /complete exercise/i }))

    // Request in flight: loading shown, no success toast, not completed.
    await waitFor(() => expect(screen.getByRole('button', { name: /submitting/i })).toBeTruthy())
    expect(submitCalls()).toHaveLength(1)
    expect(toastMock).not.toHaveBeenCalled()
    expect(screen.queryByText('Completed')).toBeNull()

    await act(async () => {
      resolveSubmit(okResponse({ success: true }))
    })

    await waitFor(() => expect(toastMock).toHaveBeenCalledWith(SUCCESS_TOAST))
    expect(screen.getByText('Completed')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /submitting/i })).toBeNull()
  })
})
