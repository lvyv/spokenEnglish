'use client';

import Header from '../_components/Header'; // 导入 Header 组件
import Footer from '../_components/Footer'; // 导入 Footer 组件
import LeftPanel from './_components/LeftPanel'; // 导入 LeftPanel 组件
import WordList from './_components/WordList'; // 导入 WordList 组件
import RightPanel from './_components/RightPanel'; // 导入 RightPanel 组件

export default function Favorites() {
  return (
    <div className="flex flex-col h-screen">
      {/* 头部部分 */}
      <Header />

      {/* 中间部分 */}
      <div className="flex flex-grow p-10 space-x-4 bg-gray-100 rounded mt-1 mb-1">
        
        <div className="w-1/5">
          <LeftPanel />
        </div>

        
        <div className="flex-grow">
          <WordList />
        </div>

       
        <div className="w-1/5">
          <RightPanel />
        </div>
      </div>

      {/* 底部部分 */}
      <Footer />
    </div>
  );
}
