'use client';
import { useState } from 'react';

export default function LeftPanel() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="p-6 bg-[#F5F5F5] rounded shadow-md h-full overflow-y-auto">
      {/* 今日目标 */}
      <div className="w-full mb-8 text-center">
        <div
          className="flex justify-between items-center cursor-pointer w-full"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div
            className={`text-lg font-bold px-4 py-2 border rounded-full ${
              selectedItem === '今日目标' ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-800'
            }`}
            onClick={() => handleItemClick('今日目标')}
          >
            今日目标
          </div>
          <span className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
        {isDropdownOpen && (
          <ul className="mt-4 space-y-3">
            <li
              className={`text-lg font-bold px-4 py-2 border rounded-full cursor-pointer ${
                selectedItem === '今日添加' ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-800'
              }`}
              onClick={() => handleItemClick('今日添加')}
            >
              今日添加
            </li>
            <li
              className={`text-lg font-bold px-4 py-2 border rounded-full cursor-pointer ${
                selectedItem === '今日复习' ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-800'
              }`}
              onClick={() => handleItemClick('今日复习')}
            >
              今日复习
            </li>
          </ul>
        )}
      </div>

      
      <div className="mb-8">
        <div
          className={`text-lg font-bold px-4 py-2 border rounded-full cursor-pointer ${
            selectedItem === '在学单词' ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-800'
          }`}
          onClick={() => handleItemClick('在学单词')}
        >
          在学单词
        </div>
      </div>

      {/* 未学单词 */}
      <div>
        <div
          className={`text-lg font-bold px-4 py-2 border rounded-full cursor-pointer ${
            selectedItem === '未学单词' ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-800'
          }`}
          onClick={() => handleItemClick('未学单词')}
        >
          未学单词
        </div>
      </div>
    </div>
  );
}
