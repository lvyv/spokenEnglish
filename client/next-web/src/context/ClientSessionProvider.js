// src/app/context/ClientSessionProvider.js
/*
12.3 yaloxin 
将 NextAuth 的会话管理功能引入到应用的组件树中，从而提供用户身份认证的上下文
*/
'use client';

import { SessionProvider } from 'next-auth/react';

export default function ClientSessionProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
