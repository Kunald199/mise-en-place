import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useFridge() {
  const { user } = useAuth()
  const [fridgeItems, setFridgeItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchFridge() {
      const { data } = await supabase
        .from('fridge_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setFridgeItems(data || [])
      setLoading(false)
    }

    fetchFridge()
  }, [user])

  const addItem = async (name) => {
    const { data, error } = await supabase
      .from('fridge_items')
      .insert({ name: name.trim(), user_id: user.id })
      .select()
      .single()

    if (error) return { error }
    setFridgeItems((prev) => [data, ...prev])
    return { data }
  }

  const removeItem = async (id) => {
    const { error } = await supabase.from('fridge_items').delete().eq('id', id)

    if (error) return { error }
    setFridgeItems((prev) => prev.filter((item) => item.id !== id))
    return {}
  }

  return { fridgeItems, loading, addItem, removeItem }
}
