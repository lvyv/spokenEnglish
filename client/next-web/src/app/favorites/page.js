'use client';
import Favorites from './_components/Favorite';
import Header from '../_components/Header'; // 导入 Header 组件
import Footer from '../_components/Footer'; // 导入 Footer 组件
import LeftPanel from './_components/LeftPanel'; // 导入 LeftPanel 组件
import RightPanel from './_components/RightPanel'; // 导入 RightPanel 组件

export default function FavoritesPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* 顶部 Header */}
      <Header />

      {/* 主体部分 */}
      <div className="flex flex-grow p-10 space-x-4 bg-gray-100 rounded mt-1 mb-1">
        {/* 左侧面板 */}
        <div className="w-1/5">
          <LeftPanel />
        </div>

        {/* 中间的内容区域 */}
        <div className="flex-grow">
          <Favorites />
        </div>

        {/* 右侧面板 */}
        <div className="w-1/5">
          <RightPanel />
        </div>
      </div>

      {/* 底部 Footer */}
      <Footer />
    </div>
  );
}
