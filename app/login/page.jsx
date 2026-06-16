"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setBusy(false);
    if (res?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Неверный email или пароль");
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="h1">Войти</h1>
        <form onSubmit={submit} className="auth-form">
          <input
            type="email" name="email" autoComplete="email" spellCheck={false}
            placeholder="Email" aria-label="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />
          <input
            type="password" name="password" autoComplete="current-password"
            placeholder="Пароль" aria-label="Пароль"
            value={password} onChange={(e) => setPassword(e.target.value)} required
          />
          {error && <div className="auth-error">{error}</div>}
          <button className="btn" disabled={busy}>{busy ? "Входим…" : "Войти"}</button>
        </form>
        <div className="auth-link">
          Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
        </div>
        <div className="auth-demo">
          <div className="auth-demo-title">Демо-аккаунты</div>
          <div className="auth-demo-hint">Email: aidar@demo.reach2 · Пароль: demo123</div>
        </div>
      </div>
    </div>
  );
}
