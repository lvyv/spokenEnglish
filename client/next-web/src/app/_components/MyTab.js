// import { useMyCharacters } from '@/util/apiClient';
// import MyCharacterCard from '@/app/_components/MyCharacterCard';
// import { Card, CardBody } from '@nextui-org/react';
// import Link from 'next/link';
// import { BsPlusLg } from 'react-icons/bs';

// // 定义一个名为MyTab的函数组件，接受isDisplay作为参数
// export default function MyTab({ isDisplay }) {
//   // 使用自定义hook获取角色数据
//   const { characters } = useMyCharacters();
//   // 根据isDisplay参数决定显示方式
//   const display = isDisplay ? 'flex' : 'hidden';

//   return (
//     // 返回一个包含角色卡片和创建角色链接的section
//     <section className={`flex flex-row flex-wrap justify-center mt-10 gap-5 ${display}`}>
//       {/* 创建角色卡片的链接 */}
//       <Card className="md:basis-52 bg-white text-black">
//         <CardBody className="flex justify-center">
//           <Link href="/create">
//             <BsPlusLg className="w-7 h-7 block my-2.5 mx-auto fill-real-blue-500" />
//             <p className="text-xs leading-5 text-center text-real-blue-500 font-light">
//               Create a character
//             </p>
//           </Link>
//         </CardBody>
//       </Card>

//       {/* 遍历角色数据，渲染符合条件的角色卡片 */}
//       {characters?.map((character) => {
//         return character.location === 'database' && character.is_author ? (
//           <div key={character.character_id} className='basis-72 md:basis-52'>
//             <MyCharacterCard character={character} playingId={''} handlePlay={() => { }} />
//           </div>
//         ) : null;
//       })}
//     </section>
//   );
// }

import MyCharacterCard from '@/app/_components/MyCharacterCard';
import { Card, CardBody } from '@nextui-org/react';
import Link from 'next/link';
import { BsPlusLg } from 'react-icons/bs';

export default function MyTab({ isDisplay }) {
  const { characters } = useMyCharacters();
  const display = isDisplay ? 'flex' : 'hidden';

  return (
    <section className={`flex flex-col items-end mt-10 gap-5 ${display}`}>
      <Card className="md:w-64 bg-white text-black"> 
        <CardBody className="flex justify-center">
          <Link href="/create">
            <BsPlusLg className="w-6 h-6 block my-2.5 mx-auto fill-real-blue-500" />
            <p className="text-xs leading-5 text-center text-real-blue-500 font-light">
              Create a character
            </p>
          </Link>
        </CardBody>
      </Card>

      {characters?.map((character) => {
        return character.location === 'database' && character.is_author ? (
          <div key={character.character_id} className="w-full max-w-sm">  
            <MyCharacterCard character={character} playingId={''} handlePlay={() => { }} />
          </div>
        ) : null;
      })}
    </section>
  );
}

