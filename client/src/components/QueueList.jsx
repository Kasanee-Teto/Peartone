import { FiPlay, FiTrash2 } from "react-icons/fi";

const QueueList = ({ queue = [], currentIndex = 0, onPlay, onRemove, onClear }) => {
  return (
    <div className="absolute bottom-[92px] right-6 z-[500] w-[320px] max-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-[#0d0d0ff5] text-white shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b border-white/10 px-[14px] py-3">
        <strong>Queue</strong>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          onClick={onClear}
          title="Clear"
        >
          <FiTrash2 />
        </button>
      </div>

      <div className="max-h-[300px] overflow-y-auto p-2">
        {queue.length === 0 ? (
          <div className="p-4 text-center text-white/50">Queue kosong</div>
        ) : (
          queue.map((t, i) => (
            <div
              key={`${t.title}-${i}`}
              className={`mb-1.5 flex items-center justify-between gap-3 rounded-md p-2 ${i === currentIndex ? "bg-lime-300/10" : ""}`}
            >
              <div className="min-w-0 overflow-hidden">
                <div className="truncate text-[13px] font-semibold">{t.title}</div>
                <div className="truncate text-[11px] text-white/50">{t.artist}</div>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                  onClick={() => onPlay(i)}
                  title="Play"
                >
                  <FiPlay />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-red-300 hover:bg-red-300/15 hover:text-red-200"
                  onClick={() => onRemove(i)}
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QueueList;