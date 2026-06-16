import Link from "next/link";
import { notFound } from "next/navigation";
import { getDB, albumWithStats, timeAgo, wordCount } from "../../../lib/db";
import Stars from "../../../components/Stars";
import Avatar from "../../../components/Avatar";
import ReviewForm from "../../../components/ReviewForm";
import TrackList from "../../../components/TrackList";

export const dynamic = "force-dynamic";

export default function AlbumPage({ params }) {
  const db = getDB();
  const raw = db.albums.find((a) => a.id === params.id);
  if (!raw) notFound();

  const album = albumWithStats(db, raw);
  const artist = db.artists.find((a) => a.id === album.artistId);
  const reviews = db.reviews
    .filter((r) => r.albumId === album.id)
    .map((r) => ({ ...r, user: db.users.find((u) => u.id === r.userId) }));

  return (
    <div>
      <div className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${album.cover})` }} />
        <div className="hero-in">
          <img className="hero-cover" src={album.cover} alt={album.title} />
          <div className="hero-meta">
            <span className="badge">{album.genre}{album.year ? ` · ${album.year}` : ""}</span>
            <h1 className="h1">{album.title}</h1>
            {artist && (
              <span className="muted" style={{ fontSize: 16 }}>{artist.name}</span>
            )}
            <div className="hero-rating">
              <span className="hero-score">{album.reviewCount ? album.avgRating.toFixed(1) : "—"}</span>
              <div>
                <Stars value={album.avgRating} />
                <div className="small muted">{album.reviewCount} рецензий</div>
              </div>
            </div>
            <div className="ext-links">
              {album.link && (
                <a href={album.link} target="_blank" rel="noreferrer">🎵 Открыть в Apple Music</a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="cols">
        <div>
          <div className="panel">
            <ReviewForm albumId={album.id} />
          </div>

          <div className="section-gap">
            <h2 className="h2" style={{ marginBottom: 6 }}>Рецензии</h2>
            {reviews.length === 0 && (
              <div className="empty" style={{ padding: 32 }}>
                Пока ни одной рецензии. Стань первым — выше есть форма 👆
              </div>
            )}
            {reviews.map((r) => (
              <div className="review" key={r.id}>
                <div className="review-head">
                  <Avatar userId={r.userId} name={r.user?.name} size={30} />
                  <Link href={`/u/${r.userId}`} className="review-name">{r.user?.name || "Аноним"}</Link>
                  <Stars value={r.rating} size={13} />
                  <span className="review-date">{timeAgo(r.date)}</span>
                </div>
                {r.text && <p className="review-text">{r.text}</p>}
                <div className="review-foot">
                  ♥ {r.likes}
                  {r.text ? ` · ${wordCount(r.text)} слов` : " · только оценка"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside>
          <TrackList tracks={album.tracks} albumTitle={album.title} artistName={artist?.name} cover={album.cover} />
        </aside>
      </div>
    </div>
  );
}
