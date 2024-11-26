export const createTextSlice = (set, get) => ({
    chatContent: [], // 初始状态
    interimChat: '', // 临时聊天内容
    addChatMessage: (message) =>
      set((state) => ({
        chatContent: [...state.chatContent, message],
      })),
    setInterimChat: (content) => set(() => ({ interimChat: content })),
  });
  