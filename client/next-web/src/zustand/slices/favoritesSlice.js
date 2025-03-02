
export const createFavoritesSlice = (set, get) => ({
  favoriteWords: [],

  addFavorite: (wordInfo) => {
    const updatedFavorites = [...get().favoriteWords, wordInfo];
    set({ favoriteWords: updatedFavorites });
  },

  removeFavorite: (word) => {
    const updatedFavorites = get().favoriteWords.filter((w) => w.word !== word);
    set({ favoriteWords: updatedFavorites });
  },

  isFavorite: (word) => get().favoriteWords.some((w) => w.word === word),
});
