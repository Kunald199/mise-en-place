import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AddRecipeModal } from '../components/AddRecipeModal'

describe('AddRecipeModal', () => {
  it('renders the modal with title input', () => {
    render(<AddRecipeModal onClose={() => {}} onAdd={async () => ({})} />)

    expect(
      screen.getByRole('heading', { name: 'Add recipe' })
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('e.g. Spaghetti Carbonara')
    ).toBeInTheDocument()
  })

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn()

    render(<AddRecipeModal onClose={onClose} onAdd={async () => ({})} />)

    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows error when onAdd returns an error', async () => {
    const onAdd = vi.fn().mockResolvedValue({
      error: { message: 'Something went wrong' },
    })

    render(<AddRecipeModal onClose={() => {}} onAdd={onAdd} />)

    fireEvent.change(screen.getByPlaceholderText('e.g. Spaghetti Carbonara'), {
      target: { value: 'Test Recipe' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add recipe' }))

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })

  it('does not submit without a title', () => {
    const onAdd = vi.fn()

    render(<AddRecipeModal onClose={() => {}} onAdd={onAdd} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add recipe' }))
    expect(onAdd).not.toHaveBeenCalled()
  })
})
