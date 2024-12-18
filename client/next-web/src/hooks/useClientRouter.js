// src/hooks/useClientRouter.js
"use client";  // 确保是客户端组件

import { useRouter } from "next/router";

export default function useClientRouter() {
  if (typeof window === "undefined") {
    throw new Error("This hook should only be used in the browser");
  }

  return useRouter();
}
