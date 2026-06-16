"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.id) {
      router.replace(`/u/${session.user.id}`);
    } else {
      router.replace("/login");
    }
  }, [session, status, router]);

  return <div className="muted" style={{ padding: 40 }}>Открываем профиль…</div>;
}
