export const createNavigationSlice = (set, get) => ({
  tabNow: 'explore',
  setTabNow: (tab) => {
    set({ tabNow: tab });
  },
});  //动态地切换和显示不同的标签页
