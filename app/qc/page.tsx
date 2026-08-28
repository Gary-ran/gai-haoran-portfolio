'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

type DimensionKey = 'semantic' | 'visual' | 'temporal' | 'motion' | 'style' | 'audio';
type Decision = '通过' | '待复核' | '驳回';
type Severity = '轻微' | '一般' | '严重';
type Sample = { id:string; type:'图像'|'视频'; title:string; duration?:string; prompt:string; focus:string; visual:'portrait'|'motion'|'product'|'text' };
type Review = { sampleId:string; sampleTitle:string; scores:Record<DimensionKey,number>; issues:string[]; severity:Severity; decision:Decision; note:string; total:number; reviewedAt:string };

const dimensions:{key:DimensionKey;label:string;hint:string}[] = [
  { key:'semantic', label:'语义一致性', hint:'生成内容是否准确回应提示词' },
  { key:'visual', label:'画面质量', hint:'清晰度、构图、色彩与瑕疵' },
  { key:'temporal', label:'时序稳定性', hint:'前后帧是否闪烁、跳变或漂移' },
  { key:'motion', label:'动作合理性', hint:'人物与物体运动是否自然' },
  { key:'style', label:'风格统一性', hint:'主体、场景和镜头风格是否一致' },
  { key:'audio', label:'音画匹配度', hint:'声音、口型、节奏和画面是否对应' },
];

const issueOptions = ['语义偏差','画面模糊','主体变形','闪烁跳变','动作不自然','风格漂移','文字乱码','音画不同步','音频异常','无明显问题'];
const samples:Sample[] = [
  { id:'IMG-0142', type:'图像', title:'人物头像风格生成', prompt:'年轻男性，正面半身，黑色短发与黑色上衣，薄荷绿纯色背景，简洁二次元插画。', focus:'重点观察人物身份特征、手部以外结构、背景纯净度与风格统一。', visual:'portrait' },
  { id:'VID-0087', type:'视频', title:'公园慢跑镜头', duration:'00:08', prompt:'清晨公园中，一名穿蓝色运动服的人从左向右慢跑，镜头稳定跟随。', focus:'重点观察人物跨帧一致性、腿部动作、背景闪烁与镜头稳定。', visual:'motion' },
  { id:'VID-0101', type:'视频', title:'饮料产品展示', duration:'00:06', prompt:'橙色饮料瓶在浅色桌面缓慢旋转，伴随轻快音乐和产品卖点字幕。', focus:'重点观察瓶身结构、旋转连续性、字幕可读性与音乐节奏匹配。', visual:'product' },
  { id:'IMG-0206', type:'图像', title:'未来城市宣传海报', prompt:'蓝紫色未来城市海报，标题为“探索明日”，建筑透视准确，文字清晰。', focus:'重点观察提示词还原、建筑结构、文字乱码与整体视觉层级。', visual:'text' },
];

const initialScores = ():Record<DimensionKey,number> => ({ semantic:3, visual:3, temporal:3, motion:3, style:3, audio:3 });

function SampleVisual({sample}:{sample:Sample}) {
  if (sample.visual==='portrait') return <div className="qc-portrait"><Image src="/qc-avatar-sample.png" alt="人物头像演示样本" fill sizes="(max-width: 760px) 90vw, 600px" /></div>;
  if (sample.visual==='motion') return <div className="qc-frame-strip" aria-label="慢跑视频三帧示意"><div><i className="runner">●</i><span>F01</span></div><div><i className="runner mid">●</i><span>F12</span></div><div><i className="runner end">●</i><span>F24</span></div></div>;
  if (sample.visual==='product') return <div className="qc-product-scene"><div className="qc-bottle"><i /><b>ORANGE</b></div><div className="qc-sound-wave">▂▅▃▆▂▇▃▅▂</div><span>产品展示 · FRAME 018</span></div>;
  return <div className="qc-poster"><span>AI CITY / 2046</span><h3>探索<br />明日</h3><div><i /><i /><i /></div></div>;
}

export default function QcWorkbenchPage() {
  const [sampleIndex,setSampleIndex] = useState(0);
  const [scores,setScores] = useState<Record<DimensionKey,number>>(initialScores);
  const [issues,setIssues] = useState<string[]>([]);
  const [severity,setSeverity] = useState<Severity>('一般');
  const [decision,setDecision] = useState<Decision>('待复核');
  const [note,setNote] = useState('');
  const [reviews,setReviews] = useState<Review[]>([]);
  const sample = samples[sampleIndex];
  const total = Math.round(Object.values(scores).reduce((sum,value)=>sum+value,0)/dimensions.length*20);

  const stats = useMemo(()=>({
    completed:reviews.length,
    pass:reviews.filter(item=>item.decision==='通过').length,
    review:reviews.filter(item=>item.decision==='待复核').length,
    reject:reviews.filter(item=>item.decision==='驳回').length,
    average:reviews.length?Math.round(reviews.reduce((sum,item)=>sum+item.total,0)/reviews.length):0,
  }),[reviews]);

  const badcases = reviews.filter(item=>item.decision!=='通过');
  const selectSample = (index:number) => { setSampleIndex(index); setScores(initialScores()); setIssues([]); setSeverity('一般'); setDecision('待复核'); setNote(''); };
  const toggleIssue = (issue:string) => setIssues(current=>issue==='无明显问题'?[issue]:current.includes(issue)?current.filter(item=>item!==issue):[...current.filter(item=>item!=='无明显问题'),issue]);
  const submitReview = () => {
    const review:Review={ sampleId:sample.id, sampleTitle:sample.title, scores:{...scores}, issues:issues.length?issues:['未选择问题标签'], severity, decision, note:note.trim()||'未填写补充描述', total, reviewedAt:new Date().toLocaleString('zh-CN',{hour12:false}) };
    setReviews(current=>[...current.filter(item=>item.sampleId!==sample.id),review]);
    const next=(sampleIndex+1)%samples.length;
    selectSample(next);
  };
  const download = (format:'json'|'csv') => {
    const payload={ project:'多模态内容质检工作台', exportedAt:new Date().toISOString(), summary:stats, reviews };
    let content=JSON.stringify(payload,null,2); let type='application/json'; let extension='json';
    if(format==='csv') { const quote=(value:unknown)=>`"${String(value).replaceAll('"','""')}"`; content=['sample_id,title,decision,severity,total,issues,note',...reviews.map(item=>[item.sampleId,item.sampleTitle,item.decision,item.severity,item.total,item.issues.join('|'),item.note].map(quote).join(','))].join('\n'); type='text/csv;charset=utf-8'; extension='csv'; }
    const url=URL.createObjectURL(new Blob([content],{type})); const anchor=document.createElement('a'); anchor.href=url; anchor.download=`multimodal-qc-report.${extension}`; anchor.click(); URL.revokeObjectURL(url);
  };

  return <main><div className="shell"><SiteNav active="works" />
    <section className="qc-hero"><div><p className="overline">VIBE CODING PROJECT · 01</p><h1>多模态内容<br /><span className="marker">质检工作台</span></h1><p>用统一规则完成图像与视频样本的六维评估、问题归因和审核结论，形成可导出的 Bad Case 记录。</p></div><div className="qc-hero-badge"><span>LOCAL DEMO</span><b>4 条演示样本<br />不上传任何数据</b></div></section>

    <section className="qc-dashboard">
      <aside className="qc-sidebar"><div className="qc-side-head"><p>样本队列</p><span>{stats.completed}/{samples.length}</span></div>{samples.map((item,index)=><button type="button" className={sampleIndex===index?'active':''} onClick={()=>selectSample(index)} key={item.id}><span>{item.type}</span><b>{item.id}</b><small>{item.title}</small><i>{reviews.some(review=>review.sampleId===item.id)?'已完成':'待质检'}</i></button>)}</aside>
      <div className="qc-main">
        <div className="qc-sample-head"><div><p>{sample.type} SAMPLE · {sample.id}</p><h2>{sample.title}</h2></div>{sample.duration&&<span>{sample.duration}</span>}</div>
        <div className="qc-preview"><SampleVisual sample={sample}/><div className="qc-prompt"><span>生成提示词</span><p>{sample.prompt}</p><b>质检提示</b><p>{sample.focus}</p></div></div>
        <div className="qc-score-head"><div><p>六维质量评分</p><span>1 = 严重不合格 · 5 = 完全符合</span></div><strong>{total}<small>/100</small></strong></div>
        <div className="qc-dimensions">{dimensions.map(item=><label key={item.key}><span><b>{item.label}</b><small>{item.hint}</small></span><input type="range" min="1" max="5" step="1" value={scores[item.key]} onChange={event=>setScores(current=>({...current,[item.key]:Number(event.target.value)}))}/><em>{scores[item.key]}</em></label>)}</div>
        <div className="qc-form-block"><div className="qc-block-title"><b>问题标签</b><span>可多选</span></div><div className="qc-issue-tags">{issueOptions.map(issue=><button type="button" className={issues.includes(issue)?'selected':''} onClick={()=>toggleIssue(issue)} key={issue}>{issue}</button>)}</div></div>
        <div className="qc-review-grid"><fieldset><legend>严重程度</legend>{(['轻微','一般','严重'] as Severity[]).map(item=><button type="button" className={severity===item?'selected':''} onClick={()=>setSeverity(item)} key={item}>{item}</button>)}</fieldset><fieldset><legend>审核结论</legend>{(['通过','待复核','驳回'] as Decision[]).map(item=><button type="button" className={decision===item?'selected':''} onClick={()=>setDecision(item)} key={item}>{item}</button>)}</fieldset></div>
        <label className="qc-note"><span>问题描述与修改建议</span><textarea value={note} onChange={event=>setNote(event.target.value)} placeholder="示例：第 3—4 秒人物右腿出现结构跳变，建议重新生成该片段并增加动作连续性约束。"/></label>
        <button className="qc-submit" type="button" onClick={submitReview}>提交本条质检 <span>下一条 →</span></button>
      </div>
      <aside className="qc-report"><div className="qc-side-head"><p>质检概览</p><span>LIVE</span></div><div className="qc-kpis"><div><b>{stats.completed}</b><span>已完成</span></div><div><b>{stats.average||'—'}</b><span>平均分</span></div><div><b>{stats.pass}</b><span>通过</span></div><div><b>{stats.reject}</b><span>驳回</span></div></div><div className="qc-distribution"><p>结论分布</p>{[['通过',stats.pass,'pass'],['待复核',stats.review,'review'],['驳回',stats.reject,'reject']].map(([label,value,color])=><div key={label as string}><span>{label}</span><i><em className={color as string} style={{width:`${reviews.length?Number(value)/reviews.length*100:0}%`}}/></i><b>{value}</b></div>)}</div><div className="qc-badcases"><p>Bad Case 队列</p>{badcases.length?badcases.map(item=><div key={item.sampleId}><span>{item.sampleId}</span><b>{item.decision}</b><small>{item.issues.slice(0,2).join(' · ')}</small></div>):<p className="qc-empty">提交“待复核”或“驳回”样本后自动生成。</p>}</div><div className="qc-export"><button type="button" disabled={!reviews.length} onClick={()=>download('json')}>导出 JSON</button><button type="button" disabled={!reviews.length} onClick={()=>download('csv')}>导出 CSV</button></div></aside>
    </section>
    <section className="qc-method"><div><p className="project-index">PROJECT NOTES</p><h2>这不是“AI 自动评分”的包装。</h2></div><div><p>这是一个用于展示<strong>质检流程、规则理解和问题归因</strong>的前端模拟工具。演示样本、评分与审核结果只在当前浏览器内处理。</p><p>项目重点：将模糊的“画面好不好”拆为六个可观察维度，让质检结论可以复核、统计和导出。</p></div></section>
    <SiteFooter />
  </div></main>;
}
