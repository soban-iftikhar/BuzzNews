
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import NewsCard from "../Components/NewsCard"
import "../Styles/title.css"

const WatchLater = () => {
  const navigate = useNavigate()
  const [watchLaterItems, setWatchLaterItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = "http://localhost:8000"

  // NEW DELETE HANDLER
  const handleRemoveWatchLater = async (watchLaterId) => {
    const token = localStorage.getItem("token")
    if (!token) return navigate("/login")

    try {
        const response = await fetch(`${API_BASE_URL}/api/watchlater/${watchLaterId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Failed to remove watch later item.")
        }

        // OPTIMISTIC UI UPDATE: Remove the item from the state immediately
        setWatchLaterItems(prev => prev.filter(item => item.id !== watchLaterId))
        console.log(`Removed watch later ID: ${watchLaterId}`)

    } catch (err) {
        setError(err.message || "Could not remove item from watch later.")
    }
}

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const fetchWatchLater = async () => {
      try {
        setLoading(true)
        setError(null)

      // FIX: URL is correct: /api/watchlater/
      const response = await fetch(`${API_BASE_URL}/api/watchlater/`, { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

        if (!response.ok) {
          throw new Error(`Failed to fetch watch later items: ${response.statusText}`)
        }

        const data = await response.json()
        
        // CRITICAL FIX: The FastAPI endpoint returns the array directly
        setWatchLaterItems(Array.isArray(data) ? data : [])

      } catch (err) {
        setError("Failed to load watch later items.")
        setWatchLaterItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchWatchLater()
  }, [navigate])

  if (loading) {
    return (
      <>
        <Header />
        <div className="page-container">
          <main className="main-content">
            <section className="hero-section">
              <h1 className="page-title">Watch Later</h1>
            </section>
            <div style={{ textAlign: "center", padding: "40px", fontSize: "16px" }}>Loading items...</div>
          </main>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="page-container">
        <main className="main-content">
          <section className="hero-section">
            <h1 className="page-title">Watch Later</h1>
          </section>

          {error && (
            <div
              style={{
                padding: "15px",
                backgroundColor: "#ffe6e6",
                color: "#cc0000",
                borderRadius: "4px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {watchLaterItems.length > 0 ? (
            <section className="news-grid-section">
              <div className="news-grid">
                {watchLaterItems.map((item) => (
                  // Map over the saved item and use the nested article object for NewsCard
                  <NewsCard 
                    key={item.id} 
                    article={item.article} 
                    onRemove={handleRemoveWatchLater} // Pass the delete handler
                    savedItemId={item.id} // Pass the WatchLater ID
                  />
                ))}
              </div>
            </section>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                minHeight: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>Your Watch Later List is Empty</h3>
              <p style={{ fontSize: "16px", color: "#666" }}>Save articles here to read them later.</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  )
}

export default WatchLater