import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Recipe } from "../../types/recipe";

interface FavoritesState {
  items: Recipe[];
}

const loadFavorites = (): Recipe[] => {
  try {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState: FavoritesState = {
  items: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Recipe>) => {
      if (!state.items.find((f) => f.id === action.payload.id)) {
        state.items.push(action.payload);
        localStorage.setItem("favorites", JSON.stringify(state.items));
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((f) => f.id !== action.payload);
      localStorage.setItem("favorites", JSON.stringify(state.items));
    },
    clearFavorites: (state) => {
      state.items = [];
      localStorage.setItem("favorites", JSON.stringify([]));
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;

// Selectors
import type { RootState } from "../../app/store";

export const selectFavorites = (state: RootState) => state.favorites.items;

export const selectFavoritesSorted = (state: RootState) => {
  return [...state.favorites.items].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

export const selectFavoritesByCuisine = (state: RootState, cuisine: string) => {
  return state.favorites.items.filter((r) => r.cuisine === cuisine);
};

export const selectFavoritesByDifficulty = (
  state: RootState,
  difficulty: string
) => {
  return state.favorites.items.filter((r) => r.difficulty === difficulty);
};
