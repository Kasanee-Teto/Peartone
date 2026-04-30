import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App