import type { UserRole } from "@prisma/client";
import { User } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export interface ExtendedUser extends DefaultSession {
	role: UserRole;
	id: string;
	email: string;
	role: $Enums.UserRole;
	firstName: string;
	lastName: string;
}
declare module "next-auth" {
	interface Session {
		user: ExtendedUser;
	}
}
