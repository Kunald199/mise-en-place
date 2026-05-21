import { supabase } from './supabase'

export async function saveImportedRecipe(recipeData, userId) {
  // 1. Save the recipe first
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      title: recipeData.title,
      description: recipeData.description || null,
      servings: recipeData.servings || 4,
      prep_time_mins: recipeData.prep_time_mins || null,
      cook_time_mins: recipeData.cook_time_mins || null,
      tags: recipeData.tags || [],
      user_id: userId,
    })
    .select()
    .single()

  if (recipeError) return { error: recipeError }

  // 2. Save ingredients if any
  if (recipeData.ingredients && recipeData.ingredients.length > 0) {
    const ingredients = recipeData.ingredients.map((ing, index) => ({
      recipe_id: recipe.id,
      name: ing.name,
      amount: ing.amount || null,
      unit: ing.unit || null,
      notes: ing.notes || null,
      order_index: index,
    }))

    const { error: ingError } = await supabase
      .from('ingredients')
      .insert(ingredients)

    if (ingError) return { error: ingError }
  }

  // 3. Save steps if any
  if (recipeData.steps && recipeData.steps.length > 0) {
    const steps = recipeData.steps.map((step) => ({
      recipe_id: recipe.id,
      step_number: step.step_number,
      instruction: step.instruction,
      timer_mins: step.timer_mins || null,
    }))

    const { error: stepsError } = await supabase.from('steps').insert(steps)

    if (stepsError) return { error: stepsError }
  }

  return { data: recipe }
}
