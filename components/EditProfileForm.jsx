"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfileForm({ name: initName, bio: initBio }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initName || "");
  const [bio, setBio] = useState(initBio || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function save() {
    if (!name.trim()) return setError("Имя не может быть пустым");
    setBusy(true); setError("");
    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), bio: bio.trim() }),
    });
    setBusy(false);
    if (res.ok) { setOpen(false); router.refresh(); }
    else { const d = await res.json().catch(() => ({})); setError(d.error || "Ошибка"); }
  }

  if (!open) return (
    <button className="btn btn-ghost" onClick={() => setOpen(true)} style={{ padding: "7px 16px", fontSize: 12, marginTop: 8 }}>
      Редактировать профиль
    </button>
  );

  return (
    <div className="edit-profile-form">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя"
        maxLength={60}
        autoFocus
      />
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="О себе (необязательно)"
        maxLength={200}
        rows={3}
      />
      {error && <div className="auth-error">{error}</div>}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button className="btn" onClick={save} disabled={busy} style={{ padding: "8px 20px", fontSize: 13 }}>
          {busy ? "…" : "Сохранить"}
        </button>
        <button className="btn btn-ghost" onClick={() => setOpen(false)} style={{ padding: "8px 16px", fontSize: 13 }}>
          Отмена
        </button>
      </div>
    </div>
  );
}
