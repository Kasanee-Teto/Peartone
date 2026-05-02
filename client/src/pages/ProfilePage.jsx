import { useEffect, useState } from "react";
import { FiMusic, FiHeart, FiEdit2, FiMapPin, FiCalendar, FiX } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/ProfilePage.css";
import { useFetch } from "../hooks/useFetch";
import { authApi } from "../api/auth.js";

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", email: "", location: "" });
  const [profileUser, setProfileUser] = useState(() => JSON.parse(localStorage.getItem("pt_user") || "null") || {});
  const { data: playlistsResp } = useFetch("/playlists");
  const { data: likesResp } = useFetch("/likes");
  const playlists = Array.isArray(playlistsResp) ? playlistsResp : playlistsResp?.data || [];
  const likes = Array.isArray(likesResp) ? likesResp : likesResp?.data || [];

  useEffect(() => {
    let active = true;

    authApi
      .getProfile()
      .then((response) => {
        const nextUser = response?.data || response;
        if (!active || !nextUser) return;
        setProfileUser(nextUser);
        localStorage.setItem("pt_user", JSON.stringify(nextUser));
      })
      .catch(() => {
        // keep local cache when profile fetch fails
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setEditForm({
      username: profileUser.username || "",
      email: profileUser.email || "",
      location: profileUser.location || "",
    });
  }, [profileUser]);

  const openEditor = () => setIsEditing(true);

  const saveProfile = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const response = await authApi.updateProfile(editForm);
      const updatedUser = response?.data || response;
      setProfileUser(updatedUser);
      localStorage.setItem("pt_user", JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (error) {
      window.alert(error.message || "Gagal menyimpan profil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="profile__page">
      {/* Blur blobs */}
      <div className="profile__blobs" aria-hidden="true">
        <div className="profile__blob profile__blob--purple" />
        <div className="profile__blob profile__blob--green" />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => setIsSidebarOpen(false)}
      />

      <button
        className={`home__sidebar-overlay ${isSidebarOpen ? "is-open" : ""}`}
        type="button"
        aria-label="Tutup menu samping"
        onClick={() => setIsSidebarOpen(false)}
      />

      <button
        className="home__sidebar-toggle"
        type="button"
        aria-label="Buka menu samping"
        aria-controls="home-sidebar"
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen(true)}
      >
        ≡
      </button>

      <div className="profile__container">

        {/* Hero Banner */}
        <div className="profile__hero">
            <div className="profile__avatar">{(profileUser.username || "P").slice(0, 1).toUpperCase()}</div>
            <div className="profile__hero-info">
            <span className="profile__hero-type">Profil Publik</span>
            <h1 className="profile__hero-name">{profileUser.username || 'Peartone User'}</h1>
            <div className="profile__hero-meta">
              <span className="profile__hero-meta-item">
                <FiMusic size={13} /> {playlists.length} Playlist
              </span>
              <span className="profile__hero-meta-item">
                <FiHeart size={13} /> {likes.length} Liked Songs
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="profile__actions">
          <button type="button" className="profile__btn-edit" onClick={openEditor}>
            <FiEdit2 size={14} />
            Edit Profil
          </button>
        </div>

        {/* Content Grid */}
        <div className="profile__content">

          {/* Kolom Kiri */}
          <aside className="profile__sidebar-info">
            <div className="profile__info-card">
              <h2 className="profile__info-card-title">Informasi</h2>
              <ul className="profile__info-list">
                <li className="profile__info-item">
                  <span className="profile__info-icon"><FiMapPin size={14} /></span>
                  <span>{profileUser.location || "Belum diisi"}</span>
                </li>
                <li className="profile__info-item">
                  <span className="profile__info-icon"><FiCalendar size={14} /></span>
                  <span>{profileUser.createdAt ? new Date(profileUser.createdAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" }) : "Tanggal bergabung tidak tersedia"}</span>
                </li>
              </ul>
            </div>

            <div className="profile__info-card">
              <h2 className="profile__info-card-title">Bio</h2>
              <p className="profile__bio-text">
                {profileUser.bio || "Pendengar musik aktif yang suka eksplorasi playlist baru setiap hari."}
              </p>
            </div>

            <div className="profile__stats-row">
              <div className="profile__stat">
                <span className="profile__stat-icon profile__stat-icon--purple">
                  <FiMusic size={16} />
                </span>
                  <p className="profile__stat-value">{playlists.length}</p>
                <p className="profile__stat-label">Playlists</p>
              </div>
              <div className="profile__stat">
                <span className="profile__stat-icon profile__stat-icon--green">
                  <FiHeart size={16} />
                </span>
                  <p className="profile__stat-value">{likes.length}</p>
                <p className="profile__stat-label">Liked Songs</p>
              </div>
            </div>
          </aside>

          {/* Kolom Kanan */}
          <section className="profile__main">
            <h2 className="profile__section-title">Aktivitas Terbaru</h2>
            <ul className="profile__activity-list" role="list">
              {[
                ...playlists.slice(0, 3).map((playlist) => ({
                  title: playlist.name,
                  sub: `Playlist · ${playlist.updatedAt ? new Date(playlist.updatedAt).toLocaleDateString("id-ID") : "Baru saja"}`,
                })),
              ].map((item) => (
                <li key={item.title} className="profile__activity-item">
                  <div className="profile__activity-thumb">
                    <FiMusic size={16} />
                  </div>
                  <div className="profile__activity-info">
                    <p className="profile__activity-title">{item.title}</p>
                    <p className="profile__activity-sub">{item.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

        </div>

        {isEditing ? (
          <div className="profile__modal" role="dialog" aria-modal="true" aria-label="Edit profil">
            <form className="profile__modalCard" onSubmit={saveProfile}>
              <div className="profile__modalHead">
                <h2 className="profile__info-card-title">Edit Profil</h2>
                <button type="button" className="profile__btn-edit" onClick={() => setIsEditing(false)} aria-label="Tutup editor">
                  <FiX size={14} />
                </button>
              </div>

              <label className="profile__field">
                <span>Username</span>
                <input
                  value={editForm.username}
                  onChange={(event) => setEditForm((current) => ({ ...current, username: event.target.value }))}
                  className="profile__input"
                  required
                />
              </label>

              <label className="profile__field">
                <span>Email</span>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(event) => setEditForm((current) => ({ ...current, email: event.target.value }))}
                  className="profile__input"
                  required
                />
              </label>

              <label className="profile__field">
                <span>Lokasi</span>
                <input
                  value={editForm.location}
                  onChange={(event) => setEditForm((current) => ({ ...current, location: event.target.value }))}
                  className="profile__input"
                  placeholder="Misalnya Jakarta, Indonesia"
                />
              </label>

              <div className="profile__modalActions">
                <button type="button" className="profile__btn-edit" onClick={() => setIsEditing(false)}>
                  Batal
                </button>
                <button type="submit" className="profile__btn-edit" disabled={isSaving}>
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default ProfilePage;
