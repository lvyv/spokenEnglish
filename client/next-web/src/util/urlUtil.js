const apiHost = process.env.NEXT_PUBLIC_API_HOST; // 从环境变量获取 API 主机地址

function getProtocolAndHost() {
  const urlRegex = /^(https?:)\/\/([^:/]+)(:\d+)?/; // 正则表达式用于匹配协议、主机和端口
  const match = apiHost?.match(urlRegex); // 匹配 apiHost
  if (!match) {
    return ''; // 如果没有匹配成功，返回空字符串
  }
  const protocol = match[1]; // 提取协议
  const host = match[2]; // 提取主机
  const port = match[3]; // 提取端口
  return [protocol, host, port]; // 返回数组
}

export function getApiServerUrl() {
  return apiHost; // 返回 API 主机地址
}

export function getWsServerUrl(url) {
  const [protocol, host, port] = getProtocolAndHost(url); // 获取协议、主机和端口
  const ws_scheme = protocol === 'https:' ? 'wss' : 'ws'; // 根据协议决定 WebSocket 方案
  return `${ws_scheme}://${host}${port ? `${port}` : ''}`; // 构造并返回 WebSocket 服务器 URL
}

