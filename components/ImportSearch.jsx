"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ImportSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(null);
  const [toast, setToast] = useState("");
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const init = params.get("q");
    if (init) setQ(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/import?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => setResults(d.results || []))
        .catch(() => setResults([]));
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  async function add(col) {
    setBusy(col.collectionId);
    const res = await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collectionId: col.collectionId }),
    });
    setBusy(null);
    if (res.ok) {
      const { albumId } = await res.json();
      setToast("Альбом добавлен в каталог ✅");
      setTimeout(() => setToast(""), 2000);
      setQ("");
      setResults([]);
      router.push(`/album/${albumId}`);
      router.refresh();
    } else {
      setToast("Не удалось импортировать");
      setTimeout(() => setToast(""), 2500);
    }
  }

  return (
    <div className="panel import-box">
      <div className="eyebrow">Добавить альбом из iTunes</div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Найди любой альбом или артиста…"
        aria-label="Поиск альбома в iTunes"
      />
      {results.map((r) => (
        <div className="import-result" key={r.collectionId}>
          <img src={r.artworkUrl100} alt="" />
          <div className="meta">
            <div style={{ fontWeight: 600 }}>{r.collectionName}</div>
            <div className="muted">{r.artistName} · {r.primaryGenreName}</div>
          </div>
          <button
            className="btn btn-ghost"
            style={{ padding: "6px 14px", fontSize: 13 }}
            disabled={busy === r.collectionId}
            onClick={() => add(r)}
          >
            {busy === r.collectionId ? "…" : "+ Добавить"}
          </button>
        </div>
      ))}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
