"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import NewsCard from "../Components/NewsCard"
import { useAuth } from "../Hooks/useAuth"
import "../Styles/title.css"

const WatchLater = () => {
  const navigate = useNavigate()
  const { isAuthenticated, token } = useAuth()
  const [watchLaterItems, setWatchLaterItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = "http://localhost:8000"

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    const fetchWatchLater = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_BASE_URL}/api/watch-later`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch watch later items: ${response.statusText}`)
        }

        const data = await response.json()
        setWatchLaterItems(data.watch_later || [])
      } catch (err) {
        console.error("[v0] Error fetching watch later items:", err)
        setError("Failed to load watch later items.")
        setWatchLaterItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchWatchLater()
  }, [isAuthenticated, token, navigate])

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
                {watchLaterItems.map((article) => (
                  <NewsCard key={article.id} article={article} />
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
