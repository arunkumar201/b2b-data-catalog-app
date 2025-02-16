import "server-only";

import { env } from "@/env";
import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getProductCategories = async () => {
	return await unstable_cache(
		async () => {
			try {
				const categories = await db.product.findMany({
					distinct: ["dataCategory"],
					select: {
						dataCategory: true,
					},
				});
				const uniqueCategories = new Set(
					categories.map((category) => category.dataCategory),
				);
				return Array.from(uniqueCategories);
			} catch (e) {
				console.error(`Error fetching product categories: ${e}`);
				return null;
			}
		},
		[`${env.NEXT_PUBLIC_WEB_URL}/api/v1/product/categories`],
		{
			revalidate: 60 * 60 * 24 * 7,
			tags: ["categories"],
		},
	)();
};
