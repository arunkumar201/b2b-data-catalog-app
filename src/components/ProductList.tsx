import { getFilteredProducts } from "@/services";
import type { IFilterParesedParams } from "@/utils/getParsedSearchParams";
import { Suspense } from "react";
import PremiumProductCard from "./ProductDetail";
import { ProductPagination } from "./ProductPagination";
import { ProductListSkeleton } from "./ProductSkeleton";

export const ProductList = async ({
	parsedSearchParams,
}: {
	parsedSearchParams: IFilterParesedParams;
}) => {
	const products = await getFilteredProducts(parsedSearchParams);
	return (
		<>
			{products.data.length > 0 ? (
				<Suspense
					fallback={<ProductListSkeleton />}
					key={JSON.stringify(parsedSearchParams.parsedParams)}
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 h-full">
						{products.data.map((product) => (
							<div key={product.id} className="min-h-[200px] overflow-scroll">
								<PremiumProductCard product={product} />
							</div>
						))}
					</div>
				</Suspense>
			) : (
				<div>No products found</div>
			)}
			<div className="flex justify-center">
				<ProductPagination totalPage={products?.metadata.pageCount || 1} />
			</div>
		</>
	);
};
