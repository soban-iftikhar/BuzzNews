import { Rss, Star, Clock, Home, Info, Mail } from 'lucide-react';
import '../Styles/Header.css';
import { NavLink, Link } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Feed', path: '/feed', icon: Rss },
  { name: 'Favorites', path: '/favorites', icon: Star },
  { name: 'Watch Later', path: '/watch-later', icon: Clock },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Contact', path: '/contact', icon: Mail },
];

const Header = () => {
  return (
    <nav className="navbar">
      {/* Masthead/Title Section */}
      <div className="masthead-container">
        <Link to="/" className="masthead-link" aria-label="Go to home">
          <h1>
            <span className="buzz">Buzz</span>
            <span className="news">News</span>
          </h1>
        </Link>
      </div>

      {/* Navigation Links Section */}
      <ul className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <Icon className="nav-icon" size={16} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Header;
