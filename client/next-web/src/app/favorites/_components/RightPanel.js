'use client';

export default function RightPanel() {
  return (
    <div className="p-4 bg-[#F5F5F5] rounded shadow-md h-full overflow-y-auto">
      {/* 标题 */}
      <h2 className="text-lg font-bold mb-6">单词每日复习设置</h2>
      
      {/* 下拉列表设置模块 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="review-count">
          设置每日复习单词数量
        </label>
        <select
          id="review-count"
          className="w-full px-4 py-2 border rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i} value={(i + 1) * 10}>
              {(i + 1) * 10}
            </option>
          ))}
        </select>
      </div>

      {/* 数字统计模块 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow text-center">
          <p className="text-sm font-medium text-gray-700">今日添加</p>
          <p className="mt-2 text-xl font-bold text-blue-500">0</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <p className="text-sm font-medium text-gray-700">今日复习</p>
          <p className="mt-2 text-xl font-bold text-blue-500">10</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <p className="text-sm font-medium text-gray-700">今日目标</p>
          <p className="mt-2 text-xl font-bold text-blue-500">20</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <p className="text-sm font-medium text-gray-700">待学习</p>
          <p className="mt-2 text-xl font-bold text-blue-500">5</p>
        </div>
      </div>

      {/* 开始复习按钮 */}
      <div className="text-center">
        <button className="px-6 py-2 bg-blue-500 text-white font-medium rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
          开始复习
        </button>
      </div>
    </div>
  );
}
