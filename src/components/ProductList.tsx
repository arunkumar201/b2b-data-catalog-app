import { db } from "@/lib/db";
import React from "react";
import PremiumProductCard from "./ProductDetail";

export const ProductList = async () => {
	const products = await db.product.findMany({
		take: 10,
	});
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 h-full">
			{products.map((product) => (
				<div key={product.id} className="min-h-[200px] overflow-scroll">
					<PremiumProductCard product={product} />
				</div>
			))}
		</div>
	);
};

export default ProductList;
