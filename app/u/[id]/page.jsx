import Link from "next/link";
import { notFound } from "next/navigation";
import { getDB, timeAgo } from "../../../lib/db";
import Avatar from "../../../components/Avatar";
import Stars from "../../../components/Stars";

export const dynamic = "force-dynamic";

export default function UserPage({ params }) {
  const db = getDB();
  const user = db.users.find((u) => u.id === params.id);
  if (!user) notFound();

  const reviews = db.reviews
    .filter((r) => r.userId === user.id)
    .map((r) => ({ ...r, album: db.albums.find((a) => a.id === r.albumId) }))
    .filter((r) => r.album);

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const genres = {};
  for (const r of reviews) genres[r.album.genre] = (genres[r.album.genre] || 0) + 1;
  const topGenres = Object.entries(genres).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div>
      <div className="profile-head">
        <div className="profile-avatar"><Avatar userId={user.id} name={user.name} size={80} /></div>
        <div>
          <h1 className="h1">{user.name}</h1>
          <p className="muted small">{user.bio}</p>
          <div className="stat-row">
            <div className="stat"><b>{reviews.length}</b><span>рецензий</span></div>
            <div className="stat"><b>{avg ? avg.toFixed(1) : "—"}</b><span>средняя оценка</span></div>
            <div className="stat">
              <b style={{ fontSize: 14, lineHeight: "24px" }}>
                {topGenres.map(([g]) => g).join(" · ") || "—"}
              </b>
              <span>любимые жанры</span>
            </div>
          </div>
        </div>
      </div>

      <div className="eyebrow">История оценок</div>
      {reviews.length === 0 && (
        <div className="empty">
          <div className="h2">Пока пусто</div>
          <p>Музыкальная идентичность строится из рецензий. Найди альбом в каталоге и напиши первую.</p>
        </div>
      )}
      {reviews.map((r) => (
        <div className="feed-card" key={r.id}>
          <Link href={`/album/${r.album.id}`}>
            <img className="feed-cover" src={r.album.cover} alt={r.album.title} />
          </Link>
          <div className="feed-body">
            <div className="feed-line">
              <Link href={`/album/${r.album.id}`} className="feed-album">{r.album.title}</Link>
            </div>
            <Stars value={r.rating} />
            <div className="feed-excerpt">{r.text}</div>
            <div className="feed-meta"><span>{timeAgo(r.date)}</span><span>♥ {r.likes}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}
