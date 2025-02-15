import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthPage() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("/auth/login");
	}
	return redirect("/dashboard");
}
