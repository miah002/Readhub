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
  it('matches /content and its subpaths', () => {
    expect(isProtectedPath('/content')).toBe(true)
    expect(isProtectedPath('/content/new')).toBe(true)
  })
  it('matches /resources and its subpaths', () => {
    expect(isProtectedPath('/resources')).toBe(true)
    expect(isProtectedPath('/resources/123')).toBe(true)
  })
  it('does not match unrelated or prefix-lookalike paths', () => {
    expect(isProtectedPath('/')).toBe(false)
    expect(isProtectedPath('/login')).toBe(false)
    expect(isProtectedPath('/repositoryFoo')).toBe(false)
    expect(isProtectedPath('/contentFoo')).toBe(false)
    expect(isProtectedPath('/resourcesFoo')).toBe(false)
  })
})
