import {
  RiThumbUpLine,
  RiThumbDownLine,
  RiEyeOffLine,
  RiPlayLine,
} from 'react-icons/ri';
import { Button } from '@nextui-org/button';
import { useAppStore } from '@/zustand/store';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import realCharSVG from '@/assets/svgs/realchar.svg';

export default function Chat() {
  const { chatContent, interimChat, character, otheraudioQueue } = useAppStore();
  const messageEndRef = useRef(null);
  const [blurred, setBlurred] = useState(true);
  const [selectedWord, setSelectedWord] = useState('');
  const [wordInfo, setWordInfo] = useState({ definition: '', usage: '', audioUrl: '' });
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef(null);
  const selectedWordRef = useRef(null);

  useEffect(() => {
    messageEndRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }, [chatContent]);

  const toggleBlurred = () => {
    setBlurred((prev) => !prev);
  };

  const playOtherAudio = () => {
    if (otheraudioQueue.length > 0) {
      const audioData = otheraudioQueue[0];
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => {
        console.log('Audio playback finished');
      };
    } else {
      console.log('No audio in the queue to play');
    }
  };

  const fetchWordInfo = async (word) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (response.ok) {
        const data = await response.json();
        const definition = data[0]?.meanings[0]?.definitions[0]?.definition || '未找到该单词的定义';
        const usage = data[0]?.meanings[0]?.definitions[0]?.example || '无例句';
        const audioUrl = data[0]?.phonetics.find((phonetic) => phonetic.audio)?.audio || '';
        setWordInfo({ definition, usage, audioUrl });
      } else {
        setWordInfo({ definition: '未找到该单词的定义', usage: '', audioUrl: '' });
      }
    } catch (error) {
      console.error('Error fetching word info:', error);
      setWordInfo({ definition: '获取信息失败', usage: '', audioUrl: '' });
    }
  };

  const handleWordClick = (word, event) => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    if (!cleanWord) return;

    const { clientX, clientY } = event;
    setSelectedWord(cleanWord);
    fetchWordInfo(cleanWord);

    // 更新弹窗位置，确保其在单词旁边
    const rect = event.target.getBoundingClientRect();
    setPopoverPosition({
        top: rect.top + window.scrollY + 10, // 在单词下方显示
        left: rect.left + window.scrollX
    });
    
    setIsPopoverVisible(true);
    selectedWordRef.current = event.target; // 保存被点击的单词
};

  const playPronunciation = () => {
    if (wordInfo.audioUrl) {
      const audio = new Audio(wordInfo.audioUrl);
      audio.play();
    }
  };

  const handleScroll = () => {
    if (selectedWordRef.current) {
        const rect = selectedWordRef.current.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            setPopoverPosition({
                top: rect.top + window.scrollY + 10,
                left: rect.left + window.scrollX
            });
        } else {
            setIsPopoverVisible(false);
        }
    }
};

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target) && !selectedWordRef.current?.contains(event.target)) {
      setIsPopoverVisible(false);
    }
  };

  useEffect(() => {
    if (isPopoverVisible) {
      document.addEventListener('scroll', handleScroll);
      document.addEventListener('mousedown', handleClickOutside); // Listen for clicks outside the popover
    } else {
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside); // Remove click listener
    }
    return () => {
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup
    };
  }, [isPopoverVisible]);

  return (
    <div className="custom-conversation-container">
      <div className="custom-conversation-container scrollbar">
        <div className="flex flex-col gap-5 overflow-y-scroll min-h-25">
          {
            [...chatContent, interimChat].map((line) => {
              if (line && line.hasOwnProperty('from') && line.from === 'character') {
                return (
                  <div key={line.timestamp} className="flex flex-row items-start gap-2">
                    <div className="flex flex-row items-start gap-2">
                      <Image
                        src={character.image_url}
                        alt="character"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="flex flex-col md:flex-row self-start items-start md:items-stretch">
                        <p className={`w-fit max-w-[450px] py-2 px-5 font-light flex-none rounded-3xl md:mr-3 rounded-bl-none bg-real-blue-500/20 whitespace-pre-wrap ${blurred ? 'filter blur' : ''}`}>
                          {line.content.split(' ').map((word, index) => (
                            <span key={index} className="cursor-pointer" onClick={(e) => handleWordClick(word, e)}>
                              {word}{' '}
                            </span>
                          ))}
                        </p>
                        <div className="flex items-center">
                          <Button isIconOnly aria-label="blur toggle" radius="full" variant="light" className="text-gray-600 hover:text-white hover:bg-blue-600 min-w-fit md:min-w-10 md:h-10" onClick={toggleBlurred}>
                            <RiEyeOffLine size="1.5em" />
                          </Button>
                          <Button isIconOnly aria-label="play other audio" radius="full" variant="light" className="text-gray-600 hover:text-white hover:bg-blue-600 min-w-fit md:min-w-10 md:h-10" onClick={playOtherAudio}>
                            <RiPlayLine size="1.5em" />
                          </Button>
                          <Button isIconOnly aria-label="thumb up" radius="full" variant="light" className="text-gray-600 hover:text-white hover:bg-blue-600 min-w-fit md:min-w-10 md:h-10">
                            <RiThumbUpLine size="1.5em" />
                          </Button>
                          <Button isIconOnly aria-label="thumb down" radius="full" variant="light" className="text-gray-600 hover:text-white hover:bg-blue-600 min-w-fit md:min-w-10 md:h-10">
                            <RiThumbDownLine size="1.5em" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else if (line && line.hasOwnProperty('from') && line.from === 'user') {
                return (
                  <div key={line.timestamp} className="flex flex-row self-end items-start gap-2">
                    <div className="flex flex-col md:flex-row self-end items-end md:items-stretch">
                      <p className={"w-fit max-w-[450px] py-2 px-5 font-light flex-none rounded-3xl rounded-br-none bg-real-blue-500/50 whitespace-pre-wrap"}>{line.content}</p>
                    </div>
                    <Image
                      src={realCharSVG}
                      alt="user"
                      className="w-8 h-8 rounded-lg"
                    />
                  </div>
                );
              } else if (line && line.hasOwnProperty('from') && line.from === 'message') {
                return (
                  <div key={line.timestamp} className="self-center">
                    <p className="text-tiny text-real-silver-500">{line.content}</p>
                  </div>
                );
              }
            })
          }
          <div ref={messageEndRef}></div>
        </div>
      </div>

      {isPopoverVisible && (
        <div 
          ref={popoverRef} 
          className="absolute z-10 bg-white p-4 rounded-lg shadow-lg max-w-[300px] w-full" 
          style={{ top: popoverPosition.top, left: popoverPosition.left }}
        >
          <h3 className="font-semibold text-xl text-real-blue-600 mb-2">{selectedWord}</h3>
          <p className="text-sm text-gray-800 mb-2">定义：{wordInfo.definition}</p>
          {/* 如果“用法”不是“无例句”，则显示“用法”行 */}
          {wordInfo.usage !== '无例句' && wordInfo.usage && (
            <p className="text-sm text-gray-700 mb-2">用法：{wordInfo.usage}</p>
          )}
          {wordInfo.audioUrl && (
            <button
              onClick={playPronunciation}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <RiPlayLine size="1.2em" className="inline-block mr-2" />
              播放发音
            </button>
          )}
        </div>
      )}
    </div>
  );
}
