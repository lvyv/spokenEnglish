// util/sceneApi.js

export async function fetchSceneDetail(scene) {
    const url = `/api/scene?scene=${encodeURIComponent(scene)}`;
    
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error('网络响应错误');
    }
  
    return await response.json();
  }
  