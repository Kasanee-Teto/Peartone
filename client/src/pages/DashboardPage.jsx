import PlaylistCard from "../components/PlaylistCard";
import "../styles/DashboardPage.css";

const DashboardPage = ({ onBack }) => {
  const playlists = [
    {
      id: 1,
      title: "Popular",
      description: "High-energy tracks to keep you motivated",
      image: "https://via.placeholder.com/200?text=Workout",
      songs: 45,
      color: "#c8f560"
    },
    {
      id: 2,
      title: "Chill",
      description: "Relaxing songs for study and work",
      image: "https://via.placeholder.com/200?text=Chill",
      songs: 32,
      color: "#7c6af7"
    },
    {
      id: 3,
      title: "Party Hits",
      description: "Latest party and dance tracks",
      image: "https://via.placeholder.com/200?text=Party",
      songs: 58,
      color: "#ff5c6e"
    },
    {
      id: 4,
      title: "Indie Favorites",
      description: "Discover independent artists",
      image: "https://via.placeholder.com/200?text=Indie",
      songs: 67,
      color: "#00d4ff"
    },
    {
      id: 5,
      title: "Pop Classics",
      description: "All-time favorite pop songs",
      image: "https://via.placeholder.com/200?text=Pop",
      songs: 51,
      color: "#ffa500"
    },
    {
      id: 6,
      title: "Hip-Hop Anthems",
      description: "Best hip-hop and rap tracks",
      image: "https://via.placeholder.com/200?text=HipHop",
      songs: 44,
      color: "#ff1493"
    }
  ];

  return (
    <main className="dashboard" aria-label="Dashboard Playlist">
      <div className="dashboard-header">
        <button className="back-button" onClick={onBack} aria-label="Kembali ke beranda">
          ← Kembali
        </button>
        <h1 className="dashboard-title">Playlist Saya</h1>
        <div style={{ width: "80px" }}></div>
      </div>

      <div className="playlists-grid" role="list" aria-label="Daftar playlist">
        {playlists.map((playlist) => (
          <div key={playlist.id} role="listitem">
            <PlaylistCard playlist={playlist} />
          </div>
        ))}
      </div>
    </main>
  );
};

export default DashboardPage;
