import React, { useState } from 'react';

const SearchDropdown = () => {
  // 用于存储当前选中的场景或活动
  const [selectedItem, setSelectedItem] = useState(null);

  // 点击事件处理函数
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div
      className="absolute z-10 mt-2 bg-white rounded shadow-lg"
      style={{
        width: '120%', // 设置宽度比搜索框大，可以根据需要调整
        maxHeight: '300px', // 设置最大高度
        overflow: 'hidden', // 隐藏滚动条
      }}
    >
      <div
        className="p-4 overflow-y-scroll"
        style={{
          maxHeight: '280px', // 设置内容的最大高度
          scrollbarWidth: 'none', // Firefox: 隐藏滚动条
          msOverflowStyle: 'none', // IE 10+: 隐藏滚动条
        }}
      >
        <h3 className="text-lg font-bold text-black">热门搜索</h3>
        <div className="grid grid-cols-3 gap-4 mt-2"> {/* 使用grid布局，每行3个元素 */}
          {['场景1', '场景2', '场景3', '场景4', '场景5', '场景6'].map((scene, index) => (
            <div
              key={index}
            
               className={`py-2 px-4 rounded-full border-gray-300 text-black text-center cursor-pointer shadow-lg bg-default/10 hover:opacity-80 text-xs ${
                selectedItem === scene ? 'bg-blue-300 text-white' : ''
              }`}
              
              onClick={() => handleItemClick(scene)}
            >
              {scene}
            </div>
          ))}
        </div>
        <h3 className="text-lg font-bold text-black mt-4">热门活动</h3>
        <div className="grid grid-cols-3 gap-4 mt-2"> {/* 使用grid布局，每行3个元素 */}
          {['活动1', '活动2', '活动3', '活动4', '活动5', '活动6'].map((activity, index) => (
            <div
              key={index}
           
               className={`py-2 px-4 rounded-full border-gray-300 text-black text-center cursor-pointer shadow-lg bg-default/10 hover:opacity-80 text-xs ${
                selectedItem === activity ? 'bg-blue-300 text-white' : ''
              }`}
              
              onClick={() => handleItemClick(activity)}
            >
              {activity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;
