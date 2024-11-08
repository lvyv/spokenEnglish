import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@nextui-org/dropdown';
import { Avatar } from '@nextui-org/avatar';
import signout from '@/firebase/auth/signout';
import {useAppStore} from "@/zustand/store";
import {useEffect} from "react";

// 用户下拉菜单组件，接收一个用户对象作为属性
export default function UserDropdown({ user }) {
  const {setToken} = useAppStore();
  // 组件挂载时设置用户的访问令牌
  useEffect(()=> {
    setToken(user.accessToken);
  }, []);
  // 处理下拉菜单项点击事件的函数
  async function handleMenuClick(key) {
    switch(key) {
      case 'profile':
        return;
      // case 'create':
      //   return;
      // case 'delete':
      //   return;
      case 'logout':
        const { result, error } = await signout();
        if (error) {
          console.log(error);
          return;
        }
        return;
      default:
        return;
    }
  }
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger aria-label="Dropdown trigger">
        <Avatar
          as="button"
          name={user.displayName}
          src={user.photoURL}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        variant="flat"
        onAction={handleMenuClick}>
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="">Signed in as</p>
          <p className="">{user.email}</p>
        </DropdownItem>
        {/* <DropdownItem key="create">Create a character</DropdownItem>
        <DropdownItem key="delete">Delete a character</DropdownItem> */}
        <DropdownItem key="logout" color="danger">Log Out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}