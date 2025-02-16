import ProductFilter from "@/components/ProductFilter";
import ProductList from "@/components/ProductList";
import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface IUserDashboard {
	params: Promise<{ id: string }>;
}
export default async function UserDashboard({ params }: IUserDashboard) {
	const { id } = await params;
	const session = await getServerSession(authOptions);
	if (!session) {
		return redirect("/auth/login");
	}

	if (session.user.id !== id) {
		redirect(`/dashboard/${session.user.id}`);
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center gap-2 p-2 md:p-16">
				<ProductFilter />
				<ProductList />
			</div>
		</>
	);
}
