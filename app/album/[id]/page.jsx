import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { getDB, albumWithStats, timeAgo, wordCount } from "../../../lib/db";
import Stars from "../../../components/Stars";
import Avatar from "../../../components/Avatar";
import ReviewForm from "../../../components/ReviewForm";
import TrackList from "../../../components/TrackList";
import LikeButton from "../../../components/LikeButton";
import DeleteReviewButton from "../../../components/DeleteReviewButton";

export const dynamic = "force-dynamic";

export default async function AlbumPage({ params }) {
  const session = await getServerSession(authOptions);
  const db = getDB();
  const raw = db.albums.find((a) => a.id === params.id);
  if (!raw) notFound();

  const album = albumWithStats(db, raw);
  const artist = db.artists.find((a) => a.id === album.artistId);
  const myReview = session?.user?.id
    ? db.reviews.find((r) => r.albumId === album.id && r.userId === session.user.id)
    : null;
  const reviews = db.reviews
    .filter((r) => r.albumId === album.id)
    .map((r) => ({ ...r, user: db.users.find((u) => u.id === r.userId) }));

  return (
    <div>
      <div className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${album.cover})` }} />
        <div className="hero-in">
          <Image className="hero-cover" src={album.cover} alt={album.title} width={188} height={188} priority />
          <div className="hero-meta">
            <span className="badge">{album.genre}{album.year ? ` · ${album.year}` : ""}</span>
            <h1 className="h1">{album.title}</h1>
            {artist && <span className="muted" style={{ fontSize: 16 }}>{artist.name}</span>}
            <div className="hero-rating">
              <span className="hero-score">{album.reviewCount ? album.avgRating.toFixed(1) : "—"}</span>
              <div>
                <Stars value={album.avgRating} />
                <div className="small muted">{album.reviewCount} рецензий</div>
              </div>
            </div>
            {album.link && (
              <div className="ext-links">
                <a href={album.link} target="_blank" rel="noreferrer">Открыть в Apple Music ↗</a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="cols">
        <div>
          <div className="panel">
            {myReview ? (
              <div>
                <div className="eyebrow">Ваша оценка</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                  <Stars value={myReview.rating} />
                  <span className="muted small">{timeAgo(myReview.date)}</span>
                  <DeleteReviewButton reviewId={myReview.id} />
                </div>
                {myReview.text && <p className="review-text" style={{ marginTop: 10 }}>{myReview.text}</p>}
              </div>
            ) : (
              <ReviewForm albumId={album.id} />
            )}
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
                  <LikeButton
                    reviewId={r.id}
                    initialLikes={r.likes || 0}
                    initialLiked={(r.likedBy || []).includes(session?.user?.id || "")}
                  />
                  {r.text && <span>· {wordCount(r.text)} слов</span>}
                  {!r.text && <span>· только оценка</span>}
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
