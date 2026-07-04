import './App.css'
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from 'react-router-dom'
import { useEffect, useState } from 'react'

import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PlaylistPage from './pages/PlaylistPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import TopChartsPage from './pages/TopChartsPage.jsx'
import ArtistsPage from './pages/ArtistsPage.jsx'
import AlbumsPage from './pages/AlbumsPage.jsx'
import LikedSongsPage from './pages/LikedSongsPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import AdminUploadPage from './pages/AdminUploadPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'
import TracksPage from './pages/TracksPage.jsx'
import LoginSuccessPage from "./pages/LoginSuccessPage.jsx"
import ArtistDetailPage from './pages/ArtistDetailPage.jsx'

function PlaylistRoute() {
  const navigate = useNavigate()
  return <PlaylistPage onBack={() => navigate('/')} />
}

function ProfileRoute() {
  const navigate = useNavigate()
  return <ProfilePage onBack={() => navigate('/')} />
}

const HIDE_PLAYER_ON = ['/login', '/register']

function ProtectedRoute({ isAuthed }) {
  if (!isAuthed) return <Navigate to="/login" replace />
  return <Outlet />
}

function AppLayout() {
  const location = useLocation()
  const showPlayer = !HIDE_PLAYER_ON.includes(location.pathname)

  const [isAuthed, setIsAuthed] = useState(() => !!localStorage.getItem('token'))

  useEffect(() => {
    const syncAuth = () => setIsAuthed(!!localStorage.getItem('token'))

    window.addEventListener('storage', syncAuth)
    window.addEventListener('auth-changed', syncAuth)

    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener('auth-changed', syncAuth)
    }
  }, [])

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage setIsAuthed={setIsAuthed} />} />
        <Route path="/register" element={<RegisterPage setIsAuthed={setIsAuthed} />} />
        <Route path="/login-success" element={<LoginSuccessPage />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute isAuthed={isAuthed} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/charts" element={<TopChartsPage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artists/:id" element={<ArtistDetailPage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/liked" element={<LikedSongsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/admin" element={<AdminUploadPage />} />
          <Route path="/playlists" element={<PlaylistRoute />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route path="/tracks" element={<TracksPage />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthed ? "/" : "/login"} replace />} />
      </Routes>

      {showPlayer && <MusicPlayer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App;