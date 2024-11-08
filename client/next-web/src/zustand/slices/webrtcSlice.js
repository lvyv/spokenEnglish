export const createWebRTCSlice = (set, get) => ({
  // Audio player.
  shouldPlayAudio: true,
  setShouldPlayAudio: (v) => {
    set({ shouldPlayAudio: v });
  },
  audioQueue: [],
  pushAudioQueue: (audio) => {
    set((state) => ({ audioQueue: [...state.audioQueue, audio] })); 
  },
  popAudioQueueFront: () => {
    set((state) => ({ audioQueue: [...state.audioQueue.slice(1)] }));
  },
  isPlaying: false,
  setIsPlaying: (v) => {
    set({ isPlaying: v });
  },
  audioPlayerRef: null,
  setAudioPlayerRef: (ref) => {
    set({ audioPlayerRef: ref });   //对音频播放器引用的管理和更新
  },
  stopAudioPlayback: () => {
    console.log('Stopping audio playback'); //停止播放所有音频
    set({ audioQueue: [] });   //清空音频队列
    if (get().audioPlayerRef && get().audioPlayerRef.current) {  //
      get().setShouldPlayAudio(false);  //设置音频播放状态为停止
      get().audioPlayerRef.current.pause(); //暂停当前正在播放的音频
    }
  },
  // Peer related.
  
  pc: null,
  otherPC: null,
  micStream: null,
  incomingStreamDestination: null,
  audioContext: null,

  rtcConnectionEstablished: false,
  connectPeer: async () => {
    if (get().pc) {
      console.log('Should not call connectPeer if webrtc connection already established!');
    }
    // Use turn server when NEXT_PUBLIC_TURN_SERVER_API_ENDPOINT is set.
    let iceServers = [];
    if (process.env.NEXT_PUBLIC_TURN_SERVER_API_ENDPOINT) {
      const response = await fetch(process.env.NEXT_PUBLIC_TURN_SERVER_API_ENDPOINT);
      iceServers = await response.json();
    }
    let pc = new RTCPeerConnection({
      sdpSemantics: 'unified-plan',
      iceServers: iceServers,
    });
    // Setup local webrtc connection just for echo cancellation.
    let otherPC = new RTCPeerConnection({
      sdpSemantics: 'unified-plan',
      iceServers: iceServers,
    });
    pc.onicecandidate = (e) =>  //事件处理函数，ICE 候选者处理
      e.candidate && otherPC.addIceCandidate(new RTCIceCandidate(e.candidate));
    otherPC.onicecandidate = (e) =>
      e.candidate && pc.addIceCandidate(new RTCIceCandidate(e.candidate));
    pc.ontrack = (event) => {  //事件处理函数，接收到远程媒体流
      if (event.streams && event.streams[0]) {
        get().audioPlayerRef.current.srcObject = event.streams[0];
      }
    };
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: get().selectedMicrophone.values().next().value,
        echoCancellation: true, //启用回声消除功能。
        noiseSuppression: true,  //启用降噪功能。
      },
    });
    let micStream = stream;
    await stream.getTracks().forEach(function (track) {
      pc.addTrack(track, stream);
    });
    // Maintain a single audio stream for the duration of the call.
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let incomingStreamDestination = audioContext.createMediaStreamDestination();
    incomingStreamDestination.stream.getTracks().forEach(function (track) {
      otherPC.addTrack(track, incomingStreamDestination.stream);
    });
    // Negotiation between two local peers.
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await otherPC.setRemoteDescription(offer);
    const answer = await otherPC.createAnswer();
    await otherPC.setLocalDescription(answer);
    await pc.setRemoteDescription(answer);
    set({
      pc: pc,
      otherPC: otherPC,
      micStream: micStream,
      incomingStreamDestination: incomingStreamDestination,
      audioContext: audioContext,
    });

    return new Promise((resolve) => {
      pc.oniceconnectionstatechange = (e) => {
        if (pc.iceConnectionState === 'connected') {
          console.log('WebRTC ICE Connected!');
          set({ rtcConnectionEstablished: true });
          resolve();
        }
      };
    });
  },
  closePeer: () => {
    get().pc?.close();
    get().otherPC?.close();
    set({
      pc: null,
      otherPC: null,
      rtcConnectionEstablished: false,
    });
  },
});
