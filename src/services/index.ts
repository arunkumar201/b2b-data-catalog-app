import "server-only";

import { env } from "@/env";
import { db } from "@/lib/db";
import type { IFilterParesedParams } from "@/utils/getParsedSearchParams";
import { unstable_cache } from "next/cache";

const PAGE_SIZE = 10;

export const getFilteredProducts = async (
	filterCriteria: IFilterParesedParams,
) => {
	console.debug("🚀 ~ filterCriteria:", filterCriteria.parsedParams);

	const result = await unstable_cache(
		async () => {
			try {
				const {
					q = "",
					categories = [],
					minRecords = "0",
					maxRecords = "50000",
					sort = "default",
					page = 1,
				} = filterCriteria.parsedParams;

				const skip = (page - 1) * PAGE_SIZE;

				const minRecordsNum = Number.parseInt(minRecords, 10);
				const maxRecordsNum = Number.parseInt(maxRecords, 10);

				const whereClause = {
					AND: [
						...(categories.length > 0
							? [
									{
										OR: categories.map((category) => ({
											OR: [
												{
													fields: {
														hasSome: [category],
													},
												},
												{
													dataCategory: {
														contains: category,
														mode: "insensitive",
													},
												},
											],
										})),
									},
								]
							: []),

						...(q
							? [
									{
										dataCategory: {
											contains: q.toLowerCase(),
											mode: "insensitive",
										},
									},
								]
							: []),

						// Record count range
						{
							recordCount: {
								gte: minRecordsNum,
								lte: maxRecordsNum,
							},
						},
					],
				};

				const orderBy = (() => {
					switch (sort) {
						case "date_desc":
							return { createdAt: "desc" as const };
						case "date_asc":
							return { createdAt: "asc" as const };
						default:
							return { createdAt: "desc" as const };
					}
				})();

				const [totalCount, products] = await Promise.all([
					db.product.count({
						//@ts-expect-error
						where: whereClause,
					}),
					db.product.findMany({
						//@ts-expect-error
						where: whereClause,
						orderBy,
						skip,
						take: PAGE_SIZE,
						select: {
							id: true,
							dataCategory: true,
							fields: true,
							recordCount: true,
							imageUrl: true,
							createdAt: true,
							updatedAt: true,
						},
					}),
				]);

				return {
					data: products,
					metadata: {
						total: totalCount,
						page,
						pageSize: PAGE_SIZE,
						pageCount: Math.ceil(totalCount / PAGE_SIZE),
						hasMore: skip + products.length < totalCount,
					},
				};
			} catch (error) {
				console.error("Error fetching filtered products:", error);
				throw new Error("Failed to fetch filtered products");
			}
		},
		[
			`${env.NEXT_PUBLIC_WEB_URL}/api/v1/product/filtered`,
			JSON.stringify(filterCriteria),
		],
		{
			revalidate: 60 * 60 * 24 * 7, // 7 days
			tags: ["filterproducts"],
		},
	)();

	return result;
};
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

export const getProductsCount = async () => {
	return await unstable_cache(
		async () => {
			try {
				const count = await db.product.count();
				return count;
			} catch (e) {
				console.error(`Error fetching product count: ${e}`);
				return null;
			}
		},
		[`${env.NEXT_PUBLIC_WEB_URL}/api/v1/product/count`],
		{
			revalidate: 60 * 60 * 24 * 7,
			tags: ["products"],
		},
	)();
};
