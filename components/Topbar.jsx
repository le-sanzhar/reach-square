"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState("");
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((list) => {
        setUsers(list);
        const saved = localStorage.getItem("reach2_user");
        const id = list.some((u) => u.id === saved) ? saved : list[0]?.id || "";
        setMe(id);
        if (id) localStorage.setItem("reach2_user", id);
      })
      .catch(() => {});
  }, []);

  const current = users.find((u) => u.id === me);

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

      {users.length > 0 && (
        <div className="user-chip" title="Демо-логин: от чьего имени ты сидишь">
          <span className="user-avatar">{current?.avatar || "👤"}</span>
          <select
            value={me}
            aria-label="Сменить пользователя"
            onChange={(e) => {
              setMe(e.target.value);
              localStorage.setItem("reach2_user", e.target.value);
              router.refresh();
            }}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
