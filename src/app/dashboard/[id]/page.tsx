import ProductFilter from "@/components/ProductFilter";
import { ProductList } from "@/components/ProductList";
import { authOptions } from "@/lib/authOption";
import { getParsedSearchParams } from "@/utils/getParsedSearchParams";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface IUserDashboard {
	params: Promise<{ id: string }>;
	searchParams: Promise<Record<string, string>>;
}
export default async function UserDashboard({
	params,
	searchParams,
}: IUserDashboard) {
	const session = await getServerSession(authOptions);
	const { id } = await params;
	if (!session) {
		return redirect("/auth/login");
	}

	if (session.user.id !== id) {
		redirect(`/dashboard/${session.user.id}`);
	}
	const searchParamsData = await searchParams;

	const parsedSearchParams = getParsedSearchParams(searchParamsData);

	if (!parsedSearchParams.isValid) {
		return redirect(`/dashboard/${session.user.id}`);
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center gap-2 p-2 md:p-16 w-full">
				<ProductFilter />
				<ProductList parsedSearchParams={parsedSearchParams} />
			</div>
		</>
	);
}
