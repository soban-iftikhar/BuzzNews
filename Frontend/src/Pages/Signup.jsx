

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "../Styles/Auth.css"

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({}) 
  const [loading, setLoading] = useState(false)

  const validateField = (name, value) => {
    let error = ""

    if (name === "username") {
      const usernameRegex = /^[a-zA-Z]{3,}$/
      if (value.length > 0 && !value.match(usernameRegex)) {
        error = "Username must be at least 3 letters long and contain only letters (A-Z, a-z)."
      } else if (value.length < 3 && value.length > 0) {
        error = "Username is too short (min 3 letters)."
      }
    }

    if (name === "password") {
      if (value.length > 0 && value.length < 8) {
        error = "Password must be at least 8 characters long."
      } else if (value.length >= 8 && !/[A-Z]/.test(value)) {
        error = "Password must contain at least one capital letter."
      }
    }
    
    if (name === "email" && value.length > 0) {
      if (!value.includes("@")) {
          error = "Please enter a valid email format."
      } 
      else if (!value.endsWith("@gmail.com") && !value.endsWith("@yahoo.com")) {
        error = "Only @gmail.com or @yahoo.com domains are allowed."
      }
    }

    if (name === "confirmPassword" || name === "password") {
        const pass = name === "password" ? value : formData.password;
        const confirmPass = name === "confirmPassword" ? value : formData.confirmPassword;

        if (confirmPass.length > 0 && pass !== confirmPass) {
            setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match." }));
        } else if (name === "confirmPassword") {
            setFieldErrors(prev => ({ ...prev, confirmPassword: "" }));
        }
    }
    
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  }

  const validateForm = () => {
    let isValid = true

    validateField('username', formData.username);
    validateField('email', formData.email);
    validateField('password', formData.password);
    validateField('confirmPassword', formData.confirmPassword);
    
    const finalErrors = fieldErrors;
    if (finalErrors.username || finalErrors.email || finalErrors.password || finalErrors.confirmPassword || formData.password !== formData.confirmPassword || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        isValid = false;
    }

    for (const key in fieldErrors) {
        if (fieldErrors[key]) {
            isValid = false;
            break;
        }
    }

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("All fields are required.");
        isValid = false;
    }
    
    return isValid;
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({ ...prev, [name]: value }))
    
    validateField(name, value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return 
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        const detail = errorData.detail || "Signup failed. Please try again."

        if (response.status === 422) {
            setError("Invalid input. Please check all fields carefully or try a different username/email.")
        } else {
            setError(detail)
        }
        throw new Error(detail)
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      navigate("/")

    } catch (err) {
      if (!error) setError(err.message || "A network error occurred during signup")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>
            <span className="buzz">Buzz</span>
            <span className="news">News</span>
          </h1>
          <p>Create Your Account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              disabled={loading}
              className={fieldErrors.username ? 'input-error' : ''}
            />
            {fieldErrors.username && <p className="field-error">{fieldErrors.username}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
              className={fieldErrors.email ? 'input-error' : ''}
            />
            {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
              className={fieldErrors.password ? 'input-error' : ''}
            />
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              disabled={loading}
              className={fieldErrors.confirmPassword ? 'input-error' : ''}
            />
            {fieldErrors.confirmPassword && <p className="field-error">{fieldErrors.confirmPassword}</p>}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup