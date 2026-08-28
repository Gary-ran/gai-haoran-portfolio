import Image from 'next/image';
import SiteNav from './components/SiteNav';
import SiteFooter from './components/SiteFooter';

const questItems = [
  { date:'NOW', track:'康庄大道', title:'AI训练师求职', detail:'公若不弃，盖愿生死相随🙏', side:'right', color:'pink', icon:'⌘' },
  { date:'2025.10—2026.07', track:'当代电影大师', title:'视频剪辑与内容制作', detail:'我和王家卫只差一副墨镜🕶️', side:'left', color:'blue', icon:'▶' },
  { date:'2026', track:'天才AI哥', title:'系统学习 AI 训练与内容质检', detail:'盖飘零半生，只恨未逢明主🥺', side:'right', color:'green', icon:'AI' },
  { date:'2025.06—2026.06', track:'皇家金牌销售', title:'ToB 客户开发与项目推进', detail:'求你了大爷，我真约了王总，让我进去吧😭', side:'left', color:'yellow', icon:'↗' },
  { date:'校园', track:'摇滚练习生', title:'乐队主唱、吉他手', detail:'玩六年乐队的第一桶金，来自去年卖掉的吉他🎸', side:'right', color:'pink', icon:'♫' },
  { date:'本科', track:'回炉重造', title:'南京审计大学 · 行政管理', detail:'上斩早八困意魔，下占书馆黄金座📖', side:'left', color:'blue', icon:'学' },
  { date:'2021.09—2023.09', track:'兵王在此', title:'两年服役经历', detail:'两年义务兵，干饭倍儿行🪖', side:'left', color:'green', icon:'★' },
  { date:'专科', track:'懵懂大门', title:'江苏建筑职业技术学院 · 工程造价', detail:'一入土木深似海，从此情缘是路人💔', side:'left', color:'blue', icon:'学' },
]

export default function HomePage() {
  return <main><div className="shell home-shell">
    <SiteNav active="home" />
    <section className="identity-hero" aria-labelledby="home-title">
      <div className="identity-copy">
        <p className="identity-kicker"><span /> HELLO, I&apos;M GAI HAORAN</p>
        <h1 id="home-title">Welcome to<br /><mark>盖皓然简历</mark></h1>
        <p className="identity-intro">南京审计大学行政管理，两年服役经历，毕业做了一年 ToB 销售、兼职视频剪辑。现在希望把对规则的执行、对内容的判断和跨角色沟通，带到<strong> AI 训练、数据标注与多模态内容质检</strong>中。</p>
        <p className="identity-note">我不是标准的技术科班路线，但习惯先沟通清楚需求，再按标准执行，发现偏差后给出清楚反馈。</p>
        <div className="identity-actions"><a className="neo-button neo-button-dark" href="#life-quest">人生任务线 <span>↓</span></a><a className="neo-button neo-button-light" href="mailto:13225238530@163.com">和我联系</a></div>
      </div>
      <aside className="id-card" aria-label="盖皓然的个人 ID Card">
        <div className="id-card-head"><div><b>ID CARD</b><span>AI TRAINING CANDIDATE</span></div><span className="id-chip">GH</span></div>
        <div className="id-card-body">
          <div className="id-photo"><Image src="/avatar-luminous.png" alt="盖皓然卡通头像" fill priority sizes="(max-width: 900px) 70vw, 300px" /></div>
          <div className="id-fields"><div className="id-field yellow"><small>NAME</small><strong>盖皓然</strong></div><div className="id-field blue"><small>MAJOR</small><strong>行政管理 · 本科</strong></div><div className="id-field pink"><small>TARGET</small><strong>AI训练师 / 多模态质检</strong></div></div>
        </div>
        <div className="id-meta"><span>STATUS</span><b>期待我的加入</b><span>ID NO.</span><b>GH-AI-2026</b></div>
        <div className="id-barcode" aria-hidden="true" />
        <span className="id-sticker sticker-top">OPEN<br />TO WORK</span><span className="id-sticker sticker-bottom">RULES<br />× CONTENT</span>
      </aside>
    </section>
    <section className="quest-section" id="life-quest" aria-labelledby="quest-title">
      <header className="quest-heading"><p>MY ROUTE · 持续更新</p><h2 id="quest-title">人生任务线 <mark>CAREER QUEST</mark></h2><p>主线是可核实的教育与工作经历，支线记录兴趣、学习和正在发生的变化。</p></header>
      <div className="quest-board"><div className="quest-label quest-label-left">主线任务</div><div className="quest-label quest-label-right">支线任务</div><div className="quest-rail" aria-hidden="true"><span>⌃</span></div>
        <div className="quest-list">{questItems.map((item,index)=><article className={`quest-item quest-${item.side} quest-${item.color}`} key={`${item.date}-${item.title}`}><span className="quest-node" aria-hidden="true">{index+1}</span><div className="quest-card"><span className="quest-icon" aria-hidden="true">{item.icon}</span><div><p><b>{item.track}</b><time>{item.date}</time></p><h3>{item.title}</h3><div>{item.detail}</div></div></div></article>)}</div>
      </div>
    </section>
    <SiteFooter />
  </div></main>;
}
