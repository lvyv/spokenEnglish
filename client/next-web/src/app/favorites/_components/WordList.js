'use client';

import { useState } from 'react';
import { useAppStore } from '@/zustand/store'; // 假设你有这样一个store来管理收藏

export default function WordList() {
  // 从zustand获取收藏的单词
  const favoriteWords = useAppStore((state) => state.favoriteWords) || [];  // 确保 favoriteWords 默认是一个空数组

  const [currentPage, setCurrentPage] = useState(1);
  const [isManaging, setIsManaging] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(favoriteWords.length / itemsPerPage);

  const handleChangePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const displayedWords = favoriteWords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleManaging = () => {
    setIsManaging(!isManaging);
    setSelectedWords([]);
  };

  const handleSelectWord = (id) => {
    setSelectedWords((prev) =>
      prev.includes(id) ? prev.filter((wordId) => wordId !== id) : [...prev, id]
    );
  };

  const handleDeleteWords = () => {
    // 从 store 中删除选中的单词
    selectedWords.forEach((id) => {
      useAppStore.getState().removeWord(id);
    });
    setIsManaging(false);
  };

  // 动态生成分页
  const renderPagination = () => {
    const pages = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="p-4 bg-white rounded shadow-lg h-full">
      {/* 标题行 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">我的收藏单词</h2>
        {isManaging ? (
          <div className="bg-white space-x-2">
            <button
              onClick={handleDeleteWords}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              删除
            </button>
            <button
              onClick={toggleManaging}
              className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-200"
            >
              取消
            </button>
          </div>
        ) : (
          <button
            onClick={toggleManaging}
            className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-200"
          >
            管理
          </button>
        )}
      </div>

      {/* 单词列表 */}
      <div className="h-96 overflow-y-scroll space-y-4">
        {displayedWords.map((item) => (
          <div
            key={item.id}
            className="p-4 flex items-center rounded"
            style={{
              backgroundColor: displayedWords.indexOf(item) % 2 === 0 ? '#F5F5F5' : '#FFFFFF',
            }}
          >
            {isManaging && (
              <input
                type="checkbox"
                className="w-5 h-5 border-2 border-gray-400 rounded mr-4 checked:bg-blue-500 checked:border-blue-500"
                checked={selectedWords.includes(item.id)}
                onChange={() => handleSelectWord(item.id)}
              />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold">{item.word}</span>
                  <span className="ml-2 text-sm text-gray-600">{item.phonetic}</span>
                </div>
                <button>
                  <span role="img" aria-label="speaker" className="text-blue-500 text-3xl">
                    🔊
                  </span>
                </button>
              </div>
              <div className="mt-2 text-sm">
                <span className="font-bold text-gray-700">{item.type}</span>
                <span className="ml-2 text-gray-500">{item.translations.join('，')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 翻页部分 */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => handleChangePage(currentPage - 1)}
          className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-200"
          disabled={currentPage === 1}
        >
          上一页
        </button>
        {renderPagination().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => handleChangePage(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-3 py-1 text-gray-500">
              {page}
            </span>
          )
        )}
        <button
          onClick={() => handleChangePage(currentPage + 1)}
          className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-200"
          disabled={currentPage === totalPages}
        >
          下一页
        </button>
      </div>
    </div>
  );
}




// import { useAppStore } from '@/zustand/store';

// export default function WordList() {
//   // 从 Zustand 中获取 favorites 和 removeFavorite
//   const { favorites = [], removeFavorite } = useAppStore();

//   // 处理移除收藏单词的逻辑
//   const handleRemoveFavorite = (word) => {
//     removeFavorite(word);
//   };

//   return (
//     <div className="p-6 bg-white rounded shadow-md h-full overflow-y-auto">
//       <h2 className="text-xl font-bold mb-4">收藏单词</h2>
//       {favorites && favorites.length > 0 ? ( // 添加检查
//         <ul>
//           {favorites.map((word, index) => (
//             <li
//               key={index}
//               className="flex justify-between items-center mb-2 border-b pb-2"
//             >
//               <span className="text-gray-800">{word}</span>
//               <button
//                 onClick={() => handleRemoveFavorite(word)}
//                 className="text-red-500 hover:underline"
//               >
//                 移除
//               </button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-500">暂无收藏的单词</p>
//       )}
//     </div>
//   );
// }

