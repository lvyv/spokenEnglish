 'use client';
import ExploreTab from './ExploreTab';
import MyTab from './MyTab';
import TabButton from '@/components/TabButton';

import { useAuthContext } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppStore } from '@/zustand/store';

// Tabs组件，根据用户选择的标签显示不同的内容
export default function Tabs({ characters }) {
  const { user } = useAuthContext(); // 获取用户信息
  const { tabNow, setTabNow } = useAppStore(); // 获取当前标签和设置标签的方法
  const searchParams = useSearchParams(); // 获取URL查询参数

  // 根据URL查询参数设置当前标签
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setTabNow(tab);
    }
  }, []);

  // 根据标签筛选显示的角色
  function charactersShown(tab) {
    if (tab === 'explore') {
      return characters.filter((character) => character.source === 'default');
    } else if (tab === 'community') {
      return characters.filter((character) => character.source === 'community');
    }
  }

  return (
    <>
      <div className='flex flex-row justify-end mt-10'>
        <div className='w-[430px] grid grid-cols-3 gap-5 border-6 rounded-full p-1 border-tab'>
          <TabButton isSelected={tabNow === 'explore'} 
          handlePress={() => setTabNow('explore')} 
          className='text-gray-900 text-xs' // 设置字体颜色为黑色
          >
           探索
          </TabButton>
          <TabButton isSelected={tabNow === 'community'} 
          handlePress={() => setTabNow('community')}
          className='text-gray-900 text-xs' // 设置字体颜色为黑色
            >
            社区
          </TabButton>
          <TabButton
            isSelected={user && tabNow === 'myCharacters'}
            isDisabled={user == null}
            handlePress={() => setTabNow('myCharacters')}
            className='text-gray-900 text-xs' // 设置字体颜色为黑色
          >
           角色
          </TabButton>
        </div>
      </div>
      <ExploreTab
        characters={charactersShown(tabNow)}
        isDisplay={tabNow === 'explore' || tabNow === 'community'}
      />
      {user && <MyTab isDisplay={tabNow === 'myCharacters'} />}
    </>
  );
}






