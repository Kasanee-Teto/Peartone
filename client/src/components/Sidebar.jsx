import { NavLink } from "react-router-dom";
import {
  FiHome, FiTrendingUp, FiMic, FiDisc, FiList, FiClock, FiHeart,
  FiUploadCloud, FiUser, FiLogOut, FiMusic,
} from "react-icons/fi";

const itemBase =
  "flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[0.95rem] font-medium transition";
const itemIdle = "bg-transparent text-white/60 hover:bg-white/5 hover:text-white";
const itemActive = "bg-lime-300 text-black font-semibold shadow-[0_4px_15px_rgba(200,245,96,0.3)]";

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const navClass = ({ isActive }) => `${itemBase} ${isActive ? itemActive : itemIdle}`;

  return (
    <aside
      id="home-sidebar"
      aria-label="Sidebar"
      aria-hidden={!isOpen}
      className={`fixed left-0 top-0 z-[600] flex h-screen w-[260px] flex-col overflow-y-auto border-r border-white/10 bg-[#0d0d0f] px-5 pb-5 shadow-[10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-[110%]"}`}
    >
      <div className="shrink-0 px-3 pb-3 pt-5 text-[1.2rem] font-black tracking-[0.1em] text-lime-300">
        PEARTONE
      </div>

      <nav className="flex flex-col" aria-label="Navigasi Utama">
        <p className="px-3 pb-1.5 pt-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/30">Discover</p>
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
          <li><NavLink to="/" end onClick={onClose} className={navClass}><FiHome className="shrink-0 text-[1.2rem]" /><span>Home</span></NavLink></li>
          <li><NavLink to="/tracks" onClick={onClose} className={navClass}><FiMusic className="shrink-0 text-[1.2rem]" /><span>All Tracks</span></NavLink></li>
          <li><NavLink to="/charts" onClick={onClose} className={navClass}><FiTrendingUp className="shrink-0 text-[1.2rem]" /><span>Top Charts</span></NavLink></li>
          <li><NavLink to="/artists" onClick={onClose} className={navClass}><FiMic className="shrink-0 text-[1.2rem]" /><span>Artists</span></NavLink></li>
          <li><NavLink to="/albums" onClick={onClose} className={navClass}><FiDisc className="shrink-0 text-[1.2rem]" /><span>Albums</span></NavLink></li>
        </ul>

        <p className="mt-3 border-t border-white/10 px-3 pb-1.5 pt-4 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/30">Library</p>
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
          <li><NavLink to="/playlists" onClick={onClose} className={navClass}><FiList className="shrink-0 text-[1.2rem]" /><span>Playlists</span></NavLink></li>
          <li><NavLink to="/liked" onClick={onClose} className={navClass}><FiHeart className="shrink-0 text-[1.2rem]" /><span>Liked Songs</span></NavLink></li>
          <li><NavLink to="/history" onClick={onClose} className={navClass}><FiClock className="shrink-0 text-[1.2rem]" /><span>History</span></NavLink></li>
        </ul>

        <p className="mt-3 border-t border-white/10 px-3 pb-1.5 pt-4 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/30">Account</p>
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
          <li><NavLink to="/admin" onClick={onClose} className={navClass}><FiUploadCloud className="shrink-0 text-[1.2rem]" /><span>Admin Upload</span></NavLink></li>
          <li><NavLink to="/profile" onClick={onClose} className={navClass}><FiUser className="shrink-0 text-[1.2rem]" /><span>Profile</span></NavLink></li>
          <li>
            <button
              type="button"
              className={`${itemBase} ${itemIdle}`}
              onClick={() => {
                onClose?.();
                onLogout?.();
              }}
            >
              <FiLogOut className="shrink-0 text-[1.2rem]" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;