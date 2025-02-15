import { ZUserLogin } from "@/schema";
import { getUserByEmail, getUserById } from "@/services/user.service";
import { getSafeUserDetails } from "@/utils/user";
import type { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { Awaitable, NextAuthOptions, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import type { ExtendedUser } from "../../next-auth";

export const authOptions = {
	providers: [
		Credentials({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			//@ts-ignore
			async authorize(credentials): Promise<Awaitable<unknown>> {
				if (!credentials) {
					console.error("For some reason credentials are missing");
					throw new Error("internal server error");
				}
				const validatedFields = ZUserLogin.safeParse(credentials);
				if (!validatedFields.success) {
					throw new Error("Please provide valid email and password");
				}
				const { email, password } = validatedFields.data;

				const user = await getUserByEmail(email);

				if (!user || !user.password) {
					throw new Error("Invalid credentials");
				}
				const isPasswordValid = await bcrypt.compare(password, user.password);
				if (isPasswordValid) {
					return getSafeUserDetails(user);
				}
				throw new Error("Invalid Credentials");
			},
		}),
	],
	pages: {
		signIn: "/auth/login",
		signOut: "/auth/register",
		error: "/auth/error",
	},
	callbacks: {
		async jwt({
			// Always available but with a little difference in value
			token,
			// Available only in case of signIn, signUp or useSession().update call.
			// trigger,
			// Available when useSession().update is called. The value will be the POST data
			// session,
			// Available only in the first call once the user signs in. Not available in subsequent calls
			user,
			// Available only in the first call once the user signs in. Not available in subsequent calls
			// account,
		}) {
			// console.debug(
			// 	"callbacks:jwt",
			// 	JSON.stringify({ token, user, account, trigger, session })
			// );

			if (!user && token.sub) {
				const userDetials = await getUserById(token.sub);

				if (!userDetials) {
					return token;
				}
				return {
					...token,
					role: userDetials.role as UserRole,
					user: getSafeUserDetails(userDetials),
				} as JWT;
			}

			return token;
		},
		async session({ session, token }) {
			// console.debug(
			// 	"callbacks:session - Session callback called",
			// 	JSON.stringify({ session, token })
			// );

			if (token.role && session.user) {
				session = {
					...session,
					user: {
						...(token.user as ExtendedUser),
					},
					//@ts-ignore
					role: token.role as UserRole,
				};
			}
			return session || {};
		},
	},
	session: {
		strategy: "jwt",
	},
} satisfies NextAuthOptions;
