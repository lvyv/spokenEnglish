/*
12.3 yaloxin 
定义了一个 Next.js 的根布局组件 (RootLayout)，它用来设置全局样式、元数据、字体配置以及共享的上下文提供器
*/
import './globals.css';
import { Prompt } from 'next/font/google';
import { Providers } from './providers';
import ClientSessionProvider from '../context/ClientSessionProvider'; // 更新导入路径

const prompt = Prompt({
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'RealChar.',
  description:
    'Create, customize and talk to your AI Character/Companion in realtime',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={prompt.className}>
        <ClientSessionProvider> {/* 包裹在 ClientSessionProvider 中 */}
          <Providers>
            <main>{children}</main>
          </Providers>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
