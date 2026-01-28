import { useState, useEffect } from 'react'
import { reports, assetUrl } from '../api'
import { useNavigate } from 'react-router-dom'

export default function ReportsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await reports.list()
      setItems(res.data)
    } catch (err) {
      setError('Error fetching reports')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={() => navigate('/')} style={{ marginBottom: '20px', padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ← Back to Dashboard
        </button>
        <h1 style={{ marginBottom: '20px', color: '#333' }}>Reports</h1>
        {error && <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>{error}</div>}
        {loading ? (
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', color: '#999' }}>Loading...</div>
        ) : (
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            {items.length === 0 ? (
              <p style={{ color: '#999' }}>No reports yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {items.map((r) => (
                  <li key={r._id} style={{ padding: '12px', marginBottom: '10px', backgroundColor: '#f9f9f9', borderLeft: '4px solid #28a745', borderRadius: '4px' }}>
                    <div style={{ fontWeight: '600', color: '#333' }}>Type: {r.type}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Generated: {new Date(r.generatedAt).toLocaleDateString()}</div>
                    {r.pdfUrl && <div style={{ marginTop: '8px' }}><a href={assetUrl(r.pdfUrl)} target="_blank" rel="noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>📄 Download PDF</a></div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
