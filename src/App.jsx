import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [status, setStatus] = useState('checking...')

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase.from('recipes').select('count')
      if (error) {
        setStatus(`Error: ${error.message}`)
      } else {
        setStatus('Supabase connected!')
      }
    }
    testConnection()
  }, [])

  return (
    <div>
      <h1>Mise en Place</h1>
      <p>Supabase status: {status}</p>
    </div>
  )
}

export default App
