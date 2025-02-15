"use client";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import React, { type FC } from "react";

interface ProductType {
	id: number;
	dataCategory: string;
	recordCount: number;
	fields: string[];
	imageUrl: string | null;
	createdAt: Date;
	updatedAt: Date;
}

const PremiumProductCard: FC<{ product: ProductType }> = ({ product }) => {
	return (
		<Card className="group relative overflow-hidden font-mono  border border-gray-200 dark:border-gray-700">
			<div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

			<CardHeader className="relative pb-0">
				<div className="flex items-center justify-between mb-4">
					<Badge className="bg-indigo-500/10 text-indigo-600  hover:bg-indigo-500/20 transition-colors duration-200">
						{product.dataCategory}
					</Badge>
					<div className="flex items-center gap-2">
						<Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
						<span className="text-sm text-gray-600 dark:text-gray-400">
							Updated {new Date(product.updatedAt).toLocaleDateString()}
						</span>
					</div>
				</div>

				<div className="aspect-video relative rounded-lg overflow-hidden">
					<img
						src={product.imageUrl ?? "https://via.placeholder.com/200x150"}
						alt={product.dataCategory}
						className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				<div>
					<div className="flex items-center justify-between mt-4">
						<CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
							{product.recordCount.toLocaleString()} Records
						</CardTitle>
					</div>

					<CardDescription className="mt-2 text-gray-800 dark:text-gray-400 text-base">
						{product.dataCategory}
					</CardDescription>
				</div>

				<div className="space-y-3">
					<div>
						<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Available Fields
						</h4>
						<div className="flex flex-wrap gap-2">
							{product.fields.map((field) => (
								<Badge
									key={field.toString()}
									variant="secondary"
									className="bg-green-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
								>
									{field}
								</Badge>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default PremiumProductCard;
