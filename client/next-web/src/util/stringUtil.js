export function handleCommand(text) {
  //移除命令字符串的第一个字符，然后将剩余的字符串按空格分割成多个部分，并返回这些部分组成的数组。
  const args = text.substring(1).split(' ');    
  return args;
}
