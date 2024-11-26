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
// import { createAudioSlice } from '@/zustand/slices/audioSlice';  


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
//   ...createAudioSlice(...a),  // 引入音频相关的切片
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
import { createAudioSlice } from './slices/audioSlice';
// import { createTextSlice } from './slices/textSlices';
//  import { createFavoritesSlice } from './slices/useFavoriteStore'; // 引入 favorites slice

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
  ...createAudioSlice(...a),
  // ...createTextSlice(...a),
  //  ...createFavoritesSlice(...a), // 合并 favorites slice
}));


