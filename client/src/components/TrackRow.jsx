import { FiTrash2, FiAlertTriangle } from "react-icons/fi";

const TrackRow = ({ track, artistNames, isPendingDelete, confirmDelete, deleting, setConfirmDeleteId, mins, secs}) => {
    return (
    <div key={track.id}>
        <div
            className={`
            flex items-center gap-[14px] px-[14px] py-[10px] border transition-all duration-[160ms]
            ${isPendingDelete
                ? "bg-[rgba(255,92,110,0.05)] border-[rgba(255,92,110,0.3)] rounded-[14px_14px_0_0]"
                : "bg-white/[0.03] border-white/[0.07] rounded-[14px] hover:bg-white/[0.06]"
            }
            `}
        >
            {track.coverUrl ? (
            <img
                src={track.coverUrl}
                alt={track.title}
                className="w-[52px] h-[52px] rounded-lg object-cover shrink-0"
            />
            ) : (
            <div className="w-[52px] h-[52px] rounded-lg bg-white/[0.08] shrink-0 flex items-center justify-center text-xl">
                🎵
            </div>
            )}

            <div className="flex-1 min-w-0">
            <p className="m-0 text-[14px] font-semibold text-white truncate">{track.title}</p>
            <p className="m-0 mt-[3px] text-[12px] text-white/50 truncate">
                {artistNames}{track.Album?.title ? ` · ${track.Album.title}` : ""}
            </p>
            </div>

            <span className="text-[11px] font-medium px-[10px] py-1 rounded-full bg-[rgba(200,245,96,0.1)] border border-[rgba(200,245,96,0.25)] text-[#c8f560] shrink-0 capitalize">
            {track.genre}
            </span>

            <span className="text-[12px] text-white/40 shrink-0 tabular-nums min-w-[36px] text-right">
            {mins}:{secs}
            </span>

            <button
            type="button"
            onClick={() => setConfirmDeleteId(isPendingDelete ? null : track.id)}
            className={`
                shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border cursor-pointer transition-all duration-150
                ${isPendingDelete
                ? "bg-[rgba(255,92,110,0.2)] border-[rgba(255,92,110,0.5)] text-[#ff8b85]"
                : "bg-white/[0.05] border-white/10 text-white/40 hover:bg-white/10 hover:text-white/70"
                }
            `}
            aria-label="Delete track"
            >
            <FiTrash2 size={14} />
            </button>
        </div>

        {isPendingDelete && (
            <div className="flex items-center justify-between gap-3 px-[14px] py-[10px] bg-[rgba(255,92,110,0.08)] border border-[rgba(255,92,110,0.3)] border-t-0 rounded-[0_0_14px_14px]">
            <div className="flex items-center gap-2">
                <FiAlertTriangle size={14} className="text-[#ff8b85] shrink-0" />
                <span className="text-[12px] text-white/70">
                Do you want to delete this track? Action cannot be reverted.
                </span>
            </div>
            <div className="flex gap-2 shrink-0">
                <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="text-[12px] px-3 py-[5px] rounded-lg border border-white/12 bg-white/[0.06] text-white/60 cursor-pointer hover:bg-white/10 transition-colors"
                >
                Cancel
                </button>
                <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="text-[12px] px-3 py-[5px] rounded-lg border border-[rgba(255,92,110,0.4)] bg-[rgba(255,92,110,0.2)] text-[#ff8b85] font-medium cursor-pointer disabled:cursor-wait hover:bg-[rgba(255,92,110,0.3)] transition-colors"
                >
                {deleting ? "Deleting…" : "Delete"}
                </button>
            </div>
            </div>
        )}
    </div>
    );
};

export default TrackRow;