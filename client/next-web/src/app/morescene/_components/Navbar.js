

import { useState } from 'react';
import Image from 'next/image';
import RomanceImage from '@/assets/svgs/Romance.png';
import SportsImage from '@/assets/svgs/Sports.png';
import MusicImage from '@/assets/svgs/Music.png';
import MoviesImage from '@/assets/svgs/Movies.png';
import ReadingImage from '@/assets/svgs/Reading.png';
import SocializingImage from '@/assets/svgs/Socializing.png';

export default function Navbar({ setSelectedScene, selectedScene }) {
    const scenes = [
        { name: '社交', image: SocializingImage },
        { name: '恋爱', image: RomanceImage },
        { name: '体育', image: SportsImage },
        { name: '音乐', image: MusicImage },
        { name: '电影', image: MoviesImage },
        { name: '阅读', image: ReadingImage },
    ];

    return (
        <div
            className="h-full flex flex-col items-center justify-start shadow-lg rounded-lg hide-scrollbar"
            style={{ backgroundColor: '#B0B0B0' }} // 设置背景颜色为深灰色
        >
            {/* 返回首页按钮 */}
            <button className="mx-auto p-2 m-4 bg-blue-300 text-white rounded-lg">
                返回首页
            </button>

            {/* 场景按钮 */}
            {scenes.map((scene, index) => (
                <div key={index} className="flex items-center p-4 w-full">
                    <div className="flex-shrink-0">
                        <Image
                            src={scene.image}
                            alt={scene.name}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover"
                        />
                    </div>
                    <button
                        onClick={() => setSelectedScene(scene.name)}
                        className={`ml-4 py-2 text-lg font-medium bg-[#87CEEB] shadow-lg rounded-full ${scene.name === selectedScene ? 'text-blue-500' : 'text-white'}`} // 设置字体颜色
                        style={{ padding: '0.5rem 1.5rem', width: 'auto' }} // 增加内边距
                    >
                        {scene.name}
                    </button>
                </div>
            ))}
        </div>
    );
}
