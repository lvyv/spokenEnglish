import { v4 as uuidv4 } from 'uuid'; // 导入用于生成唯一会话ID的库
import { getWsServerUrl } from '@/util/urlUtil'; // 导入获取WebSocket服务器URL的工具函数
import { languageCode } from '@/zustand/languageCode'; // 导入语言代码配置

export const createWebsocketSlice = (set, get) => ({
  socket: null, // 存储WebSocket实例
  socketIsOpen: false, // 标记WebSocket连接是否打开

  // 通过WebSocket发送数据的函数
  sendOverSocket: (data) => {
    // 检查WebSocket是否存在且已打开
    if (get().socket && get().socket.readyState === WebSocket.OPEN) {
      get().socket.send(data); // 发送数据
      console.log('message sent to server'); // 日志输出
    } else {
      console.log('tries to send message to server but socket not open.'); // 日志输出，提示未打开连接
    }
  },

  // 处理接收到的WebSocket消息的函数
  socketOnMessageHandler: (event) => {
    // 检查接收到的数据是否为字符串类型
    if (typeof event.data === 'string') {
      const message = event.data; // 将消息数据存储为变量

      // 处理不同类型的文本消息
      if (message === '[end]\n' || message.match(/\[end=([a-zA-Z0-9]+)]/)) {
        // 处理结束消息
        get().appendChatContent(); // 追加聊天内容
        const messageIdMatches = message.match(/\[end=([a-zA-Z0-9]+)]/); // 提取消息ID
        if (messageIdMatches) {
          const messageId = messageIdMatches[1]; // 获取消息ID
          get().setMessageId(messageId); // 设置消息ID
        }
      } else if (message === '[thinking]\n') {
        // 当接收到思考中的消息时，暂时不做处理
      } else if (message.startsWith('[+]You said: ')) {
        // [+]表示转录完成，处理用户的输入
        let msg = message.split('[+]You said: '); // 分割消息以获取内容
        // 中断消息没有结束信号，手动清除之前的内容
        if (get().speechInterim != null) {
          get().appendChatContent(); // 追加聊天内容
        }
        get().setSender('user'); // 设置消息发送者为用户
        get().appendInterimChatContent(msg[1]); // 追加用户输入的内容
        get().appendChatContent(); // 追加聊天内容
        get().clearSpeechInterim(); // 清除中间语音内容
      } else if (message.startsWith('[=]' || message.match(/\[=([a-zA-Z0-9]+)]/))) {
        // [=] 或 [=id] 表示响应完成
        get().appendChatContent(); // 追加聊天内容
      } else if (message.startsWith('[+&]')) {
        // 处理带有中间消息的内容
        let msg = message.split('[+&]');
        get().appendSpeechInterim(msg[1]); // 追加中间语音内容
      } else if (message.startsWith('[+transcript]')) {
        // 处理转录消息
        const id = message.split('?id=')[1].split('&speakerId=')[0]; // 提取ID
        const speakerId = message.split('&speakerId=')[1].split('&text=')[0]; // 提取说话者ID
        const text = message.split('&text=')[1].split('&timestamp=')[0]; // 提取文本
        const timestamp = message.split('&timestamp=')[1].split('&duration')[0]; // 提取时间戳
        const duration = message.split('&duration=')[1]; // 提取持续时间
        get().appendTranscriptContent(id, speakerId, text, timestamp, duration); // 追加转录内容
      } else {
        // 处理默认文本消息
        get().setSender('character'); // 设置消息发送者为角色
        get().appendInterimChatContent(event.data); // 追加角色的中间聊天内容

        // 如果用户中断了之前的响应，应该能够播放新的响应音频
        get().setShouldPlayAudio(true); // 设置为应播放音频
      }
    } else {
      // 处理二进制数据（音频数据）
      if (!get().shouldPlayAudio || get().isMute) {
        console.log('should not play audio'); // 日志输出，不播放音频
        return; // 退出处理
      }
      
      // 将接收到的音频数据推入音频队列，以便后续处理或播放
      get().pushAudioQueue(event.data);
      console.log(
        'audio arrival: ',
        event.data.byteLength, // 输出音频数据的字节长度
        ' bytes, speaker: ',
        get().selectedSpeaker.values().next().value, // 输出当前选择的说话者
        ' mute: ',
        get().isMute, // 输出当前静音状态
        ' mic: ',
        get().selectedMicrophone.values().next().value, // 输出当前选择的麦克风
        ' mute: ',
        get().disableMic, // 输出麦克风的禁用状态
        ' isPlaying: ',
        get().isPlaying, // 输出当前播放状态
        ' isPlaying(player): ',
        get().audioPlayerRef.current ? !get().audioPlayerRef.current.paused : undefined, // 输出音频播放器的播放状态
        ' audios in queue: ',
        get().audioQueue.length // 输出音频队列中的音频数量
      );
    }
  },

  // 连接WebSocket的函数
  connectSocket: () => {
    // 检查是否已存在WebSocket连接
    if (!get().socket) {
      // 检查角色ID是否存在
      if (!get().character.hasOwnProperty('character_id')) {
        return; // 如果角色ID不存在，退出函数
      }
      const sessionId = uuidv4().replace(/-/g, ''); // 生成唯一会话ID
      get().setSessionId(sessionId); // 设置会话ID
      const ws_url = getWsServerUrl(window.location.origin); // 获取WebSocket服务器的URL
      const language =
        get().preferredLanguage.values().next().value === 'Auto Detect'
          ? ''
          : languageCode[get().preferredLanguage.values().next().value]; // 根据用户选择的语言设置语言参数
      const ws_path =
        ws_url +
        `/ws/${sessionId}?llm_model=${
          get().selectedModel.values().next().value
        }&platform=web&isJournalMode=${get().isJournalMode}&character_id=${
          get().character.character_id
        }&language=${language}&token=${get().token}`; // 构建WebSocket连接路径
      let socket = new WebSocket(ws_path); // 创建WebSocket实例
      socket.binaryType = 'arraybuffer'; // 设置WebSocket的二进制数据类型
      socket.onopen = () => {
        console.log('WebSocket connection established successfully'); // 日志输出，连接成功
        set({ socketIsOpen: true }); // 设置WebSocket连接状态为打开
      };
      socket.onmessage = get().socketOnMessageHandler; // 设置消息处理函数
      socket.onerror = (error) => {
        console.log(`WebSocket Error: `); // 日志输出WebSocket错误
        console.log(error); // 输出错误信息
      };
      socket.onclose = (event) => {
        console.log('Socket closed'); // 日志输出连接关闭
        console.log('Close code:', event.code); // 输出关闭码
        console.log('Close reason:', event.reason ? event.reason : 'No reason provided'); // 输出关闭原因

        set({ socketIsOpen: false }); // 设置WebSocket连接状态为关闭
        // 显示错误消息给用户
        alert(`Connection to server closed. Code: ${event.code}, Reason: ${event.reason}`);
      };
      set({ socket: socket }); // 将WebSocket实例存储到状态中
    }
  },

  // 关闭WebSocket的函数
  closeSocket: () => {
    get().socket?.close(); // 关闭WebSocket连接
    set({ socket: null, socketIsOpen: false }); // 清空WebSocket实例并更新状态
  },

  sessionId: '', // 存储会话ID
  setSessionId: (id) => {
    set({ sessionId: id }); // 设置会话ID
  },

  token: '', // 存储访问令牌
  setToken: (token) => {
    set({ token: token }); // 设置访问令牌
  },
});
