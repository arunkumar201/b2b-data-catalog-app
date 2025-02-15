import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("/auth/login");
	}
	return <>{children}</>;
};

export default DashboardLayout;
