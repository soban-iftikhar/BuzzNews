"use client"

import { useState } from "react"
import { Clock, ExternalLink, ChevronDown, ChevronUp, Star, BookmarkPlus } from "lucide-react"
import "../Styles/NewsCard.css"
import { useAuth } from "../Hooks/useAuth"
import LoginPromptModal from "./LoginPromptModal"

const NewsCard = ({ article }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isWatchLater, setIsWatchLater] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [watchLaterLoading, setWatchLaterLoading] = useState(false)

  const { isAuthenticated, token } = useAuth()

  const imageUrl = article.urlToImage || "https://placehold.co/600x400/333333/cccccc?text=NO+IMAGE"

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const truncateText = (text, lines = 2) => {
    if (!text) return "No description available"
    const lineArray = text.split("\n")
    return lineArray.slice(0, lines).join("\n")
  }

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      return
    }

    setFavoriteLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ articleId: article.id }),
      })

      if (response.ok) {
        setIsFavorite(!isFavorite)
      }
    } catch (err) {
      console.error("[v0] Error adding to favorites:", err)
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
      const response = await fetch("http://localhost:8000/api/watch-later", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ articleId: article.id }),
      })

      if (response.ok) {
        setIsWatchLater(!isWatchLater)
      }
    } catch (err) {
      console.error("[v0] Error adding to watch later:", err)
    } finally {
      setWatchLaterLoading(false)
    }
  }

  return (
    <>
      <div className="news-card">
        <div className="card-image-wrapper">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={article.title}
            className="card-image"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = "https://placehold.co/600x400/333333/cccccc?text=NO+IMAGE+AVAILABLE"
            }}
          />
          <div className="card-source">
            <span className="source-name">{article.source.name}</span>
          </div>
        </div>

        <div className="card-content">
          <h4 className="card-title">{article.title}</h4>

          <p className={`card-summary ${isExpanded ? "expanded" : "collapsed"}`}>
            {isExpanded ? article.description : truncateText(article.description)}
          </p>

          {isExpanded && article.content && <p className="card-content-text">{article.content}</p>}

          <div className="card-meta">
            <Clock size={14} className="meta-icon" />
            <span className="card-date">{formatDate(article.publishedAt)}</span>
          </div>

          <div className="card-actions">
            <button className="toggle-details-btn" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? (
                <>
                  <ChevronUp size={16} /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={16} /> See Full Article
                </>
              )}
            </button>

            <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more-btn">
              Read Source <ExternalLink size={14} />
            </a>
          </div>

          <div className="card-user-actions">
            <button
              className={`user-action-btn ${isFavorite ? "active" : ""}`}
              onClick={handleFavoriteClick}
              disabled={favoriteLoading}
              title={isAuthenticated ? "Add to favorites" : "Sign in to add to favorites"}
              aria-label="Add to favorites"
            >
              <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
              <span>Favorite</span>
            </button>

            <button
              className={`user-action-btn ${isWatchLater ? "active" : ""}`}
              onClick={handleWatchLaterClick}
              disabled={watchLaterLoading}
              title={isAuthenticated ? "Add to watch later" : "Sign in to add to watch later"}
              aria-label="Add to watch later"
            >
              <BookmarkPlus size={16} />
              <span>Watch Later</span>
            </button>
          </div>
        </div>
      </div>

      <LoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </>
  )
}

export default NewsCard
