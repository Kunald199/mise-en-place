import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRecipe } from '../hooks/useRecipe'

export function RecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    recipe,
    ingredients,
    steps,
    loading,
    error,
    addIngredient,
    addStep,
    deleteIngredient,
    deleteStep,
  } = useRecipe(id)

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    amount: '',
    unit: '',
    notes: '',
  })
  const [newStep, setNewStep] = useState({ instruction: '', timer_mins: '' })
  const [addingIngredient, setAddingIngredient] = useState(false)
  const [addingStep, setAddingStep] = useState(false)

  const handleAddIngredient = async (e) => {
    e.preventDefault()
    const { error } = await addIngredient({
      name: newIngredient.name.trim(),
      amount: parseFloat(newIngredient.amount) || null,
      unit: newIngredient.unit.trim() || null,
      notes: newIngredient.notes.trim() || null,
      order_index: ingredients.length,
    })
    if (!error) {
      setNewIngredient({ name: '', amount: '', unit: '', notes: '' })
      setAddingIngredient(false)
    }
  }

  const handleAddStep = async (e) => {
    e.preventDefault()
    const { error } = await addStep({
      instruction: newStep.instruction.trim(),
      timer_mins: parseInt(newStep.timer_mins) || null,
      step_number: steps.length + 1,
    })
    if (!error) {
      setNewStep({ instruction: '', timer_mins: '' })
      setAddingStep(false)
    }
  }

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: '#666',
        }}
      >
        Loading recipe...
      </div>
    )

  if (error || !recipe)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: '#dc2626',
        }}
      >
        Recipe not found.
      </div>
    )

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e5e5',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#666',
          }}
        >
          ← Back
        </button>
        <h1 style={{ fontSize: '1.1rem', fontWeight: '600' }}>
          {recipe.title}
        </h1>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
        {/* Recipe meta */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e5e5e5',
            marginBottom: '1.5rem',
          }}
        >
          {recipe.description && (
            <p style={{ color: '#555', marginBottom: '1rem', lineHeight: 1.6 }}>
              {recipe.description}
            </p>
          )}
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              fontSize: '14px',
              color: '#666',
            }}
          >
            {recipe.servings && (
              <span>
                <strong>{recipe.servings}</strong> servings
              </span>
            )}
            {recipe.prep_time_mins && (
              <span>
                <strong>{recipe.prep_time_mins}</strong> min prep
              </span>
            )}
            {recipe.cook_time_mins && (
              <span>
                <strong>{recipe.cook_time_mins}</strong> min cook
              </span>
            )}
          </div>
          {recipe.tags && recipe.tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '1rem',
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

        {/* Ingredients */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e5e5e5',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>Ingredients</h2>
            <button
              onClick={() => setAddingIngredient(!addingIngredient)}
              style={{ fontSize: '13px', padding: '0.4rem 0.8rem' }}
            >
              + Add
            </button>
          </div>

          {ingredients.length === 0 && !addingIngredient && (
            <p style={{ color: '#888', fontSize: '14px' }}>
              No ingredients yet
            </p>
          )}

          {ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid #f5f5f5',
              }}
            >
              <span style={{ fontSize: '14px' }}>
                {ingredient.amount && `${ingredient.amount} `}
                {ingredient.unit && `${ingredient.unit} `}
                <strong>{ingredient.name}</strong>
                {ingredient.notes && (
                  <span style={{ color: '#888' }}> — {ingredient.notes}</span>
                )}
              </span>
              <button
                onClick={() => deleteIngredient(ingredient.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#bbb',
                  fontSize: '16px',
                }}
              >
                ×
              </button>
            </div>
          ))}

          {addingIngredient && (
            <form
              onSubmit={handleAddIngredient}
              style={{
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 2fr',
                  gap: '0.5rem',
                }}
              >
                <input
                  placeholder="Amount"
                  type="number"
                  step="any"
                  value={newIngredient.amount}
                  onChange={(e) =>
                    setNewIngredient((p) => ({ ...p, amount: e.target.value }))
                  }
                  style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #e5e5e5',
                    fontSize: '13px',
                  }}
                />
                <input
                  placeholder="Unit"
                  value={newIngredient.unit}
                  onChange={(e) =>
                    setNewIngredient((p) => ({ ...p, unit: e.target.value }))
                  }
                  style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #e5e5e5',
                    fontSize: '13px',
                  }}
                />
                <input
                  placeholder="Ingredient name *"
                  required
                  value={newIngredient.name}
                  onChange={(e) =>
                    setNewIngredient((p) => ({ ...p, name: e.target.value }))
                  }
                  style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #e5e5e5',
                    fontSize: '13px',
                  }}
                />
              </div>
              <input
                placeholder="Notes (optional)"
                value={newIngredient.notes}
                onChange={(e) =>
                  setNewIngredient((p) => ({ ...p, notes: e.target.value }))
                }
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #e5e5e5',
                  fontSize: '13px',
                }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="submit"
                  style={{ fontSize: '13px', padding: '0.5rem 1rem' }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setAddingIngredient(false)}
                  style={{
                    fontSize: '13px',
                    padding: '0.5rem 1rem',
                    background: '#f5f5f5',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Steps */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e5e5e5',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>Steps</h2>
            <button
              onClick={() => setAddingStep(!addingStep)}
              style={{ fontSize: '13px', padding: '0.4rem 0.8rem' }}
            >
              + Add
            </button>
          </div>

          {steps.length === 0 && !addingStep && (
            <p style={{ color: '#888', fontSize: '14px' }}>No steps yet</p>
          )}

          {steps.map((step) => (
            <div
              key={step.id}
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '0.75rem 0',
                borderBottom: '1px solid #f5f5f5',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#111',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  flexShrink: 0,
                }}
              >
                {step.step_number}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  {step.instruction}
                </p>
                {step.timer_mins && (
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#888',
                      marginTop: '4px',
                      display: 'block',
                    }}
                  >
                    ⏱ {step.timer_mins} min
                  </span>
                )}
              </div>
              <button
                onClick={() => deleteStep(step.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#bbb',
                  fontSize: '16px',
                  alignSelf: 'flex-start',
                }}
              >
                ×
              </button>
            </div>
          ))}

          {addingStep && (
            <form
              onSubmit={handleAddStep}
              style={{
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <textarea
                placeholder="Step instruction *"
                required
                rows={3}
                value={newStep.instruction}
                onChange={(e) =>
                  setNewStep((p) => ({ ...p, instruction: e.target.value }))
                }
                style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #e5e5e5',
                  fontSize: '13px',
                  resize: 'vertical',
                }}
              />
              <input
                placeholder="Timer in minutes (optional)"
                type="number"
                min="1"
                value={newStep.timer_mins}
                onChange={(e) =>
                  setNewStep((p) => ({ ...p, timer_mins: e.target.value }))
                }
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #e5e5e5',
                  fontSize: '13px',
                }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="submit"
                  style={{ fontSize: '13px', padding: '0.5rem 1rem' }}
                >
                  Add step
                </button>
                <button
                  type="button"
                  onClick={() => setAddingStep(false)}
                  style={{
                    fontSize: '13px',
                    padding: '0.5rem 1rem',
                    background: '#f5f5f5',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
