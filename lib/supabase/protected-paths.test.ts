import { describe, it, expect } from 'vitest'
import { isProtectedPath } from './protected-paths'

describe('isProtectedPath', () => {
  it('matches /dashboard and its subpaths', () => {
    expect(isProtectedPath('/dashboard')).toBe(true)
    expect(isProtectedPath('/dashboard/settings')).toBe(true)
  })
  it('matches /repository and its subpaths', () => {
    expect(isProtectedPath('/repository')).toBe(true)
    expect(isProtectedPath('/repository/abc-123')).toBe(true)
  })
  it('does not match unrelated or prefix-lookalike paths', () => {
    expect(isProtectedPath('/')).toBe(false)
    expect(isProtectedPath('/login')).toBe(false)
    expect(isProtectedPath('/repositoryFoo')).toBe(false)
  })
})
