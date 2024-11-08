
import Tabs from './_components/Tabs';
import Header from './_components/Header';
import Footer from './_components/Footer';
import Sections from './_components/Sections';
import LeftModule from './_components/LeftModule';
import MiddleModule from './_components/MiddleModule';
import { getCharacters } from '../util/apiSsr';
import LeftImage from './_components/LeftImage';
import RightImage from './_components/RightImage';

export default async function Page() {
  const characters = await getCharacters();
  return (
    <>
      <Header />

      <div className="w-full bg-gray-200 p-4">
        <LeftModule />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen">

        <div className="relative flex w-full max-w-[90%] bg-white p-0 mt-4">


          <div className="flex flex-col w-[78%] mx-0">


            <div className="flex-none bg-transparent p-4 mt-10" style={{ height: '35%' }}>
              <MiddleModule />
            </div>


            <div className="flex-grow bg-gray-50 p-4 flex flex-col justify-between  ">
              <Sections />


              <div className="flex justify-between mt-auto gap-x-6">

                <div className="w-[45%] h-56 bg-gray-50 rounded-lg p-2 border-none shadow-lg">

                  <LeftImage />
                </div>


                <div className="w-[45%] h-56 bg-gray-50 rounded-lg p-2 border-none shadow-lg">

                  <RightImage />
                </div>
              </div>
            </div>
          </div>


          <div className="absolute top-0 right-0 w-[20%] bg-gray-200 p-2 h-full">
            <div className="h-full overflow-y-auto scrollbar-hidden rounded-lg p-4 bg-white shadow-lg">
              <Tabs characters={characters} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}


// export default async function Page() {
//   const characters = await getCharacters();
//   return (
//     <>
//       <Header />

//       <div className="w-full bg-gray-200 p-4">
//         <LeftModule />
//       </div>

//       <div className="relative flex flex-col items-center justify-center min-h-screen">
//         <div className="relative flex w-full max-w-[90%] bg-white p-0 mt-4"> 
//           <div className="flex flex-col w-[78%] mx-0">

//             {/* 中间模块，设置最大高度，适应背景图 */}
//             <div className="flex-none bg-transparent p-0" style={{ maxHeight: '350px', overflow: 'hidden' }}>
//               <MiddleModule className="w-full h-full object-cover" style={{ height: '100%' }} />
//             </div>

//             {/* Sections 模块，占据剩余空间 */}
//             <div className="flex-grow bg-gray-50 p-4 flex flex-col justify-between" style={{ flex: '1' }}>
//               <Sections />

//               {/* 新增两个并排的模块 */}
//               <div className="flex justify-between mt-auto gap-x-6"> 
//                 <div className="w-[45%] h-56 bg-gray-50 rounded-lg p-2 border-none shadow-lg">
//                   <LeftImage />
//                 </div>

//                 <div className="w-[45%] h-56 bg-gray-50 rounded-lg p-2 border-none shadow-lg">
//                   <RightImage />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* 右模块，保持不变 */}
//           <div className="absolute top-0 right-0 w-[20%] bg-gray-200 p-2 h-full">
//             <div className="h-full overflow-y-auto scrollbar-hidden rounded-lg p-4 bg-white shadow-lg">
//               <Tabs characters={characters} />
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }



