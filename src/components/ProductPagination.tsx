"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useTransition } from "react";
import { Button } from "./ui/button";

export const ProductPagination = ({ totalPage }: { totalPage: number }) => {
	const [isLoading, startTransition] = useTransition();
	const [page, setPage] = useQueryState(
		"page",
		parseAsInteger.withDefault(1).withOptions({
			startTransition,
			shallow: false,
		}),
	);

	const handlePrevPage = () => {
		if (page > 1) {
			setPage(page - 1);
		}
	};

	const handleNextPage = () => {
		if (page < totalPage) {
			setPage(page + 1);
		}
	};

	const getPageNumbers = () => {
		const pages = [];
		const showPages = 5;
		let start = Math.max(1, page - Math.floor(showPages / 2));
		// biome-ignore lint/style/useConst: <explanation>
		let end = Math.min(totalPage, start + showPages - 1);

		if (end - start + 1 < showPages) {
			start = Math.max(1, end - showPages + 1);
		}

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}
		return pages;
	};

	return (
		<div className="flex flex-col items-center gap-4 mt-6">
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					onClick={handlePrevPage}
					disabled={page === 1 || isLoading}
					className="h-8 w-8 rounded-full transition-all duration-200 hover:scale-105"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				<div className="flex gap-1">
					{page > 3 && (
						<>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setPage(1)}
								className="h-8 w-8 rounded-full"
							>
								1
							</Button>
							<span className="flex items-center px-2">...</span>
						</>
					)}

					{getPageNumbers().map((pageNum) => (
						<Button
							key={pageNum}
							variant={pageNum === page ? "default" : "ghost"}
							size="sm"
							onClick={() => setPage(pageNum)}
							disabled={isLoading}
							className={cn(
								"h-8 w-8 rounded-full transition-all duration-200",
								pageNum === page && "hover:scale-105",
								isLoading && "opacity-50",
							)}
						>
							{pageNum}
						</Button>
					))}

					{page < totalPage - 2 && (
						<>
							<span className="flex items-center px-2">...</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setPage(totalPage)}
								className="h-8 w-8 rounded-full"
							>
								{totalPage}
							</Button>
						</>
					)}
				</div>

				<Button
					variant="outline"
					size="icon"
					onClick={handleNextPage}
					disabled={page === totalPage || isLoading}
					className="h-8 w-8 rounded-full transition-all duration-200 hover:scale-105"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			<div className="text-sm text-muted-foreground">
				Page {page} of {totalPage}
			</div>
		</div>
	);
};
