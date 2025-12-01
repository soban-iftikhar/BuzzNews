"use client"

import { Rss, Star, Clock, Home, Info, Mail, LogOut, LogIn } from "lucide-react"
import "../Styles/Header.css"
import { NavLink, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../Hooks/useAuth"

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Feed", path: "/feed", icon: Rss },
    { name: "Favorites", path: "/favorites", icon: Star },
    { name: "Watch Later", path: "/watch-later", icon: Clock },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
  ]

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="masthead-container">
        <Link to="/" className="masthead-link" aria-label="Go to home">
          <h1>
            <span className="buzz">Buzz</span>
            <span className="news">News</span>
          </h1>
        </Link>
      </div>

      <ul className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.path}>
              <NavLink to={item.path} className={({ isActive }) => (isActive ? "active" : "")}>
                <Icon className="nav-icon" size={16} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          )
        })}

        {isAuthenticated ? (
          <>
            <li className="auth-user-info">
              <span className="username">{user?.username || user?.email}</span>
            </li>
            <li>
              <button onClick={handleLogout} className="auth-btn logout-btn">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" className="auth-btn login-btn">
                <LogIn size={16} />
                <span>Login</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" className="auth-btn signup-btn">
                <span>Sign Up</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Header
