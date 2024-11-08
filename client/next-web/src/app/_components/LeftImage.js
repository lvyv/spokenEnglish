import AImage from '@/assets/svgs/AA.jpg';
import Image from 'next/image';

const LeftImage = () => (
  <div className="w-full h-full relative overflow-hidden">
    <Image
      src={AImage}
      alt="Left image"
      layout="responsive" // 使图片响应式
      width={50}        // 设置你希望的宽度
      height={50}       // 设置你希望的高度
      className="object-contain"
    />
    {/* <p>Left Image Loaded</p> Debugging info */}
  </div>
);

export default LeftImage;
