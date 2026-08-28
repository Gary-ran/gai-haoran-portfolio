'use client';

import { useMemo, useState } from 'react';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

type MediaType='视频'|'图像'|'文本'|'音频';
type Severity='严重'|'一般'|'轻微';
type Visual='hand'|'flicker'|'text'|'layout'|'hallucination'|'audio'|'style'|'safety';
type BadCase={id:string;media:MediaType;severity:Severity;status:'待复核'|'已归档';category:string;title:string;scene:string;timecode:string;prompt:string;evidence:string;root:string;repair:string;dimensions:string[];visual:Visual};

const cases:BadCase[]=[
  {id:'BC-001',media:'视频',severity:'严重',status:'待复核',category:'主体变形',title:'人物手指跨帧增生',scene:'人物近景动作生成',timecode:'00:03.8—00:04.6',prompt:'人物端起咖啡杯，镜头缓慢推近，动作自然连贯。',evidence:'右手由五指变为六指，杯柄位置同时发生跳变，破坏主体结构一致性。',root:'手部被杯柄遮挡后重新显现，模型在跨帧结构恢复时产生错误补全。',repair:'截取异常区间重新生成；增加“手部结构稳定、五指清晰、保持握持姿势”约束，并保留前后参考帧。',dimensions:['时序稳定性','动作合理性','主体一致性'],visual:'hand'},
  {id:'BC-002',media:'视频',severity:'一般',status:'待复核',category:'闪烁跳变',title:'背景灯牌频繁闪烁',scene:'夜景街道运镜',timecode:'00:05.1—00:07.0',prompt:'雨夜霓虹街道，镜头平稳向前移动，灯牌文字保持稳定。',evidence:'同一灯牌的亮度、颜色和文字形状连续变化，局部区域出现高频闪烁。',root:'高频细节与相机运动叠加，模型没有维持背景纹理的跨帧约束。',repair:'降低镜头运动速度，简化灯牌文字；对背景区域使用固定参考图或局部重绘。',dimensions:['时序稳定性','文字稳定性','风格统一性'],visual:'flicker'},
  {id:'BC-003',media:'图像',severity:'严重',status:'已归档',category:'文字乱码',title:'宣传海报标题不可读',scene:'未来城市海报',timecode:'单帧',prompt:'蓝紫色未来城市海报，主标题为“探索明日”，副标题清晰。',evidence:'主标题出现近似汉字但无法识别，副标题字形粘连，不满足信息传达要求。',root:'生成模型对复杂中文文字的精确控制能力不足。',repair:'先生成无字底图，再使用设计软件排版真实文字；禁止直接交付生成文字。',dimensions:['语义一致性','画面质量','文字可读性'],visual:'text'},
  {id:'BC-004',media:'图像',severity:'一般',status:'已归档',category:'构图异常',title:'产品主体被边缘裁切',scene:'电商产品主图',timecode:'单帧',prompt:'橙色饮料瓶完整居中，浅色背景，瓶身标签清晰。',evidence:'瓶盖顶部超出画布，主体重心偏右，左侧留白与商品信息区冲突。',root:'提示词未明确安全边距和构图比例，生成结果过度强调瓶身特写。',repair:'补充“完整瓶身、四周保留15%安全边距、居中构图”；按电商尺寸二次裁切。',dimensions:['画面质量','构图合理性','信息层级'],visual:'layout'},
  {id:'BC-005',media:'文本',severity:'严重',status:'待复核',category:'事实幻觉',title:'虚构不存在的政策条款',scene:'企业政策咨询助手',timecode:'第 2 段',prompt:'根据给定制度文本说明报销申请的最晚提交时间。',evidence:'回答声称“制度第12条规定须在3日内提交”，但原文没有第12条，也没有3日限制。',root:'模型使用常见制度模式补全缺失信息，没有严格限定在提供的材料范围内。',repair:'增加“仅依据原文，不得补充未出现条款”的系统约束；要求引用原文句子并标记无法确认的信息。',dimensions:['准确性','可追溯性','安全性'],visual:'hallucination'},
  {id:'BC-006',media:'音频',severity:'一般',status:'已归档',category:'音画不同步',title:'配音滞后口型约半秒',scene:'数字人口播视频',timecode:'00:08.2—00:13.5',prompt:'数字人自然口播，语速适中，口型与普通话配音同步。',evidence:'爆破音和闭口动作平均错位约0.5秒，长句后半段偏差继续扩大。',root:'音频重新剪辑后未同步更新驱动时间轴，累计偏移造成后段错位。',repair:'重新进行音频对齐并逐句校准时间码；重点抽检爆破音和句尾闭口动作。',dimensions:['音画匹配度','时序稳定性','整体表现'],visual:'audio'},
  {id:'BC-007',media:'视频',severity:'轻微',status:'已归档',category:'风格漂移',title:'镜头中途由写实转插画',scene:'旅行风景短片',timecode:'00:09.0—00:10.4',prompt:'写实电影感海岸公路，保持自然光照和统一胶片色彩。',evidence:'云层和山体边缘突然出现粗描边，色彩饱和度明显升高，约1.4秒后恢复。',root:'局部纹理复杂度升高后，模型短暂偏向训练数据中的插画表达。',repair:'使用统一风格参考帧；降低风格词歧义，并对异常片段做局部重生成。',dimensions:['风格统一性','时序稳定性'],visual:'style'},
  {id:'BC-008',media:'文本',severity:'严重',status:'待复核',category:'安全边界',title:'健康咨询给出确定诊断',scene:'健康问答助手',timecode:'结论段',prompt:'用户上传模糊体检报告照片，要求判断是否患有严重疾病。',evidence:'回答直接断言用户患病并推荐具体治疗方案，没有说明图片不可辨认或建议就医。',root:'回答过度追求直接结论，未触发医疗场景的不确定性说明和安全边界。',repair:'明确不能凭模糊图片诊断；建议咨询专业医生，列出急症就医提示，并避免给出具体处方。',dimensions:['安全性','准确性','风险提示'],visual:'safety'},
];

const mediaFilters:('全部'|MediaType)[]=['全部','视频','图像','文本','音频'];
const severityFilters:('全部'|Severity)[]=['全部','严重','一般','轻微'];

function CaseVisual({kind}:{kind:Visual}){return <div className={`bc-visual bc-${kind}`} aria-hidden="true">{kind==='hand'&&<><div className="bc-person"><i/><b>✦</b></div><span>FRAME 102</span></>}{kind==='flicker'&&<><i/><i/><i/><b>NEON</b><span>F12 / F13</span></>}{kind==='text'&&<><small>AI CITY / 2046</small><b>探◈明日</b><i>TEXT ERROR</i></>}{kind==='layout'&&<><div className="bc-product"><i/><b>ORANGE</b></div><span>SAFE AREA</span></>}{kind==='hallucination'&&<><div><span>制度第 12 条</span><b>来源中不存在</b></div><i>!</i></>}{kind==='audio'&&<><div className="bc-wave">▂▅▃▇▂▆▃▅▂</div><i/><b>+ 0.5s</b></>}{kind==='style'&&<><div/><div/><i>STYLE SHIFT</i></>}{kind==='safety'&&<><strong>!</strong><span>RISKY<br/>ANSWER</span><i>MEDICAL</i></>}</div>}

export default function BadCaseLibraryPage(){
  const [media,setMedia]=useState<'全部'|MediaType>('全部');
  const [severity,setSeverity]=useState<'全部'|Severity>('全部');
  const [search,setSearch]=useState('');
  const [selected,setSelected]=useState<BadCase|null>(null);
  const [reviewed,setReviewed]=useState<string[]>([]);
  const filtered=useMemo(()=>cases.filter(item=>(media==='全部'||item.media===media)&&(severity==='全部'||item.severity===severity)&&`${item.id}${item.title}${item.category}${item.scene}`.toLowerCase().includes(search.trim().toLowerCase())),[media,severity,search]);
  const stats={total:cases.length,severe:cases.filter(item=>item.severity==='严重').length,pending:cases.filter(item=>item.status==='待复核'&&!reviewed.includes(item.id)).length,types:new Set(cases.map(item=>item.media)).size};
  const exportCases=()=>{const content=JSON.stringify({project:'AIGC Bad Case案例库',notice:'全部为作品演示案例，不是生产环境数据',exportedAt:new Date().toISOString(),cases:filtered},null,2);const url=URL.createObjectURL(new Blob([content],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='aigc-badcase-library.json';a.click();URL.revokeObjectURL(url);};
  return <main><div className="shell"><SiteNav active="works"/>
    <section className="bc-hero"><div><p className="overline">VIBE CODING PROJECT · 04</p><h1>AIGC Bad Case<br/><span className="marker">案例库</span></h1><p>把零散的异常样本沉淀为可搜索、可归因、可复用的质检资产，让问题描述能够直接支持规则更新和生成优化。</p></div><div className="bc-hero-stamp"><b>08</b><span>DEMO CASES</span><i>LOCAL LIBRARY</i></div></section>
    <section className="bc-stats"><div><b>{stats.total}</b><span>案例总数</span></div><div><b>{stats.types}</b><span>媒体类型</span></div><div><b>{stats.severe}</b><span>严重问题</span></div><div><b>{stats.pending}</b><span>待复核</span></div></section>
    <section className="bc-toolbar"><label><span>搜索案例</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索编号、问题或场景…"/></label><div><span>媒体类型</span><section>{mediaFilters.map(item=><button type="button" className={media===item?'active':''} onClick={()=>setMedia(item)} key={item}>{item}</button>)}</section></div><div><span>严重等级</span><section>{severityFilters.map(item=><button type="button" className={severity===item?'active':''} onClick={()=>setSeverity(item)} key={item}>{item}</button>)}</section></div><button type="button" className="bc-export" onClick={exportCases}>导出当前结果 ↓</button></section>
    <section className="bc-library-head"><div><p>CASE LIBRARY</p><h2>发现 {filtered.length} 条案例</h2></div><span>点击卡片查看完整归因与修复建议</span></section>
    <section className="bc-grid">{filtered.map(item=><button type="button" className="bc-card" onClick={()=>setSelected(item)} key={item.id}><CaseVisual kind={item.visual}/><div className="bc-card-body"><div><span>{item.id}</span><i className={`severity-${item.severity}`}>{item.severity}</i></div><h3>{item.title}</h3><p>{item.scene} · {item.timecode}</p><section><b>{item.media}</b><b>{item.category}</b>{reviewed.includes(item.id)&&<b className="reviewed">已复核</b>}</section><strong>查看案例详情 →</strong></div></button>)}</section>
    {!filtered.length&&<div className="bc-no-result"><b>没有找到匹配案例</b><span>尝试清空搜索词或切换筛选条件。</span></div>}
    <section className="bc-method"><div><p className="project-index">LIBRARY LOGIC</p><h2>案例不是截图，<br/>而是一条可复用的证据链。</h2></div><div><p><b>定位</b><span>记录媒体类型、时间码和可观察现象。</span></p><p><b>归因</b><span>区分生成缺陷、流程问题与规则缺口。</span></p><p><b>闭环</b><span>给出可执行的重生成或流程修复建议。</span></p></div></section>
    {selected&&<div className="bc-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><article className="bc-detail" role="dialog" aria-modal="true" aria-label={`${selected.id}案例详情`}><button type="button" className="bc-close" onClick={()=>setSelected(null)} aria-label="关闭案例详情">×</button><div className="bc-detail-top"><CaseVisual kind={selected.visual}/><div><p>{selected.id} · {selected.media}</p><h2>{selected.title}</h2><section><span className={`severity-${selected.severity}`}>{selected.severity}</span><span>{selected.category}</span><span>{selected.timecode}</span></section></div></div><div className="bc-detail-content"><section><span>原始提示词 / 任务</span><p>{selected.prompt}</p></section><section><span>可观察证据</span><p>{selected.evidence}</p></section><section><span>基础归因</span><p>{selected.root}</p></section><section className="repair"><span>修复建议</span><p>{selected.repair}</p></section></div><div className="bc-detail-bottom"><div>{selected.dimensions.map(item=><span key={item}>{item}</span>)}</div><button type="button" className={reviewed.includes(selected.id)?'done':''} onClick={()=>setReviewed(current=>current.includes(selected.id)?current.filter(id=>id!==selected.id):[...current,selected.id])}>{reviewed.includes(selected.id)?'✓ 已完成复核':'标记为已复核'}</button></div></article></div>}
    <SiteFooter/>
  </div></main>;
}
