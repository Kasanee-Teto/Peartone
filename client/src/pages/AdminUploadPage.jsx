import { useNavigate } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";
import { useFetch } from "../hooks/useFetch";
import SidebarSetup from "../components/SidebarSetup";
import { API_BASE, authFetch, handleLogout } from "../api/client";
import { GENRES } from "../constants/genre";
import CustomSelect from "../components/CustomSelect";
import { useAdminTracks } from "../hooks/useAdminTracks";
import { formatDuration } from "../utils/format";
import AdminTrackRow from "../components/AdminTrackRow";

const AdminUploadPage = () => {
  const navigate = useNavigate();
  const {
    tracks,
    title,
    genre,
    selectedArtistIds,
    album,
    audioFile,
    coverFile,
    uploading,
    uploadMsg,
    isSuccess,
    confirmDeleteId,
    deleting,
    canSubmit,
    setFormField,
    setConfirmDeleteId,
    onSubmit,
    confirmDelete,
  } = useAdminTracks();

  const { data: artistsResp } = useFetch("/artists");
  const { data: albumsResp } = useFetch("/albums");
  const artists = Array.isArray(artistsResp) ? artistsResp : artistsResp?.data || [];
  const albums = Array.isArray(albumsResp) ? albumsResp : albumsResp?.data || [];

  const audioName = audioFile?.name ?? "No File Chosen";
  const coverName = coverFile?.name ?? "No File Chosen";

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d0d0f] text-white" aria-label="Admin Upload">

      <SidebarSetup handleLogout={handleLogout} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24">

        <header className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-7 mb-[18px]">
          <div>
            <p className="m-0 mb-2 text-[10px] font-[800] uppercase tracking-[0.18em] text-white/30">Admin</p>
            <h1 className="m-0 text-[clamp(44px,8vw,56px)] font-[900] leading-none tracking-[-0.03em] text-white">
              Upload Track
            </h1>
            <p className="mt-3 mb-0 max-w-[520px] text-[13px] leading-relaxed text-white/45">
              Upload track to platform. Fill out all the fields needed.
            </p>
          </div>
        </header>

        {uploadMsg && (
          <div
            className={`
              px-4 py-3 rounded-xl mb-4 border text-[13px]
              ${isSuccess
                ? "bg-[rgba(30,215,96,0.1)] border-[rgba(30,215,96,0.25)] text-[#1ed760]"
                : "bg-[rgba(255,92,110,0.1)] border-[rgba(255,92,110,0.25)] text-[#ff8b85]"
              }
            `}
          >
            {uploadMsg}
          </div>
        )}

        <form
          className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-[18px]"
          onSubmit={onSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-white/50">Title *</span>
              <input
                className="w-full px-3 py-[10px] rounded-xl border border-white/10 bg-white/[0.04] outline-none text-white/90 text-[13px] placeholder:text-white/45 focus:border-white/20 focus:bg-white/[0.07] transition-all"
                value={title}
                onChange={(e) => setFormField("title", e.target.value)}
                placeholder="Insert Song Title"
                required
              />
            </label>

            <div className="flex flex-col gap-2 md:col-span-2">
              <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-white/50">Genre *</span>
              <div className="flex flex-wrap gap-2 p-3 bg-white/[0.04] border border-white/10 rounded-xl">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormField("genre", g)}
                    className={`
                      px-[14px] py-[6px] rounded-[20px] text-xs font-medium cursor-pointer transition-all duration-150
                      ${genre === g
                        ? "border border-[rgba(200,245,96,0.5)] bg-[rgba(200,245,96,0.15)] text-[#c8f560]"
                        : "border border-white/12 bg-white/[0.06] text-white/65 hover:bg-white/10 hover:text-white/80"
                      }
                    `}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-white/50">
                Artist * (choose min. 1)
              </span>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 max-h-[200px] overflow-auto p-3 border border-white/10 rounded-xl bg-white/[0.04]">
                {artists.length === 0 ? (
                  <span className="text-white/40 text-[13px]">
                    No artist. Add artist at Artists.
                  </span>
                ) : artists.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2 text-[13px] cursor-pointer ${selectedArtistIds.includes(item.id) ? "text-[#c8f560]" : "text-white/70"}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedArtistIds.includes(item.id)}
                      onChange={(e) => {
                          const updatedIds = e.target.checked
                            ? [...selectedArtistIds, item.id]
                            : selectedArtistIds.filter((id) => id !== item.id);
                          setFormField("selectedArtistIds",   updatedIds);
                        }
                      }
                      className="accent-[#c8f560]"
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-white/50">Album (optional)</span>
              <CustomSelect value={album} onChange={(val) => setFormField("album", val)} options={albums} placeholder="Without album" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-white/50">
                File Audio * (MP3, WAV, OGG, FLAC — max 50 MB)
              </span>
              <label className="grid grid-cols-[auto_1fr] items-center gap-[10px] p-[10px_12px] rounded-xl border border-white/10 bg-white/[0.04] cursor-pointer">
                <input
                  type="file"
                  accept="audio/mpeg,audio/wav,audio/ogg,audio/flac,audio/*"
                  onChange={(e) => setFormField("audioFile", e.target.files?.[0] ?? null)}
                  className="absolute w-px h-px opacity-0 pointer-events-none"
                />
                <span className="inline-flex items-center gap-2 px-[10px] py-2 rounded-[10px] border border-[rgba(30,215,96,0.22)] bg-[rgba(30,215,96,0.1)] text-[#1ed760] text-[13px] cursor-pointer select-none">
                  <FiUploadCloud />
                  <span>Choose Audio</span>
                </span>
                <span className="text-white/70 text-[13px] truncate" title={audioName}>{audioName}</span>
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-white/50">
                Cover (optional — JPG, PNG, WEBP)
              </span>
              <label className="grid grid-cols-[auto_1fr] items-center gap-[10px] p-[10px_12px] rounded-xl border border-white/10 bg-white/[0.04] cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setFormField("coverFile", e.target.files?.[0] ?? null)}
                  className="absolute w-px h-px opacity-0 pointer-events-none"
                />
                <span className="inline-flex items-center gap-2 px-[10px] py-2 rounded-[10px] border border-[rgba(30,215,96,0.22)] bg-[rgba(30,215,96,0.1)] text-[#1ed760] text-[13px] cursor-pointer select-none">
                  <FiUploadCloud />
                  <span>Choose Cover</span>
                </span>
                <span className="text-white/70 text-[13px] truncate" title={coverName}>{coverName}</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-[14px] mt-4">
            <button
              className="w-full sm:w-auto px-4 py-[10px] rounded-full font-[900] tracking-[0.02em] cursor-pointer text-[#0d0d0f] bg-[#1ed760] transition-all duration-150 hover:-translate-y-px disabled:opacity-55 disabled:cursor-not-allowed disabled:translate-y-0"
              type="submit"
              disabled={!canSubmit || uploading}
            >
              {uploading ? "Uploading…" : "Upload Track"}
            </button>
            <p className="m-0 text-[12px] text-white/50">
              * Must fill: Title, Genre, Artist, and Audio file.
            </p>
          </div>
        </form>

        <section className="mt-8 rounded-2xl bg-black/25 border border-white/[0.08] p-[18px]" aria-label="Daftar lagu tersimpan">
          <h2 className="m-0 mb-3 text-[14px] font-[800] text-white/85">
            Track saved ({tracks.length})
          </h2>

          {tracks.length === 0 ? (
            <p className="text-white/35 text-[13px] mt-3">No track uploaded.</p>
          ) : (
            <div className="flex flex-col gap-[10px] mt-3">
              {tracks.map((track) => {
                const artistNames = Array.isArray(track.Artists)
                  ? track.Artists.map((a) => a.name).join(", ")
                  : track.artist?.name ?? "—";
                const { mins, secs } = formatDuration(track);
                const isPendingDelete = confirmDeleteId === track.id;

                return (
                  <AdminTrackRow track={track} artistNames={artistNames} isPendingDelete={isPendingDelete} 
                  confirmDelete={confirmDelete} deleting={deleting} mins={mins} secs={secs} setConfirmDeleteId={setConfirmDeleteId} />
                )
        
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminUploadPage;