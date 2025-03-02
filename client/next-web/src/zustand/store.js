

import { create } from 'zustand';
import { createSettingSlice } from './slices/settingSlice';
import { createChatSlice } from './slices/chatSlice';
import { createWebsocketSlice } from './slices/websocketSlice';
import { createRecorderSlice } from './slices/recorderSlice';
import { createWebRTCSlice } from './slices/webrtcSlice';
import { createCharacterSlice } from './slices/characterSlice';
import { createJournalSlice } from './slices/journalSlice';
import { createCommandSlice } from './slices/commandSlice';
import { createNavigationSlice } from './slices/navigationSlice';
import { createFavoritesSlice } from './slices/favoritesSlice'; 

export const useAppStore = create((...a) => ({
  ...createSettingSlice(...a),
  ...createChatSlice(...a),
  ...createWebsocketSlice(...a),
  ...createRecorderSlice(...a),
  ...createWebRTCSlice(...a),
  ...createCharacterSlice(...a),
  ...createJournalSlice(...a),
  ...createCommandSlice(...a),
  ...createNavigationSlice(...a),
  ...createFavoritesSlice(...a), 
}));



