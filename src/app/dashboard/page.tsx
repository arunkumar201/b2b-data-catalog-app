import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/login");
	}
	const id = session.user.id;

	return redirect(`/dashboard/${id}`);
};

export default DashboardPage;
