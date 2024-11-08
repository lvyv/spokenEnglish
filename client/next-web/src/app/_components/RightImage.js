import AImage from '@/assets/svgs/CC.jpg';
import Image from 'next/image';

const RightImage = () => (
  <div className="w-full h-full relative overflow-hidden">
    <Image
      src={AImage}
      alt="Right image"
      layout="responsive" // 使图片响应式
      width={50}        // 设置你希望的宽度
      height={50}       // 设置你希望的高度
      className="object-contain"
    />
    {/* <p>Right Image Loaded</p> Debugging info */}
  </div>
);

export default RightImage;