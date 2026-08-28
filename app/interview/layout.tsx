import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 岗位模拟面试练习工具｜盖皓然',
  description: '面向 AI 训练师、数据标注员与内容质检岗位的本地可解释模拟面试工具。',
  openGraph: { title: 'AI 岗位模拟面试练习工具｜盖皓然', description: '完成五轮结构化问答，获得逐题反馈与面试报告。', images: [] },
  twitter: { title: 'AI 岗位模拟面试练习工具｜盖皓然', description: '完成五轮结构化问答，获得逐题反馈与面试报告。', images: [] },
};

export default function InterviewLayout({children}:{children:React.ReactNode}) { return children; }
