'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

type Category='收集箱'|'立即行动'|'计划安排'|'等待他人'|'保存资料'|'直接舍弃';
type Item={id:string;text:string;category:Category;today:boolean;done:boolean;createdAt:number};

const categories:Category[]=['立即行动','计划安排','等待他人','保存资料','直接舍弃'];
const categoryMeta:Record<Category,{icon:string;hint:string}>={
  '收集箱':{icon:'IN',hint:'先放进来，不急着判断'},
  '立即行动':{icon:'GO',hint:'下一步已经很明确'},
  '计划安排':{icon:'CAL',hint:'需要确定一个时间'},
  '等待他人':{icon:'WAIT',hint:'暂时不由你推进'},
  '保存资料':{icon:'REF',hint:'保留，但不需要行动'},
  '直接舍弃':{icon:'DROP',hint:'允许自己不再处理'},
};
const resetSteps=['写下脑子里所有事情','删除一件不需要做的事','完成一件两分钟内的小事','选择当前唯一要推进的事情','专注十分钟，然后停下来'];

export default function EntropyCabinPage(){
  const [items,setItems]=useState<Item[]>([]);
  const [input,setInput]=useState('');
  const [message,setMessage]=useState('');
  const [hydrated,setHydrated]=useState(false);
  const [resetOpen,setResetOpen]=useState(false);
  const [resetChecked,setResetChecked]=useState<number[]>([]);
  const [seconds,setSeconds]=useState(600);
  const [running,setRunning]=useState(false);

  useEffect(()=>{try{const saved=localStorage.getItem('entropy-cabin-items');if(saved)setItems(JSON.parse(saved) as Item[]);}catch{}setHydrated(true)},[]);
  useEffect(()=>{if(hydrated)localStorage.setItem('entropy-cabin-items',JSON.stringify(items))},[items,hydrated]);
  useEffect(()=>{if(!running||seconds<=0)return;const timer=window.setInterval(()=>setSeconds(value=>value-1),1000);return()=>window.clearInterval(timer)},[running,seconds]);

  const inbox=items.filter(item=>item.category==='收集箱'&&!item.done);
  const today=items.filter(item=>item.today&&!item.done);
  const openLoops=items.filter(item=>!item.done&&!['收集箱','保存资料','直接舍弃'].includes(item.category));
  const waiting=openLoops.filter(item=>item.category==='等待他人').length;
  const loadLabel=openLoops.length<=4?'空间充足':openLoops.length<=9?'需要轻整理':'先停下来做减法';
  const archived=items.filter(item=>item.done||item.category==='直接舍弃').length;
  const minutes=String(Math.floor(seconds/60)).padStart(2,'0');const secs=String(seconds%60).padStart(2,'0');
  const greeting=useMemo(()=>{const hour=new Date().getHours();return hour<11?'早上好':hour<18?'下午好':'晚上好'},[]);

  const addItem=(event:FormEvent)=>{event.preventDefault();const text=input.trim();if(!text)return;setItems(current=>[{id:`item-${Date.now()}`,text,category:'收集箱',today:false,done:false,createdAt:Date.now()},...current]);setInput('');setMessage('已经放进收集箱，暂时不用解决它。');window.setTimeout(()=>setMessage(''),2200)};
  const update=(id:string,patch:Partial<Item>)=>setItems(current=>current.map(item=>item.id===id?{...item,...patch}:item));
  const chooseToday=(item:Item)=>{if(!item.today&&today.length>=3){setMessage('今天只保留三件事。先完成或移走一件，再添加新的。');window.setTimeout(()=>setMessage(''),2600);return}update(item.id,{today:!item.today})};
  const finish=(item:Item)=>update(item.id,{done:!item.done,today:false});
  const startReset=()=>{setResetOpen(true);setResetChecked([]);setSeconds(600);setRunning(false)};

  return <main><div className="shell"><SiteNav active="works"/>
    <section className="entropy-hero"><div><p className="overline">PERSONAL VIBE CODING · 01</p><h1>{greeting}，盖皓然。<br/><span className="marker">今天不用解决所有问题。</span></h1><p>把混乱从脑子里搬到一个可信任的地方，再决定行动、安排、等待、保存或者放下。</p></div><div className="entropy-weather"><span>MENTAL WEATHER</span><b>{loadLabel}</b><i>{openLoops.length} 个未闭环事项</i></div></section>

    <section className="entropy-capture"><div><p>有什么正在占用你的注意力？</p><span>先记录，不需要立刻分类。</span></div><form onSubmit={addItem}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="例如：预约体检、回复一封邮件、想整理房间……" aria-label="快速记录脑内事项"/><button type="submit">放进收集箱 <span>＋</span></button></form>{message&&<p className="entropy-message">{message}</p>}</section>

    <section className="entropy-status"><div><b>{inbox.length}</b><span>等待整理</span></div><div><b>{today.length}<small>/3</small></b><span>今日重点</span></div><div><b>{waiting}</b><span>等待他人</span></div><div><b>{archived}</b><span>已经放下</span></div><button type="button" onClick={startReset}><span>我现在有点乱</span><b>进入十分钟重启 →</b></button></section>

    <section className="entropy-main-grid">
      <article className="today-panel"><div className="entropy-panel-head"><div><p>TODAY / 03</p><h2>今天只做三件事</h2></div><span>{today.length}/3</span></div><div className="today-list">{[0,1,2].map(index=>{const item=today[index];return item?<div className="today-item" key={item.id}><span>0{index+1}</span><p>{item.text}</p><button type="button" onClick={()=>finish(item)} aria-label={`完成${item.text}`}>✓</button><button type="button" onClick={()=>chooseToday(item)} aria-label={`移出今日重点${item.text}`}>×</button></div>:<div className="today-empty" key={index}><span>0{index+1}</span><p>{index===0?'选择完成后会让你明显轻松的事情':'保留一点空白，也是一种安排。'}</p></div>})}</div><p className="today-note">不是完成得越多越好，而是让真正重要的事情获得空间。</p></article>

      <article className="inbox-panel"><div className="entropy-panel-head"><div><p>INBOX</p><h2>整理收集箱</h2></div><span>{inbox.length}</span></div>{inbox.length?<div className="inbox-list">{inbox.map(item=><div className="inbox-item" key={item.id}><p>{item.text}</p><span>它接下来属于哪里？</span><section>{categories.map(category=><button type="button" onClick={()=>update(item.id,{category,today:false})} key={category}><i>{categoryMeta[category].icon}</i><b>{category}</b></button>)}</section></div>)}</div>:<div className="entropy-empty"><b>收集箱是空的</b><p>很好。新的事情出现时，先放进来，不必一直记在脑子里。</p></div>}</article>
    </section>

    <section className="loops-section"><div className="works-section-head"><div><p>OPEN LOOPS</p><h2>未闭环事项</h2></div><span>只展示仍然需要你留意的事情</span></div>{openLoops.length?<div className="loops-grid">{openLoops.map(item=><article className={`loop-card loop-${item.category}`} key={item.id}><div><span>{categoryMeta[item.category].icon}</span><i>{item.category}</i></div><h3>{item.text}</h3><p>{categoryMeta[item.category].hint}</p><section><button type="button" className={item.today?'active':''} onClick={()=>chooseToday(item)}>{item.today?'已在今日重点':'加入今日三件事'}</button><button type="button" onClick={()=>finish(item)}>完成</button></section></article>)}</div>:<div className="entropy-empty large"><b>目前没有未闭环事项</b><p>你可以在上方记录一件正在占用注意力的事情。</p></div>}</section>

    <section className="entropy-principles"><div><p className="project-index">LESS, BUT CLEARER</p><h2>这个工具不会催你。</h2></div><div><p><b>不做连续打卡</b><span>错过一天不需要补偿，也不会失去记录。</span></p><p><b>不显示完成率排名</b><span>有些事情应该完成，有些事情应该直接放下。</span></p><p><b>数据只在本地</b><span>所有事项保存在当前浏览器，不上传服务器。</span></p></div></section>

    {resetOpen&&<div className="reset-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setResetOpen(false)}}><article className="reset-dialog" role="dialog" aria-modal="true" aria-label="十分钟重启"><button type="button" className="reset-close" onClick={()=>setResetOpen(false)}>×</button><p className="overline">10 MINUTE RESET</p><h2>先不用解决人生，<br/>只把眼前理顺一点。</h2><div className="reset-timer"><strong>{minutes}:{secs}</strong><button type="button" onClick={()=>{if(seconds===0)setSeconds(600);setRunning(value=>!value)}}>{seconds===0?'重新开始':running?'暂停一下':'开始十分钟'}</button></div><div className="reset-steps">{resetSteps.map((step,index)=><button type="button" className={resetChecked.includes(index)?'done':''} onClick={()=>setResetChecked(current=>current.includes(index)?current.filter(value=>value!==index):[...current,index])} key={step}><span>{resetChecked.includes(index)?'✓':`0${index+1}`}</span><b>{step}</b></button>)}</div><p>完成一两步也可以。你的目标是恢复一点掌控感，不是把清单清零。</p></article></div>}
    <SiteFooter/>
  </div></main>;
}
