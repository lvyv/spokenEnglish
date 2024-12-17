// src/components/TextToSpeech.js

import { useState } from 'react';

const TextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false); // 用来跟踪语音是否正在播放

  const playTextToSpeech = (text) => {
    if (isPlaying) {
      // 如果正在播放，停止语音
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // 如果没有播放，开始播放语音
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 设置语言和发音
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Clara');
      utterance.lang = 'en-CA';  // 设置为  语言

      // 语音播放结束时，更新状态
      utterance.onend = () => {
        setIsPlaying(false); // 播放完毕后，设置为没有播放状态
      };

      speechSynthesis.speak(utterance);
      setIsPlaying(true); // 设置为正在播放状态
    }
  };

  return { playTextToSpeech, isPlaying };
};

export default TextToSpeech;
