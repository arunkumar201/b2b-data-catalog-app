import { db } from "@/lib/db";
import { ERROR_MESSAGE } from "@/messages";
import { ZRegisterUser } from "@/schema/auth";
import { getUserByEmail } from "@/services/user.service";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const formData = await req.json();
	const parsed = ZRegisterUser.safeParse(formData);

	if (!parsed.success) {
		return NextResponse.json(
			{
				status: false,
				message: "invalid input form data",
			},
			{ status: 400 },
		);
	}

	const { email, password, firstName, lastName } = parsed.data;

	try {
		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return NextResponse.json(
				{ status: false, message: "Email already taken" },
				{ status: 400 },
			);
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		await db.user.create({
			data: {
				email,
				password: hashedPassword,
				firstName,
				lastName,
				role: email === "ak201@gmail.com" ? "ADMIN" : "USER",
			},
		});

		return NextResponse.json(
			{ status: true, message: "User created successfully" },
			{ status: 201 },
		);
	} catch (error) {
		console.error(`Error while creating user: ${error}`);
		return NextResponse.json(
			{ status: false, message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR },
			{ status: 500 },
		);
	}
}
