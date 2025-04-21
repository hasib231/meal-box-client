import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { axiosPublic } from "@/lib/axios";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import { AUTH_ROUTES } from "@/routes/api-routes";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await axiosPublic.post(
            AUTH_ROUTES.LOGIN,
            credentials
          );
          const data = response.data;

          console.log("Login response:", JSON.stringify(data, null, 2));

          if (!response.status || response.status !== 200) {
            throw new Error(data.message || "Authentication failed");
          }

          // Check if user data exists in the expected structure
          if (!data || !data.data) {
            console.error("Unexpected response structure:", data);
            throw new Error("Unexpected response structure from server");
          }

          // The actual user data might be in data.data rather than data.user
          const userData = data.data;

          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            accessToken: data.accessToken || userData.accessToken,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT & {
        id?: string;
        accessToken?: string;
        role?: "customer" | "provider";
      };
    }) {
      if (token) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});
