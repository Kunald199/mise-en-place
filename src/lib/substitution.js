import { supabase } from './supabase'

export async function getSubstitutions(ingredients, fridgeItems) {
  // Build a clear prompt for the AI
  const ingredientList = ingredients
    .map((ing) => `- ${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim())
    .join('\n')

  const fridgeList =
    fridgeItems.length > 0
      ? fridgeItems.map((item) => `- ${item.name}`).join('\n')
      : 'Nothing specified'

  const prompt =
    'I am cooking a recipe that needs these ingredients:\n' +
    ingredientList +
    '\n\nI have these items in my fridge/pantry:\n' +
    fridgeList +
    '\n\nFor any ingredients I might be missing or want to substitute, suggest practical cooking substitutions. Return ONLY valid JSON in this exact format:\n' +
    '{\n' +
    '  "substitutions": [\n' +
    '    {\n' +
    '      "original": "ingredient name",\n' +
    '      "substitute": "substitute ingredient",\n' +
    '      "ratio": "1:1",\n' +
    '      "notes": "brief cooking note"\n' +
    '    }\n' +
    '  ]\n' +
    '}\n\n' +
    'Only suggest substitutions that actually work in cooking. Keep notes under 15 words.'

  const { data, error } = await supabase.functions.invoke('get-substitutions', {
    body: { prompt },
  })

  if (error) return { error }
  if (data.error) return { error: new Error(data.error) }

  return { substitutions: data.substitutions }
}
