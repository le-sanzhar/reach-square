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
        <span className="glass">⌕</span>
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
            title="Выйти"
          >
            ×
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
