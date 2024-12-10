import React, { useState } from 'react';
import { RiEyeOffLine } from 'react-icons/ri';
import { Button } from '@nextui-org/button';

/**
 * 单独控制消息模糊状态的组件
 * @param {string} id - 消息的唯一标识符
 * @param {function} onBlurChange - 状态变化时的回调函数
 */
export default function BlurToggle({ id, onBlurChange }) {
  const [isBlurred, setIsBlurred] = useState(true);

  const toggleBlur = () => {
    const newBlurredState = !isBlurred;
    setIsBlurred(newBlurredState);
    if (onBlurChange) {
      onBlurChange(id, newBlurredState);
    }
  };

  return (
    <Button
      isIconOnly
      aria-label="blur toggle"
      radius="full"
      variant="light"
      className="text-gray-600 hover:text-white hover:bg-blue-600 min-w-fit md:min-w-10 md:h-10"
      onClick={toggleBlur}
    >
      <RiEyeOffLine size="1.5em" />
    </Button>
  );
}
