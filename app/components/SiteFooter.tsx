export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-statement">
        <p>KEEP MOVING · KEEP CURIOUS</p>
        <h2>只有滚动的石头，<br /><span>才能不长青苔</span></h2>
      </div>
      <nav className="footer-explore" aria-label="页脚导航">
        <h3>Explore</h3>
        <a href="/">首页</a>
        <a href="/about">详细简历</a>
        <a href="/works">作品</a>
      </nav>
      <div className="footer-connect">
        <h3>Connect</h3>
        <a href="mailto:13225238530@163.com">邮件 ↗</a>
        <a href="tel:13225238530">电话 ↗</a>
        <p>全国可到岗</p>
      </div>
      <div className="footer-bottom">
        <p>盖皓然 · AI 训练与内容质检方向</p>
        <p>© 2026 GAI HAORAN</p>
      </div>
    </footer>
  );
}
