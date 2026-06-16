import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16 }}>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(72px, 12vw, 120px)", lineHeight: 1, letterSpacing: "-0.05em", color: "rgba(248,248,248,0.06)" }}>
        404
      </div>
      <h1 className="h2" style={{ marginTop: -8 }}>Страница не найдена</h1>
      <p className="muted small">Такого адреса не существует — возможно, он изменился или был удалён.</p>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Link href="/" className="btn" style={{ padding: "10px 24px" }}>На главную</Link>
        <Link href="/catalog" className="btn btn-ghost" style={{ padding: "10px 24px" }}>Каталог</Link>
      </div>
    </div>
  );
}
