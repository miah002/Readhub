import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders children and forwards onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Click me' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applies the teal variant class', () => {
    render(<Button variant="teal">Log In</Button>)
    expect(screen.getByRole('button', { name: 'Log In' })).toHaveClass('bg-teal')
  })
})
