
import {
  Card,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Link
} from '@nextui-org/react';
import NextLink from 'next/link';
import { BiEdit } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import lz from 'lz-string';

export default function CharacterCard({
  character
}) {
  const router = useRouter();

  return (
    <Card className="p-1 max-w-xs h-[200px] bg-gray-200 text-black]"> 
      <CardBody className="p-1 text-center flex flex-col gap-1">
        <Avatar
          radius="sm"
          src={character.image_url}
          className="w-8 h-8 md:w-16 md:h-16 mx-auto mt-1"
        />
        <div className="grow">
          <p className="name text-xs text-center h-8 flex flex-row justify-center items-center"><span>{character.name}</span></p> 
          <div className="flex justify-center mt-1 relative h-5"> {/* 进一步缩小高度 */}
            <Link
              href={{
                pathname: '/edit',
                query: {character: lz.compressToEncodedURIComponent(JSON.stringify(character))}
              }}
              as={NextLink}
              underline="hover"
              className="text-black flex items-center text-xs">
              <BiEdit size="0.75em" className="mr-1"/>
              Edit details
            </Link>
          </div>
        </div>
      </CardBody>
      <CardFooter className="mt-1"> {/* 减少间距 */}
        <Button
          className="w-full font-light bg-default/40 hover:opacity-80 text-xs text-black"
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

