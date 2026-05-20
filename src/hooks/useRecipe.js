import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useRecipe(id) {
  const [recipe, setRecipe] = useState(null)
  const [ingredients, setIngredients] = useState([])
  const [steps, setSteps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    async function fetchRecipe() {
      setLoading(true)
      setError(null)

      // Fetch recipe, ingredients, and steps in parallel
      const [recipeRes, ingredientsRes, stepsRes] = await Promise.all([
        supabase.from('recipes').select('*').eq('id', id).single(),
        supabase
          .from('ingredients')
          .select('*')
          .eq('recipe_id', id)
          .order('order_index'),
        supabase
          .from('steps')
          .select('*')
          .eq('recipe_id', id)
          .order('step_number'),
      ])

      if (recipeRes.error) {
        setError(recipeRes.error.message)
      } else {
        setRecipe(recipeRes.data)
        setIngredients(ingredientsRes.data || [])
        setSteps(stepsRes.data || [])
      }
      setLoading(false)
    }

    fetchRecipe()
  }, [id])

  const addIngredient = async (ingredient) => {
    const { data, error } = await supabase
      .from('ingredients')
      .insert({ ...ingredient, recipe_id: id })
      .select()
      .single()

    if (error) return { error }
    setIngredients((prev) => [...prev, data])
    return { data }
  }

  const addStep = async (step) => {
    const { data, error } = await supabase
      .from('steps')
      .insert({ ...step, recipe_id: id })
      .select()
      .single()

    if (error) return { error }
    setSteps((prev) => [...prev, data])
    return { data }
  }

  const deleteIngredient = async (ingredientId) => {
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', ingredientId)

    if (error) return { error }
    setIngredients((prev) => prev.filter((i) => i.id !== ingredientId))
    return {}
  }

  const deleteStep = async (stepId) => {
    const { error } = await supabase.from('steps').delete().eq('id', stepId)

    if (error) return { error }
    setSteps((prev) => prev.filter((s) => s.id !== stepId))
    return {}
  }

  return {
    recipe,
    ingredients,
    steps,
    loading,
    error,
    addIngredient,
    addStep,
    deleteIngredient,
    deleteStep,
  }
}
