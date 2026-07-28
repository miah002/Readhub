import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ResourcesView } from './resources-view'
import { LanguageProvider } from '@/lib/i18n/language-context'
import type { Resource } from '@/lib/types'

const refresh = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}))

const existingResource: Resource = {
  id: 'r1', title: 'Parent Reading Guide', description: 'Simple tips for reading at home.', tag: 'Guide',
  file_path: 't1/guide.pdf', file_url: 'https://example.com/guide.pdf', uploaded_by: 't1', created_at: '2026-01-01',
}

function renderResources(onUpload = vi.fn().mockResolvedValue(undefined)) {
  render(
    <LanguageProvider>
      <ResourcesView resources={[existingResource]} onUpload={onUpload} />
    </LanguageProvider>
  )
  return onUpload
}

describe('ResourcesView', () => {
  beforeEach(() => {
    refresh.mockClear()
  })

  it('renders the resources list with a download link', () => {
    renderResources()
    expect(screen.getByText('Parent Reading Guide')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Download/ })).toHaveAttribute('href', 'https://example.com/guide.pdf')
  })

  it('uploads a new resource with the file and refreshes the page', async () => {
    const onUpload = renderResources()
    await userEvent.click(screen.getByRole('button', { name: '+ Upload Resource' }))
    await userEvent.type(screen.getByPlaceholderText('Title'), 'Phonics Worksheet')
    await userEvent.type(screen.getByPlaceholderText('Description'), 'Practice sheet for letter sounds.')

    const file = new File(['dummy content'], 'worksheet.pdf', { type: 'application/pdf' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(fileInput, file)

    await userEvent.click(screen.getByRole('button', { name: 'Upload' }))

    expect(onUpload).toHaveBeenCalledOnce()
    const formData = onUpload.mock.calls[0][0] as FormData
    expect(formData.get('title')).toBe('Phonics Worksheet')
    expect(formData.get('description')).toBe('Practice sheet for letter sounds.')
    expect(formData.get('tag')).toBe('Guide')
    expect((formData.get('file') as File).name).toBe('worksheet.pdf')
    expect(refresh).toHaveBeenCalledOnce()
  })
})
