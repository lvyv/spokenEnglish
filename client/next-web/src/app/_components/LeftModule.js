
// import { FaHome, FaCompass, FaStar, FaCog, FaSignOutAlt } from 'react-icons/fa';

// export default function LeftModule() {
//   return (
//     <div className="flex justify-center space-x-12 p-4"> {/* 调整为 flex 布局并设置水平间距 */}
//       <ul className="flex space-x-20"> {/* 使导航项水平排列 */}
//         <li className="flex items-center p-2 rounded shadow hover:bg-gray-200 cursor-pointer">
//           <FaCompass className="mr-2 text-blue-500" /> 社区
//         </li>
//         <li className="flex items-center p-2 rounded shadow hover:bg-gray-200 cursor-pointer">
//           <FaStar className="mr-2 text-blue-500" /> 收藏
//         </li>
//         <li className="flex items-center p-2 rounded shadow hover:bg-gray-200 cursor-pointer">
//           <FaCog className="mr-2 text-blue-500" /> 设置
//         </li>
//         <li className="flex items-center p-2 rounded shadow hover:bg-gray-200 cursor-pointer">
//           <FaSignOutAlt className="mr-2 text-blue-500" /> 退出
//         </li>
//       </ul>
//     </div>
//   );
// }

import { FaCompass, FaStar, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function LeftModule() {
  return (
    <div className="w-full bg-white p-4 shadow-lg">
      <ul className="flex items-center space-x-8 pl-60"> {/* 为文字部分添加左内边距 */}
        <li className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
          <FaCompass className="mr-2 text-blue-500" /> 社区
        </li>
        <li className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
          <FaStar className="mr-2 text-blue-500" /> 收藏
        </li>
        <li className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
          <FaCog className="mr-2 text-blue-500" /> 设置
        </li>
        <li className="flex items-center p-2 rounded hover:bg-blue-300 cursor-pointer">
          <FaSignOutAlt className="mr-2 text-blue-500" /> 退出
        </li>
      </ul>
    </div>
  );
}









