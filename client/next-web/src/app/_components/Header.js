// 'use client';
// import {
//   Navbar,
//   NavbarContent,
//   NavbarItem,
// } from '@nextui-org/navbar';
// import { FaCompass, FaStar, FaCog, FaSignOutAlt } from 'react-icons/fa';
// import Image from 'next/image';
// import logImage from '@/assets/svgs/logo.png';
// import UserImage from '@/assets/svgs/user.png';
// import SignIn from './SignIn';
// import { useState } from 'react';
// import NotificationDropdown from './Voice'; 

// export default function Header() {
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);

//   const notifications = [
//     '你有新的消息',
//     '用户A评论了你的帖子',
//     '用户B关注了你',
    
//   ];

//   // 点击通知图标时切换通知下拉框显示/隐藏状态
//   const toggleNotification = () => {
//     setIsNotificationOpen(!isNotificationOpen);
//   };

//   return (
//     <Navbar className='h-20 bg-white shadow-sm'>
//       <div className="flex items-center">
//         <Image
//           src={logImage}
//           alt="Logo"
//           width={48}
//           height={48}
//           className="w-12 h-12"
//         />
//         <span className="ml-4 text-4xl font-bold text-blue-500">VerbaVista</span>
//       </div>
//       <NavbarContent justify='center' className="h-full flex items-center space-x-8">
//         <NavbarItem className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
//           <FaCompass className="mr-2 text-blue-500" /> 社区
//         </NavbarItem>
//         <NavbarItem className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
//           <FaStar className="mr-2 text-blue-500" /> 收藏
//         </NavbarItem>
//         <NavbarItem className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
//           <FaCog className="mr-2 text-blue-500" /> 设置
//         </NavbarItem>
//         <NavbarItem className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
//           <FaSignOutAlt className="mr-2 text-blue-500" /> 退出
//         </NavbarItem>
//       </NavbarContent>
//       <NavbarContent justify='end' className="h-full flex items-center">
//         <NavbarItem>
//           <SignIn className="ml-4" />
//         </NavbarItem>
//         <NavbarItem>
//           <span 
//             role="img" 
//             aria-label="notification" 
//             className="ml-4 text-2xl cursor-pointer"
//             onClick={toggleNotification} 
//           >
//             🔔
//           </span>
//           {isNotificationOpen && <NotificationDropdown notifications={notifications} onClose={() => setIsNotificationOpen(false)} />} {/* 显示通知下拉组件 */}
//         </NavbarItem>
//         <NavbarItem>
//           <div className="flex items-center ml-4">
//             <Image
//               src={UserImage}
//               alt="User"
//               width={48}
//               height={48}
//               className="w-12 h-12"
//             />
//             <span role="img" aria-label="add" className="ml-2 text-2xl">➕</span>
//           </div>
//         </NavbarItem>
//       </NavbarContent>
//     </Navbar>
//   );
// }
'use client';
import { useRouter } from 'next/navigation'; // 导入 useRouter
import {
  Navbar,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/navbar';
import { FaCompass, FaStar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';
import logImage from '@/assets/svgs/logo.png';
import UserImage from '@/assets/svgs/user.png';
import SignIn from './SignIn';
import { useState } from 'react';
import NotificationDropdown from './Voice';

export default function Header() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const router = useRouter(); // 使用 useRouter 获取路由对象

  const notifications = [
    '你有新的消息',
    '用户A评论了你的帖子',
    '用户B关注了你',
  ];

  // 点击通知图标时切换通知下拉框显示/隐藏状态
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  // 收藏按钮的点击事件，跳转到收藏页面
  const handleCollectClick = () => {
    router.push('/favorites'); // 跳转到收藏页面
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
      <NavbarContent justify='center' className="h-full flex items-center space-x-8">
        <NavbarItem className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
          <FaCompass className="mr-2 text-blue-500" /> 社区
        </NavbarItem>
        <NavbarItem 
          className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer"
          onClick={handleCollectClick} // 点击收藏按钮跳转
        >
          <FaStar className="mr-2 text-blue-500" /> 收藏
        </NavbarItem>
        <NavbarItem className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
          <FaCog className="mr-2 text-blue-500" /> 设置
        </NavbarItem>
        <NavbarItem className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
          <FaSignOutAlt className="mr-2 text-blue-500" /> 退出
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end' className="h-full flex items-center">
        <NavbarItem>
          <SignIn className="ml-4" />
        </NavbarItem>
        <NavbarItem>
          <span 
            role="img" 
            aria-label="notification" 
            className="ml-4 text-2xl cursor-pointer"
            onClick={toggleNotification} 
          >
            🔔
          </span>
          {isNotificationOpen && <NotificationDropdown notifications={notifications} onClose={() => setIsNotificationOpen(false)} />}
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
