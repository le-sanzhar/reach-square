import Link from "next/link";
import { getDB, albumWithStats, timeAgo } from "../lib/db";
import Stars from "../components/Stars";
import HeroPlay from "../components/HeroPlay";
import Avatar from "../components/Avatar";

export const dynamic = "force-dynamic";

export default function Home() {
  const db = getDB();

  if (db.albums.length === 0) {
    return (
      <div className="empty">
        <div className="h2">Каталог пока пустой</div>
        <p>Запусти <code>npm run seed</code> — скрипт затянет реальные альбомы из iTunes,<br />или добавь альбом вручную на странице «Каталог».</p>
      </div>
    );
  }

  const withStats = db.albums.map((a) => albumWithStats(db, a));
  const rated = withStats.filter((a) => a.reviewCount > 0);

  // Альбом недели — лучший по рейтингу × количеству рецензий
  const heroAlbum = [...rated].sort(
    (a, b) => b.avgRating * b.reviewCount - a.avgRating * a.reviewCount
  )[0] || withStats[0];
  const heroArtist = db.artists.find((x) => x.id === heroAlbum.artistId);
  const heroQueue = (heroAlbum.tracks || [])
    .filter((t) => t.previewUrl)
    .map((t) => ({ url: t.previewUrl, name: t.name, artist: heroArtist?.name, cover: heroAlbum.cover }));

  // Популярные артисты — по числу рецензий на их релизы; фото = обложка первого релиза
  const artists = db.artists
    .map((ar) => {
      const albums = withStats.filter((a) => a.artistId === ar.id);
      return {
        ...ar,
        cover: albums[0]?.cover,
        reviews: albums.reduce((s, a) => s + a.reviewCount, 0),
      };
    })
    .filter((a) => a.cover)
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 6);

  // Горячие альбомы
  const hot = [...rated]
    .sort((a, b) => b.avgRating * b.reviewCount - a.avgRating * a.reviewCount)
    .slice(0, 6);

  // Правая панель
  const fresh = [...withStats].sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, 3);
  const top5 = [...rated].sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount).slice(0, 5);
  const feed = db.reviews.slice(0, 6).map((r) => ({
    review: r,
    user: db.users.find((u) => u.id === r.userId),
    album: db.albums.find((a) => a.id === r.albumId),
  })).filter((e) => e.user && e.album);

  return (
    <div className="cols" style={{ gridTemplateColumns: "1fr 300px" }}>
      <div>
        {/* HERO */}
        <div className="hero5">
          <div className="hero5-art" style={{ backgroundImage: `url(${heroAlbum.cover})` }} />
          <div className="hero5-in">
            <div className="badge">Альбом недели</div>
            <h1 className="h1">{heroAlbum.title}</h1>
            <div className="sub">
              {heroArtist && <b>{heroArtist.name}</b>}
              <Stars value={heroAlbum.avgRating} />
              <span>{heroAlbum.avgRating.toFixed(1)} · {heroAlbum.reviewCount} рецензий</span>
            </div>
            <div className="hero5-actions">
              <HeroPlay queue={heroQueue} />
              <Link href={`/album/${heroAlbum.id}`} className="pill-ghost">Читать рецензии</Link>
            </div>
          </div>
        </div>

        {/* ПОПУЛЯРНЫЕ АРТИСТЫ */}
        <div className="row-head">
          <h2 className="h2">Популярные артисты</h2>
          <Link href="/catalog" className="see">Все →</Link>
        </div>
        <div className="circle-row">
          {artists.map((ar) => (
            <Link href={`/catalog?q=${encodeURIComponent(ar.name)}`} className="artist-circle" key={ar.id}>
              <img src={ar.cover} alt={ar.name} />
              <div className="nm">{ar.name}</div>
              <div className="g">{ar.genre}</div>
            </Link>
          ))}
        </div>

        {/* ГОРЯЧИЕ АЛЬБОМЫ */}
        <div className="row-head">
          <h2 className="h2">Горячие альбомы</h2>
          <Link href="/catalog" className="see">Все →</Link>
        </div>
        <div className="hot-grid">
          {hot.map((a) => {
            const artist = db.artists.find((x) => x.id === a.artistId);
            return (
              <Link href={`/album/${a.id}`} key={a.id} className="hot-card">
                <img src={a.cover} alt={a.title} />
                <div className="meta">
                  <div className="nm">{a.title}</div>
                  <div className="a">{artist?.name}</div>
                  <div className="r">★ {a.avgRating.toFixed(1)} · {a.reviewCount} рец.</div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ЛЕНТА */}
        <div className="row-head">
          <h2 className="h2">Лента друзей</h2>
        </div>
        {feed.map(({ review, user, album }) => {
          const artist = db.artists.find((a) => a.id === album.artistId);
          return (
            <div className="feed-card" key={review.id}>
              <Link href={`/album/${album.id}`}>
                <img className="feed-cover" src={album.cover} alt={album.title} />
              </Link>
              <div className="feed-body">
                <div className="feed-line">
                  <Link href={`/u/${user.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                    <Avatar userId={user.id} name={user.name} size={24} />
                    <b>{user.name}</b>
                  </Link>
                  {" оценил(а) "}
                  <Link href={`/album/${album.id}`} className="feed-album">{album.title}</Link>
                  {artist && <span className="muted"> · {artist.name}</span>}
                </div>
                <Stars value={review.rating} />
                <div className="feed-excerpt">{review.text}</div>
                <div className="feed-meta">
                  <span>{timeAgo(review.date)}</span>
                  <span>♥ {review.likes}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ */}
      <aside className="rail">
        <div className="rail-card">
          <div className="rail-head">
            <span className="t">Новые релизы</span>
            <Link href="/catalog" className="see">Все</Link>
          </div>
          {fresh.map((a) => {
            const artist = db.artists.find((x) => x.id === a.artistId);
            return (
              <Link href={`/album/${a.id}`} className="rail-item" key={a.id}>
                <img src={a.cover} alt="" />
                <div>
                  <div className="nm">{a.title}</div>
                  <div className="s">{artist?.name} · {a.year}</div>
                </div>
                <span className="go">›</span>
              </Link>
            );
          })}
        </div>

        <div className="rail-card">
          <div className="rail-head">
            <span className="t">Топ по оценкам</span>
          </div>
          {top5.map((a, i) => (
            <Link href={`/album/${a.id}`} className="rail-item" key={a.id}>
              <span className="rank-ghost">{i + 1}</span>
              <img src={a.cover} alt="" />
              <div>
                <div className="nm">{a.title}</div>
                <div className="s">★ {a.avgRating.toFixed(1)} · {a.reviewCount} рец.</div>
              </div>
              <span className="go">›</span>
            </Link>
          ))}
        </div>

        <div className="rail-card">
          <div className="rail-head"><span className="t">О платформе</span></div>
          <p className="small muted">
            Reach 2 — настоящий фидбек для независимой музыки.
            Ставь оценку или пиши развёрнутую рецензию — каждое мнение важно.
          </p>
        </div>
      </aside>
    </div>
  );
}
