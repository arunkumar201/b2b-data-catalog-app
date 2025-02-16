import { authOptions } from "@/lib/authOption";
import { getProductCategories } from "@/services";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{
					message: "You must be logged in to view this page",
					timestamp: new Date().toISOString(),
				},
				{ status: 401 },
			);
		}
		const categories = await getProductCategories();

		return NextResponse.json(
			{
				data: categories,
				message: "Categories retrieved successfully",
				timestamp: new Date().toISOString(),
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(`Error retrieving categories: ${error}`);
		return NextResponse.json(
			{ message: "Internal server error", timestamp: new Date().toISOString() },
			{ status: 500 },
		);
	}
}
