import { useContext } from 'react'
import { AuthContext } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, color: '#333' }}>Cleaning Reports</h1>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 10px 0', color: '#666' }}>
              Welcome, <strong>{user?.name}</strong> ({user?.role})
            </p>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Dashboard</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            Manage your cleaning reports, inspections, and tasks from the menu below.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { path: '/buildings', label: '🏢 Buildings', desc: 'Manage properties' },
              { path: '/inspections', label: '📋 Inspections', desc: 'View reports' },
              { path: '/tasks', label: '✓ Tasks', desc: 'Cleaning assignments' },
              { path: '/claims', label: '⚠️ Claims', desc: 'Client complaints' },
              { path: '/reports', label: '📊 Reports', desc: 'Analytics & PDFs' }
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '20px',
                  backgroundColor: '#fff',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s',
                  fontSize: '18px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#007bff'
                  e.target.style.backgroundColor = '#f0f7ff'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e0e0e0'
                  e.target.style.backgroundColor = '#fff'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>{item.label.split(' ')[0]}</div>
                <div style={{ color: '#333', fontWeight: '500' }}>{item.label.split(' ').slice(1).join(' ')}</div>
                <div style={{ color: '#999', fontSize: '12px', marginTop: '5px' }}>{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
