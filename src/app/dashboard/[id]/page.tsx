import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface IUserDashboard {
	params: Promise<{ id: string }>;
}
export default async function UserDashboard({ params }: IUserDashboard) {
	const { id } = await params;
	const session = await auth();
	if (!session) {
		return redirect("/auth/login");
	}
	if (session.user.id !== id) {
		return redirect("/dashboard");
	}
	return <div>wlecome User Dashboard</div>;
}
