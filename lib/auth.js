import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDB } from "./db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const db = getDB();
        const user = db.users.find((u) => u.email === credentials.email);
        if (!user?.password_hash) return null;
        const ok = await bcrypt.compare(credentials.password, user.password_hash);
        if (!ok) return null;
        return { id: user.id, name: user.name, email: user.email, avatar: user.avatar || "👤" };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user, trigger, session: sessionData }) {
      if (user) {
        token.id = user.id;
        token.avatar = user.avatar;
        token.name = user.name;
      }
      if (trigger === "update" && sessionData?.name) {
        token.name = sessionData.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.avatar = token.avatar;
        session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
