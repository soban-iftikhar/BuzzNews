import { useState } from "react"
import {
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
  BookmarkPlus
} from "lucide-react"
import "../Styles/NewsCard.css"
import LoginPromptModal from "./LoginPromptModal"

const getCategoryTag = (sourceName) => {
    const sourceMap = {
        "newsapi": "Technology", 
        "livemint": "Finance",
        "iphoneincanada.ca": "Tech / Mobile",
        "foxnews.com": "Politics",
        "financialpost": "Business",
        "breitbart.com": "World News",
        "nep123.com": "Local / Geo"
    };

    let cleanSourceName = String(sourceName || '').toLowerCase();
    
    cleanSourceName = cleanSourceName
        .replace(/https?:\/\//, '')
        .replace(/^www\./, '')      
        .split('/')[0];
    const foundCategory = Object.keys(sourceMap).find(key => 
        cleanSourceName.includes(key)
    );

    if (foundCategory) {
        return sourceMap[foundCategory];
    }
    
    return sourceName || "General News";
};
const NewsCard = ({ article, onRemove, savedItemId }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isWatchLater, setIsWatchLater] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [watchLaterLoading, setWatchLaterLoading] = useState(false)

  const token = localStorage.getItem("token")
  const isAuthenticated = !!token

  const imageUrl =
    article?.image_url ||
    "https://placehold.co/600x400/333333/cccccc?text=NO+IMAGE"

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const truncateText = (text, lines = 2) => {
    if (!text) return "No description available"
    const lineArray = text.split("\n")
    return lineArray.slice(0, lines).join("\n")
  }

  const uniqueId = article?.id 

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      return
    }

    setFavoriteLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/favorites/" ,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ article_id: uniqueId })
      })

      if (response.ok) {
        setIsFavorite((prev) => !prev)
        console.log(`Favorite status updated for: ${uniqueId}`)
      } else {
        const errorData = await response.json()
        console.error("Server error adding to favorites:", response.status, errorData)
      }
    } catch (err) {
      console.error("Network error adding to favorites:", err)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleWatchLaterClick = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      return
    }

    setWatchLaterLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/watchlater/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
       body: JSON.stringify({ article_id: uniqueId })
      })

      if (response.ok) {
        setIsWatchLater((prev) => !prev)
        console.log(`Watch Later status updated for: ${uniqueId}`)
      } else {
        const errorData = await response.json()
        console.error("Server error adding to watch later:", response.status, errorData)
      }
    } catch (err) {
      console.error("Network error adding to watch later:", err)
    } finally {
      setWatchLaterLoading(false)
    }
  }

  return (
    <>
      <div className="news-card">
        <div className="card-image-wrapper">
          <img
            src={imageUrl}
            alt={article?.title || "News image"}
            className="card-image"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src =
                "https://placehold.co/600x400/333333/cccccc?text=NO+IMAGE"
            }}
          />
          

        </div>

        <div className="card-content">
          <h4 className="card-title">{article?.title || "Untitled Article"}</h4>

          <p
            className={`card-summary ${
              isExpanded ? "expanded" : "collapsed"
            }`}
          >
            {isExpanded
              ? article?.description || "No description available"
              : truncateText(article?.description)}
          </p>

          {isExpanded && article?.content && (
            <p className="card-content-text">{article.content}</p>
          )}

          <div className="card-meta">
            <Clock size={14} className="meta-icon" />
            <span className="card-date">
              {formatDate(article?.published_at)}
            </span>
          </div>

          <div className="card-actions">
            <button
              className="toggle-details-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={20} /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={16} /> See Full Article
                </>
              )}
            </button>

            <a
              href={article?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="read-more-btn"
            >
              Read Source <ExternalLink size={14} />
            </a>
          </div>

          {!onRemove && (
            <div className="card-user-actions">
              <button
                className={`user-action-btn ${isFavorite ? "active" : ""}`}
                onClick={handleFavoriteClick}
                disabled={favoriteLoading}
                aria-label="Add to favorites"
              >
                <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                <span>Favorite</span>
              </button>

              <button
                className={`user-action-btn ${isWatchLater ? "active" : ""}`}
                onClick={handleWatchLaterClick}
                disabled={watchLaterLoading}
                aria-label="Add to watch later"
              >
                <BookmarkPlus size={16} />
                <span>Watch Later</span>
              </button>
            </div>
          )}
        </div>

        {onRemove && (
            <div className="card-management-actions">
                <button
                    className="remove-btn"
                    onClick={() => onRemove(savedItemId)} 
                    disabled={favoriteLoading || watchLaterLoading}
                >
                    Remove from List
                </button>
            </div>
        )}

      </div>

      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />
    </>
  )
}

export default NewsCard