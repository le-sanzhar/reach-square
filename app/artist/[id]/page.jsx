import Link from "next/link";
import { notFound } from "next/navigation";
import { getDB, albumWithStats } from "../../../lib/db";
import Stars from "../../../components/Stars";

export const dynamic = "force-dynamic";

export default function ArtistPage({ params }) {
  const db = getDB();
  const artist = db.artists.find((a) => a.id === params.id);
  if (!artist) notFound();

  const albums = db.albums
    .filter((a) => a.artistId === artist.id)
    .map((a) => albumWithStats(db, a));
  const totalReviews = albums.reduce((s, a) => s + a.reviewCount, 0);
  const rated = albums.filter((a) => a.reviewCount > 0);
  const avg = rated.length
    ? rated.reduce((s, a) => s + a.avgRating, 0) / rated.length
    : 0;

  return (
    <div>
      <div className="profile-head">
        <div className="profile-avatar">🎤</div>
        <div>
          <span className="badge">{artist.genre}</span>
          <h1 className="h1">{artist.name}</h1>
          <div className="stat-row">
            <div className="stat"><b>{albums.length}</b><span>релизов</span></div>
            <div className="stat"><b>{totalReviews}</b><span>рецензий</span></div>
            <div className="stat"><b>{avg ? avg.toFixed(1) : "—"}</b><span>средний рейтинг</span></div>
          </div>
          {artist.link && (
            <a href={artist.link} target="_blank" rel="noreferrer" className="small" style={{ color: "var(--lav)" }}>
              Профиль в Apple Music →
            </a>
          )}
        </div>
      </div>

      <div className="eyebrow">Релизы</div>
      <div className="grid">
        {albums.map((a) => (
          <Link href={`/album/${a.id}`} className="album-card" key={a.id}>
            <img src={a.cover} alt={a.title} />
            <div className="t">{a.title}</div>
            <div className="a">{a.year}</div>
            <div className="r">
              <Stars value={a.avgRating} size={12} />
              <span className="muted">{a.reviewCount}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
