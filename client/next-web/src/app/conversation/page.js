'use client';

// 导入必要的组件和库
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import SettingBar from './_components/SettingBar';  // 设置栏组件
import Chat from './_components/Chat';  // 聊天组件
import HandsFreeMode from './_components/HandsFreeMode';  // 免提模式组件
import TextMode from './_components/TextMode';  // 文本模式组件
import HamburgerMenu from './_components/HamburgerMenu';  // 汉堡菜单组件
import ShareButton from './_components/SettingBar/ShareButton';  // 分享按钮组件
import TabButton from '@/components/TabButton';  // 选项卡按钮组件
import Image from 'next/image';  // 图片组件
import exitIcon from '@/assets/svgs/exit.svg';  // 退出图标
import { BsChatRightText, BsTelephone } from 'react-icons/bs';  // 图标
import { useEffect, useRef, useState } from 'react';  // React钩子
import { useRouter, useSearchParams } from 'next/navigation';  // Next.js 路由和搜索参数钩子
import { useAppStore } from '@/zustand/store';  // 应用状态管理钩子
import lz from 'lz-string';  // 压缩和解压缩库
import { playAudios } from '@/util/audioUtils';  // 音频播放实用工具
import JournalMode from './_components/JournalMode';  // 日记模式组件

export default function Conversation() {
  const router = useRouter();  // 路由钩子
  const searchParams = useSearchParams();  // 获取URL参数钩子
  const [isTextMode, setIsTextMode] = useState(true);  // 控制文本模式状态
  const { isJournalMode, setIsJournalMode, resetJournal, resetSpeakersList } = useAppStore();  // 日记模式相关的状态和函数
  const { character, getAudioList, setCharacter, clearChatContent } = useAppStore();  // 角色相关的状态和函数
  
  // WebSocket相关的状态和函数
  const { socketIsOpen, sendOverSocket, connectSocket, closeSocket } = useAppStore();
  
  // 媒体录制相关的状态和函数
  const { mediaRecorder, connectMicrophone, startRecording, stopRecording, closeMediaRecorder } = useAppStore();
  
  // 音频播放器相关
  const audioPlayerRef = useRef(null);  // 音频播放器引用
  const audioQueueRef = useRef(useAppStore.getState().audioQueue);  // 音频队列引用
  const { isPlaying, setIsPlaying, popAudioQueueFront } = useAppStore();  // 音频播放状态和函数
  const { setAudioPlayerRef, stopAudioPlayback } = useAppStore();  // 音频播放器引用设置和停止播放函数
  
  // WebRTC相关
  const { connectPeer, closePeer, incomingStreamDestination, audioContext, rtcConnectionEstablished } = useAppStore();  // WebRTC相关状态和函数
  const { selectedMicrophone, selectedSpeaker } = useAppStore();  // 选择的麦克风和扬声器
  const { vadEvents, vadEventsCallback, disableVAD, enableVAD, closeVAD } = useAppStore();  // 语音活动检测（VAD）相关状态和函数

  // 订阅音频队列的变化，当音频队列变化时更新引用
  useEffect(
    () => useAppStore.subscribe(state => (audioQueueRef.current = state.audioQueue)),
    []
  );

  // 初始化角色信息和状态
  useEffect(() => {
    const characterString = searchParams.get('character');
    const character = JSON.parse(lz.decompressFromEncodedURIComponent(characterString));  // 解压缩并解析角色信息
    setCharacter(character);  // 设置角色信息
    setIsJournalMode(false);  // 设置日记模式为关闭
    resetJournal();  // 重置日记
    resetSpeakersList();  // 重置扬声器列表
  }, []);

  // 绑定音频播放器引用到状态
  useEffect(() => {
    setAudioPlayerRef(audioPlayerRef);
  }, []);

  // 连接WebSocket
  useEffect(() => {
    connectSocket();
  }, [character]);

  // 当麦克风选择变化时重新连接和初始化VAD
  useEffect(() => {
    if (mediaRecorder) {
      closeMediaRecorder();  // 关闭媒体录制器
    }
    if (rtcConnectionEstablished) {
      closePeer();  // 关闭WebRTC连接
    }
    getAudioList()  // 获取音频列表
      .then(() => connectPeer())  // 连接WebRTC
      .then(() => {
        connectMicrophone();  // 连接麦克风
        initializeVAD();  // 初始化VAD
      });
  }, [selectedMicrophone]);

  // 初始化语音活动检测(VAD)
  function initializeVAD() {
    if (vadEvents) {
      closeVAD();  // 关闭VAD
    }
    vadEventsCallback(
      () => {
        stopAudioPlayback();  // 停止音频播放
        startRecording();  // 开始录音
      },
      () => {
        // 停止录音并发送中间音频片段到服务器
        sendOverSocket('[&Speech]');
        stopRecording();  // 停止录音
      },
      () => {
        sendOverSocket('[SpeechFinished]');  // 发送语音结束信号到服务器
      }
    );
    if (!isTextMode && !disableMic) {
      enableVAD();  // 启用VAD
    }
  }

  // 重新连接WebSocket并初始化VAD
  const { preferredLanguage, selectedModel } = useAppStore();
  useEffect(() => {
    if (!mediaRecorder || !socketIsOpen || !rtcConnectionEstablished) {
      return;
    }
    closeSocket();  // 关闭WebSocket
    clearChatContent();  // 清空聊天内容
    connectSocket();  // 重新连接WebSocket
    initializeVAD();  // 初始化VAD
  }, [preferredLanguage, selectedModel]);

  // 设置音频输出设备
  useEffect(() => {
    // 在Android设备上选择音频设备可能会有问题
    if (typeof audioPlayerRef.current.setSinkId === 'function') {
      audioPlayerRef.current.setSinkId(selectedSpeaker.values().next().value);
    }
  }, [selectedSpeaker]);

  // 播放音频队列
  useEffect(() => {
    if (audioContext && !isPlaying && audioQueueRef.current?.length > 0) {
      playAudios(
        audioContext,
        audioPlayerRef,
        audioQueueRef,
        isPlaying,
        setIsPlaying,
        incomingStreamDestination,
        popAudioQueueFront
      );
    }
  }, [audioContext, audioQueueRef.current?.length]);

  const { isMute, setIsMute, disableMic, setDisableMic } = useAppStore();

  // 切换到免提模式
  function handsFreeMode() {
    setIsTextMode(false);
    if (!disableMic) {
      enableVAD();  // 启用VAD
    }
  }

  // 切换到文本模式
  function textMode() {
    setIsTextMode(true);
    disableVAD();  // 禁用VAD
  }

  // 切换静音状态
  function toggleMute() {
    if (!isMute) {
      stopAudioPlayback();  // 停止音频播放
    }
    setIsMute(!isMute);  // 切换静音状态
  }

  // 切换麦克风启用状态
  function handleMic() {
    if (disableMic) {
      enableVAD();  // 启用VAD
    } else {
      disableVAD();  // 禁用VAD
    }
    setDisableMic(!disableMic);  // 切换麦克风启用状态
  }

  // 清理状态
  const cleanUpStates = () => {
    disableVAD();  // 禁用VAD
    closeVAD();  // 关闭VAD
    stopAudioPlayback();  // 停止音频播放
    closeMediaRecorder();  // 关闭媒体录制器
    closePeer();  // 关闭WebRTC连接
    closeSocket();  // 关闭WebSocket
    clearChatContent();  // 清空聊天内容
    setCharacter({});  // 清空角色信息
  };

  // 日记模式
  useEffect(() => {
    if (isJournalMode) {
      enableVAD();  // 启用VAD
    } else {
      disableVAD();  // 禁用VAD
    }
  }, [isJournalMode]);

  return (
    <div className="relative h-screen conversation_container">
      <audio ref={audioPlayerRef} className="audio-player">
        <source src="" type="audio/mp3" />
      </audio>
      {!isJournalMode ? (
        <>
          <div className="fixed top-0 w-full bg-background z-10">
            <div className="grid grid-cols-4 gap-5 pt-4 md:pt-5 items-center">
              <div>
                <Tooltip content="Exit" placement="bottom">
                  <Button
                    isBlock
                    isIconOnly
                    radius="full"
                    className="hover:opacity-80 h-8 w-8 md:h-12 md:w-12 ml-5 mt-1 bg-button"
                    onPress={() => {
                      router.push('/');
                      cleanUpStates();  // 清理状态
                    }}
                  >
                    <Image priority src={exitIcon} alt="exit" />
                  </Button>
                </Tooltip>
              </div>
              <div className="col-span-2 flex gap-5 border-2 rounded-full p-1 border-tab">
                <TabButton
                  isSelected={isTextMode}
                  handlePress={textMode}
                  className="min-w-fit h-fit py-2 md:min-w-20 md:h-11 md:py-4"
                >
                  <span className="md:hidden">
                    <BsChatRightText size="1.2em" />
                  </span>
                  <span className="hidden md:inline">Text</span>
                  <span className="hidden lg:inline">&nbsp;mode</span>
                </TabButton>
                <TabButton
                  isSelected={!isTextMode}
                  handlePress={handsFreeMode}
                  className="min-w-fit h-fit py-2 md:min-w-20 md:h-11 md:py-4"
                >
                  <span className="md:hidden">
                    <BsTelephone size="1.2em" />
                  </span>
                  <span className="hidden md:inline">Hands-free</span>
                  <span className="hidden lg:inline">&nbsp;mode</span>
                </TabButton>
              </div>
              <div className="flex flex-row justify-self-end md:hidden">
                <ShareButton />
                <HamburgerMenu />
              </div>
            </div>
            <div className="flex flex-col mt-4 md:mt-5 pt-2 md:pt-5 pb-5 border-t-2 border-divider md:mx-auto md:w-unit-9xl lg:w-[892px]">
              <SettingBar
                isTextMode={isTextMode}
                isMute={isMute}
                toggleMute={toggleMute}
                disableMic={disableMic}
                handleMic={handleMic}
              />
            </div>
          </div>
          <div className="h-full -mb-24">
            <div className="h-[154px] md:h-[178px]"></div>
            {!isTextMode && <div className="h-[250px] md:h-[288px]"></div>}
            <div className="w-full px-4 md:px-0 mx-auto md:w-unit-9xl lg:w-[892px]">
              <Chat />
            </div>
            <div className="h-24"></div>
          </div>
          <div className="fixed bottom-0 w-full bg-background">
            <div className="px-4 md:px-0 mx-auto md:w-unit-9xl lg:w-[892px]">
              <HandsFreeMode isDisplay={!isTextMode} />
              <TextMode isDisplay={isTextMode} />
            </div>
          </div>
        </>
      ) : (
        <JournalMode />
      )}
    </div>
  );
}
