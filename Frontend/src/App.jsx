import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import Newsfeed from "./Pages/Newsfeed"
import WatchLater from "./Pages/WatchLater"
import About from "./Pages/About"
import Contact from "./Pages/Contact"
import Favorites from "./Pages/Favorites"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import CreateArticle from "./Pages/CreateArticle"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Newsfeed />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/watch-later" element={<WatchLater />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-article" element={<CreateArticle />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
