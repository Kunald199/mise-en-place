import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Still checking session — don't redirect yet
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '14px',
          color: '#666',
        }}
      >
        Loading...
      </div>
    )
  }

  // Not logged in — redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in — show the page
  return children
}
