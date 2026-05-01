import { FiPlay, FiTrash2 } from "react-icons/fi";
import "../styles/QueueList.css";

const QueueList = ({ queue = [], currentIndex = 0, onPlay, onRemove, onClear }) => {
  return (
    <div className="pt-queue">
      <div className="pt-queue__head">
        <strong>Queue</strong>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button type="button" className="pt-btn" onClick={onClear} title="Clear">
            <FiTrash2 />
          </button>
        </div>
      </div>
      <div className="pt-queue__list">
        {queue.length === 0 ? (
          <div className="pt-queue__empty">Queue kosong</div>
        ) : (
          queue.map((t, i) => (
            <div key={`${t.title}-${i}`} className={`pt-queue__item ${i === currentIndex ? "is-current" : ""}`}>
              <div className="pt-queue__meta">
                <div className="pt-queue__title">{t.title}</div>
                <div className="pt-queue__artist">{t.artist}</div>
              </div>
              <div className="pt-queue__actions">
                <button type="button" className="pt-btn" onClick={() => onPlay(i)} title="Play">
                  <FiPlay />
                </button>
                <button type="button" className="pt-btn pt-btn--danger" onClick={() => onRemove(i)} title="Delete">
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
