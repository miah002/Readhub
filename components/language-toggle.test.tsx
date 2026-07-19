import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LanguageToggle } from './language-toggle'

describe('LanguageToggle', () => {
  it('calls onChange with the clicked language', async () => {
    const onChange = vi.fn()
    render(<LanguageToggle lang="en" onChange={onChange} />)
    await userEvent.click(screen.getByText('FIL'))
    expect(onChange).toHaveBeenCalledWith('fil')
  })
})
