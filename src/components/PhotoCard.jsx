/**
 * PhotoCard.jsx
 * 
 * Renders an individual photo item with responsive aspect ratio,
 * lazy-loaded image, author attribution, and an accessible favourite toggle button.
 */

import { useState } from 'react';

export function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Optimized Picsum image URL for high quality without giant multi-megabyte payloads
  const displayUrl = `https://picsum.photos/id/${photo.id}/700/525`;
  const fallbackUrl = photo.download_url;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-800/90 border transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 ${
        isFavourite
          ? 'border-rose-400/80 dark:border-rose-500/70 ring-2 ring-rose-400/20 dark:ring-rose-500/20'
          : 'border-zinc-200/80 dark:border-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600'
      }`}
    >
      {/* Photo Container with fixed 4:3 Aspect Ratio to eliminate Layout Shifts (CLS) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {/* Placeholder skeleton while image is loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-200/70 dark:bg-zinc-800 animate-pulse">
            <svg
              className="w-8 h-8 text-zinc-400 dark:text-zinc-600"
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
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}

        {/* Actual Image */}
        <img
          src={imageError ? fallbackUrl : displayUrl}
          alt={`Photo by ${photo.author}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            if (!imageError) {
              setImageError(true);
            }
          }}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />

        {/* Subtle Dark Gradient Overlay at the top for badge contrast */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent opacity-60 pointer-events-none" />

        {/* Favourite Heart Button */}
        <button
          type="button"
          onClick={() => onToggleFavourite(photo.id)}
          aria-pressed={isFavourite}
          aria-label={
            isFavourite
              ? `Remove photo by ${photo.author} from favourites`
              : `Add photo by ${photo.author} to favourites`
          }
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 shadow-md ${
            isFavourite
              ? 'bg-rose-500 text-white shadow-rose-500/30 scale-105 hover:bg-rose-600'
              : 'bg-black/35 hover:bg-black/55 text-white/90 hover:text-white hover:scale-110'
          }`}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              isFavourite ? 'fill-current scale-110' : 'fill-none stroke-current'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={isFavourite ? 0 : 2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Favourite Tag Indicator */}
        {isFavourite && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/95 text-white shadow-sm flex items-center gap-1 backdrop-blur-xs">
            <svg
              className="w-3 h-3 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>Favourited</span>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800/90">
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">
            Photographer
          </p>
          <h3
            title={photo.author}
            className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate mt-0.5"
          >
            {photo.author}
          </h3>
        </div>

        {/* External Link to Unsplash/Picsum original */}
        <a
          href={photo.url || photo.download_url}
          target="_blank"
          rel="noopener noreferrer"
          title="View original on web"
          aria-label={`View original photo by ${photo.author} in a new tab`}
          className="p-2 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
      </div>
    </article>
  );
}

export default PhotoCard;
