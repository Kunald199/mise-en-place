import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRecipe } from '../hooks/useRecipe'
import { useFridge } from '../hooks/useFridge'
import { scaleIngredients } from '../lib/scaler'
import { getSubstitutions } from '../lib/substitution'

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

  const { fridgeItems, addItem, removeItem } = useFridge()
  const [servings, setServings] = useState(null)
  const [substitutions, setSubstitutions] = useState([])
  const [loadingSubs, setLoadingSubs] = useState(false)
  const [newFridgeItem, setNewFridgeItem] = useState('')
  const [showFridge, setShowFridge] = useState(false)

  // Set initial servings when recipe loads
  useEffect(() => {
    if (recipe) setServings(recipe.servings)
  }, [recipe])

  // Compute scaled ingredients
  const currentServings = servings || recipe?.servings || 4
  const scaledIngredients = recipe
    ? scaleIngredients(ingredients, recipe.servings, currentServings)
    : []

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

  const handleGetSubstitutions = async () => {
    setLoadingSubs(true)
    setSubstitutions([])
    const { substitutions: subs, error } = await getSubstitutions(
      ingredients,
      fridgeItems
    )
    if (!error && subs) setSubstitutions(subs)
    setLoadingSubs(false)
  }

  const handleAddFridgeItem = async (e) => {
    e.preventDefault()
    if (!newFridgeItem.trim()) return
    await addItem(newFridgeItem)
    setNewFridgeItem('')
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
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              {/* Serving scaler */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '14px',
                }}
              >
                <button
                  onClick={() =>
                    setServings((s) => Math.max(1, (s || recipe.servings) - 1))
                  }
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid #e5e5e5',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  −
                </button>
                <span style={{ minWidth: '80px', textAlign: 'center' }}>
                  {currentServings} servings
                </span>
                <button
                  onClick={() => setServings((s) => (s || recipe.servings) + 1)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid #e5e5e5',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => setAddingIngredient(!addingIngredient)}
                style={{ fontSize: '13px', padding: '0.4rem 0.8rem' }}
              >
                + Add
              </button>
            </div>
          </div>

          {ingredients.length === 0 && !addingIngredient && (
            <p style={{ color: '#888', fontSize: '14px' }}>
              No ingredients yet
            </p>
          )}

          {scaledIngredients.map((ingredient) => (
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
                {ingredient.scaledAmount && (
                  <strong>{ingredient.scaledAmount} </strong>
                )}
                {ingredient.unit && `${ingredient.unit} `}
                {ingredient.name}
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

        {/* Fridge + Substitutions */}
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
            <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>
              Ingredient Substitutions
            </h2>
            <button
              onClick={() => setShowFridge(!showFridge)}
              style={{ fontSize: '13px', padding: '0.4rem 0.8rem' }}
            >
              {showFridge ? 'Hide fridge' : 'My fridge'}
            </button>
          </div>

          {showFridge && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                background: '#f9f9f9',
                borderRadius: '8px',
              }}
            >
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '0.75rem',
                }}
              >
                What's in your fridge?
              </p>
              <form
                onSubmit={handleAddFridgeItem}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <input
                  placeholder="e.g. Greek yogurt, oat milk..."
                  value={newFridgeItem}
                  onChange={(e) => setNewFridgeItem(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #e5e5e5',
                    fontSize: '13px',
                  }}
                />
                <button
                  type="submit"
                  style={{ fontSize: '13px', padding: '0.5rem 0.75rem' }}
                >
                  Add
                </button>
              </form>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {fridgeItems.map((item) => (
                  <span
                    key={item.id}
                    style={{
                      fontSize: '13px',
                      background: '#fff',
                      border: '1px solid #e5e5e5',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {item.name}
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#bbb',
                        fontSize: '14px',
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleGetSubstitutions}
            disabled={loadingSubs}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '14px',
              marginBottom: substitutions.length > 0 ? '1rem' : 0,
            }}
          >
            {loadingSubs
              ? 'Finding substitutions...'
              : '✨ Suggest substitutions'}
          </button>

          {substitutions.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {substitutions.map((sub, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.75rem',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      {sub.original}
                    </span>
                    <span style={{ fontSize: '13px', color: '#888' }}>→</span>
                    <span style={{ fontSize: '14px', color: '#2563eb' }}>
                      {sub.substitute}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#888',
                        marginLeft: 'auto',
                      }}
                    >
                      {sub.ratio}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
                    {sub.notes}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
