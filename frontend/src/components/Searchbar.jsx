import { useEffect, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

const SearchBar = ({ onSearch, onClear }) => {
  const [query, setQuery] = useState("");
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) {
      onClear?.();
      return;
    }
    debounceRef.current = setTimeout(() => onSearch(query.trim()), 400);
    return () => clearTimeout(debounceRef.current);
  }, [query, onSearch, onClear]);

  const handleClear = () => {
    setQuery("");
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <FiSearch
        size={17}
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/45"
      />

      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for title, artist, and album"
        aria-label="Search for songs"
        autoComplete="off"
        spellCheck={false}
        className="
          w-full appearance-none rounded-2xl border border-white/15 bg-white/5
          py-3 pl-12 pr-11 text-sm text-white placeholder:text-white/40
          outline-none transition
          focus:border-[#c8f560]/60 focus:ring-2 focus:ring-[#c8f560]/25
        "
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Remove search"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <FiX size={15} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;