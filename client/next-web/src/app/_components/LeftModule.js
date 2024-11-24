"use client";
import { useState, useEffect, useRef } from 'react';
import SearchDropdown from './SearchDropdown'; // 导入搜索下拉组件

export default function LeftModule() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null); // 用于引用搜索框区域

  // 切换下拉框的显示/隐藏
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 点击空白处关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // 如果点击发生在下拉框外部，关闭下拉框
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  return (
    <div className="w-full bg-white p-4 shadow-lg">
      <ul className="flex items-center space-x-8 pl-40">
        <div className="relative" ref={searchRef} style={{ width: '70%' }}> {/* 将宽度增加到70% */}
          <input
            type="text"
            placeholder="Search..."
            className="h-10 px-4 rounded-full bg-gray-50 placeholder-black text-black custom-input" 
            style={{ width: '100%', backgroundColor: '#f3f4f6' }} // 保证搜索框的左右两边为圆弧形
            onClick={toggleDropdown} // 点击切换下拉框的显示/隐藏
          />
          {isDropdownOpen && <SearchDropdown />} {/* 显示下拉组件 */}
        </div>
      </ul>
    </div>
  );
}
