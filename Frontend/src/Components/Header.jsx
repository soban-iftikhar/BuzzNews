"use client"

import { Rss, Star, Clock, Home, Info, Mail, LogOut, LogIn, PenTool } from "lucide-react"
import "../Styles/Header.css"
import { NavLink, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    
    // Check for both token AND user data for a complete authenticated state
    if (token && userData) {
      setIsAuthenticated(true)
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      const adminEmails = ["admin@newsbuzz.com", "admin@example.com"]
      if (adminEmails.includes(parsedUser.email) || parsedUser.is_admin) {
        setIsAdmin(true)
      }
    } else {
        // Ensure state is reset if token is missing
        setIsAuthenticated(false)
        setUser(null)
        setIsAdmin(false)
    }
  }, [])

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Feed", path: "/feed", icon: Rss },
    { name: "Favorites", path: "/favorites", icon: Star },
    { name: "WatchLater", path: "/watch-later", icon: Clock },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
  ]
  
  // NOTE: Changed watch-later path for consistency, ensure your router uses this path
  const authNavItems = [
    ...(isAdmin ? [{ name: "Write", path: "/create-article", icon: PenTool }] : []),
    
    // Auth status items are now separate to be placed in the main masthead
  ];

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUser(null)
    setIsAdmin(false)
    navigate("/")
  }

  return (
    <nav className="navbar">
      {/* 1. TOP MASTHEAD CONTAINER: Logo + Welcome Message/Auth */}
      <div className="masthead-top-bar">
        {/* LOGO (Centered) */}
        <Link to="/" className="masthead-link" aria-label="Go to home">
          <h1>
            <span className="buzz">Buzz</span>
            <span className="news">News</span>
          </h1>
        </Link>

        {/* WELCOME / LOGIN BUTTONS (Right) */}
        <div className="auth-status-area">
          {isAuthenticated ? (
            <>
              <span className="welcome-message">
                Welcome, {user?.username || user?.email}
              </span>
              <button onClick={handleLogout} className="auth-btn logout-btn">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="auth-btn">
                <LogIn size={16} />
                <span>Login</span>
              </NavLink>
              <NavLink to="/signup" className="auth-btn">
                <span>Sign Up</span>
              </NavLink>
            </>
          )}
        </div>
      </div>
      {/* End Masthead Top Bar */}

      {/* 2. MAIN NAVIGATION LIST */}
      <ul className="nav-list">
        {[...navItems, ...authNavItems].map((item) => {
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
      </ul>
      {/* End Main Navigation List */}
    </nav>
  )
}

export default Header