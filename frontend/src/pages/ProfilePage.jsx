import { useEffect, useState } from "react";
import { FiMusic, FiHeart, FiEdit2, FiMapPin, FiCalendar, FiX, FiUser, FiMail, FiFileText } from "react-icons/fi";
import { useFetch } from "../hooks/useFetch.js";
import { handleLogout } from "../api/client.js";
import SidebarSetup from "../components/SidebarSetup.jsx";
import { authApi } from "../api/auth.js";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
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
    if (!editForm.username.trim()) { setSaveError("Username cannot be empty."); return; }
    if (!editForm.email.trim())    { setSaveError("Email cannot be empty."); return; }
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
      setSaveError(err.message || "Failed to load your profile. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const joinDate = profileUser.createdAt
    ? new Date(profileUser.createdAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    : "–";

  const initial = (profileUser.username || "P").slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-[#ffffff] relative overflow-x-hidden">
      <SidebarSetup handleLogout={() => handleLogout(setIsSidebarOpen, navigate)} />

      <div className="relative z-10 max-w-[960px] mx-auto padding px-6 pt-12 pb-20">

        <div className="flex items-end gap-6 pt-8 pb-6 border-b border-white/7">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7c6af7] to-[#c8f560] flex items-center justify-center text-[36px] font-bold flex-shrink-0 shadow-[0_8px_32px_rgba(124,106,247,0.35)]">
            {initial}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40">Public profile</span>
            <h1 className="text-[42px] font-extrabold line-height leading-[1.1] tracking-[-0.02em] m-0 text-white max-sm:text-[28px]">
              {profileUser.username || "Peartone User"}
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1.25 text-[13px] text-white/45"><FiMusic size={13} /> {playlists.length} Playlist</span>
              <span className="flex items-center gap-1.25 text-[13px] text-white/45"><FiHeart size={13} /> {likes.length} Liked Songs</span>
            </div>
          </div>
        </div>

        <div className="py-4 border-b border-white/7">
          <button 
            type="button" 
            className="inline-flex items-center gap-1.5 px-[18px] py-2 rounded-full border border-white/20 bg-transparent text-white/70 text-[13px] font-medium cursor-pointer transition-all duration-150 hover:border-white/60 hover:text-white hover:bg-white/5" 
            onClick={openEditor}
          >
            <FiEdit2 size={14} /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-[260px_1fr] gap-6 mt-7 items-start max-md:grid-cols-1">
          <aside className="flex flex-col gap-3">
            <div className="bg-white/4 border border-white/8 rounded-2xl px-4.5 py-4">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/35 m-0 mb-3">Information</h2>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                <li className="flex items-center gap-2 text-[13px] text-white/60">
                  <span className="text-white/35 flex"><FiMapPin size={14} /></span>
                  <span>{profileUser.location || "Not Filled"}</span>
                </li>
                <li className="flex items-center gap-2 text-[13px] text-white/60">
                  <span className="text-white/35 flex"><FiCalendar size={14} /></span>
                  <span>{joinDate}</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white/4 border border-white/8 rounded-2xl p-3.5 flex flex-col gap-1.5">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#7c6af7]/18 text-[#a89ef7]"><FiMusic size={16} /></span>
                <p className="text-2xl font-bold m-0 leading-none">{playlists.length}</p>
                <p className="text-[11px] text-white/40 m-0">Playlists</p>
              </div>
              <div className="bg-white/4 border border-white/8 rounded-2xl p-3.5 flex flex-col gap-1.5">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#c8f560]/12 text-[#c8f560]"><FiHeart size={16} /></span>
                <p className="text-2xl font-bold m-0 leading-none">{likes.length}</p>
                <p className="text-[11px] text-white/40 m-0">Liked Songs</p>
              </div>
            </div>
          </aside>

          <section className="flex flex-col gap-4">
            <div className="bg-white/4 border border-white/8 rounded-[18px] p-[18px_20px_20px]">
              <div className="flex items-center justify-between gap-3 mb-3.5">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/35 m-0">Bio</h2>
                <button 
                  type="button" 
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#c8f560]/20 bg-[#c8f560]/08 text-[#c8f560] text-xs font-bold cursor-pointer transition-all duration-150 hover:translate-y-[-1px] hover:bg-[#c8f560]/12 hover:border-[#c8f560]/35" 
                  onClick={openEditor} 
                  aria-label="Edit bio"
                >
                  <FiEdit2 size={12} /> Edit Bio
                </button>
              </div>
              <p className="text-sm text-white/72 leading-relaxed m-0">
                {profileUser.bio || "Fan of Michael Jackson."}
              </p>
            </div>
          </section>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Edit profil">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[6px] cursor-default" onClick={closeEditor} />

          <form className="relative z-10 w-full max-w-[440px] bg-[#1a1a1e] border border-white/8 rounded-2xl p-6 shadow-[0_24px_64px_rgba(0,0,0,0.6)] flex flex-col gap-5 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent max-sm:p-[20px_16px] max-sm:rounded-xl" onSubmit={saveProfile} noValidate>
            <div className="flex items-center justify-between">
              <h2 className="margin m-0 text-th-lg text-lg font-extrabold text-white">Edit Profile</h2>
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-white/7 text-white/50 cursor-pointer transition-colors duration-150 hover:bg-white/12 hover:text-white"
                onClick={closeEditor}
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="flex justify-center">
              <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#7c6af7] to-[#c8f560] flex items-center justify-center text-[28px] font-extrabold text-white shadow-[0_8px_24px_rgba(124,106,247,0.4)]">
                {editForm.username.slice(0, 1).toUpperCase() || initial}
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              <label className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white/40">
                  <FiUser size={13} /> Username
                </span>
                <input
                  className="w-full p-[11px_14px] rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none transition-all duration-150 placeholder:text-white/25 box-border focus:border-[#c8f560]/45 focus:bg-white/7"
                  value={editForm.username}
                  onChange={handleChange("username")}
                  placeholder="Your Username"
                  required
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white/40">
                  <FiMail size={13} /> Email
                </span>
                <input
                  type="email"
                  className="w-full p-[11px_14px] rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none transition-all duration-150 placeholder:text-white/25 box-border focus:border-[#c8f560]/45 focus:bg-white/7"
                  value={editForm.email}
                  onChange={handleChange("email")}
                  placeholder="example@gmail.com"
                  required
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white/40">
                  <FiMapPin size={13} /> Location
                </span>
                <input
                  className="w-full p-[11px_14px] rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none transition-all duration-150 placeholder:text-white/25 box-border focus:border-[#c8f560]/45 focus:bg-white/7"
                  value={editForm.location}
                  onChange={handleChange("location")}
                  placeholder="Jakarta, Indonesia"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white/40">
                  <FiFileText size={13} /> Bio
                </span>
                <textarea
                  className="w-full p-[11px_14px] rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none transition-all duration-150 placeholder:text-white/25 box-border focus:border-[#c8f560]/45 focus:bg-white/7 resize-y min-h-[80px] font-inherit leading-normal"
                  value={editForm.bio}
                  onChange={handleChange("bio")}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </label>
            </div>

            {saveError && (
              <p className="m-0 p-[10px_14px] rounded-lg bg-[#ff5c6e]/10 border border-[#ff5c6e]/25 text-[#ff8b85] text-xs">{saveError}</p>
            )}

            <div className="flex gap-2.5 justify-end max-sm:flex-col-reverse">
              <button
                type="button"
                className="inline-flex items-center justify-center p-[10px_20px] rounded-full text-xs font-bold cursor-pointer border border-white/10 bg-white/7 text-white/60 transition-all duration-150 hover:not-disabled:bg-white/11 hover:not-disabled:text-white disabled:opacity-55 disabled:cursor-not-allowed max-sm:w-full"
                onClick={closeEditor}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center p-[10px_20px] rounded-full text-xs font-bold cursor-pointer border-none bg-[#c8f560] text-[#0d0d0f] transition-all duration-150 hover:not-disabled:bg-[#d4f770] hover:not-disabled:translate-y-[-1px] active:not-disabled:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed max-sm:w-full"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default ProfilePage;