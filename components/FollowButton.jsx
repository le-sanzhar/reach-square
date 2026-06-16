"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function FollowButton({ userId, initialFollowing, initialFollowers }) {
  const { data: session } = useSession();
  const [following, setFollowing] = useState(initialFollowing);
  const [followers, setFollowers] = useState(initialFollowers);
  const [busy, setBusy] = useState(false);

  if (!session || session.user.id === userId) return null;

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/users/${userId}/follow`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following);
        setFollowers(data.followers);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
      <button
        className={following ? "btn btn-ghost" : "btn"}
        onClick={toggle}
        disabled={busy}
        style={{ padding: "8px 20px", fontSize: 13 }}
      >
        {busy ? "…" : following ? "Вы подписаны" : "Подписаться"}
      </button>
      {followers > 0 && (
        <span className="muted small">{followers} подписч.</span>
      )}
    </div>
  );
}
