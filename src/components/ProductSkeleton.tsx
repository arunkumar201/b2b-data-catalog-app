import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye } from "lucide-react";
import React from "react";

const ITEM_PER_PAGE = 8;

export const ProductSkeleton = () => {
	return (
		<Card className="md:max-w-[360px] w-full mx-auto overflow-hidden shadow-lg h-[430px] flex-1">
			<CardHeader className="p-0">
				<Skeleton className="h-[200px] w-full" />
			</CardHeader>
			<CardContent className="p-4">
				<Skeleton className="h-4 w-3/4 mb-2" />
				<Skeleton className="h-3 w-full mb-2" />
				<Skeleton className="h-3 w-2/3 mb-4" />
				<div className="flex justify-between items-center">
					<Skeleton className="h-3 w-1/4" />
					<Skeleton className="h-3 w-1/4" />
				</div>
			</CardContent>
			<CardFooter className="flex justify-between items-center p-4 border-t">
				<Skeleton className="h-6 w-1/2" />
				<div className="flex items-center space-x-1">
					<Skeleton className="h-4 w-8" />
					<Eye size={16} className="text-gray-400" />
				</div>
			</CardFooter>
		</Card>
	);
};

export const ProductListSkeleton = () => {
	return (
		<div className="h-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
			{Array(ITEM_PER_PAGE)
				.fill(null)
				.map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<ProductSkeleton key={index} />
				))}
		</div>
	);
};
