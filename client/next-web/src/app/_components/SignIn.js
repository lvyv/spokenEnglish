import { Button } from "@nextui-org/button";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSignIn(provider = "github") {
    setLoading(true);
    setError(null); // 重置错误信息

    try {
      const callbackUrl = process.env.NEXT_PUBLIC_GITHUB_CALLBACK_URL || "http://localhost:3000/api/auth/callback/github";
      
      // 调用 next-auth 进行 GitHub 登录
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: callbackUrl,
      });

      // 检查是否登录成功
      if (result?.error) {
        setError(result.error);
        console.error("登录失败:", result.error);
      } else {
        console.log("登录成功", result);

        // 向后端发送 GitHub 用户信息
        const response = await fetch("/api/auth/github", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            github_id: result.user.githubId,
            github_name: result.user.name,
            github_email: result.user.email,
          }),
        });

        // 处理后端响应
        if (response.ok) {
          const data = await response.json();
          console.log("Backend response:", data);
        } else {
          setError("GitHub 登录失败，无法更新用户信息");
          console.error("GitHub 登录失败", response.statusText);
        }
      }
    } catch (error) {
      setError("登录时发生错误，请重试");
      console.error("登录时发生错误:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Button
        onClick={() => handleSignIn("github")}
        className="bg-blue-500 text-white hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "登录中..." : "Sign In with GitHub"}
      </Button>

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
}
