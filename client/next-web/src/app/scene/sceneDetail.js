
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchSceneDetail } from '@/util/sceneApi'; 

export default function SceneDetail() {
  const searchParams = useSearchParams(); // 获取 URL 参数 钩子函数
  const scene = searchParams.get('scene'); // 从 URL 中获取 scene 参数
  const [sceneDetail, setSceneDetail] = useState(null);  //状态变量，存储加载后的场景详细信息。
  const [error, setError] = useState(null);

  useEffect(() => {
    if (scene) {
      fetchSceneDetail(scene)
        .then(data => setSceneDetail(data))
        .catch(err => setError(err.message));
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
        <pre className="bg-gray-100 p-4 rounded-lg">{JSON.stringify(sceneDetail, null, 2)}</pre>
      ) : (
        <p>未找到该场景数据....</p>
      )}
    </div>
  );
}
