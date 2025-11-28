import React from "react";
// Components from src/Components/
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import NewsCard from "../Components/NewsCard";
// Import styles for the page layout (Hero, Grid)
import "../Styles/Home.css";

const mockArticles = [
  // Keeping image source empty/mock, relying on the 'onerror' fallback in NewsCard.jsx
  {
    id: 1,
    title: "Global Markets Surge Amidst Tech Sector Recovery",
    summary:
      "Optimism returns as major indices post record gains, driven by strong quarterly reports from leading technology companies.",
    image: "/n1.jpeg",
    date: "5 hours ago",
    category: "Business",
  },
  {
    id: 2,
    title: "Local Elections See Record Voter Turnout",
    summary:
      "A new generation of voters mobilized for local races, signaling a shift in municipal political priorities.",
    image: "/n2.jpeg",
    date: "Yesterday",
    category: "Politics",
  },
  {
    id: 3,
    title: "New Discovery Unlocks Secrets of Deep-Sea Life",
    summary:
      "Scientists confirm the existence of rare species in the abyssal zone, challenging previous assumptions about extreme ecosystems.",
    image: "/n3.jpeg",
    date: "1 day ago",
    category: "Science",
  },
  {
    id: 4,
    title: "The Rise of Urban Farming: A Sustainable Solution?",
    summary:
      "Exploring how vertical farms are transforming city landscapes and tackling food security challenges globally.",
    image: "/n4.jpeg",
    date: "3 hours ago",
    category: "Environment",
  },
  {
    id: 5,
    title: "Cultural Festival Highlights Regional Music Diversity",
    summary:
      "The annual festival attracted thousands, featuring unique performances and celebrating local heritage.",
    image: "/n5.jpeg",
    date: "8 hours ago",
    category: "Culture",
  },
  {
    id: 6,
    title: "New Safety Regulations Impact Auto Manufacturing",
    summary:
      "The latest government mandates require significant changes to vehicle design, focusing on pedestrian safety.",
    image: "/n6.jpeg",
    date: "2 days ago",
    category: "Technology",
  },
];

const heroArticle = {
  title: "Exclusive: Global Leaders Meet for Emergency Climate Summit",
  summary:
    "In a historic and unplanned session, delegates from twenty nations convened to discuss unprecedented heat waves and rising sea levels, promising immediate and radical policy changes.",
  image: "", // Empty for API fetch, relies on fallback
  author: "Jane Smith",
  date: "1 hour ago",
  category: "World News",
};

const Home = () => {
  return (
    // page-container ensures content is centered and footer is always at the bottom
    <div className="page-container">
      <Header />
      <main className="main-content">
        {/* --- Hero Section: Large Featured Story --- */}
        <section className="hero-section">
          <div className="hero-content">
            <p className="hero-category">{heroArticle.category}</p>
            <h2 className="hero-title">{heroArticle.title}</h2>
            <p className="hero-summary">{heroArticle.summary}</p>
            <div className="hero-meta">
              <span>By {heroArticle.author}</span>
              <span className="separator">|</span>
              <span>{heroArticle.date}</span>
            </div>
          </div>
          <div className="hero-image-container">
            <img
              src={
                // avoid passing an empty string — use fallback if falsy
                heroArticle.image ||
                "https://placehold.co/1200x600/cc0000/ffffff?text=BREAKING+NEWS"
              }
              alt={heroArticle.title}
              className="hero-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://placehold.co/1200x600/cc0000/ffffff?text=BREAKING+NEWS";
              }}
            />
          </div>
        </section>

        <h3 className="section-title">Latest Updates</h3>

        {/* --- News Grid Section: Renders the NewsCard components --- */}
        <section className="news-grid-section">
          <div className="news-grid">
            {/* The conditional check ensures the NewsCard component receives an 'article' prop */}
            {mockArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
