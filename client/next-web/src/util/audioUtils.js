// 播放单个音频块
const playAudio = (
    audioPlayer,
    bufferSource,
) => {
    return new Promise(resolve => {
        bufferSource.onended = () => {
            resolve();
        };
        bufferSource.start();
        audioPlayer.current
            .play()
            .then(() => {
                audioPlayer.current.muted = false; // 播放开始后取消静音
            })
            .catch(error => {
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
    if (!audioContext || !audioPlayerRef.current || !audioSourceNode || isPlaying || audioQueueRef.current?.length === 0) {
        console.log('播放已取消：无效的参数或已经在播放中。');
        return;
    }
    setIsPlaying(true);
    while (audioQueueRef.current?.length > 0) {
        if (audioQueueRef.current[0].detached) {
            console.log('播放已取消：音频缓冲区已分离。');
            return;
        }
        console.log('正在播放音频 ', audioQueueRef.current[0].byteLength, ' 字节...');
        try {
            const audioBuffer = await audioContext.decodeAudioData(
                audioQueueRef.current[0]
            );
            const bs = audioContext.createBufferSource();
            bs.buffer = audioBuffer;
            bs.connect(audioSourceNode);

            await playAudio(
                audioPlayerRef,
                bs
            );
            popAudioQueueFront();
        } catch (error) {
            console.error('解码音频数据时出错：', error);
            alert(`播放失败原因：${error}`);
            break;
        }
    }
    console.log('已完成播放音频');
    setIsPlaying(false);
};
