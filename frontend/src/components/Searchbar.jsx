import { useEffect, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import "../styles/SearchBar.css";

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
    debounceRef.current = setTimeout(() => {
      onSearch(query.trim());
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function handleClear() {
    setQuery("");
    onClear?.();
    inputRef.current?.focus();
  }

  return (
    <div className="searchbar">
      <FiSearch className="searchbar__icon" size={17} aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari judul lagu, artis, atau album..."
        className="searchbar__input"
        aria-label="Cari lagu"
        autoComplete="off"
        spellCheck={false}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="searchbar__clear"
          aria-label="Hapus pencarian"
        >
          <FiX size={15} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
