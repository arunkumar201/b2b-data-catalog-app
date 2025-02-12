import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZUserLogin } from "./schema";
import { getUserByEmail } from "./services/user.service";
import { getSafeUserDetails } from "./utils/user";

export default {
	providers: [
		Credentials({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credential) {
				const validatedFelids = ZUserLogin.safeParse(credential);
				if (!validatedFelids.success) {
					throw new Error("Invalid input credentials");
				}
				const { email, password } = validatedFelids.data;
				const user = await getUserByEmail(email);

				if (!user || !user.password) {
					return null;
				}
				const isPasswordValid = await bcrypt.compare(password, user.password);

				if (isPasswordValid) {
					return getSafeUserDetails(user);
				}

				return null;
			},
		}),
	],
} satisfies NextAuthConfig;
