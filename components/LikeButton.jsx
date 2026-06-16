"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function LikeButton({ reviewId, initialLikes = 0, initialLiked = false }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!session || busy) return;
    setBusy(true);
    setLiked((v) => !v);
    setLikes((v) => liked ? v - 1 : v + 1);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setLiked(data.liked);
      } else {
        setLiked((v) => !v);
        setLikes((v) => liked ? v + 1 : v - 1);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      className={`like-btn${liked ? " liked" : ""}`}
      onClick={toggle}
      disabled={!session || busy}
      aria-label={liked ? "Убрать лайк" : "Поставить лайк"}
      title={!session ? "Войди чтобы ставить лайки" : ""}
    >
      ♥ {likes > 0 && <span>{likes}</span>}
    </button>
  );
}
