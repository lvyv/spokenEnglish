import { Avatar } from '@nextui-org/avatar'; // 从 NextUI 库中导入 Avatar 组件
import Image from 'next/image'; // 从 Next.js 导入 Image 组件，用于优化图片加载
import realCharSVG from '@/assets/svgs/realchar.svg'; // 导入 SVG 图像文件
import { useAppStore } from '@/zustand/store'; // 从 Zustand 状态管理库导入自定义钩子 useAppStore

// 定义 ChatPreview 组件
export default function ChatPreview() {
  // 使用 Zustand 状态管理库的钩子获取 character 和 chatContent
  const { character, chatContent } = useAppStore();

  return (
    // 创建一个无序列表，用于展示聊天内容
    <ul className="border-2 border-real-blue-500/30 rounded-2xl bg-white/10 max-h-[40vh] overflow-scroll">
      {/* 列表项显示聊天角色的名称 */}
      <li className="p-3 md:p-6 font-normal border-b-2 border-real-blue-500/30">
        Chat with {character.name}
      </li>
      {
        // 遍历 chatContent 数组，生成聊天记录的列表项
        chatContent.map((line) => (
          <li
            key={line.timeStamp} // 使用时间戳作为唯一键
            className="flex flex-row p-2 md:p-6 gap-4 text-sm md:text-lg odd:bg-real-blue-500/10" // 设置列表项的样式
          >
            {/* 根据发送者是角色还是用户显示不同的头像 */}
            {line.from === 'character' && (
              <Avatar
                src={character.image_url} // 角色的头像 URL
                size="sm" // 头像的大小
                radius="sm" // 头像的边角半径
                classNames={{base: 'shrink-0'}} // 定义头像的样式
              />
            )}
            {line.from === 'user' && (
              <Image
                src={realCharSVG} // 用户的头像（使用 SVG 图像）
                alt="user" // 图像的替代文本
                className="w-8 h-8 rounded-lg" // 设置图像的样式
              />
            )}
            <span>{line.content}</span> {/* 显示聊天内容 */}
          </li>
        ))
      }
    </ul>
  );
}
