import React, { useState, useRef, useEffect } from 'react';
import { RiStarLine, RiStarFill } from 'react-icons/ri';  // 引入收藏图标
import { useAppStore } from '@/zustand/store'; // 引入状态管理

export default function WordPopover({ word }) {
  const [selectedWord, setSelectedWord] = useState('');
  const [wordInfo, setWordInfo] = useState({ definition: '', usage: '', audioUrl: '' });
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef(null);
  const selectedWordRef = useRef(null);


  const { addFavorite, removeFavorite, isFavorite } = useAppStore(); // 从zustand获取收藏相关功能

  const handleFavoriteClick = () => {
    const favoriteData = { word: selectedWord, ...wordInfo };
    if (isFavorite(selectedWord)) {
      removeFavorite(selectedWord);
    } else {
      addFavorite(favoriteData);
    }
  };

  const fetchWordInfo = async (word) => {
    try {
      const response = await fetch(`http://127.0.0.1:18080/api/word/${word}`);
      if (response.ok) {
        const data = await response.json();
        const { phonetic, translation } = data;
        setWordInfo({
          phonetic: phonetic || "无音标",
          translation: translation || "无翻译",
        });
      } else {
        setWordInfo({ phonetic: "无音标", translation: "无翻译" });
      }
    } catch (error) {
      console.error("Error fetching word info:", error);
      setWordInfo({ phonetic: "获取失败", translation: "获取失败" });
    }
  };

  const handleWordClick = (event) => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    if (!cleanWord) return;

    const { clientX, clientY } = event;
    setSelectedWord(cleanWord);
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

          <p className="text-sm text-gray-800 mb-2">音标：{wordInfo.phonetic}</p>
          {wordInfo.translation !== '无翻译' && wordInfo.translation && (
            <p className="text-sm text-gray-700 mb-2">翻译：{wordInfo.translation}</p>
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
