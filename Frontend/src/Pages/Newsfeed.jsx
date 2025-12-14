
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { RotateCcw } from "lucide-react" // Importing the icon for the reload button
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import NewsCard from "../Components/NewsCard"
import "../Styles/title.css"

const Newsfeed = () => {
  const navigate = useNavigate()
  // We'll track the page/offset to help the backend load new data on reload
  const [page, setPage] = useState(1) 
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = "http://localhost:8000"
  // Set the default display limit higher than the homepage
  const ARTICLE_LIMIT = 15

  // Use useCallback to memoize the fetch function for the dependency array
  const fetchNews = useCallback(async (isReload = false) => {
    // If it's a reload, only show loading state briefly, don't clear the screen
    if (!isReload) {
      setLoading(true)
    }
    setError(null)
    
    // Calculate the offset for the API call (if the backend supports offset)
    const offset = isReload ? (page * ARTICLE_LIMIT) : 0; 
    
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      // FIX 1: Request 15 articles using 'limit' and include 'offset' for reloading
      const res = await fetch(`${API_BASE_URL}/api/news?limit=${ARTICLE_LIMIT}&offset=${offset}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (!res.ok) throw new Error(`API error ${res.status}`)
      
      const data = await res.json()
      console.log("news response:", data)

      // FIX: Use the robust parsing logic
      const incomingItems = Array.isArray(data)
        ? data
        : data.articles ?? data.data ?? data.results ?? data.news ?? []
        
      if (isReload) {
          // If reloading, REPLACE the existing articles with new ones
          setArticles(incomingItems)
          // Increment the page count so the next reload gets different data
          setPage(prevPage => prevPage + 1)
      } else {
          // Initial load
          setArticles(incomingItems)
      }
      
    } catch (err) {
      console.error("[v0] Error fetching news:", err)
      setError(err.message)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }, [API_BASE_URL, navigate, page]) // Dependencies: API_BASE_URL, navigate, and page state

  useEffect(() => {
    // Check for token first before attempting fetch
    const token = localStorage.getItem("token")
    if (!token) {
        navigate("/login")
        return
    }
    // Initial fetch when the component mounts
    fetchNews(false) 
  }, [fetchNews, navigate]) // Added fetchNews to dependency array (safe due to useCallback)

  // FIX 2: Handler for the reload button
  const handleReload = () => {
      // Pass true to indicate a reload request
      fetchNews(true); 
  };


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
            
          {/* FIX 2: Add Reload Button and Status Area */}
          <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px', 
              paddingBottom: '15px', 
              borderBottom: '1px solid #333' 
          }}>
              <p style={{ color: '#b0b0b0', fontSize: '1.1rem' }}>
                  Showing {articles.length} latest articles.
              </p>
              
              <button
                  onClick={handleReload}
                  disabled={loading}
                  style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 15px',
                      backgroundColor: '#cc0000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      transition: 'background-color 0.2s',
                  }}
              >
                  <RotateCcw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                  {loading ? "Refreshing..." : "Reload News"}
              </button>
          </div>
          
          <style jsx="true">{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          {/* End Reload Button and Status Area */}

          {articles.length > 0 ? (
            <section className="news-grid-section">
              <div className="news-grid">
                {articles.map((article, idx) => (
                  <NewsCard
                    key={article.id ?? article._id ?? article.url ?? idx}
                    article={article}
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
              <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>No Articles Available</h3>
              <p style={{ fontSize: "16px", color: "#666" }}>Try reloading the news feed.</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  )
}

export default Newsfeed