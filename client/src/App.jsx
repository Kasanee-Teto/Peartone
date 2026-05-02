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

function PlaylistRoute() {
  const navigate = useNavigate()
  return <PlaylistPage onBack={() => navigate('/')} />
}

function ProfileRoute() {
  const navigate = useNavigate()
  return <ProfilePage onBack={() => navigate('/')} />
}

// Halaman yang TIDAK menampilkan Music Player
const HIDE_PLAYER_ON = ['/login', '/register']

function ProtectedRoute() {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}

function AppLayout() {
  const location = useLocation()
  const showPlayer = !HIDE_PLAYER_ON.includes(location.pathname)

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/charts" element={<TopChartsPage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/liked" element={<LikedSongsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/admin" element={<AdminUploadPage />} />
          <Route path="/playlists" element={<PlaylistRoute />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route path="/tracks" element={<TracksPage />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
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

export default App