// NotificationDropdown.js
import React from 'react';

const NotificationDropdown = ({ notifications, onClose }) => {
  return (
    <div
      className="absolute z-10 mt-2 bg-white rounded shadow-lg"
      style={{
        width: '200px', // 设置下拉框的宽度
        maxHeight: '300px', // 设置最大高度
        overflowY: 'auto', // 允许垂直滚动
      }}
    >
      <div className="p-4">
        <h3 className="text-lg font-bold text-black">通知</h3>
        <ul className="mt-2">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <li
                key={index}
                // className="my-2 py-2 px-4 rounded-full border border-gray-50 text-black hover:bg-gray-200 cursor-pointer shadow-lg"
                className="my-2 py-2 px-4 rounded-full border-gray-50 text-black bg-default/10 hover:opacity-80 cursor-pointer shadow-lg text-xs"

                onClick={onClose} // 点击通知时关闭下拉框
              >
                {notification}
              </li>
            ))
          ) : (
            <li className="py-2 text-center text-gray-500">没有通知</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationDropdown;
