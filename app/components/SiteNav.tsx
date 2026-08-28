import Link from 'next/link';

type NavKey = 'home' | 'about' | 'works';

const items: { key: NavKey; href: string; label: string }[] = [
  { key: 'home', href: '/', label: '首页' },
  { key: 'about', href: '/about', label: '详细简历' },
  { key: 'works', href: '/works', label: '作品' },
];

export default function SiteNav({ active }: { active: NavKey }) {
  return (
    <header className="site-nav">
      <Link className="nav-brand" href="/" aria-label="盖皓然首页">GH.</Link>
      <nav aria-label="主要导航">
        {items.map((item) => (
          <Link className={active === item.key ? 'active' : ''} href={item.href} key={item.key} prefetch>
            {item.label}
          </Link>
        ))}
      </nav>
      <a className="nav-mail" href="mailto:13225238530@163.com" aria-label="发送邮件">✉</a>
    </header>
  );
}
