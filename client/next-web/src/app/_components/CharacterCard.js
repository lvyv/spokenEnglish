import {
  Card,
  CardBody,
  CardFooter,
  Avatar,
  Button
} from '@nextui-org/react';
import { FaPlay, FaStop } from 'react-icons/fa';
import Image from 'next/image';
import audioSvg from '@/assets/svgs/audio.svg';
import { useRouter } from 'next/navigation';
import lz from 'lz-string';
import './character.css'; // 引入自定义滚动条样式

export default function CharacterCard({
  character,
  playingId,
  handlePlay
}) {
  const router = useRouter();
  const isPlaying = playingId === character.character_id;

  function handlePress() {
    return handlePlay(character.character_id, character.audio_url);
  }

  return (
    <Card className="p-1 max-w-xs h-[200px] bg-[#FFFAF0] text-black">
      <CardBody className="p-1 text-center flex flex-col gap-1">
        <Avatar
          radius="sm"
          src={character.image_url}
          className="w-8 h-8 md:w-16 md:h-16 mx-auto mt-1"
        />
        <div className="grow">
          <p className="name text-xs text-center h-8 flex flex-row justify-center items-center">
            <span>{character.name}</span>
          </p>
          <div className="flex justify-center mt-1 relative h-5">
            <Image
              src={audioSvg}
              alt=""
              className="w-4"
            />
            <Button
              isIconOnly
              variant="bordered"
              radius="full"
              color="white"
              className="opacity-70 absolute hover:opacity-80 hover:scale-105 hover:-translate-y-0.5 transform transition-transform text-xs"
              onPress={handlePress}
            >
              {!isPlaying ? (
                <FaPlay size="0.75em" />
              ) : (
                <FaStop size="0.75em" />
              )}
            </Button>
          </div>
        </div>
      </CardBody>
      <CardFooter className="mt-1">
        <Button
          className="w-full font-light bg-[#F0FFF0] hover:opacity-80 text-xs text-black"
          onPress={() => {
            const compressedCharacter = lz.compressToEncodedURIComponent(
              JSON.stringify(character)
            );
            router.push(`/conversation?character=${compressedCharacter}`);
          }}
        >
          Chat with me
        </Button>
      </CardFooter>
    </Card>
  );
}






