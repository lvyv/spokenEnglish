import {
  RiThumbUpLine,
  RiThumbDownLine
} from 'react-icons/ri';
import { Button } from '@nextui-org/button';
import { useAppStore } from '@/zustand/store';
import { useRef, useEffect } from 'react';
import { Avatar } from '@nextui-org/avatar'; // 导入 Avatar 组件
import Image from 'next/image'; // 导入 Image 组件
import realCharSVG from '@/assets/svgs/realchar.svg'; // 导入用户头像 SVG

export default function Chat() {
  const { chatContent, interimChat, character } = useAppStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: 'center',
      inline: 'nearest'
    });
  }, [chatContent]);

  return (
    <div className="flex flex-col gap-5 overflow-y-scroll min-h-25">
      {
        [...chatContent, interimChat].map((line) => {
          if (line && line.hasOwnProperty('from') && line.from === 'character') {
            return (
              <div
                key={line.hasOwnProperty('timestamp') ? line.timestamp : 0}
                className="flex flex-row items-start gap-2"
              >
                <Avatar
                  src={character.image_url} // 角色的头像 URL
                  size="sm" // 头像大小
                  radius="sm" // 头像边角半径
                />
                <div className="flex flex-col md:flex-row self-start items-start md:items-stretch">
                  <p className={"w-fit max-w-[450px] py-2 px-5 font-light flex-none rounded-3xl md:mr-3 rounded-bl-none bg-real-blue-500/20 whitespace-pre-wrap"}>
                    {line.content}
                  </p>
                  <div>
                    <Button
                      isIconOnly
                      aria-label="thumb up"
                      radius="full"
                      variant="light"
                      className="text-white/50 hover:text-white hover:bg-button min-w-fit md:min-w-10 md:h-10"
                    >
                      <RiThumbUpLine size="1.5em" />
                    </Button>
                    <Button
                      isIconOnly
                      aria-label="thumb down"
                      radius="full"
                      variant="light"
                      className="text-white/50 hover:text-white hover:bg-button min-w-fit md:min-w-10 md:h-10"
                    >
                      <RiThumbDownLine size="1.5em" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          } else if (line && line.hasOwnProperty('from') && line.from === 'user') {
            return (
              <div
                key={line.timestamp}
                className="flex flex-row self-end items-start gap-2"
              >
                <div className="flex flex-col md:flex-row self-end items-end md:items-stretch">
                  <p className={"w-fit max-w-[450px] py-2 px-5 font-light flex-none rounded-3xl rounded-br-none bg-real-blue-500/50 whitespace-pre-wrap"}>
                    {line.content}
                  </p>
                </div>
                <Image
                  src={realCharSVG} // 用户的头像（使用 SVG 图像）
                  alt="user" // 图像的替代文本
                  className="w-8 h-8 rounded-lg" // 设置图像的样式
                />
              </div>
            )
          } else if (line && line.hasOwnProperty('from') && line.from === 'message') {
            return (
              <div
                key={line.timestamp}
                className="self-center"
              >
                <p className="text-tiny text-real-silver-500">{line.content}</p>
              </div>
            )
          }
        })
      }
      <div ref={messageEndRef}></div>
    </div>
  );
}
