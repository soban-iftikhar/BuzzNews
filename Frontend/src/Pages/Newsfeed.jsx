"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import NewsCard from "../Components/NewsCard"
import "../Styles/title.css"

const Newsfeed = () => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = "http://localhost:8000"

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const fetchNews = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_BASE_URL}/api/news`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.statusText}`)
        }

        const data = await response.json()
        setArticles(data.articles || [])
      } catch (err) {
        console.error("[v0] Error fetching news:", err)
        setError("Failed to fetch news. Please try again.")
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [navigate])

  if (loading) {
    return (
      <>
        <Header />
        <div className="page-container">
          <main className="main-content">
            <section className="hero-section">
              <h1 className="page-title">News Feed</h1>
            </section>
            <div style={{ textAlign: "center", padding: "40px", fontSize: "16px" }}>Loading articles...</div>
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
            <h1 className="page-title">News Feed</h1>
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

          {articles.length > 0 ? (
            <section className="news-grid-section">
              <div className="news-grid">
                {articles.map((article) => (
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
              <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>No Articles Available</h3>
              <p style={{ fontSize: "16px", color: "#666" }}>Try refreshing to get the latest news.</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  )
}

export default Newsfeed
