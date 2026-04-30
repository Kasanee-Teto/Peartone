import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PlaylistPage from './pages/PlaylistPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

function PlaylistRoute() {
  const navigate = useNavigate()

  return <PlaylistPage onBack={() => navigate('/')} />
}

function ProfileRoute() {
  const navigate = useNavigate()

  return <ProfilePage onBack={() => navigate('/')} />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/playlists" element={<PlaylistRoute />} />
        <Route path="/profile" element={<ProfileRoute />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App