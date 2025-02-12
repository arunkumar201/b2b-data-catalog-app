import { auth } from "@/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
	const session = await auth();

	console.debug("🚀 ~ DashboardPage ~ session:", session);

	if (!session) {
		redirect("/auth/login");
	}
	const id = session.user.id;

	return redirect(`/dashboard/${id}`);
};

export default DashboardPage;
