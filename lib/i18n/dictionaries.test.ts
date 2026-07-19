import { describe, it, expect } from 'vitest'
import { en } from './en'
import { fil } from './fil'

function keyPaths(obj: unknown, prefix = ''): string[] {
  if (Array.isArray(obj)) {
    return obj.length ? keyPaths(obj[0], `${prefix}[]`) : [prefix]
  }
  if (obj && typeof obj === 'object') {
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
      keyPaths(v, prefix ? `${prefix}.${k}` : k)
    )
  }
  return [prefix]
}

describe('dictionaries', () => {
  it('en and fil expose the same key paths', () => {
    expect(keyPaths(fil).sort()).toEqual(keyPaths(en).sort())
  })
})
