import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://gai-haoran-portfolio.pages.dev'),
  title: '盖皓然｜AI 训练与内容质检方向',
  description: '盖皓然的个人求职网站：行政管理本科、两年服役经历，具备 ToB 客户沟通、视频剪辑与内容制作经验，求职 AI 训练、数据标注与多模态内容质检方向。',
  openGraph: {
    title: '盖皓然｜AI 训练与内容质检方向',
    description: '规则执行 · 内容判断 · ToB 沟通 · 多模态质检',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '盖皓然｜AI 训练与内容质检方向',
    description: '规则执行 · 内容判断 · ToB 沟通 · 多模态质检',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="prefetch" href="/about" />
        <link rel="prefetch" href="/works" />
      </head>
      <body>{children}</body>
    </html>
  );
}
