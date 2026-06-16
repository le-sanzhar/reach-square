import Link from "next/link";
import Image from "next/image";
import { getDB, albumWithStats } from "../../lib/db";
import Stars from "../../components/Stars";
import ImportSearch from "../../components/ImportSearch";

export const dynamic = "force-dynamic";

export default function CatalogPage({ searchParams }) {
  const db = getDB();
  const genre = searchParams?.genre || "";
  const q = (searchParams?.q || "").toLowerCase().trim();

  const genres = [...new Set(db.albums.map((a) => a.genre))].sort();
  const albums = db.albums
    .filter((a) => !genre || a.genre === genre)
    .filter((a) => {
      if (!q) return true;
      const artist = db.artists.find((x) => x.id === a.artistId);
      return (
        a.title.toLowerCase().includes(q) ||
        (artist?.name || "").toLowerCase().includes(q)
      );
    })
    .map((a) => albumWithStats(db, a))
    .sort((a, b) => b.reviewCount - a.reviewCount);

  return (
    <div>
      <div className="eyebrow">Каталог</div>
      <h1 className="h1">{q ? `Поиск: «${searchParams.q}»` : "Все релизы"}</h1>

      <div className="cols" style={{ marginTop: 20 }}>
        <div>
          <div className="filters">
            <Link href="/catalog" className={!genre ? "on" : ""}>Все</Link>
            {genres.map((g) => (
              <Link
                key={g}
                href={`/catalog?genre=${encodeURIComponent(g)}`}
                className={genre === g ? "on" : ""}
              >
                {g}
              </Link>
            ))}
          </div>

          {albums.length === 0 ? (
            <div className="empty">
              <div className="h2">Здесь пока ничего нет</div>
              <p>{q ? "В каталоге не нашлось — найди этот альбом в iTunes через поиск справа и добавь в один клик." : <>Запусти <code>npm run seed</code> или добавь альбом через поиск справа.</>}</p>
            </div>
          ) : (
            <div className="grid">
              {albums.map((a) => {
                const artist = db.artists.find((x) => x.id === a.artistId);
                return (
                  <Link href={`/album/${a.id}`} className="album-card" key={a.id}>
                    <Image src={a.cover} alt={a.title} width={300} height={300} sizes="(max-width: 760px) 45vw, 175px" />
                    <div className="meta">
                      <div className="nm">{a.title}</div>
                      <div className="a">{artist?.name}</div>
                      <div className="r">
                        <Stars value={a.avgRating} size={12} />
                        <span className="muted">{a.reviewCount}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <aside>
          <ImportSearch />
          <div className="panel" style={{ marginTop: 16 }}>
            <div className="eyebrow">Как это работает</div>
            <p className="small muted">
              Поиск идёт по реальной базе iTunes — метаданные, обложки и превью
              подтягиваются официальным API. Никаких мок-данных.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
