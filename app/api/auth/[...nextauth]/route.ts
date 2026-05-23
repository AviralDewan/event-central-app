import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (profile?.email && profile.email.endsWith("@ds.study.iitm.ac.in")) {
        return true;
      }
      return false; // Only allow IITM organizational emails
    },
    async jwt({ token, account }) {
      console.log("[NextAuth JWT callback] Triggered. Has account?", !!account);
      // Initial sign in
      if (account && account.id_token) {
        console.log("[NextAuth JWT callback] Found account and id_token. Calling backend...");
        try {
          // Send Google ID token to backend to exchange for backend JWT
          const res = await fetch(`${API_BASE_URL}/api/auth/google/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: account.id_token }),
          });

          console.log("[NextAuth JWT callback] Backend responded with status:", res.status);
          if (res.ok) {
            const data = await res.json();
            console.log("[NextAuth JWT callback] Backend auth successful. Setting tokens.");
            // Attach backend tokens and user data to NextAuth JWT
            token.accessToken = data.access;
            token.refreshToken = data.refresh;
            token.backendUser = data.user;
          } else {
            console.error("[NextAuth JWT callback] Backend auth failed:", await res.text());
          }
        } catch (error) {
          console.error("[NextAuth JWT callback] Error connecting to backend auth:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Pass backend token and user data to the client session
      (session as any).accessToken = token.accessToken;
      (session as any).backendUser = token.backendUser;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
