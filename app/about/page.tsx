import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

const strengths = [
  ['01','内容判断','口播、信息流、Vlog 与宣传片剪辑，以及摄影和 PS 排版经历，形成对构图、节奏、信息层级与音画关系的基础判断。'],
  ['02','规则执行','服役期间处理训练考核计划与成绩统计，习惯把要求拆成明确步骤，按统一标准执行并复核结果。'],
  ['03','质检复盘','在内容交付和客户沟通中整理修改意见、问题清单与下一步动作，能够围绕反馈持续迭代。'],
  ['04','协作推进','具备 ToB 客户需求沟通、跨部门资源协调与活动执行经历，能够同步节点、风险和交付结果。'],
];

const experience = [
  { date:'2025.10—2026.07', role:'视频剪辑（兼职）', org:'内容制作方向', color:'pink', summary:'面向电商口播、信息流、Vlog 与宣传片等内容完成剪辑交付。', bullets:['与客户对齐风格、节奏、卖点优先级与修改边界','按脚本分段筛选镜头，处理字幕、节奏与画面信息层级','依据反馈在 1—2 轮内调整成片，覆盖 4 类视频内容'] },
  { date:'2025.06—2026.06', role:'ToB 软件销售运营', org:'企知道科技 / 南京友拓信息技术', color:'yellow', summary:'承接企业客户的软件、专利与商务资源需求，协调方案并推进签约。', bullets:['通过电话、拜访与展会触达客户，确认业务背景与时间节点','研究产业政策，匹配项目申报方案并协调内部资源','简历记录：单月最高签约 4 份合同，最高签约金额 38 万元'] },
  { date:'2021.09—2023.09', role:'文书 / 机关宣传策划', org:'边防某旅', color:'green', summary:'参与训练数据统计、新闻宣传、摄影和机关材料整理。', bullets:['使用 Excel 制定训练考核计划并统计人员成绩','参与训练摄影、新闻报排版、宣传投稿与活动执行','简历记录：6 篇宣传投稿、2 次机关借调并获旅级作品嘉奖'] },
];

const projects = [
  ['P1','多模态数据质检规则拆解','个人练习 · 规则拆解 / 试标反馈 / 质检','将语义一致、构图、光影、动作合理、风格统一与音画匹配拆成可观察判断项，记录边界和 Bad Case。'],
  ['P2','AI 助手场景竞品评测','个人练习 · 评测设计 / 数据收集','使用统一 Query 集，从专业性、准确性、个性化、安全性和格式等维度比较回答质量。'],
  ['P3','AI 模拟面试小工具','个人项目 · 产品设计 / Demo 演示','通过岗位、难度和回答输入形成练习闭环，输出可解释反馈；用于展示需求拆解与工具实现思路。'],
];

const skillGroups = [
  ['AI 训练与评测',['LLM 基础','多模态数据','标注规则','模型评测','质检与 Bad Case','Dify 工作流','RAG / Agent']],
  ['内容与工具',['视频剪辑','摄影','PS 设计','Excel 数据处理','Vibe Coding','规则文档']],
  ['通用能力',['需求澄清','客户沟通','跨部门推进','信息整理','反馈复盘','规范执行']],
];

export default function ResumePage() {
  return <main><div className="shell"><SiteNav active="about" />
    <section className="resume-hero">
      <div><p className="overline">DETAILED RESUME</p><h1>一份可以<br /><span className="marker">展开阅读的简历。</span></h1><p>行政管理本科，两年服役经历，具备 ToB 客户沟通、视频剪辑与内容制作经验，求职 AI 训练、数据标注、生成内容质检与模型评测方向。</p><div className="resume-actions"><a className="neo-button neo-button-dark" href="#experience">查看工作经历 <span>↓</span></a><a className="neo-button neo-button-light" href="mailto:13225238530@163.com">联系我</a></div></div>
      <aside className="resume-profile-card"><p>PROFILE / 01</p><h2>盖皓然</h2><div><span>求职方向</span><b>AI 训练师 · 多模态内容质检</b></div><div><span>学历</span><b>南京审计大学 · 行政管理（本科）</b></div><div><span>到岗范围</span><b>全国可到岗</b></div><div><span>联系方式</span><b>13225238530<br />13225238530@163.com</b></div></aside>
    </section>

    <section className="resume-facts"><div><b>本科</b><span>行政管理</span></div><div><b>2 年</b><span>服役经历</span></div><div><b>ToB</b><span>客户沟通与推进</span></div><div><b>4 类</b><span>视频内容制作</span></div></section>

    <section className="resume-section"><header className="resume-section-head"><p>01 / STRENGTHS</p><h2>能力概览</h2><span>能力描述均对应真实经历来源</span></header><div className="resume-strength-grid">{strengths.map(([no,title,body])=><article key={no}><span>{no}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>

    <section className="resume-section" id="experience"><header className="resume-section-head"><p>02 / EXPERIENCE</p><h2>工作与服役经历</h2><span>按时间倒序排列</span></header><div className="resume-experience-list">{experience.map((item)=><article className={`resume-exp resume-exp-${item.color}`} key={item.date}><div className="resume-exp-date">{item.date}</div><div><p>{item.org}</p><h3>{item.role}</h3><strong>{item.summary}</strong><ul>{item.bullets.map(bullet=><li key={bullet}>{bullet}</li>)}</ul></div></article>)}</div></section>

    <section className="resume-section resume-education"><header className="resume-section-head"><p>03 / EDUCATION</p><h2>教育经历</h2><span>学历信息</span></header><div className="resume-education-grid"><article><span>本科</span><time>南京审计大学</time><h3>行政管理</h3></article><article><span>专科</span><time>江苏建筑职业技术学院</time><h3>工程造价</h3></article></div></section>

    <section className="resume-section"><header className="resume-section-head"><p>04 / SKILLS</p><h2>技能清单</h2><span>学习认知与实际经验分开呈现</span></header><div className="resume-skill-groups">{skillGroups.map(([title,skills])=><article key={title as string}><h3>{title as string}</h3><div>{(skills as string[]).map(skill=><span key={skill}>{skill}</span>)}</div></article>)}</div></section>

    <section className="resume-section"><header className="resume-section-head"><p>05 / PRACTICE</p><h2>个人项目与练习</h2><span>不作为正式商业工作经验</span></header><div className="resume-project-grid">{projects.map(([no,title,meta,body])=><article key={no}><span>{no}</span><h3>{title}</h3><b>{meta}</b><p>{body}</p></article>)}</div><p className="resume-honesty">说明：本区域用于展示求职准备过程中的独立练习与个人项目，不等同于商业客户项目或正式岗位经历。</p></section>
    <SiteFooter />
  </div></main>;
}
