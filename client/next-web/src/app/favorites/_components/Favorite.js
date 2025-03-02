'use client';
import { useState } from 'react';
import { useAppStore } from '@/zustand/store';
import { RiVolumeUpLine } from 'react-icons/ri';

export default function Favorites() {
  const favoriteWords = useAppStore((state) => state.favoriteWords); // 获取收藏的单词及其详细信息
  const removeFavorite = useAppStore((state) => state.removeFavorite);

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

  const playPronunciation = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">我的收藏单词</h2>
      </div>

      <div className="space-y-4">
        {currentWords.length > 0 ? (
          currentWords.map((wordObj, index) => (
            <div
              key={index}
              className="p-4 rounded flex justify-between items-center"
              style={{
                backgroundColor: index % 2 === 0 ? '#F5F5F5' : '#FFFFFF',
              }}
            >
              <div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold">{wordObj.word}</span>
                  <span className="text-gray-500 ml-2">{wordObj.phonetic || "无音标"}</span>
                  {wordObj.audioUrl && (
                    <button
                      onClick={() => playPronunciation(wordObj.audioUrl)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <RiVolumeUpLine size="1.5em" />
                    </button>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  <p>翻译: <span className="text-blue-500">{wordObj.translation || "暂无翻译"}</span></p>
                </div>
              </div>

              <button
                onClick={() => removeFavorite(wordObj.word)}
                className="ml-4 px-3 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white"
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
            className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-200'
              }`}
          >
            上一页
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-200'
              }`}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
