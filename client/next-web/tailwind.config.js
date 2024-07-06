/*
这段代码主要是一个 Tailwind CSS 的配置文件，用于定义项目中使用的主题、颜色、背景图等。
以下是它的功能总结：

1. 引入了 @nextui-org/react 模块，并从中解构出 nextui 对象。
2. 使用 JSDoc 注释指定了 module.exports 的类型为 Tailwind CSS 的配置类型。
3. 定义了 content 属性，用于指定需要处理的文件路径，包括页面、组件和主题相关文件。
4. 在 theme 属性中，通过 extend 对象扩展了背景图片的渐变属性，同时定义了一系列颜色变量。
5. 设置了 darkMode 为 'class'，表示启用 Dark Mode，并且根据 class 属性进行切换。
6. 使用了 plugins 数组，其中包含了 nextui 插件的配置，用于定制 NextUI 的主题颜色和默认主题模式等。

总的来说，这个配置文件定义了 Tailwind CSS 的一些基本配置，包括文件处理路径、颜色、背景图和 Dark Mode 等，同时集成了 NextUI 的定制主题插件。
*/

const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      header: 'rgba(167, 191, 255, 0.05)',
      tab: 'rgba(167, 191, 255, 0.2)',
      button: 'rgba(188, 207, 254, 0.1)',
      divider: 'rgba(99, 106, 132, 0.3)',
      dropdown: '#1e2643',
      dropdownHover: 'rgba(103, 133, 211, 0.3)',
      modalBG: '#050e2e',
      modalBorder: 'rgba(194, 211, 255, 0.3)',
      'real-black': {
        DEFAULT: '#02081D',
      },
      'real-silver': {
        500: '#636A84',
      },
      'real-blue': {
        700: '#344778',
        500: '#6785D3',
        300: '#C2D3FF',
      },
      'real-contrastBlue': {
        DEFAULT: '#1F4FCC',
      },
      neutral: {
        500: '#858585',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      defaultTheme: 'dark',
      addCommonColors: true,
      themes: {
        dark: {
          colors: {
            background: '#02081D',
            warning: '#FAAD14',
          },
        },
      },
    }),
  ],
};
