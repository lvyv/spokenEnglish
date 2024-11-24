'use client';

import { useState } from 'react';

export default function WordList() {
  const initialWords = [
    { id: 1, word: 'Obfuscate', phonetic: '[ˈɒbfəsˌkeɪt]', type: 'v', translations: ['使模糊', '使费解', '混淆'] },
    { id: 2, word: 'Pernicious', phonetic: '[pərˈnɪʃəs]', type: 'adj', translations: ['有害的', '恶性的', '致命的'] },
    { id: 3, word: 'Sagacity', phonetic: '[səˈɡæsɪti]', type: 'n', translations: ['睿智', '洞察力', '明智'] },
    { id: 4, word: 'Expeditiously', phonetic: '[ˌɛkspəˈdɪʃəsli]', type: 'adv', translations: ['迅速地', '高效地'] },
    { id: 5, word: 'Prevaricate', phonetic: '[prɪˈværɪˌkeɪt]', type: 'v', translations: ['支吾其词', '搪塞', '闪烁其词'] },
    { id: 6, word: 'Lugubrious', phonetic: '[luˈɡuːbriəs]', type: 'adj', translations: ['悲哀的', '忧郁的'] },
    { id: 7, word: 'Ephemeral', phonetic: '[ɪˈfɛmərəl]', type: 'adj', translations: ['短暂的', '朝生暮死的'] },
    { id: 8, word: 'Ebullient', phonetic: '[ɪˈbʌljənt]', type: 'adj', translations: ['热情洋溢的', '精力充沛的'] },
    { id: 9, word: 'Grandiloquent', phonetic: '[ɡrænˈdɪləkwənt]', type: 'adj', translations: ['夸张的', '浮夸的'] },
    { id: 10, word: 'Halcyon', phonetic: '[ˈhælsiən]', type: 'adj', translations: ['平静的', '幸福的'] },
    // 更多单词...
  ];

  for (let i = 11; i <= 100; i++) {
    initialWords.push({
      id: i,
      word: `Word${i}`,
      phonetic: `[wɜːd${i}]`,
      type: i % 2 === 0 ? 'n' : 'v',
      translations: ['翻译1', '翻译2', `翻译${i}`],
    });
  }

  const [words, setWords] = useState(initialWords);
  const [currentPage, setCurrentPage] = useState(1);
  const [isManaging, setIsManaging] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(words.length / itemsPerPage);

  const handleChangePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const displayedWords = words.slice(
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
    setWords(words.filter((word) => !selectedWords.includes(word.id)));
    setIsManaging(false);
  };

  // 动态生成页码
  const renderPagination = () => {
    const pages = [];
    if (totalPages <= 10) {
      // 如果页数少于10，直接显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 页数多于10，显示带省略号的分页
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
        <h2 className="text-xl font-bold">单词列表</h2>
        {isManaging ? (
          <div className=" bg-white space-x-2">
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
              backgroundColor: words.indexOf(item) % 2 === 0 ? '#F5F5F5' : '#FFFFFF',
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
