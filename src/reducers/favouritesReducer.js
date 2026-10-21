/**
 * favouritesReducer.js
 * 
 * Manages the collection of favourited photo IDs using useReducer.
 * Keeps state pure, predictable, and resilient to corrupt localStorage data.
 */

export const FAVOURITES_STORAGE_KEY = 'snapgrid_favourites_v1';

export const FavouritesActionTypes = {
  TOGGLE: 'TOGGLE_FAVOURITE',
  SET: 'SET_FAVOURITES',
  CLEAR_ALL: 'CLEAR_ALL',
};

/**
 * Lazy initializer for useReducer.
 * Reads saved favourite IDs from localStorage safely.
 * Returns an array of photo ID strings.
 * 
 * @param {string[]} initialValue
 * @returns {string[]}
 */
export function favouritesInitializer(initialValue = []) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return initialValue;
  }

  try {
    const rawData = window.localStorage.getItem(FAVOURITES_STORAGE_KEY);
    if (!rawData) {
      return initialValue;
    }

    const parsed = JSON.parse(rawData);

    // Validate that the stored data is an array of IDs
    if (Array.isArray(parsed)) {
      // Filter out null/undefined, cast to strings, deduplicate
      const sanitized = Array.from(
        new Set(
          parsed
            .filter((id) => id !== null && id !== undefined)
            .map((id) => String(id).trim())
            .filter((id) => id.length > 0)
        )
      );
      return sanitized;
    }

    console.warn('SnapGrid: Invalid favourites data in localStorage; expected array, found:', parsed);
  } catch (error) {
    console.warn('SnapGrid: Failed to read favourites from localStorage:', error);
  }

  return initialValue;
}

/**
 * Reducer function for favourite photo IDs.
 * State is a string array containing unique photo IDs.
 * 
 * @param {string[]} state
 * @param {{ type: string, payload?: any }} action
 * @returns {string[]}
 */
export function favouritesReducer(state, action) {
  switch (action.type) {
    case FavouritesActionTypes.TOGGLE: {
      const targetId = String(action.payload);
      if (state.includes(targetId)) {
        return state.filter((id) => id !== targetId);
      }
      return [...state, targetId];
    }

    case FavouritesActionTypes.SET: {
      if (Array.isArray(action.payload)) {
        return Array.from(new Set(action.payload.map(String)));
      }
      return state;
    }

    case FavouritesActionTypes.CLEAR_ALL: {
      return [];
    }

    default:
      return state;
  }
}
