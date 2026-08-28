'use client';

import { useMemo, useState } from 'react';
import SiteNav from '../components/SiteNav';

type Role = 'AI 训练师' | '数据标注员' | '内容质检专员';
type Level = '基础' | '进阶' | '压力面';
type Feedback = { overall:number; relevance:number; structure:number; evidence:number; clarity:number; strengths:string[]; suggestions:string[] };
type RecordItem = { question:string; answer:string; feedback:Feedback };

const roles: Role[] = ['AI 训练师', '数据标注员', '内容质检专员'];
const levels: Level[] = ['基础', '进阶', '压力面'];

const questionBank: Record<Role, Record<Level, string[]>> = {
  'AI 训练师': {
    '基础': [
      '请用一分钟介绍你自己，并说明为什么想应聘 AI 训练师。',
      '你如何理解数据标注规则？开始一个新任务前会做哪些准备？',
      '如果一条样本同时符合两个标签，你会如何判断并记录？',
      '请说说你会从哪些维度判断一段 AI 生成视频的质量。',
      '当你发现自己连续出现同类错误时，会如何复盘和改进？',
    ],
    '进阶': [
      '如果让你为一批客服对话设计意图分类标注流程，你会如何从需求到验收推进？',
      '标注员对同一条规则理解不一致时，你会怎样定位问题并推动规则收敛？',
      '请举例说明如何建立 badcase 分类，并让它真正帮助模型或标注流程改进。',
      '面对文本、图片、视频三种数据，你会如何设计不同的质量检查维度？',
      '项目要求提升产量，但准确率开始下降，你会怎样平衡效率和质量？',
    ],
    '压力面': [
      '你没有正式 AI 训练师工作经验，我们为什么要选择你？',
      '如果负责人认为你的判断错了，但规则原文支持你的结论，你会怎么处理？',
      '连续两周重复标注让你感到枯燥，你如何保证注意力和一致性？',
      '上线前一天发现 10% 的样本可能有系统性错误，你会立即做什么？',
      '请指出你目前最不适合这个岗位的一点，并给出具体改进计划。',
    ],
  },
  '数据标注员': {
    '基础': [
      '请简要介绍自己，并说明你有哪些经历能证明细致和耐心。',
      '拿到一份新标注规则后，你会如何确认自己已经理解？',
      '遇到无法判断的样本时，你会如何处理？',
      '你平时如何使用 Excel 整理和检查数据？',
      '如何在重复任务中保持标注结果一致？',
    ],
    '进阶': [
      '请设计一次 30 条样本的试标流程，并说明每一步的目的。',
      '如果一致率低于目标，你会从哪些方面分析原因？',
      '多标签任务中，主标签和次标签冲突时应该如何处理？',
      '如何抽检一批已经完成的标注数据，并输出可执行的反馈？',
      '请描述一个你会如何记录、归类和复用边界样本的方案。',
    ],
    '压力面': [
      '如果你一天的产量比团队平均值低 20%，你会如何解释并改进？',
      '你发现同事大量沿用一个错误标签，但交付时间只剩两小时，怎么办？',
      '规则频繁变化导致返工，你如何控制自己的情绪和结果质量？',
      '如果抽检发现你的错误率最高，你会如何面对？',
      '为什么数据标注不是“照着规则机械点击”？',
    ],
  },
  '内容质检专员': {
    '基础': [
      '请介绍你与视频、图像或文字内容相关的经历。',
      '你会从哪些方面判断一条视频是否达到交付标准？',
      '发现音画不同步时，你会怎样描述问题，才能让制作人员快速修改？',
      '审美判断比较主观，你如何保持质检结果稳定？',
      '请举例说明一次根据反馈快速调整内容的经历。',
    ],
    '进阶': [
      '如何把“画面不好看”拆成可观察、可复核的质量维度？',
      '如果视频单帧质量不错，但前后动作不连贯，你会如何判定和记录？',
      '请设计一个包含语义、构图、节奏和音画匹配的质检表。',
      '面对大量异常 case，你会如何归因并给上游提出规则改进建议？',
      '客户偏好与内部质检规范冲突时，你会如何推进验收？',
    ],
    '压力面': [
      '你的审美和负责人完全不同，你凭什么坚持自己的质检结论？',
      '当天必须交付，但你判断素材本身无法达到标准，怎么办？',
      '如果漏检内容已经上线并造成投诉，你会怎样处理和复盘？',
      '同一批视频里有大量“勉强可用”的边界样本，你如何保证尺度一致？',
      '请指出视频剪辑经验迁移到 AI 内容质检时最容易产生的误区。',
    ],
  },
};

const roleKeywords: Record<Role,string[]> = {
  'AI 训练师':['规则','标注','模型','样本','质检','复核','边界','反馈','数据','准确'],
  '数据标注员':['规则','样本','标签','复核','一致','记录','准确','抽检','边界','数据'],
  '内容质检专员':['画面','构图','节奏','音画','标准','质检','问题','修改','内容','一致'],
};

const clamp = (value:number) => Math.max(35, Math.min(100, Math.round(value)));

function analyzeAnswer(answer:string, role:Role): Feedback {
  const text = answer.trim();
  const length = text.length;
  const sentences = text.split(/[。！？!?；;]/).filter(Boolean).length;
  const matched = roleKeywords[role].filter(word=>text.includes(word)).length;
  const structureSignals = ['首先','其次','最后','第一','第二','第三','背景','任务','行动','结果','因为','所以'].filter(word=>text.includes(word)).length;
  const evidenceSignals = (text.match(/\d+|%|结果|提升|完成|达到|签约|交付|复盘/g)||[]).length;

  const relevance = clamp(42 + matched*8 + Math.min(length/18,16));
  const structure = clamp(40 + structureSignals*9 + Math.min(sentences*4,20));
  const evidence = clamp(38 + evidenceSignals*10 + (length>120?12:0));
  const clarity = clamp(55 + Math.min(sentences*5,20) - (sentences>0 && length/sentences>90?14:0));
  const overall = Math.round((relevance+structure+evidence+clarity)/4);
  const strengths:string[] = [];
  const suggestions:string[] = [];
  if (relevance>=72) strengths.push('回答包含与岗位直接相关的关键词，没有明显跑题。');
  if (structure>=72) strengths.push('表达有清晰的层次或因果关系，面试官较容易跟上。');
  if (evidence>=72) strengths.push('使用了动作、结果或数字证据，可信度较高。');
  if (clarity>=75) strengths.push('句子长度适中，整体表达比较清楚。');
  if (!strengths.length) strengths.push('已经正面回应问题，具备进一步打磨的基础。');
  if (length<90) suggestions.push('回答偏短，建议补充一个具体场景、你的动作和最终结果。');
  if (matched<2) suggestions.push(`增加与${role}直接相关的判断过程和岗位关键词。`);
  if (structureSignals<2) suggestions.push('使用“背景—任务—行动—结果”或“首先—其次—最后”组织回答。');
  if (evidenceSignals<2) suggestions.push('补充数字、时间、交付结果或复盘结论，减少空泛描述。');
  if (sentences>0 && length/sentences>90) suggestions.push('拆分长句，每句话只表达一个重点。');
  if (!suggestions.length) suggestions.push('内容已经完整，可进一步压缩到 60—90 秒并强化开头结论。');
  return { overall,relevance,structure,evidence,clarity,strengths,suggestions };
}

export default function InterviewPage() {
  const [role,setRole] = useState<Role>('AI 训练师');
  const [level,setLevel] = useState<Level>('基础');
  const [stage,setStage] = useState<'setup'|'question'|'feedback'|'summary'>('setup');
  const [index,setIndex] = useState(0);
  const [answer,setAnswer] = useState('');
  const [records,setRecords] = useState<RecordItem[]>([]);
  const questions = questionBank[role][level];
  const latest = records.at(-1);

  const averages = useMemo(()=>{
    if (!records.length) return null;
    const keys:(keyof Pick<Feedback,'overall'|'relevance'|'structure'|'evidence'|'clarity'>)[]=['overall','relevance','structure','evidence','clarity'];
    return Object.fromEntries(keys.map(key=>[key,Math.round(records.reduce((sum,item)=>sum+item.feedback[key],0)/records.length)])) as Record<typeof keys[number],number>;
  },[records]);

  const start = () => { setIndex(0); setAnswer(''); setRecords([]); setStage('question'); };
  const submit = () => {
    if (answer.trim().length<20) return;
    const feedback=analyzeAnswer(answer,role);
    setRecords(prev=>[...prev,{question:questions[index],answer:answer.trim(),feedback}]);
    setStage('feedback');
  };
  const next = () => {
    if (index>=questions.length-1) { setStage('summary'); return; }
    setIndex(prev=>prev+1); setAnswer(''); setStage('question');
  };

  return <main><div className="shell"><SiteNav active="works" />
    <section className="tool-hero">
      <div><p className="overline">INTERVIEW LAB · 01</p><h1>AI 岗位模拟面试<br /><span className="marker">练习工作台</span></h1><p>选择目标岗位和面试难度，完成 5 轮结构化问答，获得逐题反馈和可打印的面试总结。</p></div>
      <div className="tool-badge"><span>EXPLAINABLE PROTOTYPE</span><b>无需登录<br />不保存回答</b></div>
    </section>

    {stage==='setup' && <section className="interview-setup">
      <div className="setup-copy"><p className="project-index">STEP 01</p><h2>配置本轮面试</h2><p>这是一个本地可解释评分原型：根据岗位关键词、回答结构、事实证据和表达清晰度提供反馈，不调用外部模型，也不把结果上传服务器。</p></div>
      <div className="setup-form">
        <fieldset><legend>目标岗位</legend><div className="choice-grid">{roles.map(item=><button type="button" className={role===item?'selected':''} onClick={()=>setRole(item)} key={item}>{item}</button>)}</div></fieldset>
        <fieldset><legend>面试难度</legend><div className="choice-grid compact">{levels.map(item=><button type="button" className={level===item?'selected':''} onClick={()=>setLevel(item)} key={item}>{item}</button>)}</div></fieldset>
        <button className="start-interview" type="button" onClick={start}>开始 5 题模拟面试 <span>→</span></button>
      </div>
    </section>}

    {stage==='question' && <section className="interview-room">
      <div className="room-top"><span>{role}</span><span>{level}难度</span><span>问题 {index+1} / {questions.length}</span></div>
      <div className="progress-track"><i style={{width:`${(index/questions.length)*100}%`}} /></div>
      <div className="question-card"><p className="project-index">QUESTION {String(index+1).padStart(2,'0')}</p><h2>{questions[index]}</h2><textarea value={answer} onChange={event=>setAnswer(event.target.value)} placeholder="建议使用：背景—任务—行动—结果。至少输入 20 个字。" aria-label="面试回答" /><div className="answer-meta"><span>{answer.trim().length} 字</span>{answer.trim().length<20 && answer.length>0?<span className="warning">还需要更完整的回答</span>:<span>回答仅在当前页面处理</span>}</div><button type="button" className="start-interview" disabled={answer.trim().length<20} onClick={submit}>提交回答并获取反馈 <span>→</span></button></div>
    </section>}

    {stage==='feedback' && latest && <section className="feedback-panel">
      <div className="score-orbit"><span>本题得分</span><strong>{latest.feedback.overall}</strong><small>/ 100</small></div>
      <div className="feedback-main"><p className="project-index">EXPLAINABLE FEEDBACK</p><h2>{latest.feedback.overall>=80?'这是一条有说服力的回答。':latest.feedback.overall>=65?'方向正确，还可以更具体。':'需要补充结构和事实证据。'}</h2>
        <div className="dimension-grid">{[['岗位相关',latest.feedback.relevance],['表达结构',latest.feedback.structure],['事实证据',latest.feedback.evidence],['清晰程度',latest.feedback.clarity]].map(([label,value])=><div key={label as string}><span>{label}</span><b>{value}</b><i><em style={{width:`${value}%`}} /></i></div>)}</div>
        <div className="feedback-cols"><div><h3>做得好的地方</h3>{latest.feedback.strengths.map(item=><p key={item}>✓ {item}</p>)}</div><div><h3>下一步怎么改</h3>{latest.feedback.suggestions.map(item=><p key={item}>→ {item}</p>)}</div></div>
        <button className="start-interview" type="button" onClick={next}>{index===questions.length-1?'生成本轮面试报告':'进入下一题'} <span>→</span></button>
      </div>
    </section>}

    {stage==='summary' && averages && <section className="summary-panel">
      <div className="summary-head"><div><p className="overline">INTERVIEW REPORT</p><h2>本轮模拟完成</h2><p>{role} · {level}难度 · {records.length} 题</p></div><div className="summary-score"><strong>{averages.overall}</strong><span>综合得分</span></div></div>
      <div className="summary-dimensions">{[['岗位相关',averages.relevance],['表达结构',averages.structure],['事实证据',averages.evidence],['清晰程度',averages.clarity]].map(([label,value])=><div key={label as string}><span>{label}</span><b>{value}</b></div>)}</div>
      <div className="record-list">{records.map((item,i)=><details key={item.question} open={i===0}><summary><span>0{i+1}</span><b>{item.question}</b><em>{item.feedback.overall} 分</em></summary><div><h3>你的回答</h3><p>{item.answer}</p><h3>改进建议</h3>{item.feedback.suggestions.map(tip=><p key={tip}>→ {tip}</p>)}</div></details>)}</div>
      <div className="summary-actions"><button type="button" onClick={()=>window.print()}>打印 / 保存为 PDF</button><button type="button" onClick={()=>setStage('setup')}>重新开始</button></div>
    </section>}

    <section className="tool-notes"><div><p className="project-index">HOW IT WORKS</p><h2>这个工具如何评分？</h2></div><div><p><b>岗位相关性</b>：是否回应问题并使用目标岗位的关键概念。</p><p><b>表达结构</b>：是否有清晰层次、因果关系或 STAR 结构。</p><p><b>事实证据</b>：是否包含具体动作、数字、结果和复盘。</p><p><b>清晰程度</b>：句子是否易读、重点是否集中。</p><small>该版本用于面试练习和产品能力展示，评分为规则辅助建议，不代表招聘结论。</small></div></section>
  </div></main>;
}
