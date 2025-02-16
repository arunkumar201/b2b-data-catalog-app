"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/useDebounce";
import { wait } from "@/utils";
import { SlidersHorizontal, X } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const sortOptions = [
	{ value: "date_desc", label: "Newest" },
	{ value: "date_asc", label: "Oldest" },
];

export const MAX_RECORDS = 50_000;
export const MIN_RECORDS = 0;

const ProductFilter = () => {
	const [page, setPage] = useQueryState(
		"page",
		parseAsInteger.withDefault(1).withOptions({
			shallow: false,
			throttleMs: 100,
		}),
	);
	const [search, setSearch] = useQueryState(
		"q",
		parseAsString.withDefault("").withOptions({
			shallow: false,
		}),
	);
	const [minRecords, setMinRecords] = useQueryState(
		"minRecords",
		parseAsString.withDefault("0").withOptions({
			shallow: false,
		}),
	);
	const [maxRecords, setMaxRecords] = useQueryState(
		"maxRecords",
		parseAsString.withDefault(MAX_RECORDS.toString()).withOptions({
			shallow: false,
		}),
	);
	const [sortBy, setSortBy] = useQueryState(
		"sort",
		parseAsString.withDefault("default").withOptions({
			shallow: false,
		}),
	);
	const [categories, setCategories] = useState<string[]>([]);
	const [selectedCategories, setSelectedCategories] = useQueryState(
		"categories",
		{
			parse: (value) => value.split(","),
			serialize: (value) => value.join(","),
			defaultValue: [],
			shallow: false,
		},
	);

	const [localSearch, setLocalSearch] = useState(search || "");
	const [localMinRecords, setLocalMinRecords] = useState(
		minRecords || MIN_RECORDS.toString(),
	);
	const [localMaxRecords, setLocalMaxRecords] = useState(
		maxRecords || MAX_RECORDS.toString(),
	);
	const [localSortBy, setLocalSortBy] = useState(sortBy || "default");
	const [localselectedCategories, setLocalselectedCategories] = useState(
		selectedCategories || [],
	);

	const [isOpen, setIsOpen] = useState(false);

	const debouncedSearch = useDebounce(localSearch, 300);
	const debouncedMinRecords = useDebounce(localMinRecords, 300);
	const debouncedMaxRecords = useDebounce(localMaxRecords, 300);
	const debouncedSortBy = useDebounce(localSortBy, 300);
	const debouncedLocalselectedCategories = useDebounce(
		localselectedCategories,
		300,
	);

	const activeFiltersCount = [
		search,
		...(selectedCategories || []),
		minRecords,
		maxRecords,
		sortBy,
	].filter(Boolean).length;

	const handleClearFilters = () => {
		if (
			activeFiltersCount === 0 ||
			(search === "" &&
				minRecords === MIN_RECORDS.toString() &&
				maxRecords === MAX_RECORDS.toString() &&
				sortBy === "default" &&
				selectedCategories.length === 0)
		) {
			toast.success("No active filters to clear");
			return;
		}
		setLocalSearch("");
		setLocalMinRecords(MIN_RECORDS.toString());
		setLocalMaxRecords(MAX_RECORDS.toString());
		setLocalSortBy("default");
		setLocalselectedCategories([]);
		setPage(1);
		toast.success("Filters are cleared");
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const min = Number.parseInt(localMinRecords);
		const max = Number.parseInt(localMaxRecords);

		if (!isNaN(min) && !isNaN(max) && max > min) {
			setLocalMaxRecords(localMaxRecords);
			setLocalMinRecords(localMinRecords);
		} else {
			toast.error("Invalid product count range");
			setMaxRecords(MAX_RECORDS.toString());
			setMinRecords(MIN_RECORDS.toString());
			wait(200).then(() => {
				setLocalMinRecords(MIN_RECORDS.toString());
			});
		}
		setPage(1);
	}, [maxRecords, minRecords]);

	useEffect(() => {
		setSearch(debouncedSearch);
		setPage(1);
		setPage(1);
	}, [debouncedSearch, setSearch, setPage]);

	useEffect(() => {
		if (!debouncedMinRecords) return;
		setMinRecords(debouncedMinRecords);
		setPage(1);
	}, [debouncedMinRecords, setMinRecords, setPage]);

	useEffect(() => {
		if (!debouncedMaxRecords) return;
		setMaxRecords(debouncedMaxRecords);
		setPage(1);
	}, [debouncedMaxRecords, setMaxRecords, setPage]);

	useEffect(() => {
		if (!debouncedSortBy) return;
		setSortBy(debouncedSortBy);
		setPage(1);
	}, [debouncedSortBy, setSortBy, setPage]);

	useEffect(() => {
		if (!debouncedLocalselectedCategories) return;
		setSelectedCategories(debouncedLocalselectedCategories);
		setPage(1);
	}, [debouncedLocalselectedCategories, setSelectedCategories, setPage]);

	const toggleCategory = (category: string) => {
		setLocalselectedCategories((prev) => {
			if (prev?.includes(category)) {
				return prev.filter((c) => c !== category);
				// biome-ignore lint/style/noUselessElse: <explanation>
			} else {
				return [...(prev || []), category];
			}
		});
	};

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch("/api/v1/products/categories");
				const result = await response.json();
				setCategories(result.data);
			} catch (error) {
				console.error("Failed to fetch categories:", error);
				setCategories([]);
			}
		};

		fetchCategories();
	}, []);

	return (
		<div className="font-mono w-full space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
			<div className="flex flex-col lg:flex-row gap-4 items-center w-full">
				<div className="flex-1 w-full">
					<Input
						type="text"
						placeholder="Search datasets..."
						value={localSearch || ""}
						onChange={(e) => setLocalSearch(e.target.value)}
						className="w-full h-10"
					/>
				</div>

				<div className="hidden lg:flex gap-2">
					<Select value={sortBy || "default"} onValueChange={setLocalSortBy}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="default">Default Order</SelectItem>
							{sortOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="lg:hidden">
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button variant="outline" className="w-full">
								<SlidersHorizontal className="mr-2 h-4 w-4" />
								Filters
								{activeFiltersCount > 0 && (
									<Badge variant="secondary" className="ml-2">
										{activeFiltersCount}
									</Badge>
								)}
							</Button>
						</SheetTrigger>
						<SheetContent className="w-full sm:max-w-md">
							<SheetHeader>
								<SheetTitle>Filter Datasets</SheetTitle>
								<SheetDescription>
									Apply filters to find specific datasets
								</SheetDescription>
							</SheetHeader>
							<div className="mt-6 space-y-6">
								<div className="space-y-2">
									<h3 className="text-sm font-medium">Categories</h3>
									<div className="space-y-2">
										{categories.map((cat) => (
											<div key={cat} className="flex items-center space-x-2">
												<Checkbox
													id={`category-${cat}`}
													checked={localselectedCategories?.includes(
														cat.toLowerCase(),
													)}
													onCheckedChange={() =>
														toggleCategory(cat.toLowerCase())
													}
												/>
												<Label htmlFor={`category-${cat}`}>{cat}</Label>
											</div>
										))}
									</div>
								</div>

								<div className="space-y-2">
									<h3 className="text-sm font-medium">Record Count Range</h3>
									<div className="space-y-4">
										<div>
											<Label className="text-sm text-gray-500">
												Min Records:{" "}
												{Number.parseInt(
													localMinRecords || "0",
												).toLocaleString()}
											</Label>
											<Input
												type="range"
												min="0"
												max={MIN_RECORDS}
												step="500"
												value={minRecords || "0"}
												onChange={(e) => setLocalMinRecords(e.target.value)}
												className="w-full"
											/>
										</div>
										<div>
											<Label className="text-sm text-gray-500">
												Max Records:{" "}
												{Number.parseInt(
													localMaxRecords || "500000",
												).toLocaleString()}
											</Label>
											<Input
												type="range"
												min="1"
												max={MIN_RECORDS}
												step="500"
												value={maxRecords || "500000"}
												onChange={(e) => setLocalMaxRecords(e.target.value)}
												className="w-full"
											/>
										</div>
									</div>
								</div>

								<div className="space-y-2">
									<h3 className="text-sm font-medium">Sort By</h3>
									<Select
										value={sortBy || "default"}
										onValueChange={setLocalSortBy}
									>
										<SelectTrigger>
											<SelectValue placeholder="Sort by" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="default">Default Order</SelectItem>
											{sortOptions.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{activeFiltersCount > 0 && (
									<Button
										variant="outline"
										onClick={() => {
											handleClearFilters();
											setIsOpen(false);
										}}
										className="w-full"
									>
										Clear All Filters
										<X className="ml-2 h-4 w-4" />
									</Button>
								)}
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>

			<div className="hidden lg:block space-y-4">
				<div className="flex flex-wrap gap-4">
					{categories.map((cat) => (
						<div key={cat} className="flex items-center space-x-2">
							<Checkbox
								id={`category-${cat}`}
								checked={localselectedCategories?.includes(cat.toLowerCase())}
								onCheckedChange={() => toggleCategory(cat.toLowerCase())}
							/>
							<Label htmlFor={`category-${cat}`}>{cat}</Label>
						</div>
					))}
				</div>
				<div className="flex space-x-4 items-center">
					<div className="flex-1">
						<Label className="text-sm text-gray-500">
							Min Records:{" "}
							{Number.parseInt(localMinRecords || "0").toLocaleString()}
						</Label>
						<Input
							type="range"
							min={MIN_RECORDS}
							max={MAX_RECORDS}
							step="500"
							value={localMinRecords || "0"}
							onChange={(e) => setLocalMinRecords(e.target.value)}
							className="w-full"
						/>
					</div>
					<div className="flex-1">
						<Label className="text-sm text-gray-500">
							Max Records:{" "}
							{Number.parseInt(localMaxRecords || "50000").toLocaleString()}
						</Label>
						<Input
							type="range"
							min="0"
							max={MAX_RECORDS}
							step="500"
							value={localMaxRecords || "50000"}
							onChange={(e) => setLocalMaxRecords(e.target.value)}
							className="w-full"
						/>
					</div>
				</div>
			</div>
			<div className="flex justify-between items-center">
				<div className="flex justify-between items-center">
					{activeFiltersCount > 0 && (
						<div className="flex flex-wrap gap-2 pt-2">
							{localSearch && (
								<Badge variant="secondary" className="gap-1 w-fit">
									<span>Search: {search}</span>
									<button
										onClick={() => setLocalSearch("")}
										className="ml-2 hover:text-cyan-900"
									>
										<X className="h-3 w-3" />
									</button>
								</Badge>
							)}
							{localselectedCategories &&
								localselectedCategories.map((cat) => (
									<Badge key={cat} variant="secondary" className="gap-1 w-fit">
										<p className="w-fit">
											<span>Category:</span>
											{cat}
										</p>
										<button
											onClick={() => toggleCategory(cat)}
											className="ml-2 hover:text-cyan-900"
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								))}
							{localMinRecords &&
								localMinRecords !== MIN_RECORDS.toString() && (
									<Badge variant="secondary" className="gap-1 w-fit">
										<p className="w-fit">
											<span className="mr-2">Min Records</span>
											{Number.parseInt(localMinRecords).toLocaleString()}
										</p>
										<button
											onClick={() => setLocalMinRecords(MIN_RECORDS.toString())}
											className="ml-2 hover:text-cyan-900"
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								)}

							{page > 1 && (
								<Badge variant="secondary" className="gap-1 w-fit">
									<span className="w-fit">
										<span className="mr-2">Current Page</span>
										{page}
									</span>
									<button
										onClick={() => setPage(1)}
										className="ml-2 hover:text-cyan-900"
									>
										<X className="h-3 w-3" />
									</button>
								</Badge>
							)}
							{localMinRecords &&
								localMaxRecords !== MAX_RECORDS.toString() && (
									<Badge variant="secondary" className="gap-1 w-fit">
										<p>
											<span className="mr-2">Max Records</span>
											{Number.parseInt(localMaxRecords).toLocaleString()}
										</p>
										<button
											onClick={() => setLocalMaxRecords(MAX_RECORDS.toString())}
											className="ml-2 hover:text-cyan-900"
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								)}
							{localSortBy && localSortBy !== "default" && (
								<Badge variant="secondary" className="gap-1 w-fit">
									<p className="w-fit">
										<span className="mr-2">Sort</span>
										{sortOptions.find((opt) => opt.value === localSortBy)
											?.label || localSortBy.replace("_", " ").toUpperCase()}
									</p>
									<button
										onClick={() => setLocalSortBy("default")}
										className="ml-2 hover:text-cyan-900"
									>
										<X className="h-3 w-3" />
									</button>
								</Badge>
							)}
						</div>
					)}
				</div>
				<div className="flex justify-end w-full items-center">
					{activeFiltersCount > 0 && (
						<Button
							variant="outline"
							onClick={handleClearFilters}
							className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						>
							Clear Filters
							<X className="ml-2 h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductFilter;
