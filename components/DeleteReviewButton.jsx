"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteReviewButton({ reviewId }) {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function del() {
    setBusy(true);
    const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else setBusy(false);
  }

  if (confirm) return (
    <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
      <button className="delete-confirm-btn" onClick={del} disabled={busy}>
        {busy ? "…" : "Удалить"}
      </button>
      <button className="delete-cancel-btn" onClick={() => setConfirm(false)}>Отмена</button>
    </span>
  );

  return (
    <button className="delete-btn" onClick={() => setConfirm(true)} aria-label="Удалить рецензию">
      Удалить
    </button>
  );
}
