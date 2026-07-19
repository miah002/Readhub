import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from './card'

describe('Card', () => {
  it('renders children inside a bordered container', () => {
    render(<Card data-testid="card">Hello</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveTextContent('Hello')
    expect(card).toHaveClass('border-cardBorder')
  })
})
