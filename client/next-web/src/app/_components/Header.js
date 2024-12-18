"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/navbar';
import { FaCompass, FaStar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';
import logImage from '@/assets/svgs/logo.png';
import UserImage from '@/assets/svgs/user.png';
import SignIn from './SignIn';
import { useState } from 'react';
import NotificationDropdown from './Voice';

export default function Header() {
  const { data: session, status } = useSession(); // 获取 session 状态
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notifications = [
    '你有新的消息',
    '用户A评论了你的帖子',
    '用户B关注了你',
  ];

  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);

  const handleCollectClick = () => router.push('/favorites'); // 收藏页面跳转

  // 退出登录逻辑
  const handleSignOut = () => signOut();

  return (
    <Navbar className='h-20 bg-white shadow-sm'>
      <div className="flex items-center">
        <Image src={logImage} alt="Logo" width={48} height={48} className="w-12 h-12" />
        <span className="ml-4 text-4xl font-bold text-blue-500">VerbaVista</span>
      </div>

      <NavbarContent justify='center' className="h-full flex items-center space-x-8">
        <NavbarItem className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
          <FaCompass className="mr-2 text-blue-500" /> 社区
        </NavbarItem>
        <NavbarItem className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer" onClick={handleCollectClick}>
          <FaStar className="mr-2 text-blue-500" /> 收藏
        </NavbarItem>
        <NavbarItem className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
          <FaCog className="mr-2 text-blue-500" /> 设置
        </NavbarItem>
        <NavbarItem className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
          <FaSignOutAlt className="mr-2 text-blue-500" onClick={handleSignOut} /> 退出
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify='end' className="h-full flex items-center">
        {status === "authenticated" ? (
          <NavbarItem>
            <div className="flex items-center ml-4">
              <Image src={UserImage} alt="User" width={48} height={48} className="w-12 h-12" />
              <span className="ml-2 text-2xl">{session.user.name || "User"}</span>
            </div>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <SignIn className="ml-4" />
          </NavbarItem>
        )}

        <NavbarItem>
          <span role="img" aria-label="notification" className="ml-4 text-2xl cursor-pointer" onClick={toggleNotification}>
            🔔
          </span>
          {isNotificationOpen && <NotificationDropdown notifications={notifications} onClose={() => setIsNotificationOpen(false)} />}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
