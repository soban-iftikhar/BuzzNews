import { Rss, Star, Clock, Home, Info, Mail, LogOut, LogIn, PenTool, Menu, X } from "lucide-react"
import "../Styles/Header.css"
import { NavLink, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false) 
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    
    if (token && userData) {
      setIsAuthenticated(true)
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      const adminEmails = ["admin@newsbuzz.com", "admin@example.com"]
      if (adminEmails.includes(parsedUser.email) || parsedUser.is_admin) {
        setIsAdmin(true)
      }
    } else {
        
        setIsAuthenticated(false)
        setUser(null)
        setIsAdmin(false)
    }
  }, [])

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Feed", path: "/feed", icon: Rss },
    { name: "Favorites", path: "/favorites", icon: Star },
    { name: "Watch Later", path: "/watchlater", icon: Clock }, 
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
  ]
  
 
  const authNavItems = [
    ...(isAdmin ? [{ name: "Write", path: "/create-article", icon: PenTool }] : []),
 
  ];

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUser(null)
    setIsAdmin(false)
    navigate("/")
    setIsMenuOpen(false); 
  }
  
  const handleNavLinkClick = () => {
      setIsMenuOpen(false);
  }

  return (
    <nav className="navbar">
      
      <div className="masthead-top-bar">
        <Link to="/" className="masthead-link" aria-label="Go to home">
          <h1>
            <span className="buzz">Buzz</span>
            <span className="news">News</span>
          </h1>
        </Link>

        <button className="menu-toggle-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle navigation menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="auth-status-area auth-status-desktop">
          {isAuthenticated ? (
            <>
              <span className="welcome-message">
                Welcome, <strong>{user?.username || user?.email}</strong>
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


    
      <ul className={`nav-list ${isMenuOpen ? 'open' : ''}`}>
        {[...navItems, ...authNavItems].map((item) => {
          const Icon = item.icon
          return (
            <li key={item.path}>
              <NavLink to={item.path} onClick={handleNavLinkClick} className={({ isActive }) => (isActive ? "active" : "")}>
                <Icon className="nav-icon" size={16} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          )
        })}
        
     
        <li className="mobile-auth-separator" aria-hidden="true"></li>
        {isAuthenticated ? (
             <li className="mobile-auth-item">
                <button onClick={handleLogout} className="logout-btn auth-btn">
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </li>
        ) : (
         
            <li className="mobile-auth-item mobile-login-group">
                <NavLink to="/login" className="auth-btn" onClick={handleNavLinkClick}>
                    <LogIn size={16} />
                    <span>Login</span>
                </NavLink>
                <NavLink to="/signup" className="auth-btn" onClick={handleNavLinkClick}>
                    <span>Sign Up</span>
                </NavLink>
            </li>
        )}
      </ul>
    
    </nav>
  )
}

export default Header