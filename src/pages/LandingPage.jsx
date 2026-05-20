import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export function LandingPage() {
  const { user, loading } = useAuth()

  // Already logged in — send straight to app
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}
      >
        Mise en Place
      </h1>
      <p
        style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '2rem',
          maxWidth: '400px',
        }}
      >
        Your AI cooking companion. Import any recipe, scale servings, find
        substitutions, and cook with confidence.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/signup">
          <button style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
            Get started free
          </button>
        </Link>
        <Link to="/login">
          <button style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
            Log in
          </button>
        </Link>
      </div>
    </div>
  )
}
