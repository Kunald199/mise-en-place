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
    const { prompt } = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

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
            content: 'You are an expert chef. Return ONLY valid JSON. No explanation, no markdown, no backticks.',
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

    let parsed
    try {
      parsed = JSON.parse(rawContent)
    } catch {
      const cleaned = rawContent.replace(/```json|```/g, '').trim()
      parsed = JSON.parse(cleaned)
    }

    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})