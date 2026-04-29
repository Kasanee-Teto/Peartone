const Sidebar = ({ isOpen, onClose, onPlaylist }) => {
  return (
    <aside
      id="home-sidebar"
      className={`home__sidebar ${isOpen ? "is-open" : ""}`}
      aria-label="Menu Samping"
      aria-hidden={!isOpen}
    >
      <button
        className="home__sidebar-close"
        type="button"
        aria-label="Tutup menu samping"
        onClick={onClose}
      >
        X
      </button>
      <nav className="home__sidebar-nav" aria-label="Navigasi Utama">
        <button className="home__sidebar-link is-active" type="button">
          Home
        </button>
        <button className="home__sidebar-link" type="button" onClick={onPlaylist}>
          Playlist
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
