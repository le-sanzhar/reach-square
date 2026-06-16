import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { getDB } from "../../lib/db";
import Avatar from "../../components/Avatar";
import FollowButton from "../../components/FollowButton";

export const dynamic = "force-dynamic";

export default async function PeoplePage({ searchParams }) {
  const session = await getServerSession(authOptions);
  const q = (searchParams?.q || "").toLowerCase().trim();
  const db = getDB();

  const me = session?.user?.id ? db.users.find((u) => u.id === session.user.id) : null;
  const myFollowing = me?.following || [];

  const users = db.users
    .filter((u) => !q || u.name.toLowerCase().includes(q) || (u.bio || "").toLowerCase().includes(q))
    .map((u) => {
      const reviewCount = db.reviews.filter((r) => r.userId === u.id).length;
      const followers = db.users.filter((x) => (x.following || []).includes(u.id)).length;
      return { ...u, reviewCount, followers };
    })
    .sort((a, b) => b.reviewCount - a.reviewCount);

  return (
    <div>
      <div className="eyebrow">Сообщество</div>
      <h1 className="h1">{q ? `Поиск: «${searchParams.q}»` : "Слушатели"}</h1>

      <form method="GET" style={{ margin: "20px 0 28px" }}>
        <div className="search" style={{ maxWidth: 420, borderRadius: "var(--r)" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "var(--mut)", flexShrink: 0 }}>
            <circle cx="5.5" cy="5.5" r="4"/><path d="M9 9L12.5 12.5"/>
          </svg>
          <input name="q" defaultValue={searchParams?.q || ""} placeholder="Найти слушателя…" autoComplete="off" />
        </div>
      </form>

      {users.length === 0 ? (
        <div className="empty">
          <div className="h2">Никого не нашлось</div>
          <p>Попробуй другой запрос</p>
        </div>
      ) : (
        <div className="people-grid">
          {users.map((u) => (
            <div className="people-card" key={u.id}>
              <Link href={`/u/${u.id}`} className="people-card-inner">
                <Avatar userId={u.id} name={u.name} size={48} />
                <div className="people-info">
                  <div className="people-name">{u.name}</div>
                  {u.bio && <div className="people-bio">{u.bio}</div>}
                  <div className="people-stats">
                    <span>{u.reviewCount} рец.</span>
                    <span>·</span>
                    <span>{u.followers} подписч.</span>
                  </div>
                </div>
              </Link>
              <FollowButton
                userId={u.id}
                initialFollowing={myFollowing.includes(u.id)}
                initialFollowers={u.followers}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
