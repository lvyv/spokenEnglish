import hark from 'hark'; // 导入 hark 库，用于语音活动检测

export const createRecorderSlice = (set, get) => ({
  // 记录录音状态
  isRecording: false,
  setIsRecording: v => {
    set({ isRecording: v }); // 设置录音状态
  },
  mediaRecorder: null, // 媒体录音对象

  // 连接麦克风
  connectMicrophone: () => {
    const deviceId = get().selectedMicrophone.values().next().value; // 获取选定的麦克风设备ID
    if (get().mediaRecorder) return; // 如果已有录音器，直接返回
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          deviceId: deviceId ? deviceId : undefined, // 获取音频流
        },
      })
      .then(stream => {
        let micStreamSourceNode =
          get().audioContext.createMediaStreamSource(stream); // 创建媒体流源节点
        let gainNode = get().audioContext.createGain(); // 创建增益节点
        gainNode.gain.setValueAtTime(1.5, get().audioContext.currentTime); // 设置增益值
        let delayNode = get().audioContext.createDelay(0.5); // 创建延迟节点
        delayNode.delayTime.value = 0.1; // 设置延迟时间
        let micStreamDestinationNode =
          get().audioContext.createMediaStreamDestination(); // 创建媒体流目标节点
        let mediaRecorder = new MediaRecorder(micStreamDestinationNode.stream); // 创建媒体录音器
        micStreamSourceNode
          .connect(gainNode)
          .connect(delayNode)
          .connect(micStreamDestinationNode); // 连接音频节点

        // 临时解决方案，用于模拟iOS 16中停止事件行为，当前iOS 16停止事件不会触发
        mediaRecorder.ondataavailable = event => {
          let blob = new Blob([event.data], { type: 'audio/webm' }); // 创建Blob对象
          get().sendOverSocket(blob); // 通过Socket发送音频数据
        };
        set({
          mediaRecorder: mediaRecorder, // 设置媒体录音器
        });
      })
      .catch(function (err) {
        console.log('An error occurred: ' + err); // 打印错误信息
        if (err.name === 'NotAllowedError') {
          alert(
            'Permission Denied: Please grant permission to access the microphone and refresh the website to try again!'
          ); // 提示用户麦克风权限被拒绝
        } else if (err.name === 'NotFoundError') {
          alert(
            'No Device Found: Please check your microphone device and refresh the website to try again.'
          ); // 提示用户麦克风设备未找到
        }
        get().closeMediaRecorder(); // 关闭媒体录音器
        // TODO: Route to / ?
      });
  },

  // 开始录音
  startRecording: () => {
    console.log('start recording');
    get().mediaRecorder?.start(); // 启动媒体录音器
    get().setIsRecording(true); // 设置录音状态为true
  },

  // 停止录音
  stopRecording: () => {
    console.log('stop recording');
    get().mediaRecorder?.stop(); // 停止媒体录音器
    get().setIsRecording(false); // 设置录音状态为false
  },

  // 关闭媒体录音器
  closeMediaRecorder: () => {
    get().stopRecording(); // 停止录音
    set({
      mediaRecorder: null, // 清空媒体录音器
    });
  },

  // 语音活动检测（VAD）
  vadEvents: null,
  isSpeaking: false, // 是否正在说话
  speakingMaxGap: 500, // 在ms中的最大间隔
  delayedSpeakingTimeoutID: null,

  // VAD事件回调
  vadEventsCallback: (
    voiceStartCallback,
    voiceInterimCallback,
    voiceEndCallback
  ) => {
    let vadEvents = hark(get().micStream, { interval: 20, threshold: -50 }); // 初始化VAD
    vadEvents.on('speaking', () => {
      voiceStartCallback(); // 调用语音开始回调
      if (!get().isSpeaking) {
        set({ isSpeaking: true }); // 设置正在说话状态
      } else {
        clearTimeout(get().delayedSpeakingTimeoutID); // 清除延迟的说话超时ID
      }
    });
    vadEvents.on('stopped_speaking', () => {
      if (get().isSpeaking) {
        const task = setTimeout(() => {
          voiceEndCallback(); // 调用语音结束回调
          set({ isSpeaking: false }); // 设置不在说话状态
        }, get().speakingMaxGap); // 延迟间隔
        set({ delayedSpeakingTimeoutID: task }); // 设置延迟的说话超时ID
        voiceInterimCallback(); // 调用语音中间回调
      }
    });
    vadEvents.suspend(); // 暂停VAD
    set({ vadEvents: vadEvents }); // 设置VAD事件
  },

  // 启用VAD
  enableVAD: () => {
    get().vadEvents?.resume(); // 恢复VAD
  },

  // 禁用VAD
  disableVAD: () => {
    get().vadEvents?.suspend(); // 暂停VAD
  },

  // 关闭VAD
  closeVAD: () => {
    get().vadEvents?.stop(); // 停止VAD
    set({ vadEvents: null, isSpeaking: false }); // 清空VAD事件，设置不在说话状态
  },
});
