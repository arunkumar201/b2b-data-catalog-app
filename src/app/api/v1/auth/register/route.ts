import { db } from "@/lib/db";
import { ERROR_MESSAGE } from "@/messages";
import { ZRegisterUser } from "@/schema";
import { getUserByEmail } from "@/services/user.service";
import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";

const registerUserHandler = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	if (req.method !== "POST") {
		return res.status(405).json({ error: ERROR_MESSAGE.METHOD_NOT_ALLOWED });
	}

	const parsed = ZRegisterUser.safeParse(req.body);

	if (!parsed.success) {
		return res
			.status(400)
			.json({ error: "Invalid Input Data", details: parsed.error.errors[0] });
	}

	const { email, password, name } = parsed.data;

	try {
		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return res.status(409).json({ error: "Email already taken" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const userData = {
			email,
			password: hashedPassword,
			name,
		};

		await db.user.create({ data: userData });

		return res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		console.error(`Error while creating user: ${error}`);
		return res.status(500).json({ error: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
	}
};

export default registerUserHandler;
