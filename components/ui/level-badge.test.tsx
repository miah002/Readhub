import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LevelBadge } from './level-badge'

describe('LevelBadge', () => {
  it('renders the label with the level color', () => {
    render(<LevelBadge level="transitioning" label="Transitioning" />)
    const badge = screen.getByText('Transitioning')
    expect(badge).toHaveStyle({ color: '#29B6A4' })
  })
})
