import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as userRepository from "@/repositories/userRepository";
import { signInSchema } from "@/lib/validation/auth";
import { checkRateLimit } from "@/lib/rateLimiter";
import type { Role } from "@/types/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = signInSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const rateLimit = checkRateLimit(`signin:${email}`, {
          maxAttempts: 5,
          windowMs: 15 * 60 * 1000,
        });
        if (!rateLimit.allowed) {
          throw new Error("Too many sign-in attempts. Please try again later.");
        }

        const user = await userRepository.findByEmail(email);
        if (!user) return null;
        if (user.accountStatus !== "active") return null;

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) return null;

        await userRepository.updateLastLogin(user.id);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as Role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});
