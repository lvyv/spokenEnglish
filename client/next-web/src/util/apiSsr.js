// 从环境变量中获取 API 服务器的主机地址
const host = process.env.API_HOST;

// 定义一个异步函数，用于获取角色信息
export async function getCharacters() {
  try {
    // 发送 GET 请求到服务器的 /characters 端点
    const res = await fetch(`${host}/characters`, { next: { revalidate: 5 } });
    
    // 将响应解析为 JSON 格式
    const characters = await res.json();
    
    // 打印获取到的角色数量到控制台
    console.log('getCharacters: got ' + characters.length + ' characters');
    
    // 返回角色数据
    return characters;
  } catch (err) {
    // 如果请求或解析过程中发生错误，打印错误信息到控制台
    console.log('getCharacters - Error: ' + err);
    
    // 返回一个空数组表示获取角色失败
    return [];
  }
}
