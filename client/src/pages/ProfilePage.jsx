import { useState } from "react";
import Sidebar from "../components/Sidebar";

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#7c6af7] opacity-20 blur-[120px]" />
          <div className="absolute bottom-6 right-0 h-72 w-72 rounded-full bg-[#c8f560] opacity-15 blur-[140px]" />
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

        <section className="relative z-10 grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center">
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Profile
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/60 sm:text-base">
              Kelola informasi akun, aktivitas terbaru, dan preferensi musikmu.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur sm:p-8">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Peartone User</h2>
                <p className="mt-1 text-sm text-white/60">peartone@email.com</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#111114] p-4">
                <p className="text-sm text-white/50">Playlists</p>
                <p className="mt-2 text-2xl font-semibold">12</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#111114] p-4">
                <p className="text-sm text-white/50">Liked Songs</p>
                <p className="mt-2 text-2xl font-semibold">84</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-[#111114] p-4">
              <p className="text-sm text-white/50">Bio</p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Pendengar musik aktif yang suka eksplorasi playlist baru setiap hari.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;