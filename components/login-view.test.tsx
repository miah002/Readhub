import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LoginView } from './login-view'
import { LanguageProvider } from '@/lib/i18n/language-context'

describe('LoginView', () => {
  it('submits the entered email and password', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<LanguageProvider><LoginView onSubmit={onSubmit} /></LanguageProvider>)

    await userEvent.type(screen.getByLabelText('Email Address'), 'jemimah.ulan@sjes.edu.ph')
    await userEvent.type(screen.getByLabelText('Password'), 'hunter2')
    await userEvent.click(screen.getByRole('button', { name: 'Log In' }))

    expect(onSubmit).toHaveBeenCalledWith('jemimah.ulan@sjes.edu.ph', 'hunter2')
  })

  it('shows the returned error message', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ error: 'Invalid email or password.' })
    render(<LanguageProvider><LoginView onSubmit={onSubmit} /></LanguageProvider>)

    await userEvent.type(screen.getByLabelText('Email Address'), 'wrong@sjes.edu.ph')
    await userEvent.type(screen.getByLabelText('Password'), 'bad')
    await userEvent.click(screen.getByRole('button', { name: 'Log In' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password.')
  })
})
