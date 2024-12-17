// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { createSettingSlice } from './slices/settingSlice';
// import { createChatSlice } from './slices/chatSlice';
// import { createWebsocketSlice } from '@/zustand/slices/websocketSlice';
// import { createRecorderSlice } from '@/zustand/slices/recorderSlice';
// import { createWebRTCSlice } from '@/zustand/slices/webrtcSlice';
// import { createCharacterSlice } from '@/zustand/slices/characterSlice';
// import { createJournalSlice } from '@/zustand/slices/journalSlice';
// import { createCommandSlice } from '@/zustand/slices/commandSlice';
// import { createNavigationSlice } from '@/zustand/slices/navigationSlice';

// export const useAppStore = create((...a) => ({
//   ...createSettingSlice(...a),
//   ...createChatSlice(...a),
//   ...createWebsocketSlice(...a),
//   ...createRecorderSlice(...a),
//   ...createWebRTCSlice(...a),
//   ...createCharacterSlice(...a),
//   ...createJournalSlice(...a),
//   ...createCommandSlice(...a),
//   ...createNavigationSlice(...a),
// }));

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



