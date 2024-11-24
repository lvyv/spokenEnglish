
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
const colors = [
  '#E0FFFF', '#E6E6FA', '#F5DEB3', '#F0FFF0', '#FFC0CB',
  '#FAFAD2', '#F5FFFA', '#F0FFFF', '#E0FFFF', '#F0FFF0',
  '#F5DEB3', '#FAF0E6', '#FFE4C4', '#FFFACD', '#FFE4E1',
  '#F5FFFA', '#D8BFD8', '#F0FFF0', '#F5F5F5', '#FAEBD7',
  '#FFF0F5', '#FFFACD', '#FFF0F5', '#FFE4B5', '#FAFAD2',
  '#F5F5F5', '#F0FFF0', '#F0FFFF', '#D8BFD8', '#EEE8AA',
];

export default function SceneTab({ tabNow }) {
  const router = useRouter();
  const [sceneData, setSceneData] = useState({});

  useEffect(() => {
    const loadScenes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:18080/scenes');
        if (!response.ok) {
          throw new Error('无法加载场景数据，状态码：' + response.status);
        }
        const data = await response.json();
        // 将场景数据按标签分类
        const categorizedData = data.reduce((acc, scene) => {
          const category = scene.category; // 假设后端数据中有 category 字段
          if (!acc[category]) acc[category] = [];
          acc[category].push(scene);
          return acc;
        }, {});
        setSceneData(categorizedData);
      } catch (error) {
        console.error('Error fetching scenes:', error);
        alert(`Error: ${error.message}`);
      }
    };

    loadScenes();
  }, []);

  const handleSceneClick = (scene) => {
    router.push(`/scene/?scene=${encodeURIComponent(scene)}`);
  };

  return (
    <div className="relative mt-6 p-4 bg-white rounded-lg shadow-lg">
      <div className="flex overflow-x-auto scroll-snap-x mandatory scrollbar-hide">
        {sceneData[tabNow]?.map((sceneObj, index) => (
          <div
            key={sceneObj.id}
            className="min-w-max px-4 py-2 mx-2 rounded-lg scroll-snap-align-start cursor-pointer shadow-md"
            onClick={() => handleSceneClick(sceneObj.name)}
            style={{ backgroundColor: colors[index % colors.length] }}
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
    </div>
  );
}


 