import { v4 as uuidv4 } from 'uuid';
import { getWsServerUrl } from '@/util/urlUtil';
import { languageCode } from '@/zustand/languageCode';

export const createWebsocketSlice = (set, get) => ({
  socket: null, // WebSocket 对象
  socketIsOpen: false, // WebSocket 是否已连接标志

  sendOverSocket: (data) => { // 发送消息
    if (get().socket && get().socket.readyState === WebSocket.OPEN) { // socket 存在且已连接
      get().socket.send(data); // 发送数据到服务器
      console.log('消息已发送到服务器');  
    } else {
      console.log('尝试发送消息到服务器，但 socket 未连接');
    }
  },

  socketOnMessageHandler: (event) => { // WebSocket 消息处理函数
    if (typeof event.data === 'string') {  // 如果接收到的消息是字符串类型
      const message = event.data; // 保存接收到的消息
      if (message === '[end]\n' || message.match(/\[end=([a-zA-Z0-9]+)]/)) { // 处理结束标志的消息
        get().appendChatContent(); // 添加聊天内容
        const messageIdMatches = message.match(/\[end=([a-zA-Z0-9]+)]/); // 匹配消息中的 messageId
        if (messageIdMatches) {
          const messageId = messageIdMatches[1]; // 提取 messageId
          get().setMessageId(messageId); // 设置消息 ID
        }
      } else if (message === '[thinking]\n') {
        // 暂时不做任何处理
        // setIsThinking(true); // 可以设置正在思考的状态
      } else if (message.startsWith('[+]You said: ')) {
        // [+] 表示语音识别完成
        let msg = message.split('[+]You said: '); // 拆分消息，获取用户说的内容
        if (get().speechInterim != null) { // 如果存在临时语音结果
          get().appendChatContent(); // 添加聊天内容
        }
        get().setSender('user'); // 设置消息发送者为用户
        get().appendInterimChatContent(msg[1]); // 添加临时聊天内容
        get().appendChatContent(); // 添加最终聊天内容
        get().clearSpeechInterim(); // 清除临时语音结果
      } else if (message.startsWith('[=]' || message.match(/\[=([a-zA-Z0-9]+)]/))) {
        // [=] 或 [=id] 表示回应已完成
        get().appendChatContent(); // 添加聊天内容
      } else if (message.startsWith('[+&]')) {
        let msg = message.split('[+&]'); // 拆分特殊格式的消息
        get().appendSpeechInterim(msg[1]); // 添加临时语音结果
      } else if (message.startsWith('[+transcript]')) {
        // 处理转录消息
        const id = message.split('?id=')[1].split('&speakerId=')[0];
        const speakerId = message.split('&speakerId=')[1].split('&text=')[0];
        const text = message.split('&text=')[1].split('&timestamp=')[0];
        const timestamp = message.split('&timestamp=')[1].split('&duration')[0];
        const duration = message.split('&duration=')[1];
        get().appendTranscriptContent(id, speakerId, text, timestamp, duration); // 添加转录内容
      } else {
        get().setSender('character'); // 设置消息发送者为角色
        get().appendInterimChatContent(event.data); // 添加临时聊天内容

        // 如果用户中断了上一个回应，应当能够播放新的回应
        get().setShouldPlayAudio(true); // 设置为需要播放音频
      }
    } else {
      // 处理二进制数据 (如音频)
      if (!get().shouldPlayAudio || get().isMute) { // 如果不应该播放音频或静音
        console.log('不应该播放音频');
        return;
      }
      // 将二进制数据推入 audioQueue
      get().audioQueue.push(event.data); 
      console.log('二进制数据已添加到 audioQueue');
    }
  },

  connectSocket: () => {
    if (!get().socket) { // 如果当前 socket 还不存在
      if (!get().character.hasOwnProperty('character_id')) { // 如果没有角色 ID
        return; // 不继续连接
      }
      const sessionId = uuidv4().replace(/-/g, ''); // 生成唯一的 sessionId，去掉中划线
      get().setSessionId(sessionId); // 设置 sessionId
      const ws_url = getWsServerUrl(window.location.origin); // 获取 WebSocket 服务器 URL
      const language =
        get().preferredLanguage.values().next().value === 'Auto Detect'
          ? '' // 如果是自动检测语言，语言为空
          : languageCode[get().preferredLanguage.values().next().value]; // 否则获取指定语言代码
      const ws_path =
        ws_url +
        `/ws/${sessionId}?llm_model=${
          get().selectedModel.values().next().value
        }&platform=web&isJournalMode=${get().isJournalMode}&character_id=${
          get().character.character_id
        }&language=${language}&token=${get().token}`; // 构建 WebSocket 连接路径

      let socket = new WebSocket(ws_path); // 创建 WebSocket 连接
      socket.binaryType = 'arraybuffer'; // 设置二进制数据类型为 arraybuffer
      socket.onopen = () => { // WebSocket 连接成功
        set({ socketIsOpen: true }); // 标记 WebSocket 已打开
      };
      socket.onmessage = get().socketOnMessageHandler; // 设置消息处理函数
      
      socket.onerror = (error) => { // WebSocket 发生错误
        console.log(`WebSocket 错误: `);
        console.log(error);
      };
      socket.onclose = (event) => { // WebSocket 关闭
        console.log('Socket 已关闭');
        set({ socketIsOpen: false }); // 标记 WebSocket 已关闭
      };
      set({ socket: socket }); // 保存 WebSocket 实例
    }
  },
  closeSocket: () => { // 关闭 WebSocket 连接
    get().socket?.close(); // 关闭 WebSocket，如果存在
    set({ socket: null, socketIsOpen: false }); // 重置 WebSocket 状态
  },
  sessionId: '', // 会话 ID
  setSessionId: (id) => { // 设置会话 ID
    set({ sessionId: id });
  },

  token: '', // 认证 token
  setToken: (token) => { // 设置 token
    set({ token: token });
  },
});
