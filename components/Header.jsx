"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const path = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="logo">
        <Image src="/logo.jpg" alt="Reach 2" width={34} height={34} />
        <span className="wordmark">REACH<sup>2</sup></span>
      </Link>

      <nav className="nav-links" aria-label="Основная навигация">
        <Link href="/" className={path === "/" ? "active" : ""}>
          <span className="ico">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
              <path d="M1.5 7L8 1.5 14.5 7V14.5H10.5V10H5.5V14.5H1.5V7Z"/>
            </svg>
          </span>
          Главная
        </Link>
        <Link href="/catalog" className={path.startsWith("/catalog") ? "active" : ""}>
          <span className="ico">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1.5" y="1.5" width="5" height="5" rx="1.2"/>
              <rect x="9.5" y="1.5" width="5" height="5" rx="1.2"/>
              <rect x="1.5" y="9.5" width="5" height="5" rx="1.2"/>
              <rect x="9.5" y="9.5" width="5" height="5" rx="1.2"/>
            </svg>
          </span>
          Каталог
        </Link>
        <Link href="/people" className={path.startsWith("/people") ? "active" : ""}>
          <span className="ico">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="5.5" cy="5" r="2.5"/>
              <path d="M1 14c0-2.76 2.02-5 4.5-5"/>
              <circle cx="11.5" cy="5" r="2.5"/>
              <path d="M15 14c0-2.76-2.02-5-4.5-5"/>
            </svg>
          </span>
          Слушатели
        </Link>
        <Link href="/profile" className={path.startsWith("/u/") || path === "/profile" ? "active" : ""}>
          <span className="ico">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="8" cy="5.5" r="2.8"/>
              <path d="M1.5 14.5c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5"/>
            </svg>
          </span>
          Мой профиль
        </Link>
      </nav>

      <div className="nav-spacer" />
      <div className="small muted" style={{ padding: "0 12px" }}>
        Независимая музыка.<br />Настоящие рецензии.
      </div>
    </aside>
  );
}
