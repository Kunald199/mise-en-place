import { useState } from 'react'

export function AddRecipeModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    servings: 4,
    prep_time_mins: '',
    cook_time_mins: '',
    tags: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const recipeData = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      servings: parseInt(form.servings) || 4,
      prep_time_mins: parseInt(form.prep_time_mins) || null,
      cook_time_mins: parseInt(form.cook_time_mins) || null,
      tags: form.tags
        ? form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    }

    const { error } = await onAdd(recipeData)

    if (error) {
      setError(error.message)
    } else {
      onClose()
    }
    setLoading(false)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 100,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2rem',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem' }}>Add recipe</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Spaghetti Carbonara"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
                boxSizing: 'border-box',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="A short description..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
                boxSizing: 'border-box',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Servings
              </label>
              <input
                name="servings"
                type="number"
                min="1"
                value={form.servings}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Prep (mins)
              </label>
              <input
                name="prep_time_mins"
                type="number"
                min="0"
                value={form.prep_time_mins}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Cook (mins)
              </label>
              <input
                name="cook_time_mins"
                type="number"
                min="0"
                value={form.cook_time_mins}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Tags{' '}
              <span style={{ fontWeight: '400', color: '#888' }}>
                (comma separated)
              </span>
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="italian, pasta, quick"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
                boxSizing: 'border-box',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 1, padding: '0.75rem', fontSize: '14px' }}
            >
              {loading ? 'Adding...' : 'Add recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
