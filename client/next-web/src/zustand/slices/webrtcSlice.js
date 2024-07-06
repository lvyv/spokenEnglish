export const createWebRTCSlice = (set, get) => ({
  // 音频播放器相关状态和方法
  shouldPlayAudio: true, // 是否应该播放音频的标志
  setShouldPlayAudio: (v) => {
    set({ shouldPlayAudio: v }); // 设置是否播放音频
  },
  audioQueue: [], // 音频队列，用于存储待播放的音频数据
  pushAudioQueue: (audio) => {
    set((state) => ({ audioQueue: [...state.audioQueue, audio] })); // 将新的音频数据推入音频队列
  },
  popAudioQueueFront: () => {
    set((state) => ({ audioQueue: [...state.audioQueue.slice(1)] })); // 移除音频队列的第一个元素
  },
  isPlaying: false, // 当前是否正在播放音频
  setIsPlaying: (v) => {
    set({ isPlaying: v }); // 设置是否正在播放音频
  },
  audioPlayerRef: null, // 用于引用音频播放器的引用
  setAudioPlayerRef: (ref) => {
    set({ audioPlayerRef: ref }); // 设置音频播放器引用
  },
  stopAudioPlayback: () => {
    console.log('Stopping audio playback'); // 停止音频播放的日志输出
    set({ audioQueue: [] }); // 清空音频队列
    if (get().audioPlayerRef && get().audioPlayerRef.current) {
      get().setShouldPlayAudio(false); // 设置为不应播放音频
      get().audioPlayerRef.current.pause(); // 暂停音频播放器
    }
  },

  // WebRTC连接相关状态和方法
  pc: null, // 本地WebRTC连接的实例
  otherPC: null, // 用于回声消除的另一个本地WebRTC连接的实例
  micStream: null, // 麦克风输入流
  incomingStreamDestination: null, // 用于处理输入流的目标
  audioContext: null, // 用于处理音频的AudioContext实例

  rtcConnectionEstablished: false, // WebRTC连接是否已建立的标志
  connectPeer: async () => {
    if (get().pc) {
      console.log('Should not call connectPeer if webrtc connection already established!'); // 已建立连接时不应再次调用连接函数的日志输出
      return;
    }
    
    // 当设置了TURN服务器API端点时，使用TURN服务器
    let iceServers = [];
    if (process.env.NEXT_PUBLIC_TURN_SERVER_API_ENDPOINT) {
      const response = await fetch(process.env.NEXT_PUBLIC_TURN_SERVER_API_ENDPOINT);
      iceServers = await response.json(); // 从API获取ICE服务器配置
    }
    
    // 创建本地WebRTC连接实例
    let pc = new RTCPeerConnection({
      sdpSemantics: 'unified-plan', // 使用统一计划的SDP语义
      iceServers: iceServers, // 使用获取的ICE服务器配置
    });
    
    // 创建另一个本地WebRTC连接实例，用于回声消除
    let otherPC = new RTCPeerConnection({
      sdpSemantics: 'unified-plan',
      iceServers: iceServers,
    });

    // 当有ICE候选时，添加到另一个连接实例中
    pc.onicecandidate = (e) =>
      e.candidate && otherPC.addIceCandidate(new RTCIceCandidate(e.candidate));
    otherPC.onicecandidate = (e) =>
      e.candidate && pc.addIceCandidate(new RTCIceCandidate(e.candidate));

    // 当接收到轨道时，将其设置为音频播放器的来源
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        get().audioPlayerRef.current.srcObject = event.streams[0];
      }
    };

    // 获取用户麦克风输入流
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: get().selectedMicrophone.values().next().value, // 选择的麦克风设备ID
        echoCancellation: true, // 开启回声消除
        noiseSuppression: true, // 开启噪声抑制
      },
    });
    let micStream = stream;

    // 将麦克风输入流的轨道添加到本地WebRTC连接实例中
    await stream.getTracks().forEach(function (track) {
      pc.addTrack(track, stream);
    });

    // 为通话期间维护单一音频流
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let incomingStreamDestination = audioContext.createMediaStreamDestination();
    incomingStreamDestination.stream.getTracks().forEach(function (track) {
      otherPC.addTrack(track, incomingStreamDestination.stream);
    });

    // 在两个本地连接之间进行协商
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await otherPC.setRemoteDescription(offer);
    const answer = await otherPC.createAnswer();
    await otherPC.setLocalDescription(answer);
    await pc.setRemoteDescription(answer);

    // 更新状态，存储连接实例和音频处理相关对象
    set({
      pc: pc,
      otherPC: otherPC,
      micStream: micStream,
      incomingStreamDestination: incomingStreamDestination,
      audioContext: audioContext,
    });

    // 返回一个Promise，当ICE连接状态改变时解析Promise
    return new Promise((resolve) => {
      pc.oniceconnectionstatechange = (e) => {
        if (pc.iceConnectionState === 'connected') {
          console.log('WebRTC ICE Connected!'); // 日志输出，ICE连接已建立
          set({ rtcConnectionEstablished: true }); // 更新状态，指示连接已建立
          resolve(); // 解析Promise
        }
      };
    });
  },

  // 关闭WebRTC连接的方法
  closePeer: () => {
    get().pc?.close(); // 关闭本地WebRTC连接实例
    get().otherPC?.close(); // 关闭用于回声消除的本地WebRTC连接实例
    set({
      pc: null,
      otherPC: null,
      rtcConnectionEstablished: false, // 更新状态，指示连接已关闭
    });
  },
});
