import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSettingSlice } from './slices/settingSlice';
import { createChatSlice } from './slices/chatSlice';
import { createWebsocketSlice } from '@/zustand/slices/websocketSlice';
import { createRecorderSlice } from '@/zustand/slices/recorderSlice';
import { createWebRTCSlice } from '@/zustand/slices/webrtcSlice';
import { createCharacterSlice } from '@/zustand/slices/characterSlice';
import { createJournalSlice } from '@/zustand/slices/journalSlice';
import { createCommandSlice } from '@/zustand/slices/commandSlice';
import { createNavigationSlice } from '@/zustand/slices/navigationSlice';
import { createAudioSlice } from '@/zustand/slices/audioSlice';  


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
  ...createAudioSlice(...a),  // 引入音频相关的切片
}));
