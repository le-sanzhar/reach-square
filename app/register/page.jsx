"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBusy(false);
      setError(data.error || "Не получилось зарегистрироваться");
      return;
    }
    await signIn("credentials", { email, password, redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="h1">Регистрация</h1>
        <form onSubmit={submit} className="auth-form">
          <input
            type="text" placeholder="Имя"
            value={name} onChange={(e) => setName(e.target.value)} required
          />
          <input
            type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />
          <input
            type="password" placeholder="Пароль (минимум 6 символов)"
            value={password} onChange={(e) => setPassword(e.target.value)}
            required minLength={6}
          />
          {error && <div className="auth-error">{error}</div>}
          <button className="btn" disabled={busy}>{busy ? "Создаём…" : "Создать аккаунт"}</button>
        </form>
        <div className="auth-link">
          Уже есть аккаунт? <Link href="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
}
