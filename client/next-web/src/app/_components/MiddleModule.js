
// "use client";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { useState } from "react";
// import Image from 'next/image';
// import './MiddleModule.css';  // 引入自定义样式文件

// // 引入图片
// import AImage from '@/assets/svgs/A.jpg';
// import BImage from '@/assets/svgs/B.jpg';
// import CImage from '@/assets/svgs/C.jpg';

// export default function MiddleModule() {
//   const [searchQuery, setSearchQuery] = useState("");
  
  
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
    
//     arrows: false, // 关闭箭头
//   };

//   const images = [AImage, BImage, CImage];

//   return (
//     <div className="relative bg-white min-h-[100px] p-4 flex items-center justify-center">
//       <div className="container"> 
//         <Slider {...settings}>
//           {images.map((src, index) => (
//             <div key={index} className="slider-container"> 
//               <Image
//                 src={src}
//                 alt={`Slide ${index + 1}`}
//                 layout="responsive"
//                 width={100}          
//                 height={100} 
//                 className="h-full"
//               />
//               {/* <div className="absolute inset-0 flex items-center justify-center">
//                 <p className="text-white font-bold text-4xl whitespace-nowrap">
//                   Learn English Anytime Anywhere
//                 </p>
//               </div> */}
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </div>
//   );
// }

"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import Image from 'next/image';
import './MiddleModule.css';  // 引入自定义样式文件

// 引入图片
import AImage from '@/assets/svgs/A.jpg';
import BImage from '@/assets/svgs/B.jpg';
import CImage from '@/assets/svgs/C.jpg';

export default function MiddleModule() {
  const [searchQuery, setSearchQuery] = useState("");

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // 关闭箭头
  };

  const images = [AImage, BImage, CImage];

  return (
    <div className="relative bg-white min-h-[100px] p-4 flex flex-col items-center justify-center">
      {/* 添加文本的部分 */}
      <div className="absolute top-[-50px] text-center whitespace-nowrap w-full">
        <h1 className="text-4xl font-extrabold text-black font-serif">
          欢迎来到 <span className="bg-gradient-to-r from-blue-400 to-green-500 text-transparent bg-clip-text text-5xl">VerbaVista</span>,开启英语口语的精彩旅程！
        </h1>
      </div>

      <div className="container">
        <Slider {...settings}>
          {images.map((src, index) => (
            <div key={index} className="slider-container">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                layout="responsive"
                width={100}
                height={100}
                className="h-full"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
