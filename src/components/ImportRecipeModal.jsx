import { useState } from 'react'
import { importRecipeFromUrl } from '../lib/groq'

export function ImportRecipeModal({ onClose, onImport }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)

  // Step 1 — extract recipe from URL
  const handleExtract = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setPreview(null)

    const { recipe, error } = await importRecipeFromUrl(url)

    if (error) {
      setError(error.message)
    } else {
      setPreview(recipe)
    }
    setLoading(false)
  }

  // Step 2 — save extracted recipe to database
  const handleSave = async () => {
    if (!preview) return
    setLoading(true)

    const { error } = await onImport(preview)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      onClose()
    }
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
          maxWidth: '520px',
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
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Import from URL</h2>
            <p style={{ fontSize: '13px', color: '#666', margin: '4px 0 0' }}>
              Paste any recipe URL — AI will extract it automatically
            </p>
          </div>
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

        {/* URL input */}
        {!preview && (
          <form onSubmit={handleExtract}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.allrecipes.com/recipe/..."
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
                boxSizing: 'border-box',
                fontSize: '14px',
                marginBottom: '1rem',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', fontSize: '14px' }}
            >
              {loading ? 'Extracting recipe...' : 'Extract recipe'}
            </button>
          </form>
        )}

        {/* Preview extracted recipe */}
        {preview && (
          <div>
            <div
              style={{
                background: '#f9f9f9',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                {preview.title}
              </h3>
              {preview.description && (
                <p
                  style={{
                    fontSize: '13px',
                    color: '#555',
                    marginBottom: '0.75rem',
                  }}
                >
                  {preview.description}
                </p>
              )}
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  fontSize: '13px',
                  color: '#666',
                  marginBottom: '0.75rem',
                }}
              >
                {preview.servings && <span>{preview.servings} servings</span>}
                {preview.prep_time_mins && (
                  <span>{preview.prep_time_mins}m prep</span>
                )}
                {preview.cook_time_mins && (
                  <span>{preview.cook_time_mins}m cook</span>
                )}
              </div>

              <p
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                }}
              >
                {preview.ingredients?.length} ingredients
              </p>
              {preview.ingredients?.slice(0, 3).map((ing, i) => (
                <p
                  key={i}
                  style={{ fontSize: '13px', color: '#555', margin: '2px 0' }}
                >
                  • {ing.amount} {ing.unit} {ing.name}
                </p>
              ))}
              {preview.ingredients?.length > 3 && (
                <p style={{ fontSize: '13px', color: '#888' }}>
                  + {preview.ingredients.length - 3} more...
                </p>
              )}

              <p
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  margin: '0.75rem 0 0.5rem',
                }}
              >
                {preview.steps?.length} steps
              </p>
              {preview.steps?.slice(0, 2).map((step, i) => (
                <p
                  key={i}
                  style={{ fontSize: '13px', color: '#555', margin: '2px 0' }}
                >
                  {step.step_number}. {step.instruction.slice(0, 80)}...
                </p>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setPreview(null)}
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
                Try different URL
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{ flex: 1, padding: '0.75rem', fontSize: '14px' }}
              >
                {loading ? 'Saving...' : 'Save recipe'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
