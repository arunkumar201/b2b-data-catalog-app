import ProductFilter from "@/components/ProductFilter";
import ProductList from "@/components/ProductList";
import { ProductPagination } from "@/components/ProductPagination";
import { ProductListSkeleton } from "@/components/ProductSkeleton";
import { authOptions } from "@/lib/authOption";
import { getFilteredProducts } from "@/services";
import { wait } from "@/utils";
import { getParsedSearchParams } from "@/utils/getParsedSearchParams";
import type { Product } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

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
	const products = await getFilteredProducts(parsedSearchParams);

	return (
		<>
			<div className="flex flex-col items-center justify-center gap-2 p-2 md:p-16 w-full">
				<ProductFilter />
				<Suspense
					fallback={<ProductListSkeleton />}
					key={JSON.stringify(parsedSearchParams.parsedParams)}
				>
					{products?.data.length > 0 ? (
						<ProductList products={products?.data as Product[]} />
					) : (
						<div className="flex flex-col items-center justify-center gap-2 p-2 md:p-16">
							<p className="text-center text-gray-500 text-lg">
								No products were found matching your search criteria.
							</p>
						</div>
					)}
				</Suspense>
				<div className="flex justify-center">
					<ProductPagination totalPage={products?.metadata.pageCount || 1} />
				</div>
			</div>
		</>
	);
}
