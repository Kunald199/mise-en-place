import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useRecipes() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // FETCH all recipes for the logged in user
  const fetchRecipes = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setRecipes(data)
    }
    setLoading(false)
  }, [user])

  // Fetch recipes when the hook first loads
  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  // CREATE a new recipe
  const createRecipe = async (recipeData) => {
    const { data, error } = await supabase
      .from('recipes')
      .insert({
        ...recipeData,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) return { error }

    // Add new recipe to top of list without refetching
    setRecipes((prev) => [data, ...prev])
    return { data }
  }

  // UPDATE an existing recipe
  const updateRecipe = async (id, updates) => {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return { error }

    // Update the recipe in local state
    setRecipes((prev) =>
      prev.map((recipe) => (recipe.id === id ? data : recipe))
    )
    return { data }
  }

  // DELETE a recipe
  const deleteRecipe = async (id) => {
    const { error } = await supabase.from('recipes').delete().eq('id', id)

    if (error) return { error }

    // Remove from local state
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
    return {}
  }

  return {
    recipes,
    loading,
    error,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    refetch: fetchRecipes,
  }
}
