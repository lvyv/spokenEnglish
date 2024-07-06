import useSWR from 'swr'; // 引入 useSWR 库用于数据获取和缓存
import { getApiServerUrl } from './urlUtil'; // 引入获取 API 服务器 URL 的工具函数
import { useAppStore } from '@/zustand/store'; // 引入状态管理库的自定义 hook

const fileUrlMap = new Map(); // 创建一个 Map 用于缓存文件 URL

// fetcher 函数，用于封装 fetch 请求逻辑
const fetcher = ([url, token]) => {
  let headers = {
    'Content-Type': 'application/json',
  };
  // 如果有 token，则将其添加到请求头中
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  // 发送 GET 请求，并将响应解析为 JSON
  return fetch(url, {
    method: 'GET',
    headers: headers,
  }).then(res => {
    return res.json();
  });
};

// 自定义 hook，用于获取角色数据
export function useMyCharacters() {
  const { token } = useAppStore(); // 从全局状态中获取 token
  const { isLoading, error, data } = useSWR(
    [`${getApiServerUrl()}/characters`, token], // 构造请求 URL 和 token
    fetcher // 使用 fetcher 函数进行数据获取
  );
  console.log(data); // 打印获取到的数据

  if (error) {
    console.log('error'); // 如果有错误，打印错误信息
    return;
  }
  return {
    characters: data, // 返回角色数据
    isLoading, // 返回加载状态
  };
}

// 生成系统提示的异步函数
export async function generateSystemPrompt(name, background, accessToken) {
  const url = getApiServerUrl() + '/system_prompt'; // 构造请求 URL
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: name,
      background: background,
    }),
  });

  if (response.ok) {
    return await response.json(); // 请求成功，返回 JSON 响应
  } else {
    throw new Error(`HTTP error! status: ${response.status}`); // 请求失败，抛出错误
  }
}

// 创建角色的异步函数
export async function createCharacter(characterRequest, accessToken) {
  const url = getApiServerUrl() + '/create_character'; // 构造请求 URL
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(characterRequest),
  });

  if (response.ok) {
    return await response.json(); // 请求成功，返回 JSON 响应
  } else {
    throw new Error(`HTTP error! status: ${response.status}`); // 请求失败，抛出错误
  }
}

// 删除角色的异步函数
export async function deleteCharacter(character_id, accessToken) {
  const url = getApiServerUrl() + '/delete_character'; // 构造请求 URL
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      character_id: character_id,
    }),
  });

  if (response.ok) {
    return await response.json(); // 请求成功，返回 JSON 响应
  } else {
    throw new Error(`HTTP error! status: ${response.status}`); // 请求失败，抛出错误
  }
}

// 上传文件的异步函数
export async function uploadFile(file, accessToken) {
  if (fileUrlMap.has(file)) {
    console.log('Cache has file ' + file.name); // 如果缓存中有该文件，直接返回缓存的 URL
    return fileUrlMap.get(file);
  }
  const url = getApiServerUrl() + '/uploadfile'; // 构造请求 URL
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (response.ok) {
    const jsonResponse = await response.json();
    fileUrlMap.set(file, jsonResponse); // 将响应结果缓存起来
    return jsonResponse;
  } else {
    throw new Error(`HTTP error! status: ${response.status}`); // 请求失败，抛出错误
  }
}

// 克隆声音的异步函数
export async function cloneVoice(files, accessToken) {
  // 检查所有文件是否已经上传
  for (const file of files) {
    if (!fileUrlMap.has(file)) {
      await uploadFile(file, accessToken); // 上传未缓存的文件
    }
  }
  const url = getApiServerUrl() + '/clone_voice'; // 构造请求 URL
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (response.ok) {
    return await response.json(); // 请求成功，返回 JSON 响应
  } else {
    throw new Error(`HTTP error! status: ${response.status}`); // 请求失败，抛出错误
  }
}

// 获取角色的异步函数
export async function getCharacter(character_id, accessToken) {
  const url = getApiServerUrl() + '/get_character?character_id=' + character_id; // 构造请求 URL
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.ok) {
    return await response.json(); // 请求成功，返回 JSON 响应
  }
  throw new Error(response.toString()); // 请求失败，抛出错误
}

// 编辑角色的异步函数
export async function editCharacter(editCharacterRequest, accessToken) {
  const url = getApiServerUrl() + '/edit_character'; // 构造请求 URL
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(editCharacterRequest),
  });

  if (response.ok) {
    return await response.json(); // 请求成功，返回 JSON 响应
  } else {
    throw new Error(await response.text()); // 请求失败，抛出错误
  }
}

// 发起 Twilio 呼叫的异步函数
export async function makeTwilioCall(number, vad_threshold, character_id) {
  const url = getApiServerUrl() + '/twilio/call'; // 构造请求 URL
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target_number: number,
      character_id: character_id,
      vad_threshold: vad_threshold,
    }),
  });

  if (response.ok) {
    return await response.json(); // 请求成功，返回 JSON 响应
  } else {
    throw new Error(await response.text()); // 请求失败，抛出错误
  }
}

// 生成高亮内容的异步函数
export async function generateHighlight(generateHighlightRequest, accessToken) {
  const url = getApiServerUrl() + '/generate_highlight'; // 构造请求 URL
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(generateHighlightRequest),
  });

  if (response.ok) {
    return await response.json(); // 请求成功，返回 JSON 响应
  } else {
    throw new Error(await response.text()); // 请求失败，抛出错误
  }
}
