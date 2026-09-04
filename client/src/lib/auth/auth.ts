import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
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
    // Requires AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET in .env.local (see
    // .env.example) — until those are set, the "Continue with Google"
    // button renders but signing in will fail with a config error.
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
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
        // Accounts created via Google sign-up have no password set.
        if (!user.passwordHash) return null;

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
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      if (!user.email) return false;

      const existing = await userRepository.findByEmail(user.email);
      if (existing) return existing.accountStatus === "active";

      // First time this Google account has signed in — create a real
      // account for it. Google has already verified the email address.
      await userRepository.createFromGoogle({
        name: user.name ?? user.email,
        email: user.email,
        image: user.image ?? undefined,
      });
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google" && user.email) {
          // Google's `user.id` is its own OAuth subject, not ours — signIn
          // already confirmed/created a matching account, so look it up.
          const appUser = await userRepository.findByEmail(user.email);
          if (appUser) {
            token.id = appUser.id;
            token.role = appUser.role;
            token.image = appUser.image ?? null;
          }
        } else {
          token.id = user.id as string;
          token.role = user.role as Role;
          token.image = user.image ?? null;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.image = token.image as string | null | undefined;
      }
      return session;
    },
  },
});
