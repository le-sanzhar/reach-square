"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MIN_WORDS = 50;
const HINTS = [
  { label: "🎤 текст", text: "Тексты здесь " },
  { label: "🥁 бит", text: "Бит и продакшн " },
  { label: "🌫 атмосфера", text: "По атмосфере альбом напоминает " },
  { label: "🎯 кому зайдёт", text: "Этот релиз стоит послушать тем, кто " },
];

export default function ReviewForm({ albumId }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const taRef = useRef(null);
  const router = useRouter();

  const draftKey = `reach2_draft_${albumId}`;

  // черновик: восстановление + автосохранение
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
  const ready = words >= MIN_WORDS && rating > 0;
  const pct = Math.min(100, Math.round((words / MIN_WORDS) * 100));

  function addHint(h) {
    setText((t) => (t ? t.replace(/\s*$/, " ") : "") + h.text);
    taRef.current?.focus();
  }

  async function publish() {
    if (!ready || busy) return;
    setBusy(true);
    const userId = localStorage.getItem("reach2_user") || "u1";
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ albumId, userId, rating, text }),
    });
    setBusy(false);
    if (res.ok) {
      localStorage.removeItem(draftKey);
      setText("");
      setRating(0);
      setToast("Рецензия опубликована 🎉");
      setTimeout(() => setToast(""), 2500);
      router.refresh();
    } else {
      const e = await res.json().catch(() => ({}));
      setToast(e.error || "Не получилось опубликовать — попробуй ещё раз");
      setTimeout(() => setToast(""), 3000);
    }
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
        placeholder="Что ты думаешь об этом альбоме? Минимум 50 слов — «🔥🔥🔥» не считается."
      />

      <div className="gate">
        <div className="gate-bar">
          <div className={`gate-fill ${words >= MIN_WORDS ? "done" : ""}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="gate-row">
          {words >= MIN_WORDS ? (
            <span className="ok">✓ Достаточно слов — это настоящая рецензия</span>
          ) : (
            <span>{words} / {MIN_WORDS} слов{rating === 0 ? " · и не забудь оценку" : ""}</span>
          )}
          <button className="btn" disabled={!ready || busy} onClick={publish}>
            {busy ? "Публикуем…" : "Опубликовать"}
          </button>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
