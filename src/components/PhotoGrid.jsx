/**
 * PhotoGrid.jsx
 * 
 * Displays photos in a responsive grid layout:
 * - Desktop: 4 columns
 * - Tablet: 2 columns
 * - Mobile: 1 column
 * Handles empty search results with a friendly clear-search prompt.
 */

import { PhotoCard } from './PhotoCard';

export function PhotoGrid({
  photos,
  favourites,
  onToggleFavourite,
  searchQuery,
  onClearSearch,
}) {
  // Empty state when search produces no matching photos
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-4 shadow-inner">
          <svg
            className="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          No photos found
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          {searchQuery
            ? `We couldn't find any photographer matching "${searchQuery}". Check the spelling or try a different name.`
            : 'No photos are currently available.'}
        </p>
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Search Filter
          </button>
        )}
      </div>
    );
  }

  // Set-based lookup for O(1) favourite status checks
  const favouritesSet = new Set(favourites);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
      role="region"
      aria-label="Photo gallery grid"
    >
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          isFavourite={favouritesSet.has(String(photo.id))}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  );
}

export default PhotoGrid;
