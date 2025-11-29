import { useState } from "react"
import { Clock, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import "../Styles/NewsCard.css"

const NewsCard = ({ article }) => {
  const [isExpanded, setIsExpanded] = useState(false)

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

  return (
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
      </div>
    </div>
  )
}

export default NewsCard
