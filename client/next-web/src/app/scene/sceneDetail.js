'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// 固定的场景数据
const SCENE_DATA = {
  "机票预定": {
    name: "机票预定",
    description: "这是一个关于如何预定机票的场景。",
    image: "/assets/svgs/flight.png"
  },
  "酒店预订": {
    name: "酒店预订",
    description: "这是一个关于如何预订酒店的场景。",
    image: "/assets/svgs/hotel.png"
  },
  // 其他场景数据
};

export default function SceneDetail() {
  const searchParams = useSearchParams(); // 获取 URL 参数 钩子函数
  const scene = searchParams.get('scene'); // 从 URL 中获取 scene 参数
  const [sceneDetail, setSceneDetail] = useState(null);  //状态变量，存储加载后的场景详细信息。
  const [error, setError] = useState(null);

  useEffect(() => {
    if (scene) {
      // 使用固定数据而不是 API
      const sceneData = SCENE_DATA[scene];
      if (sceneData) {
        setSceneDetail(sceneData);
      } else {
        setError('未找到该场景的详细信息。');
      }
    }
  }, [scene]);

  if (!scene) {
    return <p>正在加载场景数据...</p>;
  }

  if (error) {
    return <p>错误: {error}</p>;
  }

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">场景详情: {scene || '加载中...'}</h1>
      {sceneDetail ? (
        <div>
          <h2 className="text-xl mb-2">{sceneDetail.name}</h2>
          <p className="mb-4">{sceneDetail.description}</p>
          <img src={sceneDetail.image} alt={sceneDetail.name} width={200} height={200} />
        </div>
      ) : (
        <p>未找到该场景数据....</p>
      )}
    </div>
  );
}
