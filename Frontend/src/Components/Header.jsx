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
    if (token) {
      setIsAuthenticated(true)
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        const adminEmails = ["admin@newsbuzz.com", "admin@example.com"]
        if (adminEmails.includes(parsedUser.email) || parsedUser.is_admin) {
          setIsAdmin(true)
        }
      }
    }
  }, [])

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Feed", path: "/feed", icon: Rss },
    { name: "Favorites", path: "/favorites", icon: Star },
    { name: "Watch Later", path: "/watch-later", icon: Clock },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
  ]

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
            {isAdmin && (
              <li>
                <NavLink to="/create-article" className={({ isActive }) => (isActive ? "active" : "")}>
                  <PenTool className="nav-icon" size={16} />
                  <span>Write</span>
                </NavLink>
              </li>
            )}
            <li className="auth-user-info">
              <span className="username">{user?.username || user?.email}</span>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" className="">
                <LogIn size={16} />
                <span>Login</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" className="">
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
