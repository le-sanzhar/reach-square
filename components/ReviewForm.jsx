"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SOFT_MIN = 50;
const HINTS = [
  { label: "🎤 текст", text: "Тексты здесь " },
  { label: "🥁 бит", text: "Бит и продакшн " },
  { label: "🌫 атмосфера", text: "По атмосфере альбом напоминает " },
  { label: "🎯 кому зайдёт", text: "Этот релиз стоит послушать тем, кто " },
];

export default function ReviewForm({ albumId }) {
  const { data: session, status } = useSession();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const taRef = useRef(null);
  const router = useRouter();

  const draftKey = `reach2_draft_${albumId}`;

  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setText(d.text || "");
        setRating(d.rating || 0);
      } catch {}
    }
  }, [draftKey]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (text || rating) localStorage.setItem(draftKey, JSON.stringify({ text, rating }));
    }, 800);
    return () => clearTimeout(t);
  }, [text, rating, draftKey]);

  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);
  const pct = Math.min(100, Math.round((words / SOFT_MIN) * 100));
  const hasText = text.trim().length > 0;

  function addHint(h) {
    setText((t) => (t ? t.replace(/\s*$/, " ") : "") + h.text);
    taRef.current?.focus();
  }

  async function publish(quickRating = false) {
    if (!rating || busy) return;
    setBusy(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ albumId, rating, text: quickRating ? null : text || null }),
    });
    setBusy(false);
    if (res.ok) {
      localStorage.removeItem(draftKey);
      setText("");
      setRating(0);
      setToast(quickRating ? "Оценка сохранена ★" : "Рецензия опубликована 🎉");
      setTimeout(() => setToast(""), 2500);
      router.refresh();
    } else {
      const e = await res.json().catch(() => ({}));
      setToast(e.error || "Не получилось опубликовать — попробуй ещё раз");
      setTimeout(() => setToast(""), 3000);
    }
  }

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="review-form">
        <div className="eyebrow">Написать рецензию</div>
        <div style={{ marginTop: 14, color: "var(--mut)", fontSize: 14 }}>
          Чтобы оставить рецензию или оценку,{" "}
          <Link href="/login" style={{ color: "var(--accent-2)", fontWeight: 600 }}>войди в аккаунт</Link>.
        </div>
      </div>
    );
  }

  return (
    <div className="review-form">
      <div className="eyebrow">Написать рецензию</div>

      <div className="stars-input" role="radiogroup" aria-label="Оценка">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            className={(hover || rating) >= i ? "on" : ""}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(i)}
            aria-label={`${i} из 5`}
          >
            ★
          </button>
        ))}
      </div>

      <div className="hints">
        {HINTS.map((h) => (
          <button key={h.label} type="button" onClick={() => addHint(h)}>{h.label}</button>
        ))}
      </div>

      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Что ты думаешь об этом альбоме? Можно коротко, можно развёрнуто — или просто поставь оценку выше."
      />

      {hasText && (
        <div className="gate">
          <div className="gate-bar">
            <div className={`gate-fill ${words >= SOFT_MIN ? "done" : ""}`} style={{ width: `${pct}%` }} />
          </div>
          <div className="gate-row">
            {words >= SOFT_MIN ? (
              <span className="ok">✓ Это уже настоящая рецензия</span>
            ) : (
              <span className="muted">{words} слов — можно ещё раскрыть</span>
            )}
          </div>
        </div>
      )}

      <div className="review-actions">
        {rating > 0 && !hasText && (
          <button className="btn btn-ghost" disabled={busy} onClick={() => publish(true)}>
            {busy ? "…" : "Только оценка"}
          </button>
        )}
        <button className="btn" disabled={!rating || busy} onClick={() => publish(false)}>
          {busy ? "Публикуем…" : hasText ? "Опубликовать рецензию" : "Опубликовать"}
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
