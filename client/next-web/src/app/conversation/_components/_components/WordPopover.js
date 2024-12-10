import React, { useState, useRef, useEffect } from 'react';
import { RiStarLine, RiStarFill } from 'react-icons/ri';  // 引入收藏图标
import { useAppStore } from '@/zustand/store'; // 引入状态管理

export default function WordPopover({ word }) {
  const [wordInfo, setWordInfo] = useState({ definition: '', usage: '', audioUrl: '' });
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef(null);
  const selectedWordRef = useRef(null);

  const { addFavorite, removeFavorite, isFavorite } = useAppStore(); // 从zustand获取收藏相关功能

  const fetchWordInfo = async (word) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (response.ok) {
        const data = await response.json();
        const definition = data[0]?.meanings[0]?.definitions[0]?.definition || '未找到该单词的定义';
        const usage = data[0]?.meanings[0]?.definitions[0]?.example || '无例句';
        const audioUrl = data[0]?.phonetics.find((phonetic) => phonetic.audio)?.audio || '';
        setWordInfo({ definition, usage, audioUrl });
      } else {
        setWordInfo({ definition: '未找到该单词的定义', usage: '', audioUrl: '' });
      }
    } catch (error) {
      console.error('Error fetching word info:', error);
      setWordInfo({ definition: '获取信息失败', usage: '', audioUrl: '' });
    }
  };

  const handleWordClick = (event) => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    if (!cleanWord) return;

    const { clientX, clientY } = event;
    fetchWordInfo(cleanWord);

    // 更新弹窗位置，确保其在单词旁边
    const rect = event.target.getBoundingClientRect();
    setPopoverPosition({
      top: rect.top + window.scrollY + 10, // 在单词下方显示
      left: rect.left + window.scrollX,
    });

    setIsPopoverVisible(true);
    selectedWordRef.current = event.target; // 保存被点击的单词
  };

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target) && !selectedWordRef.current?.contains(event.target)) {
      setIsPopoverVisible(false);
    }
  };

  useEffect(() => {
    if (isPopoverVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverVisible]);

  const playPronunciation = () => {
    if (wordInfo.audioUrl) {
      const audio = new Audio(wordInfo.audioUrl);
      audio.play();
    }
  };

  const handleFavoriteClick = () => {
    if (isFavorite(word)) {
      removeFavorite(word);  // 如果已经收藏，移除收藏
    } else {
      addFavorite(word);  // 如果没有收藏，添加收藏
    }
  };

  return (
    <>
      <span
        className="cursor-pointer"
        onClick={handleWordClick}
        ref={selectedWordRef}
      >
        {word}{' '}
      </span>

      {isPopoverVisible && (
        <div
          ref={popoverRef}
          className="absolute z-10 bg-white p-4 rounded-lg shadow-lg max-w-[300px] w-full"
          style={{ top: popoverPosition.top, left: popoverPosition.left }}
        >
          <h3 className="font-semibold text-xl text-real-blue-600 mb-2">{word}</h3>

          {/* 优化后的收藏按钮 */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 text-gray-600 hover:text-yellow-500"
            style={{ padding: '5px', cursor: 'pointer' }}
          >
            {isFavorite(word) ? (
              <RiStarFill size="1.5em" className="text-yellow-500" />
            ) : (
              <RiStarLine size="1.5em" className="text-gray-600" />
            )}
          </button>

          <p className="text-sm text-gray-800 mb-2">定义：{wordInfo.definition}</p>
          {wordInfo.usage !== '无例句' && wordInfo.usage && (
            <p className="text-sm text-gray-700 mb-2">用法：{wordInfo.usage}</p>
          )}
          {wordInfo.audioUrl && (
            <button
              onClick={playPronunciation}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              播放发音
            </button>
          )}
        </div>
      )}
    </>
  );
}
