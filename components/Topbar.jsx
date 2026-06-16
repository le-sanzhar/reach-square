"use client";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Avatar from "./Avatar";

export default function Topbar() {
  const { data: session, status } = useSession();
  const [q, setQ] = useState("");
  const router = useRouter();

  function submit(e) {
    e.preventDefault();
    router.push(q.trim() ? `/catalog?q=${encodeURIComponent(q.trim())}` : "/catalog");
  }

  return (
    <div className="topbar">
      <form className="search" onSubmit={submit}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "var(--mut)", flexShrink: 0 }} aria-hidden="true">
          <circle cx="5.5" cy="5.5" r="4"/>
          <path d="M9 9L12.5 12.5"/>
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Найти альбом или артиста…"
          aria-label="Поиск"
        />
      </form>

      {status === "loading" ? (
        <div className="user-chip"><span className="muted" style={{ fontSize: 13 }}>…</span></div>
      ) : session ? (
        <div className="user-chip">
          <Avatar userId={session.user.id} name={session.user.name} size={28} />
          <Link href={`/u/${session.user.id}`} className="user-name">{session.user.name}</Link>
          <button
            className="sign-out-btn"
            onClick={() => signOut({ callbackUrl: "/login" })}
            aria-label="Выйти"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      ) : (
        <div className="user-chip" style={{ padding: "6px 8px" }}>
          <Link href="/login" className="btn" style={{ padding: "8px 20px", fontSize: 14 }}>Войти</Link>
        </div>
      )}
    </div>
  );
}
