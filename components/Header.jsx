"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const path = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="logo">
        <img src="/logo.jpg" alt="Reach 2" />
        <span className="wordmark">REACH<sup>2</sup></span>
      </Link>

      <div className="side-label">Меню</div>
      <nav className="nav-links">
        <Link href="/" className={path === "/" ? "active" : ""}>
          <span className="ico">⌂</span> Главная
        </Link>
        <Link href="/catalog" className={path.startsWith("/catalog") ? "active" : ""}>
          <span className="ico">▦</span> Каталог
        </Link>
        <Link href="/profile" className={path.startsWith("/u/") || path === "/profile" ? "active" : ""}>
          <span className="ico">◉</span> Мой профиль
        </Link>
      </nav>

      <div className="nav-spacer" />
      <div className="small muted" style={{ padding: "0 12px" }}>
        Независимая музыка.<br />Настоящие рецензии.
      </div>
    </aside>
  );
}
