import { Button } from '@nextui-org/button';

export default function TabButton({
  isSelected,
  isDisabled=false,
  handlePress,
  className='',
  children
}) {
  let styles;
  if (isSelected) {
    styles = "bg-blue-500 text-white";
  } else {
    styles = "bg-transparent text-black";
  }
  return (
    <Button
      isBlock
      isDisabled={isDisabled}
      radius="full"
      className={`h-14 w-full font-medium text-lg justify-center py-3 px-4 hover:opacity-80 ${className} ${styles}`}
      onClick={handlePress}
    >
      {children}
    </Button>
  );
}
