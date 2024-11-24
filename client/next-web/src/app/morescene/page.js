'use client';
import { useState } from 'react';
import Navbar from './_components/Navbar';
import CombinedContent from './_components/CombinedContent';

export default function HomePage() {
    const [selectedScene, setSelectedScene] = useState('社交'); // 默认选中社交场景

    return (
        <div className="flex min-h-screen bg-gray-200">
            {/* 左侧导航栏 */}
            <div className="w-60 h-full flex-shrink-0" style={{ backgroundColor: '#333333' }}>
                <Navbar setSelectedScene={setSelectedScene} /> {/* 传递 setSelectedScene 函数 */}
            </div>
            
            {/* 右侧内容区域 */}
            <div className="flex flex-col flex-1 p-4 space-y-4 overflow-y-auto">
                <CombinedContent selectedScene={selectedScene} /> {/* 传递 selectedScene */}
            </div>
        </div>
    );
}
