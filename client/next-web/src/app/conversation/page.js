'use client';
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import SettingBar from './_components/SettingBar';
import Chat from './_components/Chat';
import HandsFreeMode from './_components/HandsFreeMode';
import TextMode from './_components/TextMode';
import HamburgerMenu from './_components/HamburgerMenu';
import ShareButton from './_components/SettingBar/ShareButton';
import TabButton from '@/components/TabButton';
import Image from 'next/image';
import exitIcon from '@/assets/svgs/exit.svg';
import { BsChatRightText, BsTelephone } from 'react-icons/bs';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/zustand/store';
import lz from 'lz-string';
import { playAudios } from '@/util/audioUtils';
import JournalMode from './_components/JournalMode';
import './conversationStyles.css'; // 自定义 CSS 文件

export default function Conversation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isTextMode, setIsTextMode] = useState(true);
  const { isJournalMode, setIsJournalMode, resetJournal, resetSpeakersList } =
    useAppStore();
  const { character, getAudioList, setCharacter, clearChatContent } =
    useAppStore();
  const { socketIsOpen, sendOverSocket, connectSocket, closeSocket } =
    useAppStore();
  const { mediaRecorder, connectMicrophone, startRecording, stopRecording, closeMediaRecorder } = useAppStore();
  const audioPlayerRef = useRef(null);
  const audioQueueRef = useRef(useAppStore.getState().audioQueue);
  const { isPlaying, setIsPlaying, popAudioQueueFront } = useAppStore();
  const { setAudioPlayerRef, stopAudioPlayback } = useAppStore();
  const { connectPeer, closePeer, incomingStreamDestination, audioContext, rtcConnectionEstablished } = useAppStore();
  const { selectedMicrophone, selectedSpeaker } = useAppStore();
  const { vadEvents, vadEventsCallback, disableVAD, enableVAD, closeVAD } = useAppStore();

  useEffect(() => useAppStore.subscribe(state => (audioQueueRef.current = state.audioQueue)), []);

  useEffect(() => {
    const characterString = searchParams.get('character');
    const character = JSON.parse(lz.decompressFromEncodedURIComponent(characterString));
    setCharacter(character);
    setIsJournalMode(false);
    resetJournal();
    resetSpeakersList();
  }, []);

  useEffect(() => {
    setAudioPlayerRef(audioPlayerRef);
  }, []);

  useEffect(() => {
    connectSocket();
  }, [character]);

  useEffect(() => {
    if (mediaRecorder) {
      closeMediaRecorder();
    }
    if (rtcConnectionEstablished) {
      closePeer();
    }
    getAudioList().then(() => {
      connectPeer().then(() => {
        connectMicrophone();
        initializeVAD();
      });
    });
  }, [selectedMicrophone]);

  function initializeVAD() {
    if (vadEvents) {
      closeVAD();
    }
    vadEventsCallback(
      () => {
        stopAudioPlayback();
        startRecording();
      },
      () => {
        sendOverSocket('[&Speech]');
        stopRecording();
      },
      () => {
        sendOverSocket('[SpeechFinished]');
      }
    );
    if (!isTextMode && !disableMic) {
      enableVAD();
    }
  }

  const { preferredLanguage, selectedModel } = useAppStore();
  useEffect(() => {
    if (!mediaRecorder || !socketIsOpen || !rtcConnectionEstablished) {
      return;
    }
    closeSocket();
    clearChatContent();
    connectSocket();
    initializeVAD();
  }, [preferredLanguage, selectedModel]);

  useEffect(() => {
    if (typeof audioPlayerRef.current.setSinkId === 'function') {
      audioPlayerRef.current.setSinkId(selectedSpeaker.values().next().value);
    }
  }, [selectedSpeaker]);

  useEffect(() => {
    if (audioContext, !isPlaying && audioQueueRef.current?.length > 0) {
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

  function handsFreeMode() {
    setIsTextMode(false);
    if (!disableMic) {
      enableVAD();
    }
  }

  function textMode() {
    setIsTextMode(true);
    disableVAD();
  }

  function toggleMute() {
    if (!isMute) {
      stopAudioPlayback();
    }
    setIsMute(!isMute);
  }

  function handleMic() {
    if (disableMic) {
      enableVAD();
    } else {
      disableVAD();
    }
    setDisableMic(!disableMic);
  }

  const cleanUpStates = () => {
    disableVAD();
    closeVAD();
    stopAudioPlayback();
    closeMediaRecorder();
    closePeer();
    closeSocket();
    clearChatContent();
    setCharacter({});
  };

  useEffect(() => {
    if (isJournalMode) {
      enableVAD();
    } else {
      disableVAD();
    }
  }, [isJournalMode]);

  return (
    <div className="relative h-screen custom-conversation-container">
      <audio ref={audioPlayerRef} className="audio-player">
        <source src="" type="audio/mp3" />
      </audio>
      {!isJournalMode ? (
        <>
          <div className="fixed top-0 w-full custom-header z-10">
            <div className="grid grid-cols-4 gap-5 pt-4 md:pt-5 items-center">
              <div>
                <Tooltip content="Exit" placement="bottom">
                  <Button
                    isBlock
                    isIconOnly
                    radius="full"
                    className="hover:opacity-80 h-8 w-8 md:h-12 md:w-12 ml-5 mt-1 custom-button"
                    onPress={() => {
                      router.push('/');
                      cleanUpStates();
                    }}
                  >
                    <Image priority src={exitIcon} alt="exit" />
                  </Button>
                </Tooltip>
              </div>
              <div className="col-span-2 flex gap-5 border-2 rounded-full p-1 custom-tab-border">
                <TabButton isSelected={isTextMode} handlePress={textMode} className="min-w-fit h-fit py-2 md:min-w-20 md:h-11 md:py-4">
                  <span className="md:hidden">
                    <BsChatRightText size="1.2em" />
                  </span>
                  <span className="hidden md:inline">Text</span>
                  <span className="hidden lg:inline">&nbsp;mode</span>
                </TabButton>
                <TabButton isSelected={!isTextMode} handlePress={handsFreeMode} className="min-w-fit h-fit py-2 md:min-w-20 md:h-11 md:py-4">
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
            <div className="flex flex-col mt-4 md:mt-5 pt-2 md:pt-5 pb-5 border-t-2 custom-divider md:mx-auto md:w-unit-9xl lg:w-[892px]">
              <SettingBar isTextMode={isTextMode} isMute={isMute} toggleMute={toggleMute} disableMic={disableMic} handleMic={handleMic} />
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
          <div className="fixed bottom-0 w-full custom-footer">
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
