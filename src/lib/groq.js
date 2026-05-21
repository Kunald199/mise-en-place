import { supabase } from './supabase'

export async function importRecipeFromUrl(url) {
  // 1. Fetch the page HTML from the browser via allorigins proxy
  const proxyUrl =
    'https://api.allorigins.win/get?url=' + encodeURIComponent(url)

  let html
  try {
    const response = await fetch(proxyUrl)
    if (!response.ok) throw new Error('Could not fetch that URL')
    const data = await response.json()
    html = data.contents
  } catch (err) {
    return {
      error: new Error(
        'Could not fetch that URL — try copying the recipe text instead'
      ),
    }
  }

  // 2. Clean the HTML — strip tags, limit size
  const cleanText = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000)

  // 3. Send clean text to Edge Function which calls Groq
  const { data, error } = await supabase.functions.invoke('import-recipe', {
    body: { text: cleanText },
  })

  if (error) return { error }
  if (data.error) return { error: new Error(data.error) }

  return { recipe: data.recipe }
}
