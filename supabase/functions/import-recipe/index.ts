import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const prompt = 'Extract the recipe from this text and return JSON in exactly this format:\n{\n  "title": "Recipe name",\n  "description": "Brief description",\n  "servings": 4,\n  "prep_time_mins": 15,\n  "cook_time_mins": 30,\n  "tags": ["tag1", "tag2"],\n  "ingredients": [\n    { "name": "ingredient name", "amount": 1, "unit": "cup", "notes": "" }\n  ],\n  "steps": [\n    { "step_number": 1, "instruction": "Step instruction", "timer_mins": null }\n  ]\n}\n\nUse null for any missing numeric values. Tags should be 2-4 relevant keywords.\n\nText to extract from:\n' + text

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + Deno.env.get('GROQ_API_KEY'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        temperature: 0,
        messages: [
          {
            role: 'system',
            content: 'You are a recipe extraction assistant. Extract recipe data from text and return ONLY valid JSON. No explanation, no markdown, no backticks. Just raw JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!groqResponse.ok) {
      const groqError = await groqResponse.text()
      return new Response(
        JSON.stringify({ error: 'Groq API error: ' + groqError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const groqData = await groqResponse.json()
    const rawContent = groqData.choices[0].message.content

    let recipe
    try {
      recipe = JSON.parse(rawContent)
    } catch {
      const cleaned = rawContent.replace(/```json|```/g, '').trim()
      recipe = JSON.parse(cleaned)
    }

    return new Response(
      JSON.stringify({ recipe }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})