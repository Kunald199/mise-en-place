import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRecipes } from '../hooks/useRecipes'
import { RecipeCard } from '../components/RecipeCard'
import { AddRecipeModal } from '../components/AddRecipeModal'
import { ImportRecipeModal } from '../components/ImportRecipeModal'
import { saveImportedRecipe } from '../lib/recipeImporter'

export function DashboardPage() {
  const { user, signOut } = useAuth()
  const { recipes, loading, error, createRecipe, deleteRecipe, refetch } =
    useRecipes()
  const [showModal, setShowModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  const handleImport = async (recipeData) => {
    const { data, error } = await saveImportedRecipe(recipeData, user.id)
    if (error) return { error }
    await refetch()
    return { data }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e5e5',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
          Mise en Place
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>{user?.email}</span>
          <button
            onClick={handleSignOut}
            style={{
              fontSize: '14px',
              background: 'none',
              border: '1px solid #e5e5e5',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              My Recipes
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '2px' }}>
              {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setShowImportModal(true)}
              style={{
                padding: '0.75rem 1.25rem',
                background: '#f5f5f5',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              🔗 Import from URL
            </button>
            <button
              onClick={() => setShowModal(true)}
              style={{ padding: '0.75rem 1.25rem' }}
            >
              + Add recipe
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            Loading recipes...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '8px',
            }}
          >
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && recipes.length === 0 && (
          <div
            style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}
          >
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              No recipes yet
            </p>
            <p style={{ fontSize: '14px' }}>
              Add your first recipe to get started
            </p>
          </div>
        )}

        {/* Recipe grid */}
        {!loading && recipes.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={deleteRecipe}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <AddRecipeModal
          onClose={() => setShowModal(false)}
          onAdd={createRecipe}
        />
      )}

      {showImportModal && (
        <ImportRecipeModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
        />
      )}
    </div>
  )
}
