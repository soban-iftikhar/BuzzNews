
import { X } from "lucide-react"
import { Link } from "react-router-dom"
import "../Styles/LoginPromptModal.css"

const LoginPromptModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        <div className="modal-header">
          <h2>Sign in to continue</h2>
          <p>Log in to save your favorite articles and watchlist</p>
        </div>

        <div className="modal-actions">
          <Link to="/login" className="modal-btn modal-login-btn">
            Log In
          </Link>
          <Link to="/signup" className="modal-btn modal-signup-btn">
            Create Account
          </Link>
        </div>

        <button className="modal-cancel-btn" onClick={onClose}>
          Continue as Guest
        </button>
      </div>
    </div>
  )
}

export default LoginPromptModal
