import { db } from "@/lib/db";
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
				id: Number(id),
			},
		});
		return user;
	} catch (error) {
		console.log("Error while getting user id: ", error);
		return null;
	}
};
