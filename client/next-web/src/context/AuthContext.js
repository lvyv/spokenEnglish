import React from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth'; // 从 Firebase 导入身份验证相关的方法
import firebase_app from '@/firebase/config'; // 导入 Firebase 配置

const auth = getAuth(firebase_app); // 初始化 Firebase 身份验证

// 创建一个用于身份验证的上下文
export const AuthContext = React.createContext({});

// 自定义 Hook，方便获取上下文的值
export const useAuthContext = () => React.useContext(AuthContext);

// 上下文提供者组件，管理身份验证状态并向子组件提供上下文
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null); // 保存当前用户状态
  const [loading, setLoading] = React.useState(true); // 保存加载状态

  // 在组件挂载时设置身份验证状态监听器
  React.useEffect(() => {
    // 监听身份验证状态的变化
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // 如果用户存在，设置用户状态
      } else {
        setUser(null); // 如果用户不存在，设置用户状态为null
      }
      setLoading(false); // 设置加载状态为false
    });

    // 在组件卸载时取消监听
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? <div>Loading...</div> : children} 
      {/* 如果在加载，则显示加载提示，否则显示子组件 */}
    </AuthContext.Provider>
  );
};