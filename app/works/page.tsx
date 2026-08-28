import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

export default function WorksPage(){return <main><div className="shell"><SiteNav active="works"/>
  <section className="works-section vibe-section"><div className="works-section-head"><div><p>01 / VIBE CODING</p><h2>交互式项目</h2></div><span>点击项目，进入可操作的完整界面</span></div>
    <div className="vibe-category-head"><span>AI TRAINER RELATED</span><h3>AI训练师相关</h3><p>围绕内容质检、模型评测、Bad Case和求职训练构建的交互工具。</p></div>
    <div className="vibe-grid">
      <a className="vibe-card vibe-qc" href="/qc"><div className="vibe-thumb"><div className="thumb-window"><span>MULTIMODAL QC</span><i>LIVE</i></div><div className="thumb-qc-body"><aside><b>IMG-0142</b><b>VID-0087</b><b>VID-0101</b></aside><main><div className="thumb-frame"><em/><em/><em/></div><div className="thumb-bars"><i/><i/><i/><i/></div></main><section><strong>78</strong><span>待复核</span></section></div></div><div className="vibe-copy"><p>PROJECT 01</p><h3>多模态内容质检工作台</h3><span>六维评分、问题归因、Bad Case 队列与报告导出</span><b>打开完整项目 →</b></div></a>
      <a className="vibe-card vibe-eval" href="/eval"><div className="vibe-thumb"><div className="thumb-window"><span>BLIND EVALUATION</span><i>03 / 09</i></div><div className="thumb-eval-body"><div><span>A</span><p/><p/><p/></div><div className="active"><span>B</span><p/><p/><p/></div><div><span>C</span><p/><p/><p/></div></div><div className="thumb-ranking"><b>RANK 01 · CANDIDATE B</b><i>84</i></div></div><div className="vibe-copy"><p>PROJECT 02</p><h3>大模型回答双盲评测台</h3><span>统一 Query、匿名评分、五维比较与结果排名</span><b>打开完整项目 →</b></div></a>
      <a className="vibe-card vibe-interview" href="/interview"><div className="vibe-thumb"><div className="thumb-window"><span>INTERVIEW LAB</span><i>Q 03 / 05</i></div><div className="thumb-chat"><span>请说说你会从哪些维度判断 AI 生成视频的质量。</span><p>背景—任务—行动—结果</p><div><i/><i/><i/><i/></div><strong>82</strong></div></div><div className="vibe-copy"><p>PROJECT 03</p><h3>AI 岗位模拟面试工具</h3><span>岗位题库、规则评分、逐题反馈与总结报告</span><b>打开完整项目 →</b></div></a>
      <a className="vibe-card vibe-badcase" href="/badcases"><div className="vibe-thumb"><div className="thumb-window"><span>BAD CASE LIBRARY</span><i>08 CASES</i></div><div className="thumb-badcase-grid"><div><i>严重</i><b>主体变形</b><span>BC-001</span></div><div><i>一般</i><b>闪烁跳变</b><span>BC-002</span></div><div><i>严重</i><b>事实幻觉</b><span>BC-005</span></div><div><i>严重</i><b>安全边界</b><span>BC-008</span></div></div></div><div className="vibe-copy"><p>PROJECT 04</p><h3>AIGC Bad Case 案例库</h3><span>多模态异常检索、证据记录、基础归因与修复建议</span><b>打开完整项目 →</b></div></a>
    </div>
    <div className="vibe-category-head personal-head"><span>PERSONAL INTEREST</span><h3>个人兴趣类</h3><p>从真实生活需求出发，把Vibe Coding变成自己会持续使用的工具。</p></div>
    <div className="personal-vibe-grid"><a className="vibe-card vibe-entropy" href="/entropy"><div className="vibe-thumb"><div className="thumb-window"><span>ENTROPY CABIN</span><i>CALM MODE</i></div><div className="thumb-entropy"><section><p>今天不用解决所有问题。</p><div><i/><i/><i/></div></section><aside><span>01</span><b>必须完成</b><span>02</span><b>完成后会轻松</b><span>03</span><b>有精力再做</b></aside><footer><b>10:00</b><span>十分钟重启</span></footer></div></div><div className="vibe-copy"><p>PERSONAL PROJECT 01</p><h3>减熵生活舱</h3><span>快速收集、五类整理、今日三件事和十分钟重启，让生活更有序从容。</span><b>打开完整项目 →</b></div></a></div>
  </section>

  <section className="works-section data-section"><div className="works-section-head"><div><p>02 / DATA PRACTICE</p><h2>数据练习</h2></div><span>明确标注为个人练习，不包装为商业项目</span></div>
    <article className="data-work-card"><div className="data-sheet-thumb"><div><span>客户原话</span><span>主标签</span><span>紧急度</span></div>{['实施周期大概多久？','登录后一直报错','合同到期怎么续费','能否增加子账号'].map((text,index)=><p key={text}><b>{text}</b><i>{['实施交付','故障报错','续费商务','账号权限'][index]}</i><em>{index===1?'高':'中'}</em></p>)}</div><div><p className="project-index">INDEPENDENT PRACTICE</p><h3>ToB 客户需求意图分类标注</h3><span>在 5 类需求标签中判断主意图和紧急度，练习规则执行、边界判断与结果复核。</span><ul><li>30 条脱敏模拟样本</li><li>统一标签规则与复核统计</li><li>保留 Excel 原始交付物</li></ul><a className="button button-primary" href="/tob-intent-labeling-portfolio.xlsx" download>下载 Excel 作品 <span>↓</span></a></div></article>
  </section>

  <SiteFooter/>
</div></main>}
