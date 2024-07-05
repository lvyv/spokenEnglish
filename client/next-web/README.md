This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setting firebase environment

Create a `.env` file in the `next-web` root directory and add your Firebase configuration files. It should look like this:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=analytic-id
```

## Setting API host

Open `.env` file created above, add your api host in the file. It should look like this

```bash
# for example http://127.0.0.1:8000
# the host is where you launch the backend service using python cli.py run-uvicorn
API_HOST=your-api-host
NEXT_PUBLIC_API_HOST=your-api-host
NEXT_PUBLIC_TURN_SERVER_API_ENDPOINT=turn-server-api-endpoint
```

Note that `NEXT_PUBLIC_TURN_SERVER_API_ENDPOINT` is used to solve the issue that iOS devices cannot send audio in mobile internet data mode. It is Optional.

## Setting Other Config

Open `.env` file created above, add other configurations. It should look like this

```bash
# frontend app version. For example, 0.0.1
REACT_APP_BUILD_NUMBER=app-build-number
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

这是一个使用 create-next-app 快速启动的 Next.js 项目。

设置 Firebase 环境
在 next-web 根目录中创建一个 .env 文件，并添加你的 Firebase 配置文件。文件应该如下所示：

bash
Copy code
NEXT_PUBLIC_FIREBASE_API_KEY=api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=analytic-id
设置 API 主机
打开上面创建的 .env 文件，在文件中添加你的 API 主机。文件应该如下所示：

bash
Copy code
# 例如 http://127.0.0.1:8000
# 主机是你使用 python cli.py run-uvicorn 启动后端服务的地方
API_HOST=your-api-host
NEXT_PUBLIC_API_HOST=your-api-host
NEXT_PUBLIC_TURN_SERVER_API_ENDPOINT=turn-server-api-endpoint
请注意 NEXT_PUBLIC_TURN_SERVER_API_ENDPOINT 用于解决 iOS 设备在移动互联网数据模式下无法发送音频的问题。它是可选的。

设置其他配置
打开上面创建的 .env 文件，并添加其他配置。文件应该如下所示：

bash
Copy code
# 前端应用程序版本。例如，0.0.1
REACT_APP_BUILD_NUMBER=app-build-number
开始
首先，运行开发服务器：

bash
Copy code
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
用你的浏览器打开 http://localhost:3000 来查看结果。

你可以通过修改 app/page.js 来开始编辑页面。页面在你编辑文件时会自动更新。

这个项目使用 next/font 来自动优化和加载 Inter，一个自定义的 Google 字体。

了解更多
要了解更多关于 Next.js 的信息，请参考以下资源：

Next.js 文档 - 了解 Next.js 的功能和 API。
学习 Next.js - 一个交互式的 Next.js 教程。
你可以查看 Next.js GitHub 仓库 - 欢迎提出反馈和贡献！

在 Vercel 上部署
部署你的 Next.js 应用程序的最简单方式是使用 Vercel 平台 ，它是 Next.js 的创建者提供的。

查看我们的 Next.js 部署文档 以获取更多详情。






