// 播放单个音频块
const playAudio = (audioPlayer, bufferSource) => {
    return new Promise(resolve => {
        // 当音频播放结束时，调用 resolve 方法，标记 Promise 完成
        bufferSource.onended = () => {
            resolve();
        };
        // 开始播放音频
        bufferSource.start();
        // 播放器开始播放音频
        audioPlayer.current
            .play()
            .then(() => {
                // 播放开始后取消静音
                audioPlayer.current.muted = false;
            })
            .catch(error => {
                // 处理播放错误
                if (error.name === 'NotSupportedError') {
                    alert(
                        `播放失败原因：${error}。请检查 https://elevenlabs.io/subscription 是否有足够的字符数。`
                    );
                } else {
                    alert(`播放失败原因：${error}`);
                }
            });
    });
};

// 播放所有音频块
export const playAudios = async (
    audioContext,
    audioPlayerRef,
    audioQueueRef,
    isPlaying,
    setIsPlaying,
    audioSourceNode,
    popAudioQueueFront
) => {
    console.log('playAudios called');
    // 检查必要的参数是否有效，以及是否已经在播放中
    if (!audioContext || !audioPlayerRef.current || !audioSourceNode || isPlaying || audioQueueRef.current?.length === 0) {
        console.log('播放已取消：无效的参数或已经在播放中。');
        return;
    }
    // 设置播放状态为 true
    setIsPlaying(true);
    // 当音频队列中还有音频数据时，循环播放
    while (audioQueueRef.current?.length > 0) {
        // 如果音频缓冲区已分离，取消播放
        if (audioQueueRef.current[0].detached) {
            console.log('播放已取消：音频缓冲区已分离。');
            return;
        }
        console.log('正在播放音频 ', audioQueueRef.current[0].byteLength, ' 字节...');
        try {
            // 解码音频数据
            const audioBuffer = await audioContext.decodeAudioData(
                audioQueueRef.current[0]
            );
            // 创建一个新的音频缓冲源
            const bs = audioContext.createBufferSource();
            bs.buffer = audioBuffer;
            bs.connect(audioSourceNode);

            // 播放音频
            await playAudio(
                audioPlayerRef,
                bs
            );
            // 播放完成后，移除队列前端的音频数据
            popAudioQueueFront();
        } catch (error) {
            console.error('解码音频数据时出错：', error);
            alert(`播放失败原因：${error}`);
            break;
        }
    }
    console.log('已完成播放音频');
    // 设置播放状态为 false
    setIsPlaying(false);
};
