
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SearchDropdown from "./SearchDropdown"; // 下拉框组件

export default function LeftModule() {
  const [searchInput, setSearchInput] = useState(""); // 输入框内容
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 控制下拉框
  const searchRef = useRef(null); // 引用区域
  const router = useRouter(); // Next.js 导航

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setSearchInput(value);

    if (value) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  return (
    <div className="w-full bg-white p-4 shadow-lg">
      <ul className="flex items-center space-x-8 pl-40">
        <div className="relative" ref={searchRef} style={{ width: "70%" }}>
          {/* 搜索框 */}
          <input
            type="text"
            placeholder="Search..."
            className="h-10 px-4 rounded-full bg-gray-50 placeholder-black text-black custom-input"
            style={{ width: "100%", backgroundColor: "#f3f4f6" }}
            value={searchInput}
            onChange={handleInputChange}
          />
         
          {isDropdownOpen && (
            <SearchDropdown
              searchInput={searchInput}
              onDetailClick={(word) => router.push(`/worddetail/${word}`)}
            />
          )}
        </div>
      </ul>
    </div>
  );
}
