import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { LanguageProvider, useLanguage } from './language-context'

function Probe() {
  const { lang, dict, setLang } = useLanguage()
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="title">{dict.login.title}</span>
      <button onClick={() => setLang('fil')}>switch</button>
    </div>
  )
}

describe('LanguageProvider', () => {
  it('defaults to en and switches to fil on demand', async () => {
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
    expect(screen.getByTestId('title')).toHaveTextContent('Teacher Login')
    await userEvent.click(screen.getByText('switch'))
    expect(screen.getByTestId('lang')).toHaveTextContent('fil')
    expect(screen.getByTestId('title')).toHaveTextContent('Login ng Guro')
  })
})
