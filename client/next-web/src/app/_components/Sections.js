'use client';
import { useState } from 'react';
import TabButton from '@/components/TabButton';
import SceneTab from './SectionsTab';
import { useRouter } from 'next/navigation';

export default function Sections() {
  const [tabNow, setTabNow] = useState('recommend'); // 默认显示第一个标签
  const router = useRouter(); // 使用 useRouter 进行路由跳转

  const tabs = [
    { key: 'recommend', label: '热门推荐' },
    { key: 'daily', label: '日常生活' },
    { key: 'work', label: '职场沟通' },
    { key: 'travel', label: '旅行计划'},
    { key: 'exam', label: '考试面试' },
    { key: 'school', label: '校园生活' },
    { key: 'more', label: '更多场景' } // 新增的标签
  ];

   // 处理标签点击事件
  const handleTabClick = (key) => {
    if (key === 'more') {
      // 跳转到 /morescene 页面
      router.push('/morescene');
    } else {
      setTabNow(key);
    }
  };




  return (
    <>
      <div className='flex flex-row justify-center mt-10'>
        <div className='w-[700px] grid grid-cols-7 gap-3 border-2 rounded-full p-2 border-tab bg-white shadow-lg'>
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              isSelected={tabNow === tab.key}
              handlePress={() => handleTabClick(tab.key)}
              className='text-black'
            >
              {tab.label}
            </TabButton>
          ))}
        </div>
      </div>
      {/* <SceneTab tabNow={tabNow} /> */}
      {tabNow !== 'more' && <SceneTab tabNow={tabNow} />}

    </>
  );
}


