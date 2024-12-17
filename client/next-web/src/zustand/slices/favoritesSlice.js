// 该文件用于管理用户收藏的单词
export const createFavoritesSlice = (set, get) => ({
  favoriteWords: [], // 使用数组代替 Set

  addFavorite: (word) => {
    const updatedFavorites = [...get().favoriteWords, word];
    set({ favoriteWords: updatedFavorites });
  },

  removeFavorite: (word) => {
    const updatedFavorites = get().favoriteWords.filter(w => w !== word);
    set({ favoriteWords: updatedFavorites });
  },

  isFavorite: (word) => get().favoriteWords.includes(word),
});

