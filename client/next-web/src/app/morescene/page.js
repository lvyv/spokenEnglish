// app/page.js
'use client';

import Navbar from './_components/Navbar';
import Topbar from './_components/Topbar';
import MainContent from './_components/MainContent';

export default function HomePage() {
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* 左侧模块 */}
        <div className="flex-shrink-0 w-60 h-screen ml-4">
          <Navbar />
        </div>
  
        {/* 右侧部分 */}
        <div className="flex flex-col flex-1 p-4 space-y-4">
          {/* 右侧顶部模块 */}
          <Topbar />
          
          {/* 右侧下面的模块 */}
          <MainContent />
        </div>
      </div>
    );
  }