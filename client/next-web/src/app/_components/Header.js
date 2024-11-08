'use client';
import {
  Navbar,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/navbar';
import Image from 'next/image';
import logImage from '@/assets/svgs/logo.png';
import UserImage from '@/assets/svgs/user.png';
import SignIn from './SignIn';
import { useState } from 'react';
import SearchDropdown from './SearchDropdown'; // 导入搜索下拉组件
import NotificationDropdown from './Voice'; // 导入通知下拉组件

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notifications = [
    '你有新的消息',
    '用户A评论了你的帖子',
    '用户B关注了你',
    // 添加更多通知内容
  ];

  // 点击搜索框时切换下拉框显示/隐藏状态
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 点击通知图标时切换通知下拉框显示/隐藏状态
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <Navbar className='h-20 bg-white shadow-sm'>
      <div className="flex items-center">
        <Image
          src={logImage}
          alt="Logo"
          width={48}
          height={48}
          className="w-12 h-12"
        />
        <span className="ml-4 text-4xl font-bold text-blue-500">VerbaVista</span>
      </div>
      <div className="flex justify-center items-center w-full relative">
        <div className="relative" style={{ width: '60%' }}>
          <input
            type="text"
            placeholder="Search..."
            className="h-10 px-4 rounded-l-full bg-gray-50 placeholder-black text-black custom-input"
            style={{ width: '100%', backgroundColor: '#f3f4f6' }}
            onClick={toggleDropdown} // 点击切换下拉框的显示/隐藏
          />
          {isDropdownOpen && <SearchDropdown />} {/* 显示下拉组件 */}
        </div>
      </div>
      <NavbarContent justify='end' className="h-full flex items-center">
        <NavbarItem>
          <SignIn className="ml-4" />
        </NavbarItem>
        <NavbarItem>
          <span 
            role="img" 
            aria-label="notification" 
            className="ml-4 text-2xl cursor-pointer"
            onClick={toggleNotification} // 点击切换通知下拉框
          >
            🔔
          </span>
          {isNotificationOpen && <NotificationDropdown notifications={notifications} onClose={() => setIsNotificationOpen(false)} />} {/* 显示通知下拉组件 */}
        </NavbarItem>
        <NavbarItem>
          <div className="flex items-center ml-4">
            <Image
              src={UserImage}
              alt="User"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <span role="img" aria-label="add" className="ml-2 text-2xl">➕</span>
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
