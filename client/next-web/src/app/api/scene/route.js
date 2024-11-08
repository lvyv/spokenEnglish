// app/api/scene/route.js
import { getSceneData } from '@/zustand/slices/mockSlice';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const scene = searchParams.get('scene');

  if (!scene) {
    return new Response(JSON.stringify({ message: '请提供场景名称' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = getSceneData(scene);

  if (data.message) {
    return new Response(JSON.stringify({ message: '未找到该场景数据' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
