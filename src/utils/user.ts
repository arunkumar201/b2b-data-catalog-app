import "server-only";

import type { User } from "@prisma/client";

export const getSafeUserDetails = (user: User): object => {
	const { password, createdAt, updatedAt, ...safeUser } = user;
	return safeUser;
};
