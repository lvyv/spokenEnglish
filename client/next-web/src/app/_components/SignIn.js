import { Button } from '@nextui-org/button';
import signIn from '@/firebase/auth/signin';

// 导出一个名为SignIn的函数组件，用于处理用户登录
export default function SignIn() {
  // 定义一个异步函数handleSignIn，用于处理登录逻辑
  async function handleSignIn() {
    const { result, error } = await signIn();
    if (error) {
      console.log(error);
      return;
    }
  }

  // 返回一个Button组件，点击时调用handleSignIn函数
  return (
    <Button
      onClick={handleSignIn}
      className="bg-blue-500 text-white hover:bg-blue-600"
    >
      Sign in
    </Button>
  );
}
