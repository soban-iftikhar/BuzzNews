import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../Styles/CreateArticle.css"
import { ArrowLeft } from "lucide-react"

const CreateArticle = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    category: "",
    source: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (!token) {
      navigate("/login")
      return
    }

    if (user) {
      const userData = JSON.parse(user)
      // Check if user is admin (predefined admin emails or is_admin flag from backend)
      const adminEmails = ["admin@newsbuzz.com", "admin@example.com"]
      if (adminEmails.includes(userData.email) || userData.is_admin) {
        setIsAdmin(true)
      } else {
        // Non-admin users cannot access this page
        navigate("/")
      }
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")

      const response = await fetch("http://localhost:8000/api/admin/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to publish article")
      }

      setFormData({
        title: "",
        description: "",
        content: "",
        imageUrl: "",
        category: "",
        source: "",
      })
      alert("Article published successfully!")
      navigate("/feed")
    } catch (err) {
      setError(err.message || "Error publishing article")
      console.error("[v0] Create Article Error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="create-article-container">
      <button onClick={() => navigate("/")} className="back-btn">
        <ArrowLeft size={20} />
        Back to Home
      </button>

      <div className="article-form-card">
        <div className="form-header">
          <h1>Write & Publish Article</h1>
          <p>Share your news story with the NewsBuzz community</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="article-form">
          <div className="form-group">
            <label htmlFor="title">Article Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter article title"
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Technology, Sports, Politics"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="source">Source</label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="e.g., NewsBuzz Editorial"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Short Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief summary of the article"
              rows="3"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Full Article Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write the complete article content here"
              rows="8"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Publishing..." : "Publish Article"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateArticle
