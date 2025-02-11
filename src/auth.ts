import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getUserById } from "./services/user.service";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: "/auth/login",
		signOut: "/auth/register",
		error: "/auth/error",
	},
	events: {},
	callbacks: {
		async jwt({ token }) {
			if (!token.sub) {
				return token;
			}
			const existingUser = await getUserById(token.sub);
			token.role = existingUser?.role || UserRole.USER;
			return token;
		},
		async session({ session, token }) {
			if (token.role && session.user) {
				session.user.role = token.role as UserRole;
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	...authConfig,
});
