/**
 * App.jsx
 * 
 * Root component for SnapGrid - React Photo Gallery.
 * Coordinates photo fetching, author search filtering, favourite management,
 * and responsive presentation states (loading skeleton, error retry, empty states).
 */

import { useState, useEffect, useReducer, useCallback, useMemo, useRef } from 'react';
import { useFetchPhotos } from './hooks/useFetchPhotos';
import {
  favouritesReducer,
  favouritesInitializer,
  FavouritesActionTypes,
  FAVOURITES_STORAGE_KEY,
} from './reducers/favouritesReducer';
import { SearchBar } from './components/SearchBar';
import { PhotoGrid } from './components/PhotoGrid';

export function App() {
  // 1. Custom hook for API data fetching (uses useState, useEffect, AbortController)
  const { photos, loading, error, retry } = useFetchPhotos();

  // 2. State for search query and favourite filter toggle
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);

  // 3. Reducer for favourites state management (with lazy initializer from localStorage)
  const [favourites, dispatchFavourites] = useReducer(
    favouritesReducer,
    [],
    favouritesInitializer
  );

  // 4. Safely synchronise favourite state changes to localStorage
  // Avoids writing redundant updates during initial render
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(
          FAVOURITES_STORAGE_KEY,
          JSON.stringify(favourites)
        );
      }
    } catch (err) {
      console.error('SnapGrid: Failed to persist favourites to localStorage', err);
    }
  }, [favourites]);

  // 5. Stable search input change handler using useCallback
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Stable handler to clear the search query
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Stable handler to toggle a photo's favourite status
  const handleToggleFavourite = useCallback((photoId) => {
    dispatchFavourites({
      type: FavouritesActionTypes.TOGGLE,
      payload: photoId,
    });
  }, []);

  // 6. Memoized filtered photo list using useMemo
  // Filters case-insensitively by author name without issuing extra API requests
  const filteredPhotos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const favouritesSet = new Set(favourites);

    return photos.filter((photo) => {
      // If "Show Favourites Only" is active, exclude non-favourited photos
      if (showFavouritesOnly && !favouritesSet.has(String(photo.id))) {
        return false;
      }

      // Filter by author name if a query is present
      if (!query) {
        return true;
      }
      return photo.author.toLowerCase().includes(query);
    });
  }, [photos, searchQuery, showFavouritesOnly, favourites]);

  // Count of favourites that exist within the loaded photos
  const favouriteCount = favourites.length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header & Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-zinc-200 dark:to-indigo-300 bg-clip-text text-transparent">
                SnapGrid
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Curated High-Resolution Photography
              </p>
            </div>
          </div>

          {/* Header Action: Favourite Counter & Quick Filter */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowFavouritesOnly((prev) => !prev)}
              aria-pressed={showFavouritesOnly}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                showFavouritesOnly
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <svg
                className={`w-4 h-4 ${
                  favouriteCount > 0 ? 'fill-rose-500 text-rose-500' : 'fill-none stroke-current'
                } ${showFavouritesOnly ? 'text-white fill-white' : ''}`}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <span>{showFavouritesOnly ? 'Showing Favourites' : 'Favourites'}</span>
              <span
                className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                  showFavouritesOnly
                    ? 'bg-rose-700/60 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                {favouriteCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Gallery Hero Title and Description */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Explore 30 Featured Photos
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Browse through 30 handpicked photographs from the Picsum catalog.
            Instant author search, zero layout shifts, and favourites saved locally.
          </p>
        </div>

        {/* Search Bar Component */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          totalCount={photos.length}
          filteredCount={filteredPhotos.length}
        />

        {/* Active Filter Pill when Favourites Only is enabled */}
        {showFavouritesOnly && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-xs bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 px-3 py-1 rounded-full flex items-center gap-2">
              Viewing only {favouriteCount} favourited {favouriteCount === 1 ? 'photo' : 'photos'}
              <button
                type="button"
                onClick={() => setShowFavouritesOnly(false)}
                className="hover:text-rose-900 dark:hover:text-rose-100 font-bold ml-1"
                aria-label="Show all photos"
              >
                ✕
              </button>
            </span>
          </div>
        )}

        {/* State 1: Loading Skeleton Grid */}
        {loading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
            aria-live="polite"
            aria-busy="true"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="overflow-hidden rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-800 shadow-sm animate-pulse"
              >
                {/* 4:3 Aspect Ratio Placeholder */}
                <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-800" />
                {/* Meta details placeholder */}
                <div className="p-4 space-y-2">
                  <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* State 2: Error with Retry Button */}
        {!loading && error && (
          <div
            className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-center shadow-sm"
            role="alert"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6"
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
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-red-900 dark:text-red-200 mb-1">
              Failed to load photos
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300/90 mb-5">
              {error}
            </p>
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium text-sm shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            >
              <svg
                className="w-4 h-4"
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
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Retry Request
            </button>
          </div>
        )}

        {/* State 3: Normal Gallery Grid (Responsive 4 cols desktop / 2 tablet / 1 mobile) */}
        {!loading && !error && (
          <PhotoGrid
            photos={filteredPhotos}
            favourites={favourites}
            onToggleFavourite={handleToggleFavourite}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>
          SnapGrid &bull; Powered by React, Vite, Tailwind CSS &amp; Picsum Photos API
        </p>
      </footer>
    </div>
  );
}

export default App;
