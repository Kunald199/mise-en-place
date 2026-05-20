import { useAuth } from '../context/AuthContext'

export function DashboardPage() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem' }}>My Recipes</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>{user?.email}</span>
          <button onClick={handleSignOut} style={{ fontSize: '14px' }}>
            Sign out
          </button>
        </div>
      </div>
      <p style={{ color: '#666' }}>
        Your recipes will appear here. Let's build this next!
      </p>
    </div>
  )
}
