// Reach 2 — сид реальных данных из iTunes Search API (без ключей).
// Запуск: npm run seed
// Альбомы, обложки, жанры, треки и 30-сек превью — настоящие.
// Пользователи и рецензии — сгенерированы (реальных рецензий легально спарсить неоткуда).

import fs from "fs";
import path from "path";

const TERMS = [
  "Ninety One",          // Q-Pop — наш дифференциатор из PRD
  "Irina Kairatovna",
  "Скриптонит",
  "Molchat Doma",
  "Mac DeMarco",
  "Men I Trust",
  "Mitski",
  "Crumb",
  "Boy Pablo",
  "Kino Виктор Цой",
];

const USERS = [
  { id: "u1", name: "Айдар", avatar: "🎧", bio: "Ищу Q-Pop до того, как он станет мейнстримом" },
  { id: "u2", name: "Dana", avatar: "🌙", bio: "dream pop, shoegaze и всё, что звучит как туман" },
  { id: "u3", name: "Тимур", avatar: "🔥", bio: "Хип-хоп головного мозга. Скриптонит > всё" },
  { id: "u4", name: "Aliya", avatar: "🌸", bio: "Слушаю инди, пишу длинные рецензии, не извиняюсь" },
  { id: "u5", name: "Марк", avatar: "🎸", bio: "Пост-панк это не жанр, это состояние" },
  { id: "u6", name: "Sofia", avatar: "✨", bio: "Первая нашла половину твоих любимых артистов" },
  { id: "u7", name: "Ержан", avatar: "🎹", bio: "Фонк, синтвейв и странные находки с третьей страницы поиска" },
  { id: "u8", name: "Lena", avatar: "🖤", bio: "Если альбом короче 30 минут — уже хорошо" },
];

// Генератор рецензий ≥ 50 слов: собираем из фрагментов, чтобы не было близнецов.
const OPENERS = [
  "Включил этот альбом без особых ожиданий, а в итоге переслушал три раза подряд.",
  "Это тот случай, когда обложка обещает одно, а внутри тебя ждёт совсем другое — в хорошем смысле.",
  "Долго откладывал знакомство с этим релизом и зря: он оказался гораздо глубже, чем я думал.",
  "Первое прослушивание оставило меня в лёгком недоумении, но со второго раза всё встало на свои места.",
  "Редко пишу рецензии сразу после первого прослушивания, но здесь не удержался.",
  "Наткнулся на этот альбом через ленту друзей и теперь он живёт у меня в плеере вторую неделю.",
];
const MIDDLES = [
  "Продакшн здесь дышит: пространство между инструментами выстроено так, что каждая деталь слышна, ничего не давит и не перегружает.",
  "Вокал сидит в миксе идеально — не выпирает, но и не тонет, а тексты цепляют образами, которые потом крутятся в голове.",
  "Басовая линия и ударные держат всю конструкцию, и даже в самых тихих местах есть внутреннее напряжение, которое не отпускает.",
  "Атмосфера густая, почти осязаемая: это музыка для поздних поездок по городу, когда фонари сливаются в одну линию.",
  "Аранжировки минималистичные, но каждое решение звучит осознанно — никакого шума ради шума.",
  "Слышно, что артист не пытался попасть в тренды, а делал ровно то, что хотел, и эта честность подкупает сильнее любых хитов.",
];
const DETAILS = [
  "Особенно зашла середина альбома — там есть пара треков, ради которых стоит слушать всё целиком, без перемотки.",
  "Открывающий трек задаёт настроение настолько точно, что дальше уже невозможно остановиться.",
  "Финальная композиция собирает весь альбом в одну точку — давно не слышал настолько правильного завершения.",
  "Есть один трек ближе к концу, который я уже отправил трём друзьям — и все трое вернулись с вопросом «что это было и где брать ещё».",
  "Местами слышны неожиданные влияния, и эти повороты делают прослушивание похожим на хорошее путешествие без карты.",
];
const CLOSERS = [
  "В итоге — твёрдая рекомендация всем, кто устал от одинаковых плейлистов из алгоритмов.",
  "Не идеально, и пара моментов спорные, но это живая музыка, а не продукт — и это главное.",
  "Буду следить за артистом дальше: если следующий релиз будет на этом уровне, мы все о нём ещё услышим.",
  "Поставил бы и выше, если бы было куда — слушайте обязательно.",
  "Это уже не первый раз, когда независимая сцена даёт больше эмоций, чем весь топ-чарт вместе взятый.",
];

function pick(arr, n) {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function makeReview() {
  return [
    pick(OPENERS, 1)[0],
    ...pick(MIDDLES, 2),
    pick(DETAILS, 1)[0],
    pick(CLOSERS, 1)[0],
  ].join(" ");
}

function randomDateWithin(days) {
  const past = Date.now() - Math.floor(Math.random() * days * 86400000);
  return new Date(past).toISOString();
}

async function itunes(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Reach2-Student-Project" } });
  if (!res.ok) throw new Error(`iTunes API: ${res.status} for ${url}`);
  return res.json();
}

// Чарты iTunes RSS — реальные топ-альбомы, наполняют каталог "под завязку".
// genre=20 Alternative · 18 Hip-Hop/Rap · полный список кодов: жанры iTunes.
const CHARTS = [
  ["https://itunes.apple.com/us/rss/topalbums/limit=40/json", "Top Albums US"],
  ["https://itunes.apple.com/us/rss/topalbums/genre=20/limit=25/json", "Alternative"],
  ["https://itunes.apple.com/us/rss/topalbums/genre=18/limit=20/json", "Hip-Hop/Rap"],
];

async function main() {
  console.log("⏳ Тянем реальные релизы из iTunes (поиск по артистам + чарты)...");
  const ids = new Set();

  // Фаза 1: твои артисты из TERMS
  for (const term of TERMS) {
    try {
      const data = await itunes(
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=album&limit=2&country=US`
      );
      for (const col of data.results || []) if (col.collectionId) ids.add(col.collectionId);
    } catch (e) {
      console.warn(`⚠️  Пропускаем "${term}": ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  // Фаза 2: реальные чарты
  for (const [url, label] of CHARTS) {
    try {
      const data = await itunes(url);
      const entries = data?.feed?.entry || [];
      let added = 0;
      for (const e of entries) {
        const id = Number(e?.id?.attributes?.["im:id"]);
        if (id && !ids.has(id)) { ids.add(id); added++; }
      }
      console.log(`  📈 ${label}: +${added} альбомов из чарта`);
    } catch (e) {
      console.warn(`⚠️  Чарт "${label}" недоступен: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`⏳ Загружаем детали и треки для ${ids.size} альбомов (~${Math.ceil(ids.size * 0.4)} сек)...`);
  const artists = new Map();
  const albums = [];

  for (const collectionId of ids) {
    let col = null;
    let tracks = [];
    try {
      const lookup = await itunes(
        `https://itunes.apple.com/lookup?id=${collectionId}&entity=song&limit=200`
      );
      col = (lookup.results || []).find((r) => r.wrapperType === "collection");
      tracks = (lookup.results || [])
        .filter((t) => t.wrapperType === "track")
        .map((t) => ({
          name: t.trackName,
          previewUrl: t.previewUrl || null,
          durationMs: t.trackTimeMillis || null,
        }));
    } catch {
      /* пропускаем недоступные */
    }
    if (!col) continue;

    const artistId = `a${col.artistId}`;
    if (!artists.has(artistId)) {
      artists.set(artistId, {
        id: artistId,
        itunesId: col.artistId,
        name: col.artistName,
        genre: col.primaryGenreName || "Indie",
        link: col.artistViewUrl || null,
      });
    }

    albums.push({
      id: `al${col.collectionId}`,
      itunesId: col.collectionId,
      artistId,
      title: col.collectionName,
      year: col.releaseDate ? new Date(col.releaseDate).getFullYear() : null,
      genre: col.primaryGenreName || "Indie",
      cover: (col.artworkUrl100 || "").replace("100x100", "600x600"),
      link: col.collectionViewUrl || null,
      tracks,
    });
    console.log(`  ✅ ${col.artistName} — ${col.collectionName} (${tracks.length} треков)`);
    await new Promise((r) => setTimeout(r, 350)); // бережём rate limit
  }

  if (albums.length === 0) {
    console.error("❌ Ничего не загрузилось. Проверь интернет и попробуй ещё раз.");
    process.exit(1);
  }

  // Рецензии: 2–4 на альбом, ≥ 50 слов, от разных пользователей
  const reviews = [];
  let rid = 1;
  for (const al of albums) {
    const reviewers = pick(USERS, 2 + Math.floor(Math.random() * 3));
    for (const u of reviewers) {
      reviews.push({
        id: `r${rid++}`,
        albumId: al.id,
        userId: u.id,
        rating: 3 + Math.floor(Math.random() * 3), // 3..5 — инди-комьюнити доброе
        text: makeReview(),
        date: randomDateWithin(45),
        likes: Math.floor(Math.random() * 14),
      });
    }
  }

  const db = {
    artists: [...artists.values()],
    albums,
    users: USERS,
    reviews: reviews.sort((a, b) => new Date(b.date) - new Date(a.date)),
  };

  const out = path.join(process.cwd(), "data", "db.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(db, null, 2));
  console.log(
    `\n🎉 Готово: ${db.artists.length} артистов, ${db.albums.length} альбомов, ${db.reviews.length} рецензий → data/db.json`
  );
}

main();
