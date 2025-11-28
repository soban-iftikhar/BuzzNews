// ...existing code...
import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed ${email} to the BuzzNews Daily Digest! (Mock submission)`);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content-wrapper">
        {/* Column 1: Logo/Masthead */}
        <div className="footer-masthead footer-col">
          <Link to="/" className="footer-logo-link" aria-label="Go to home">
            <h2 className="footer-logo">
              <span className="buzz">Buzz</span>
              <span className="news">News</span>
            </h2>
          </Link>

          <p className="copyright">
            &copy; {currentYear} BuzzNews Media Inc. <br />
            All rights reserved. Breaking News, Always.
          </p>

          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-links footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/feed">Latest Feed</Link></li>
            <li><Link to="/favorites">My Favorites</Link></li>
            <li><Link to="/watch-later">Watch Later</Link></li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="footer-info footer-col">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
          </ul>
        </div>

        {/* Column 4: Subscribe */}
        <div className="footer-subscribe footer-col">
          <h3>Subscribe</h3>
          <p>Get the headlines delivered straight to your inbox daily.</p>
          <form onSubmit={handleSubscribe} className="subscribe-form">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" aria-label="Subscribe to newsletter">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="footer-tagline">The Future of News. Delivered Daily.</div>
    </footer>
  );
};

export default Footer;