import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { axiosPublic } from "@/lib/axios";

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
          console.log("Auth: Attempting login with credentials", {
            email: credentials.email,
          });
          const response = await axiosPublic.post(
            AUTH_ROUTES.LOGIN,
            credentials
          );
          const data = response.data;

          console.log("Auth: Login response:", JSON.stringify(data, null, 2));

          if (!response.status || response.status !== 200) {
            throw new Error(data.message || "Authentication failed");
          }

          // Check if user data exists in the expected structure
          if (!data || !data.data) {
            console.error("Auth: Unexpected response structure:", data);
            throw new Error("Unexpected response structure from server");
          }

          // The actual user data might be in data.data rather than data.user
          const userData = data.data;

          console.log("Auth: User data extracted:", {
            id: userData._id || userData.id,
            name: userData.name,
            role: userData.role,
          });

          // Make sure to capture the accessToken from the response
          const accessToken =
            data.accessToken || data.token || userData.accessToken;
          console.log(
            "Auth: Access token captured:",
            accessToken ? "Found" : "Not found"
          );

          return {
            id: userData._id || userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            accessToken,
          };
        } catch (error) {
          console.error("Auth: Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("Auth: Setting JWT token with user data:", {
          id: user.id,
          role: user.role,
          hasAccessToken: !!user.accessToken,
        });
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        console.log("Auth: Updating session with token data:", {
          id: token.id,
          role: token.role,
          hasAccessToken: !!token.accessToken,
        });
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
        session.user.role = token.role as "customer" | "provider";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});