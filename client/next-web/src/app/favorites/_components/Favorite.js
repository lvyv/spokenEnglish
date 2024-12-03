'use client'; 
import CryptoJS from 'crypto-js';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/zustand/store';

export default function Favorites() {
  const favoriteWords = useAppStore((state) => state.favoriteWords);
  const removeFavorite = useAppStore((state) => state.removeFavorite);

  const [wordDetails, setWordDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(favoriteWords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWords = favoriteWords.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const fetchWordDetails = async (word) => {
    if (wordDetails[word]) return; // 如果已经获取过，不再重复请求

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (response.ok) {
        const data = await response.json();
        const wordData = {
          phonetic: data[0]?.phonetic || '暂无音标',
          meanings: data[0]?.meanings.map((meaning) => ({
            partOfSpeech: meaning.partOfSpeech,
            definitions: meaning.definitions.map((def) => ({
              definition: def.definition,
              example: def.example || '暂无例子',
              translation: def.definition, // 简化为直接使用英文定义模拟中文翻译
            })),
          })),
        };

        setWordDetails((prev) => ({ ...prev, [word]: wordData }));
      } else {
        setWordDetails((prev) => ({
          ...prev,
          [word]: { error: '无法获取单词数据' },
        }));
      }
    } catch (error) {
      setWordDetails((prev) => ({
        ...prev,
        [word]: { error: '网络错误，无法获取单词数据' },
      }));
    }
  };

  
  useEffect(() => {
    currentWords.forEach(fetchWordDetails); // 加载当前页的单词详情
  }, [currentWords]);

  return (
    <div className="p-4 bg-white rounded shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">我的收藏单词</h2>
      </div>

      <div className="space-y-4">
        {currentWords.length > 0 ? (
          currentWords.map((word, index) => (
            <div
              key={index}
              className="p-4 rounded"
              style={{
                backgroundColor: index % 2 === 0 ? '#F5F5F5' : '#FFFFFF',
              }}
            >
              <div className="flex items-center">
                <span className="text-lg font-semibold">{word}</span>
                <span className="text-gray-500 ml-2">{wordDetails[word]?.phonetic || '加载中...'}</span>
              </div>
              {wordDetails[word]?.meanings ? (
                <div className="mt-2 text-sm text-gray-700">
                  {wordDetails[word].meanings.map((meaning, i) => (
                    <div key={i}>
                      <div className="font-medium">
                        {meaning.partOfSpeech.charAt(0)} {/* 词性简写 */}
                      </div>
                      <ul className="list-none ml-4">
                        {meaning.definitions.slice(0, 1).map((def, j) => (
                          <li key={j} className="mt-2">
                            <p>翻译: <span className="text-blue-500">{def.translation}</span></p>
                            <p className="italic">例句: {def.example}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : wordDetails[word]?.error ? (
                <p className="text-red-500">{wordDetails[word].error}</p>
              ) : (
                <p className="text-gray-500">加载中...</p>
              )}
              <button
                onClick={() => removeFavorite(word)}
                className="mt-2 px-3 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white"
              >
                删除
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">暂无收藏单词</p>
        )}
      </div>

      {favoriteWords.length > itemsPerPage && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1 ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-200'
            }`}
          >
            上一页
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-200'
            }`}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
