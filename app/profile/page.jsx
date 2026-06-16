"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileRedirect() {
  const router = useRouter();
  useEffect(() => {
    const me = localStorage.getItem("reach2_user");
    router.replace(me ? `/u/${me}` : "/");
  }, [router]);
  return <div className="muted" style={{ padding: 40 }}>Открываем профиль…</div>;
}
