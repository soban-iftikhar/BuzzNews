
import { useState, useEffect } from "react"
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import NewsCard from "../Components/NewsCard"
import "../Styles/Home.css"

const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const truncateText = (text, maxLength = 150) => {
    if (!text) return "No summary available";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};



const API_BASE_URL = "http://localhost:8000"

const Home = () => {
  const [heroArticle, setHeroArticle] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const heroRes = await fetch(`${API_BASE_URL}/api/news/featured`)
        if (!heroRes.ok) throw new Error("Failed to fetch featured article")
        const heroData = await heroRes.json()
        const featuredArticle = Array.isArray(heroData) ? heroData[0] : heroData;
        setHeroArticle(featuredArticle)

        const articlesRes = await fetch(`${API_BASE_URL}/api/news?limit=6`)
        if (!articlesRes.ok) throw new Error("Failed to fetch articles")
        
        const articlesData = await articlesRes.json()
        const articleList = Array.isArray(articlesData) ? articlesData : (articlesData.articles || articlesData.data || [])
        
        const limitedArticles = articleList.slice(0, 6)
        setArticles(limitedArticles)

      } catch (err) {
        setError(err.message)
        console.error("[v0] Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="page-container">
      <Header />
      <main className="main-content">
        {loading ? (
          <section className="hero-section">
            <div className="hero-content">
              <p className="hero-category">Loading...</p>
              <h2 className="hero-title">Fetching latest news...</h2>
            </div>
          </section>
        ) : error ? (
          <section className="hero-section">
            <div className="hero-content">
              <p className="hero-category">Error</p>
              <h2 className="hero-title">Unable to load featured article</h2>
              <p>{error}</p>
            </div>
          </section>
        ) : heroArticle ? (
          <section className="hero-section">
            <div className="hero-image-container"> 
              <img
                src={heroArticle.image_url || "/placeholder.svg"} 
                alt={heroArticle.title}
                className="hero-image"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = "https://placehold.co/1200x600/cc0000/ffffff?text=BREAKING+NEWS"
                }}
              />
            </div>

            <div className="hero-content">
              <h2 className="hero-title">{heroArticle.title}</h2>
              <p className="hero-summary">{truncateText(heroArticle.description, 250)}</p>
              
              <div className="hero-meta">
                
                <span>{formatDate(heroArticle.published_at)}</span>
              </div>
            </div>

          </section>
        ) : null}

        <h3 className="section-title">Latest Updates</h3>

        <section className="news-grid-section">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Loading articles...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Unable to load articles: {error}</p>
            </div>
          ) : articles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>No articles available at the moment.</p>
            </div>
          ) : (
            <div className="news-grid">
              {articles.map((article, index) => (
                <NewsCard key={article.id || index} article={article} /> 
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home