# SnapGrid — React Photo Gallery

SnapGrid is a modern, responsive photo gallery web application built with **React**, **Vite**, and **Tailwind CSS**. It fetches and showcases 30 curated high-resolution photographs from the Picsum Photos API, offering instant client-side search by author name, seamless favouriting with persistent storage, zero layout shifts, and graceful error recovery.

---

## Features

- **Photo Fetching**:
  - Automatically fetches exactly 30 high-resolution photos on load from the Picsum Photos API (`https://picsum.photos/v2/list?limit=30`).
  - Handled via a robust custom hook (`useFetchPhotos`) with `AbortController` cancellation for unmounted components.
  - Comprehensive state handling: smooth shimmer skeleton loading, helpful error banners, and an instant **Retry Request** button.

- **Responsive Grid**:
  - **Desktop (>= 1024px)**: 4 columns
  - **Tablet (640px – 1023px)**: 2 columns
  - **Mobile (< 640px)**: 1 column
  - Fixed 4:3 aspect ratio per card with placeholder skeletons to eliminate **Cumulative Layout Shifts (CLS)**.
  - Crisp image presentation with lazy loading (`loading="lazy"`), smooth hover zoom, author attribution, and links to source photos.

- **Instant Author Search**:
  - Case-insensitive search filtering across all photo authors.
  - Executes completely client-side without extra network calls.
  - Dynamic result counters and a clear button for quick reset.
  - User-friendly empty state with an actionable **Clear Search Filter** button when no matching authors are found.

- **Favourites Management & Persistence**:
  - Managed via `useReducer` to maintain a pure, predictable state transition model.
  - Saves favorite photo IDs (not entire photo objects) in `localStorage`.
  - Initialized lazily using `favouritesInitializer` to parse and sanitize saved IDs without performance penalties.
  - Synchronized safely using `useEffect` with error protection against storage quota or privacy restrictions.
  - Survives browser refreshes and tab reloads.
  - Interactive header badge that displays the current favorite count and toggles a **Favourites Only** view.
  - Accessible button states with dynamic `aria-label` and `aria-pressed` attributes.

---

## Tech Stack

- **Core Framework**: React 19 (Functional Components & Hooks only)
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Linter**: Oxlint (fast, lightweight ESLint-compatible rules)
- **Data Source**: [Picsum Photos API](https://picsum.photos/)

---

## Folder Structure

```
snapgrid/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── PhotoCard.jsx   # Individual photo card (image, author, heart toggle)
│   │   ├── PhotoGrid.jsx   # Responsive grid layout and empty search state
│   │   └── SearchBar.jsx   # Accessible search input with clear button & match counts
│   ├── hooks/
│   │   └── useFetchPhotos.js # Custom data-fetching hook with AbortController & retry
│   ├── reducers/
│   │   └── favouritesReducer.js # Reducer and lazy localStorage initializer
│   ├── App.jsx             # Main application orchestrator
│   ├── index.css           # Tailwind CSS imports and base styles
│   └── main.jsx            # Application entry point
├── index.html              # HTML template with metadata and favicon
├── package.json            # Project dependencies and script commands
├── vite.config.js          # Vite configuration with React and Tailwind plugins
└── README.md               # Project documentation
```

---

## React Hooks Used & Their Purpose

SnapGrid adheres to standard React best practices, employing functional components and each required hook intentionally:

| Hook | Where Used | Purpose |
| :--- | :--- | :--- |
| `useState` | `useFetchPhotos.js`<br>`App.jsx`<br>`PhotoCard.jsx` | Tracks API state (`photos`, `loading`, `error`, `retryCount`), user search query (`searchQuery`), favorite filter toggle (`showFavouritesOnly`), and individual image load status (`imageLoaded`, `imageError`). |
| `useEffect` | `useFetchPhotos.js`<br>`App.jsx` | - **API Fetching**: Fetches photos upon mount or retry trigger with `AbortController` cleanup to cancel in-flight requests.<br>- **Persistence Sync**: Safely syncs `favourites` state to `localStorage`, skipping the initial render via `isFirstRender` ref to avoid redundant writes. |
| `useReducer` | `App.jsx`<br>`favouritesReducer.js` | Manages the favourites state (`TOGGLE_FAVOURITE`, `CLEAR_ALL`, `SET_FAVOURITES`). Keeps favourite operations pure, centralized, and decoupled from component UI. |
| `useCallback` | `App.jsx`<br>`useFetchPhotos.js` | Memoizes callback functions (`handleSearchChange`, `handleClearSearch`, `handleToggleFavourite`, `retry`) to ensure stable function references across re-renders and prevent unnecessary child updates. |
| `useMemo` | `App.jsx` | Computes the filtered photo collection based on `photos`, `searchQuery`, `showFavouritesOnly`, and `favourites`. Ensures filtering runs only when inputs change, avoiding expensive recomputations on unrelated renders. |
| `useFetchPhotos` (Custom Hook) | `src/hooks/useFetchPhotos.js` | Encapsulates API fetching logic, HTTP error handling, array validation, loading state, request cancellation, and retry triggering into a single reusable hook. |

---

## Favourites Persistence Strategy

1. **Storage Format**: Only unique photo IDs (e.g. `["0", "1", "10"]`) are serialized to JSON under the key `snapgrid_favourites_v1`. Storing IDs rather than full objects ensures minimal storage overhead and prevents stale photo metadata.
2. **Lazy Initialization**: `useReducer(favouritesReducer, [], favouritesInitializer)` uses a lazy initializer function. This ensures `localStorage.getItem()` and JSON parsing execute **only once on initial component mount**, preventing synchronous disk I/O on subsequent renders.
3. **Resilience & Sanitization**: If localStorage contains malformed JSON, corrupted data, or non-array formats, the initializer safely logs a warning and gracefully falls back to an empty array without crashing the app.
4. **Targeted Syncing**: A `useEffect` hook listens to changes in the `favourites` state. Using an `isFirstRender` ref guard, it skips writing on initial mount (when the state has just been read from storage), writing only when the user toggles a favourite. All writes are wrapped in `try...catch` blocks to protect against disabled storage or quota exceptions.

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

---

## Installation & Local Development

1. **Clone or navigate into the repository**:
   ```bash
   cd snapgrid
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://127.0.0.1:5173/` (or the port specified in terminal output).

---

## Build & Lint Commands

- **Run linter**:
  ```bash
  npm run lint
  ```
  *(Checks all project files using oxlint for standard React and JavaScript best practices).*

- **Build for production**:
  ```bash
  npm run build
  ```
  *(Generates an optimized, minified production bundle in the `dist/` directory).*

- **Preview production build locally**:
  ```bash
  npm run preview
  ```

---

## API Reference

- **Endpoint**: `https://picsum.photos/v2/list?limit=30`
- **Method**: `GET`
- **Sample Item Structure**:
  ```json
  {
    "id": "0",
    "author": "Alejandro Escamilla",
    "width": 5000,
    "height": 3333,
    "url": "https://unsplash.com/photos/yC-Yzbqy7PY",
    "download_url": "https://picsum.photos/id/0/5000/3333"
  }
  ```
- **Optimized Image URLs**: SnapGrid requests proportional 4:3 previews (`https://picsum.photos/id/${photo.id}/700/525`) for lightning-fast loading (~30-50KB per image instead of 4MB raw downloads) with fallback to `photo.download_url`.

---

## Known Limitations

- **Rate Limiting / Offline Mode**: The application relies on the public Picsum Photos API. If offline or if the API is unreachable, the UI displays a clear error state with a Retry button.
- **Client-Side Pagination**: Currently loads the top 30 featured photos as specified in the assignment requirements. Server-side pagination or infinite scrolling can be added in future iterations if larger sets are required.
