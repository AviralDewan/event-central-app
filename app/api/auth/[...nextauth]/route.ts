import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
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
      // Only allow IITM organizational emails
      return false;
    },
  },
});

export { handler as GET, handler as POST };
