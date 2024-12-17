import React, { useState, useRef, useEffect } from 'react';
import { RiThumbUpLine, RiThumbDownLine, RiPlayLine } from 'react-icons/ri';
import { Button } from '@nextui-org/button';
import { useAppStore } from '@/zustand/store';
import Image from 'next/image';
import BlurToggle from './_components/BlurToggle';
import WordPopover from './_components/WordPopover';
import realCharSVG from '@/assets/svgs/realchar.svg';
import TextToSpeech from './_components/TextToSpeech';

export default function Chat() {
  const { chatContent, interimChat, character } = useAppStore();
  const messageEndRef = useRef(null);

  const [blurredStates, setBlurredStates] = useState({});

  const { playTextToSpeech, isPlaying } = TextToSpeech();

  useEffect(() => {
    const initialBlurredStates = {};
    [...chatContent, interimChat].forEach((line) => {
      if (line && line.timestamp) {
        initialBlurredStates[line.timestamp] = true;
      }
    });
    setBlurredStates(initialBlurredStates);
  }, [chatContent, interimChat]);

  const handleBlurChange = (id, newBlurredState) => {
    setBlurredStates((prev) => ({
      ...prev,
      [id]: newBlurredState,
    }));
  };

  return (
    <div className="custom-conversation-container">
      <div className="custom-conversation-container scrollbar">
        <div className="flex flex-col gap-5 overflow-y-scroll min-h-25">
          {[...chatContent, interimChat].map((line) => {
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
                      <p
                        className={`w-fit max-w-[450px] py-2 px-5 font-light flex-none rounded-3xl md:mr-3 rounded-bl-none bg-real-blue-500/20 whitespace-pre-wrap ${blurredStates[line.timestamp] ? 'filter blur' : ''}`}
                      >
                        {line.content.split(' ').map((word, index) => (
                          <WordPopover key={index} word={word} />
                        ))}
                      </p>
                      <div className="flex items-center">
                        <BlurToggle id={line.timestamp} onBlurChange={handleBlurChange} />
                        <Button
                          isIconOnly
                          aria-label="play text-to-speech"
                          radius="full"
                          variant="light"
                          className="text-gray-600 hover:text-white hover:bg-blue-600 min-w-fit md:min-w-10 md:h-10"
                          onClick={() => playTextToSpeech(line.content)}
                        >
                          <RiPlayLine size="1.5em" />
                        </Button>
                        <Button
                          isIconOnly
                          aria-label="thumb up"
                          radius="full"
                          variant="light"
                          className="text-gray-600 hover:text-white hover:bg-blue-600 min-w-fit md:min-w-10 md:h-10"
                        >
                          <RiThumbUpLine size="1.5em" />
                        </Button>
                        <Button
                          isIconOnly
                          aria-label="thumb down"
                          radius="full"
                          variant="light"
                          className="text-gray-600 hover:text-white hover:bg-blue-600 min-w-fit md:min-w-10 md:h-10"
                        >
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
                    <p className="w-fit max-w-[450px] py-2 px-5 font-light flex-none rounded-3xl rounded-br-none bg-real-blue-500/50 whitespace-pre-wrap">
                      {line.content}
                    </p>
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
          })}
          <div ref={messageEndRef}></div>
        </div>
      </div>
    </div>
  );
}
