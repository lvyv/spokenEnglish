// src/zustand/slices/audioSlice.js

export const createAudioSlice = (set, get) => ({
    // 新增队列，用于存放二进制数据
    otheraudioQueue: [],
  
    // 将二进制数据推入队列的方法
    pushOtherAudioQueue: (data) => {
      const queue = get().otheraudioQueue;
      queue.push(data);
      set({ otheraudioQueue: queue });
      console.log('二进制音频数据已添加到otheraudioQueue');
    },
  
    // 从队列中取出数据的方法
    popOtherAudioQueue: () => {
      const queue = get().otheraudioQueue;
      if (queue.length > 0) {
        const audioData = queue.shift(); // 从队列头部取出音频数据
        set({ otheraudioQueue: queue });
        return audioData;
      } else {
        console.log('队列为空，无法取出音频数据');
        return null;
      }
    },
  
    // 播放音频队列中的数据
    playOtherAudio: () => {
      const audioData = get().popOtherAudioQueue();
      if (audioData) {
        // 假设你有音频播放的逻辑
        const audioBlob = new Blob([audioData], { type: 'audio/wav' }); // 假设数据是 wav 格式
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        console.log('正在播放音频...');
      } else {
        console.log('没有可播放的音频数据');
      }
    },
  
    // 清空音频队列
    clearOtherAudioQueue: () => {
      set({ otheraudioQueue: [] });
      console.log('otheraudioQueue 已清空');
    }
  });
  