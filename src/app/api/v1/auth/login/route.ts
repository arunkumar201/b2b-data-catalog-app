import { ERROR_MESSAGE } from "@/messages";
import { ZUserLogin } from "@/schema";
import { signIn } from "next-auth/react";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const formData = await req.json();
	const parsedLoginData = ZUserLogin.safeParse(formData);

	if (!parsedLoginData.success) {
		return NextResponse.json(
			{
				status: false,
				message: "invalid input form data",
			},
			{ status: 400 },
		);
	}

	const { email, password } = parsedLoginData.data;

	try {
		await signIn("credentials", {
			email,
			password,
			redirect: false,
		});
		return NextResponse.json(
			{ status: true, message: "User logged in successfully" },
			{ status: 200 },
		);
	} catch (error) {
		if (error instanceof Error) {
			console.log("Error while creating user: ", error.stack);
		}
		return NextResponse.json(
			{
				status: false,
				//@ts-ignore
				message: error.message || ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
			},
			{ status: 500 },
		);
	}
}
