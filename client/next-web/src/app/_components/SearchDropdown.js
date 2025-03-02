
import React, { useEffect, useState } from "react";
import { RiVolumeUpLine } from "react-icons/ri";

const SearchDropdown = ({ searchInput, onDetailClick }) => {
  const [wordInfo, setWordInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 请求单词简略信息
  useEffect(() => {
    if (searchInput) {
      const fetchWordInfo = async () => {
        setLoading(true);
        setError(null);
        setWordInfo(null);

        try {
          const response = await fetch(`http://127.0.0.1:18080/api/word/${searchInput}`); // 请求后端接口
          if (!response.ok) throw new Error("无法获取单词信息，请检查后端服务");

          const data = await response.json();
          // 只获取需要的数据
          const wordDetails = {
            word: data.word || "",
            phonetic: data.phonetic || "[暂无音标]",
            translation: data.translation || "暂无翻译",
          };
          setWordInfo(wordDetails);
        } catch (err) {
          setError(err.message || "获取单词信息失败，请稍后重试");
        } finally {
          setLoading(false);
        }
      };

      fetchWordInfo();
    }
  }, [searchInput]);

  // 发音按钮功能
  const playPronunciation = (word) => {
    if (word) {
      const audioUrl = `https://dict.youdao.com/dictvoice?audio=${word}&type=2`;
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div
      className="absolute z-10 mt-2 bg-white rounded shadow-lg p-4"
      style={{ width: "100%", left: "0" }}
    >
      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : wordInfo ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <h3 className="text-lg font-bold">{wordInfo.word}</h3>
              <span className="text-gray-500 ml-2">{wordInfo.phonetic}</span>
              <button
                onClick={() => playPronunciation(wordInfo.word)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <RiVolumeUpLine size="1.5em" />
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-700">
            <p>翻译: {wordInfo.translation}</p>
          </div>

          <button
            onClick={() => onDetailClick(wordInfo.word)} // 跳转到详细解释页面
            className="mt-2 text-blue-600 hover:underline"
          >
            查看详细解释
          </button>
        </>
      ) : (
        <p className="text-gray-500">未找到相关单词信息</p>
      )}
    </div>
  );
};

export default SearchDropdown;
