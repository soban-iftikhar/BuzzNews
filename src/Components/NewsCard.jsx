import React from "react";
import { Clock, Tag } from "lucide-react";
import "../Styles/NewsCard.css";

const NewsCard = ({ article }) => {
  // Use a placeholder image URL if the provided article.image link is empty,
  // typical when using free API tiers that don't always provide media.
  const imageUrl =
    article.image || "https://placehold.co/600x400/333333/cccccc?text=NO+IMAGE";

  return (
    <div className="news-card">
      <div className="card-image-wrapper">
        <img
          src={imageUrl}
          alt={article.title}
          className="card-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/600x400/333333/cccccc?text=NO+IMAGE+AVAILABLE";
          }}
        />
        <div className="card-category">
          <Tag size={14} className="category-icon" />
          {article.category}
        </div>
      </div>
      <div className="card-content">
        <h4 className="card-title">{article.title}</h4>
        <p className="card-summary">{article.summary}</p>
        <div className="card-meta">
          <Clock size={14} className="meta-icon" />
          <span className="card-date">{article.date}</span>
          <a href="#" className="read-more-btn">
            Read Full Article &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
