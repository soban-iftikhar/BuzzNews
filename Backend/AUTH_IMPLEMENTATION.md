# NewsBuzz Frontend Authentication System

## Overview
The NewsBuzz frontend implements a complete JWT-based authentication system with token management, protected routes, and conditional UI rendering. All authentication state is managed locally on the frontend with localStorage persistence.

## Architecture

### Core Components

#### 1. **AuthContext** (`src/Context/AuthContext.jsx`)
- Global authentication state management using React Context
- Manages: `user`, `token`, `isAuthenticated`, `loading`
- Provides methods: `login()`, `signup()`, `logout()`
- Persists auth data to localStorage for session recovery

#### 2. **useAuth Hook** (`src/Hooks/useAuth.js`)
- Custom hook to access AuthContext from any component
- Returns: `{ user, token, loading, login, signup, logout, isAuthenticated }`
- Throws error if used outside AuthProvider

#### 3. **AuthProvider Wrapper**
- Wraps entire app in `src/App.jsx`
- Initializes auth state from localStorage on mount
- Provides auth methods to all child components

## Features

### Frontend-Only JWT Handling

**Token Storage:**
- Stored in localStorage as `authToken`
- User data stored in localStorage as `user` (JSON stringified)
- Auto-recovered on page reload

**Token Usage:**
- Sent in `Authorization: Bearer {token}` header on protected API calls
- Checked locally before allowing protected actions
- No validation on frontend (backend validates JWT)

### Authentication Pages

#### Login Page (`src/Pages/Login.jsx`)
- Email and password inputs
- Loading states during API call
- Error message display
- Redirects to home on success
- Link to signup page

#### Signup Page (`src/Pages/Signup.jsx`)
- Username, email, password inputs
- Password confirmation validation
- Loading states during API call
- Error message display
- Redirects to home on success
- Link to login page

### Protected Features

#### ProtectedRoute Component (`src/Components/ProtectedRoute.jsx`)
- Wraps pages requiring authentication (Favorites, Watch Later)
- Redirects unauthenticated users to /login
- Shows loading state while checking auth status

#### NewsCard Actions
**Favorite Button:**
- Shows modal if user not authenticated
- Sends POST to `/api/favorites` with Bearer token
- Updates UI state on success

**Watch Later Button:**
- Shows modal if user not authenticated
- Sends POST to `/api/watch-later` with Bearer token
- Updates UI state on success

#### LoginPromptModal (`src/Components/LoginPromptModal.jsx`)
- Triggered when unauthenticated users try to favorite/watch-later
- Shows "Sign in to continue" message
- Provides links to Login and Signup pages
- Option to continue as guest

### Header Authentication UI (`src/Components/Header.jsx`)

**Not Authenticated:**
- Shows "Login" button (links to /login)
- Shows "Sign Up" button (links to /signup)

**Authenticated:**
- Shows current user's username/email
- Shows "Logout" button
- Logout clears token and user data, redirects home

## API Integration

### Expected Backend Endpoints

\`\`\`
POST /api/auth/login
  Request: { email, password }
  Response: { token, user: { id, username, email } }

POST /api/auth/signup
  Request: { username, email, password }
  Response: { token, user: { id, username, email } }

POST /api/favorites
  Header: Authorization: Bearer {token}
  Request: { articleId }
  Response: { success: true }

POST /api/watch-later
  Header: Authorization: Bearer {token}
  Request: { articleId }
  Response: { success: true }

GET /api/favorites
  Header: Authorization: Bearer {token}
  Response: { favorites: [...articles] }

GET /api/watch-later
  Header: Authorization: Bearer {token}
  Response: { watch_later: [...articles] }
\`\`\`

## File Structure

\`\`\`
src/
├── Context/
│   └── AuthContext.jsx          # Auth state management
├── Hooks/
│   └── useAuth.js               # Auth context hook
├── Components/
│   ├── Header.jsx               # Auth-aware navbar
│   ├── NewsCard.jsx             # Cards with favorite/watch-later
│   ├── LoginPromptModal.jsx     # Modal for unauth actions
│   └── ProtectedRoute.jsx       # Route protection wrapper
├── Pages/
│   ├── Login.jsx                # Login page
│   ├── Signup.jsx               # Signup page
│   ├── Home.jsx                 # Public homepage (6 cards)
│   ├── Favorites.jsx            # Protected favorites page
│   ├── WatchLater.jsx           # Protected watch-later page
│   └── ...other pages
├── Styles/
│   ├── Auth.css                 # Login/signup styling
│   ├── LoginPromptModal.css     # Modal styling
│   ├── Header.css               # Header styling
│   └── NewsCard.css             # Card styling
└── App.jsx                       # Main app with routes & AuthProvider
\`\`\`

## Styling

All components follow the NewsBuzz dark theme:
- Primary dark background: `#0d0d0d`
- Secondary dark: `#2c2c2c`
- Accent color: `#cc0000` (red)
- Text color: `#f0f0f0`
- Borders: `#383838`

## User Flow

### Unauthenticated User
1. Lands on public homepage (sees 6 news cards)
2. Can view articles, expand details
3. Clicks "Favorite" or "Watch Later" → LoginPromptModal appears
4. Clicks "Log In" → redirected to /login
5. Enters credentials → backend validates JWT → token stored locally
6. Redirected to homepage (now authenticated)

### Authenticated User
1. Lands on homepage
2. Header shows username and logout button
3. Can click "Favorite" and "Watch Later" on cards
4. API calls include Bearer token in Authorization header
5. Can access Favorites and Watch Later pages
6. Clicks logout → token cleared, redirected to homepage

## Conditional Rendering Logic

\`\`\`javascript
// Check authentication
const { isAuthenticated, token } = useAuth()

// Protect actions
if (!isAuthenticated) {
  // Show login prompt or redirect
  return
}

// Include token in API calls
fetch('/api/endpoint', {
  headers: { Authorization: `Bearer ${token}` }
})
\`\`\`

## Security Notes

- ⚠️ Frontend stores token in localStorage (accessible to XSS attacks)
  - Backend should validate all tokens and implement CSRF protection
  - Use httpOnly cookies for production if possible
- Backend must validate JWT signature and expiry
- Frontend assumes valid responses from backend
- No password hashing or validation on frontend (backend responsibility)

## Next Steps for Backend Implementation

1. Create `/api/auth/login` and `/api/auth/signup` endpoints
2. Generate JWT tokens on successful authentication
3. Create `/api/favorites` and `/api/watch-later` endpoints
4. Implement JWT middleware to protect endpoints
5. Store user data and track favorites/watch-later items in database
6. Return appropriate error messages for frontend error handling
