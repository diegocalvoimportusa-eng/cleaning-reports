import { useState, useEffect, useRef } from 'react'
import { buildings, assetUrl } from '../api'
import { useNavigate } from 'react-router-dom'

export default function BuildingsPage() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    try {
      const res = await buildings.list()
      setItems(res.data)
    } catch (err) {
      setError('Error fetching buildings')
      console.error(err)
    }
  }

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotoPreview(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      console.log('Creating building:', { name, address })
      const res = await buildings.create({ name, address, areas: [] })
      console.log('Building created:', res.data)
      
      // Upload photo if selected
      if (photoFile) {
        try {
          console.log('Uploading photo:', photoFile.name)
          const uploadRes = await buildings.upload(res.data._id, photoFile)
          console.log('Photo uploaded:', uploadRes.data)
        } catch (photoErr) {
          console.error('Photo upload error:', photoErr)
          setError('Building created but photo upload failed')
        }
      }

      setName('')
      setAddress('')
      setPhotoFile(null)
      setPhotoPreview(null)
      fetchBuildings()
    } catch (err) {
      setError('Error creating building')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const clearPhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      setError('Cannot access camera. Please check permissions.')
      console.error(err)
    }
  }

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
    }
    setCameraActive(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      context.drawImage(videoRef.current, 0, 0)
      
      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
        setPhotoFile(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setPhotoPreview(e.target.result)
        }
        reader.readAsDataURL(file)
        closeCamera()
      }, 'image/jpeg', 0.95)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={() => navigate('/')} style={{ marginBottom: '20px', padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ← Back to Dashboard
        </button>

        <h1 style={{ marginBottom: '30px', color: '#333' }}>Buildings</h1>

        {error && <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Create New Building</h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="buildingName" style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Building Name:</label>
                <input
                  id="buildingName"
                  type="text"
                  placeholder="e.g., Office Tower A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="buildingAddress" style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Address:</label>
                <input
                  id="buildingAddress"
                  type="text"
                  placeholder="e.g., 123 Main Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#555', fontWeight: '600' }}>📸 Photo (Optional):</label>
                
                {!cameraActive && !photoPreview && (
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <button
                      type="button"
                      onClick={openCamera}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      📷 Open Camera
                    </button>
                    <label
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        textAlign: 'center',
                        display: 'block'
                      }}
                    >
                      🖼️ Upload from Gallery
                      <input
                        id="buildingPhoto"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                )}

                <>
                  {cameraActive && (
                    <div style={{ marginBottom: '15px' }}>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{
                          width: '100%',
                          borderRadius: '8px',
                          marginBottom: '10px',
                          backgroundColor: '#000'
                        }}
                      />
                      <canvas ref={canvasRef} style={{ display: 'none' }} />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={capturePhoto}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          ✓ Capture Photo
                        </button>
                        <button
                          type="button"
                          onClick={closeCamera}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {photoPreview && (
                    <div style={{ marginBottom: '15px', position: 'relative' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: '#333' }}>✓ Photo Preview:</div>
                      <img
                        src={photoPreview}
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '300px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '3px solid #28a745',
                          display: 'block'
                        }}
                      />
                      <button
                        type="button"
                        onClick={clearPhoto}
                        style={{
                          marginTop: '10px',
                          width: '100%',
                          padding: '8px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        ✕ Remove Photo
                      </button>
                    </div>
                  )}
                </>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: loading ? '#999' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                {loading ? 'Creating Building...' : '✓ Create Building'}
              </button>
            </form>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Buildings List ({items.length})</h3>
            {items.length === 0 ? (
              <p style={{ color: '#999' }}>No buildings yet. Create one to get started!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {items.map((b) => (
                  <div
                    key={b._id}
                    style={{
                      padding: '20px',
                      backgroundColor: '#f9f9f9',
                      borderLeft: '4px solid #007bff',
                      borderRadius: '4px',
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'stretch'
                    }}
                  >
                    {b.photos && b.photos.length > 0 ? (
                      <img
                        src={assetUrl(b.photos[0])}
                        alt={b.name}
                        style={{
                          width: '200px',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '200px',
                          height: '200px',
                          backgroundColor: '#e9ecef',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#999',
                          fontSize: '13px',
                          fontWeight: '500',
                          flexShrink: 0
                        }}
                      >
                        No Photo
                      </div>
                    )}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: '#333', fontSize: '18px' }}>{b.name}</div>
                        <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>{b.address || 'No address'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
