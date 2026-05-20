import { useNavigate } from 'react-router-dom'

export function RecipeCard({ recipe, onDelete }) {
  const navigate = useNavigate()

  const handleDelete = async (e) => {
    // Stop click from bubbling up to the card click handler
    e.stopPropagation()
    if (window.confirm('Delete this recipe?')) {
      await onDelete(recipe.id)
    }
  }

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      style={{
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        background: '#fff',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#111')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e5e5')}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
          }}
        >
          {recipe.title}
        </h3>
        <button
          onClick={handleDelete}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#999',
            fontSize: '18px',
            padding: '0 0 0 8px',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {recipe.description && (
        <p
          style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '0.75rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {recipe.description}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          fontSize: '13px',
          color: '#888',
        }}
      >
        {recipe.servings && <span>{recipe.servings} servings</span>}
        {recipe.prep_time_mins && <span>{recipe.prep_time_mins}m prep</span>}
        {recipe.cook_time_mins && <span>{recipe.cook_time_mins}m cook</span>}
      </div>

      {recipe.tags && recipe.tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '12px',
                background: '#f5f5f5',
                padding: '2px 8px',
                borderRadius: '4px',
                color: '#555',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
