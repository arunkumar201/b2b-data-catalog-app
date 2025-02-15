import { db } from "@/lib/db";
import { User } from "@prisma/client";
import "server-only";

export const getUserByEmail = async (email: string) => {
	try {
		const user = await db.user.findUnique({
			where: {
				email,
			},
		});

		return user;
	} catch (error) {
		console.log(`Error while getting user: ${error}`);
		return null;
	}
};

export const getUserById = async (id: string) => {
	try {
		const user = await db.user.findUnique({
			where: {
				id,
			},
		});
		return user;
	} catch (error) {
		console.log("Error while getting user id: ", error);
		return null;
	}
};
