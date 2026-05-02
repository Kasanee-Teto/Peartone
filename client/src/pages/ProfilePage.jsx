import { useEffect, useState } from "react";
import { FiMusic, FiHeart, FiEdit2, FiMapPin, FiCalendar, FiX, FiUser, FiMail, FiFileText } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/ProfilePage.css";
import { useFetch } from "../hooks/useFetch";
import { authApi } from "../api/auth.js";

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen]   = useState(false);
  const [isEditing, setIsEditing]           = useState(false);
  const [isSaving, setIsSaving]             = useState(false);
  const [saveError, setSaveError]           = useState("");
  const [profileUser, setProfileUser]       = useState(
    () => JSON.parse(localStorage.getItem("pt_user") || "null") || {}
  );
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    location: "",
    bio: "",
  });

  const { data: playlistsResp } = useFetch("/playlists");
  const { data: likesResp }     = useFetch("/likes");
  const playlists = Array.isArray(playlistsResp) ? playlistsResp : playlistsResp?.data || [];
  const likes     = Array.isArray(likesResp)     ? likesResp     : likesResp?.data     || [];

  // Fetch fresh profile on mount
  useEffect(() => {
    let active = true;
    authApi.getProfile()
      .then((res) => {
        const user = res?.data || res;
        if (!active || !user) return;
        setProfileUser(user);
        localStorage.setItem("pt_user", JSON.stringify(user));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  // Sync form when profileUser changes
  useEffect(() => {
    setEditForm({
      username: profileUser.username || "",
      email:    profileUser.email    || "",
      location: profileUser.location || "",
      bio:      profileUser.bio      || "",
    });
  }, [profileUser]);

  const openEditor = () => {
    setSaveError("");
    setIsEditing(true);
  };

  const closeEditor = () => {
    // Reset form ke data saat ini
    setEditForm({
      username: profileUser.username || "",
      email:    profileUser.email    || "",
      location: profileUser.location || "",
      bio:      profileUser.bio      || "",
    });
    setSaveError("");
    setIsEditing(false);
  };

  const handleChange = (field) => (e) =>
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!editForm.username.trim()) { setSaveError("Username tidak boleh kosong."); return; }
    if (!editForm.email.trim())    { setSaveError("Email tidak boleh kosong."); return; }
    setSaveError("");
    setIsSaving(true);
    try {
      const res = await authApi.updateProfile({
        username: editForm.username.trim(),
        email:    editForm.email.trim(),
        location: editForm.location.trim(),
        bio:      editForm.bio.trim(),
      });
      const updated = res?.data || res;
      setProfileUser(updated);
      localStorage.setItem("pt_user", JSON.stringify(updated));
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || "Gagal menyimpan profil. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const joinDate = profileUser.createdAt
    ? new Date(profileUser.createdAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    : "–";

  const initial = (profileUser.username || "P").slice(0, 1).toUpperCase();

  return (
    <main className="profile__page">
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
      >≡</button>

      <div className="profile__container">

        {/* ── Hero ── */}
        <div className="profile__hero">
          <div className="profile__avatar">{initial}</div>
          <div className="profile__hero-info">
            <span className="profile__hero-type">Profil Publik</span>
            <h1 className="profile__hero-name">{profileUser.username || "Peartone User"}</h1>
            <div className="profile__hero-meta">
              <span className="profile__hero-meta-item"><FiMusic size={13} /> {playlists.length} Playlist</span>
              <span className="profile__hero-meta-item"><FiHeart size={13} /> {likes.length} Liked Songs</span>
            </div>
          </div>
        </div>

        {/* ── Action bar ── */}
        <div className="profile__actions">
          <button type="button" className="profile__btn-edit" onClick={openEditor}>
            <FiEdit2 size={14} /> Edit Profil
          </button>
        </div>

        {/* ── Content grid ── */}
        <div className="profile__content">
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
                  <span>{joinDate}</span>
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
                <span className="profile__stat-icon profile__stat-icon--purple"><FiMusic size={16} /></span>
                <p className="profile__stat-value">{playlists.length}</p>
                <p className="profile__stat-label">Playlists</p>
              </div>
              <div className="profile__stat">
                <span className="profile__stat-icon profile__stat-icon--green"><FiHeart size={16} /></span>
                <p className="profile__stat-value">{likes.length}</p>
                <p className="profile__stat-label">Liked Songs</p>
              </div>
            </div>
          </aside>

          <section className="profile__main">
            <h2 className="profile__section-title">Aktivitas Terbaru</h2>
            <ul className="profile__activity-list" role="list">
              {playlists.slice(0, 3).map((playlist) => (
                <li key={playlist.id} className="profile__activity-item">
                  <div className="profile__activity-thumb"><FiMusic size={16} /></div>
                  <div className="profile__activity-info">
                    <p className="profile__activity-title">{playlist.name}</p>
                    <p className="profile__activity-sub">
                      Playlist · {playlist.updatedAt
                        ? new Date(playlist.updatedAt).toLocaleDateString("id-ID")
                        : "Baru saja"}
                    </p>
                  </div>
                </li>
              ))}
              {playlists.length === 0 && (
                <li className="profile__activity-empty">Belum ada aktivitas.</li>
              )}
            </ul>
          </section>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {isEditing && (
        <div className="profile__modal" role="dialog" aria-modal="true" aria-label="Edit profil">
          <div className="profile__modal-backdrop" onClick={closeEditor} />

          <form className="profile__modal-card" onSubmit={saveProfile} noValidate>
            {/* Modal header */}
            <div className="profile__modal-head">
              <h2 className="profile__modal-title">Edit Profil</h2>
              <button
                type="button"
                className="profile__modal-close"
                onClick={closeEditor}
                aria-label="Tutup"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Avatar preview */}
            <div className="profile__modal-avatar">
              <div className="profile__modal-avatar-circle">
                {editForm.username.slice(0, 1).toUpperCase() || initial}
              </div>
            </div>

            {/* Fields */}
            <div className="profile__modal-fields">
              <label className="profile__field">
                <span className="profile__field-label">
                  <FiUser size={13} /> Username
                </span>
                <input
                  className="profile__input"
                  value={editForm.username}
                  onChange={handleChange("username")}
                  placeholder="Username kamu"
                  required
                />
              </label>

              <label className="profile__field">
                <span className="profile__field-label">
                  <FiMail size={13} /> Email
                </span>
                <input
                  type="email"
                  className="profile__input"
                  value={editForm.email}
                  onChange={handleChange("email")}
                  placeholder="email@contoh.com"
                  required
                />
              </label>

              <label className="profile__field">
                <span className="profile__field-label">
                  <FiMapPin size={13} /> Lokasi
                </span>
                <input
                  className="profile__input"
                  value={editForm.location}
                  onChange={handleChange("location")}
                  placeholder="Misalnya Jakarta, Indonesia"
                />
              </label>

              <label className="profile__field">
                <span className="profile__field-label">
                  <FiFileText size={13} /> Bio
                </span>
                <textarea
                  className="profile__input profile__input--textarea"
                  value={editForm.bio}
                  onChange={handleChange("bio")}
                  placeholder="Ceritakan sedikit tentang dirimu..."
                  rows={3}
                />
              </label>
            </div>

            {/* Error */}
            {saveError && (
              <p className="profile__modal-error">{saveError}</p>
            )}

            {/* Actions */}
            <div className="profile__modal-actions">
              <button
                type="button"
                className="profile__modal-btn profile__modal-btn--cancel"
                onClick={closeEditor}
                disabled={isSaving}
              >
                Batal
              </button>
              <button
                type="submit"
                className="profile__modal-btn profile__modal-btn--save"
                disabled={isSaving}
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default ProfilePage;
