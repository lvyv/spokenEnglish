
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchScenes } from '@/zustand/slices/mock'; // 导入模拟数据

export default function SectionsTab({ tabNow }) {
  const router = useRouter();
  const [sceneData, setSceneData] = useState([]);

  useEffect(() => {
    const loadScenes = async () => {
      const data = await fetchScenes(tabNow);
      setSceneData(data);
    };

    loadScenes();
  }, [tabNow]);

  const handleSceneClick = (scene) => {
    router.push(`/scene/?scene=${encodeURIComponent(scene)}`);
  };

  return (
    <div className="relative mt-6 p-4 bg-white rounded-lg shadow-lg">
      {/* 滚动容器，隐藏滚动条 */}
      <div className="flex overflow-x-auto scroll-snap-x mandatory scrollbar-hide">
        {sceneData.map((sceneObj, index) => (
          <div
            key={index}
            className="min-w-max px-4 py-2 mx-2 bg-white rounded-lg scroll-snap-align-start cursor-pointer shadow-md"
            onClick={() => handleSceneClick(sceneObj.name)}
          >
            <Image
              src={sceneObj.image}
              alt={sceneObj.name}
              width={100}
              height={100}
              className="mb-2"
            />
            {sceneObj.name}
          </div>
        ))}
      </div>

      {/* 左侧箭头按钮 - 隐藏但功能保留 */}
      <button
        className="absolute left-2 bottom-2 transform translate-y-1/2 p-2 bg-blue-500 text-white rounded-full shadow-lg opacity-0"
        onClick={() => {
          const container = document.querySelector('.overflow-x-auto');
          container.scrollBy({ left: -200, behavior: 'smooth' });
        }}
      >
        ←
      </button>

      {/* 右侧箭头按钮 - 隐藏但功能保留 */}
      <button
        className="absolute right-2 bottom-2 transform translate-y-1/2 p-2 bg-blue-500 text-white rounded-full shadow-lg opacity-0"
        onClick={() => {
          const container = document.querySelector('.overflow-x-auto');
          container.scrollBy({ left: 200, behavior: 'smooth' });
        }}
      >
        →
      </button>
    </div>
  );
}
