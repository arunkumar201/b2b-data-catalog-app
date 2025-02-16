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
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const sortOptions = [
	{ value: "date_desc", label: "Newest" },
	{ value: "date_asc", label: "Oldest" },
];

const MAX_RECORDS = 500000;
const MIN_RECORDS = 0;

const ProductFilter = () => {
	const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
	const [minRecords, setMinRecords] = useQueryState(
		"minRecords",
		parseAsString.withDefault("0"),
	);
	const [maxRecords, setMaxRecords] = useQueryState(
		"maxRecords",
		parseAsString.withDefault(MAX_RECORDS.toString()),
	);
	const [sortBy, setSortBy] = useQueryState(
		"sort",
		parseAsString.withDefault("default"),
	);
	const [categories, setCategories] = useState<string[]>([]);
	const [selectedCategories, setSelectedCategories] = useQueryState(
		"categories",
		{
			parse: (value) => value.split(","),
			serialize: (value) => value.join(","),
			defaultValue: [],
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
		setLocalSearch("");
		setLocalselectedCategories([]);
		setLocalMinRecords(MIN_RECORDS.toString());
		setLocalMaxRecords(MAX_RECORDS.toString());
		setLocalSortBy("default");
	};

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
	}, [maxRecords, minRecords]);

	useEffect(() => {
		if (!debouncedSearch) return;
		setSearch(debouncedSearch);
	}, [debouncedSearch]);

	useEffect(() => {
		if (!debouncedMinRecords) return;
		setMinRecords(debouncedMinRecords);
	}, [debouncedMinRecords]);

	useEffect(() => {
		if (!debouncedMaxRecords) return;
		setMaxRecords(debouncedMaxRecords);
	}, [debouncedMaxRecords]);

	useEffect(() => {
		if (!debouncedSortBy) return;
		setSortBy(debouncedSortBy);
	}, [debouncedSortBy]);

	useEffect(() => {
		if (!debouncedLocalselectedCategories) return;
		setSelectedCategories(debouncedLocalselectedCategories);
	}, [debouncedLocalselectedCategories]);

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
			<div className="flex flex-col lg:flex-row gap-4">
				<div className="flex-1">
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

					{activeFiltersCount > 0 && (
						<Button
							variant="ghost"
							onClick={handleClearFilters}
							className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						>
							Clear Filters
							<X className="ml-2 h-4 w-4" />
						</Button>
					)}
				</div>

				<div className="lg:hidden">
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button variant="outline" className="w-full lg:w-auto">
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
												max="500000"
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
												min="0"
												max="500000"
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
							min="0"
							max="500000"
							step="500"
							value={localMinRecords || "0"}
							onChange={(e) => setLocalMinRecords(e.target.value)}
							className="w-full"
						/>
					</div>
					<div className="flex-1">
						<Label className="text-sm text-gray-500">
							Max Records:{" "}
							{Number.parseInt(localMaxRecords || "500000").toLocaleString()}
						</Label>
						<Input
							type="range"
							min="0"
							max="500000"
							step="500"
							value={localMaxRecords || "500000"}
							onChange={(e) => setLocalMaxRecords(e.target.value)}
							className="w-full"
						/>
					</div>
				</div>
			</div>

			{activeFiltersCount > 0 && (
				<div className="flex flex-wrap gap-2 pt-2">
					{localSearch && (
						<Badge variant="secondary" className="gap-1">
							Search: {search}
							<button
								onClick={() => setLocalSearch(null)}
								className="ml-2 hover:text-cyan-900"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{localselectedCategories &&
						localselectedCategories.map((cat) => (
							<Badge key={cat} variant="secondary" className="gap-1">
								Category: {cat}
								<Button
									onClick={() => toggleCategory(cat)}
									className="ml-2 hover:text-cyan-900"
								>
									<X className="h-3 w-3" />
								</Button>
							</Badge>
						))}
					{localMinRecords && (
						<Badge variant="secondary" className="gap-1">
							Min Records: {Number.parseInt(localMinRecords).toLocaleString()}
							<button
								onClick={() => setMinRecords(null)}
								className="ml-2 hover:text-cyan-900"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{localMinRecords && localMaxRecords !== "500000" && (
						<Badge variant="secondary" className="gap-1">
							Max Records: {Number.parseInt(localMaxRecords).toLocaleString()}
							<Button
								onClick={() => setMaxRecords(null)}
								className="ml-2 hover:text-cyan-900"
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					)}
					{localSortBy && localSortBy !== "default" && (
						<Badge variant="secondary" className="gap-1">
							Sort:{" "}
							{sortOptions.find((opt) => opt.value === localSortBy)?.label ||
								localSortBy.replace("_", " ").toUpperCase()}
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
	);
};

export default ProductFilter;
