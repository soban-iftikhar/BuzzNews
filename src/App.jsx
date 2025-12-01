import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./Context/AuthContext"
import Home from "./Pages/Home"
import Newsfeed from "./Pages/Newsfeed"
import WatchLater from "./Pages/WatchLater"
import About from "./Pages/About"
import Contact from "./Pages/Contact"
import Favorites from "./Pages/Favorites"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import ProtectedRoute from "./Components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Newsfeed />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watch-later"
            element={
              <ProtectedRoute>
                <WatchLater />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
