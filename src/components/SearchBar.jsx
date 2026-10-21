/**
 * SearchBar.jsx
 * 
 * Provides an accessible, styled search input to filter photos by author.
 * Includes a search icon, a clear-input button, and result count stats.
 */

export function SearchBar({
  searchQuery,
  onSearchChange,
  onClearSearch,
  totalCount,
  filteredCount,
}) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-4.5 pointer-events-none text-zinc-400 dark:text-zinc-500">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          id="author-search"
          type="text"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search photos by author name..."
          aria-label="Search photos by author name"
          autoComplete="off"
          spellCheck="false"
          className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:ring-indigo-400/40 dark:focus:border-indigo-400 transition-all text-base"
        />

        {/* Clear Button (Visible when searchQuery is non-empty) */}
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            aria-label="Clear search query"
            className="absolute right-3.5 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search feedback / match count */}
      {searchQuery.trim() && (
        <div className="mt-2.5 px-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            Found <strong className="font-semibold text-zinc-800 dark:text-zinc-200">{filteredCount}</strong>{' '}
            {filteredCount === 1 ? 'photo' : 'photos'} matching &ldquo;{searchQuery}&rdquo;
          </span>
          <span>out of {totalCount} total</span>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
