import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";

const SidebarSetup = ({ handleLogout, showPlaylist }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    return (
        <>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-[-64px] left-[-128px] w-[500px] h-[500px] rounded-full bg-[#7c6af7] opacity-7 filter blur-[140px]" />
            <div className="absolute bottom-[-80px] right-0 w-[384px] h-[384px] rounded-full bg-[#c8f560] opacity-6 filter blur-[140px]" />
        ` </div>

          <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onLogout={handleLogout}
              
              inert={!isSidebarOpen}
              onPlaylist={showPlaylist ? () => { showPlaylist(); setIsSidebarOpen(false); } : undefined}
          />
    
          <button
              className={`fixed inset-0 bg-black/55 z-40 transition-opacity duration-250 ease-in-out ${
              isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
              type="button"
              aria-label="Close Sidebar"
              onClick={() => setIsSidebarOpen(false)}
          />

          <button
              className="fixed top-6 right-6 z-45 inline-flex items-center justify-center bg-[#222228] text-[#c8f560] border border-white/5 rounded-[9px] px-[18px] py-2.5 cursor-pointer transition-all duration-150 ease-in-out hover:bg-[#c8f560] hover:text-[#0d0d0f] hover:-translate-y-[1px]"
              type="button"
              aria-label="Open Sidebar"
              aria-controls="home-sidebar"
              aria-expanded={isSidebarOpen}
              onClick={() => setIsSidebarOpen(true)}
          >
              ≡
          </button>
      </>
    );
};

export default SidebarSetup;