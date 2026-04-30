import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PlaylistPage from './pages/PlaylistPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import TopChartsPage from './pages/TopChartsPage.jsx'
import ArtistsPage from './pages/ArtistsPage.jsx'
import AlbumsPage from './pages/AlbumsPage.jsx'
import LikedSongsPage from './pages/LikedSongsPage.jsx'

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
        <Route path="/charts" element={<TopChartsPage />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/liked" element={<LikedSongsPage />} />
        <Route path="/playlists" element={<PlaylistRoute />} />
        <Route path="/profile" element={<ProfileRoute />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App