// src/util/audioPlayer.js

let audioCache = {}; // 用于缓存音频数据

// 播放音频的函数
export const playOtherAudio = (audioData) => {
  const audioBlob = new Blob([audioData], { type: 'audio/wav' }); // 假设音频数据是 wav 格式
  const audioUrl = URL.createObjectURL(audioBlob);

  // 创建新的 Audio 对象并播放
  const audio = new Audio(audioUrl);
  audio.play()
    .then(() => {
      console.log('音频播放中...');
    })
    .catch((error) => {
      console.error('播放音频时出错:', error);
    });

  // 缓存音频数据
  audioCache[audioUrl] = audioBlob;
};

// 清除缓存的音频数据
export const clearAudioCache = () => {
  audioCache = {};
  console.log('音频缓存已清空');
};

// 播放缓存的音频
export const playCachedAudio = (url) => {
  if (audioCache[url]) {
    const audio = new Audio(URL.createObjectURL(audioCache[url]));
    audio.play()
      .then(() => {
        console.log('缓存音频播放中...');
      })
      .catch((error) => {
        console.error('播放缓存音频时出错:', error);
      });
  } else {
    console.warn('没有找到缓存的音频数据');
  }
};
