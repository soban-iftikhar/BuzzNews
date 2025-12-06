"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import NewsCard from "../Components/NewsCard"
import "../Styles/title.css"

const Favorites = () => {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = "http://localhost:8000"

  // NEW DELETE HANDLER
  const handleRemoveFavorite = async (favoriteId) => {
    const token = localStorage.getItem("token")
    if (!token) return navigate("/login")

    try {
        const response = await fetch(`${API_BASE_URL}/api/favorites/${favoriteId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Failed to remove favorite.")
        }

        // OPTIMISTIC UI UPDATE: Remove the item from the state immediately
        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId))
        console.log(`Removed favorite ID: ${favoriteId}`)

    } catch (err) {
        setError(err.message || "Could not remove item from favorites.")
    }
}

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true)
        setError(null)

       // FIX: URL is correct: /api/favorites/
       const response = await fetch(`${API_BASE_URL}/api/favorites/`, { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

        if (!response.ok) {
          throw new Error(`Failed to fetch favorites: ${response.statusText}`)
        }

        const data = await response.json()
        
        // CRITICAL FIX: The FastAPI endpoint returns the array directly
        setFavorites(Array.isArray(data) ? data : [])

      } catch (err) {
        setError("Failed to load favorites.")
        setFavorites([])
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [navigate])

  if (loading) {
    return (
      <>
        <Header />
        <div className="page-container">
          <main className="main-content">
            <section className="hero-section">
              <h1 className="page-title">Favorites</h1>
            </section>
            <div style={{ textAlign: "center", padding: "40px", fontSize: "16px" }}>Loading favorites...</div>
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
            <h1 className="page-title">Favorites</h1>
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

          {favorites.length > 0 ? (
            <section className="news-grid-section">
              <div className="news-grid">
                {favorites.map((item) => (
                  // Map over the saved item and use the nested article object for NewsCard
                  <NewsCard 
                    key={item.id} 
                    article={item.article} 
                    onRemove={handleRemoveFavorite} // Pass the delete handler
                    savedItemId={item.id} // Pass the Favorite ID
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
              <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>No Favorites Yet</h3>
              <p style={{ fontSize: "16px", color: "#666" }}>
                Start adding articles to your favorites to see them here.
              </p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  )
}

export default Favorites