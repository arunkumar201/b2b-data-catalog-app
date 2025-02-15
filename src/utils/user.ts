import "server-only";

import type { User } from "@prisma/client";
import type { ExtendedUser } from "../../next-auth";

export const getSafeUserDetails = (user: User): Partial<ExtendedUser> => {
	const { password, createdAt, updatedAt, ...safeUser } = user;
	return safeUser;
};
