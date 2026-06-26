import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiTrendingUp,
  FiMic,
  FiDisc,
  FiList,
  FiClock,
  FiHeart,
  FiUploadCloud,
  FiUser,
  FiLogOut,
  FiMusic,
} from "react-icons/fi";
import "../styles/Sidebar.css";

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  return (
    <aside
      id="home-sidebar"
      className={`home__sidebar ${isOpen ? "is-open" : ""}`}
      aria-label="Menu Samping"
      aria-hidden={!isOpen}
    >

      <nav className="home__sidebar-nav" aria-label="Navigasi Utama">

        {/* ── Discover ── */}
        <p className="home__sidebar-group-title">Discover</p>
        <ul className="home__sidebar-list" role="list">
          <li className="home__sidebar-item">
            <NavLink
              to="/"
              end
              onClick={onClose}
              className={({ isActive }) =>
                `home__sidebar-link${isActive ? " is-active" : ""}`
              }
            >
              <FiHome className="home__sidebar-icon" aria-hidden="true" />
              <span>Home</span>
            </NavLink>
          </li>
          <li className="home__sidebar-item">
            <NavLink
              to="/tracks"
              onClick={onClose}
              className={({ isActive }) =>
                `home__sidebar-link${isActive ? " is-active" : ""}`
              }
            >
              <FiMusic className="home__sidebar-icon" aria-hidden="true" />
              <span>All Tracks</span>
            </NavLink>
          </li>
          <li className="home__sidebar-item">
            <NavLink
              to="/charts"
              onClick={onClose}
              className={({ isActive }) =>
                `home__sidebar-link${isActive ? " is-active" : ""}`
              }
            >
              <FiTrendingUp className="home__sidebar-icon" aria-hidden="true" />
              <span>Top Charts</span>
            </NavLink>
          </li>
          <li className="home__sidebar-item">
            <NavLink
              to="/artists"
              onClick={onClose}
              className={({ isActive }) =>
                `home__sidebar-link${isActive ? " is-active" : ""}`
              }
            >
              <FiMic className="home__sidebar-icon" aria-hidden="true" />
              <span>Artists</span>
            </NavLink>
          </li>
          <li className="home__sidebar-item">
            <NavLink
              to="/albums"
              onClick={onClose}
              className={({ isActive }) =>
                `home__sidebar-link${isActive ? " is-active" : ""}`
              }
            >
              <FiDisc className="home__sidebar-icon" aria-hidden="true" />
              <span>Albums</span>
            </NavLink>
          </li>
        </ul>

        {/* ── Library ── */}
        <p className="home__sidebar-group-title">Library</p>
        <ul className="home__sidebar-list" role="list">
          <li className="home__sidebar-item">
            <NavLink
              to="/playlists"
              onClick={onClose}
              className={({ isActive }) =>
                `home__sidebar-link${isActive ? " is-active" : ""}`
              }
            >
              <FiList className="home__sidebar-icon" aria-hidden="true" />
              <span>Playlists</span>
            </NavLink>
          </li>
          <li className="home__sidebar-item">
            <NavLink
              to="/liked"
              onClick={onClose}
              className={({ isActive }) =>
                `home__sidebar-link${isActive ? " is-active" : ""}`
              }
            >
              <FiHeart className="home__sidebar-icon" aria-hidden="true" />
              <span>Liked Songs</span>
            </NavLink>
          </li>
          <li className="home__sidebar-item">
            <NavLink
              to="/history"
              onClick={onClose}
              className={({ isActive }) =>
                `home__sidebar-link${isActive ? " is-active" : ""}`
              }
            >
              <FiClock className="home__sidebar-icon" aria-hidden="true" />
              <span>History</span>
            </NavLink>
          </li>
        </ul>

        {/* ── Account ── */}
        <p className="home__sidebar-group-title">Account</p>
        <ul className="home__sidebar-list" role="list">
          <li className="home__sidebar-item">
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) =>
                `home__sidebar-link${isActive ? " is-active" : ""}`
              }
            >
              <FiUploadCloud className="home__sidebar-icon" aria-hidden="true" />
              <span>Admin Upload</span>
            </NavLink>
          </li>
          <li className="home__sidebar-item">
            <NavLink
              to="/profile"
              onClick={onClose}
              className={({ isActive }) =>
                `home__sidebar-link${isActive ? " is-active" : ""}`
              }
            >
              <FiUser className="home__sidebar-icon" aria-hidden="true" />
              <span>Profile</span>
            </NavLink>
          </li>
          <li className="home__sidebar-item">
            <button
              type="button"
              className="home__sidebar-link"
              onClick={() => {
                onClose?.();
                onLogout?.();
              }}
            >
              <FiLogOut className="home__sidebar-icon" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </li>
        </ul>

      </nav>
    </aside>
  );
};

export default Sidebar;