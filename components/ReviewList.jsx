"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Avatar from "./Avatar";
import Stars from "./Stars";
import LikeButton from "./LikeButton";
import DeleteReviewButton from "./DeleteReviewButton";

function timeAgoClient(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч назад`;
  const d = Math.floor(h / 24);
  if (d === 1) return "вчера";
  if (d < 30) return `${d} дн назад`;
  return `${Math.floor(d / 30)} мес назад`;
}

function wordCount(text) {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}

export default function ReviewList({ reviews }) {
  const { data: session } = useSession();
  const [sort, setSort] = useState("date");

  const sorted = [...reviews].sort((a, b) =>
    sort === "likes"
      ? (b.likes || 0) - (a.likes || 0)
      : new Date(b.date) - new Date(a.date)
  );

  if (reviews.length === 0) return (
    <div className="empty" style={{ padding: 32 }}>
      Пока ни одной рецензии. Стань первым — выше есть форма 👆
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 className="h2">Рецензии <span className="muted" style={{ fontSize: 14, fontWeight: 400 }}>({reviews.length})</span></h2>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            className={sort === "date" ? "filter-btn on" : "filter-btn"}
            onClick={() => setSort("date")}
          >Новые</button>
          <button
            className={sort === "likes" ? "filter-btn on" : "filter-btn"}
            onClick={() => setSort("likes")}
          >Популярные</button>
        </div>
      </div>

      {sorted.map((r) => (
        <div className="review" key={r.id}>
          <div className="review-head">
            <Avatar userId={r.userId} name={r.user?.name} size={30} />
            <Link href={`/u/${r.userId}`} className="review-name">{r.user?.name || "Аноним"}</Link>
            <Stars value={r.rating} size={13} />
            <span className="review-date">{timeAgoClient(r.date)}</span>
          </div>
          {r.text && <p className="review-text">{r.text}</p>}
          <div className="review-foot">
            <LikeButton
              reviewId={r.id}
              initialLikes={r.likes || 0}
              initialLiked={(r.likedBy || []).includes(session?.user?.id || "")}
            />
            {r.text && <span>· {wordCount(r.text)} слов</span>}
            {!r.text && <span>· только оценка</span>}
            {session?.user?.id === r.userId && <DeleteReviewButton reviewId={r.id} />}
          </div>
        </div>
      ))}
    </div>
  );
}
