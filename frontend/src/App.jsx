import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './AuthContext'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BuildingsPage from './pages/BuildingsPage'
import InspectionsPage from './pages/InspectionsPage'
import TasksPage from './pages/TasksPage'
import ClaimsPage from './pages/ClaimsPage'
import ReportsPage from './pages/ReportsPage'
import { useContext } from 'react'

function AppContent() {
  const { token, loading } = useContext(AuthContext)

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={token ? <DashboardPage /> : <Navigate to="/login" replace />} />
      <Route path="/buildings" element={<ProtectedRoute><BuildingsPage /></ProtectedRoute>} />
      <Route path="/inspections" element={<ProtectedRoute><InspectionsPage /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
      <Route path="/claims" element={<ProtectedRoute><ClaimsPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}
