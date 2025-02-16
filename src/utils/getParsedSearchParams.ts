import "server-only";
import { parseAsInteger, parseAsString } from "nuqs/server";

const MIN_RECORDS = 0;
const MAX_RECORDS = 50_000;

type SearchParams = {
	q?: string;
	categories?: string[];
	minRecords?: string;
	maxRecords?: string;
	page?: number;
	sort?: string;
};

const VALID_SORT_OPTIONS = ["default", "date_desc", "date_asc"];

export const getParsedSearchParams = (searchParams: Record<string, string>) => {
	const validatedParams: SearchParams = {};

	const search = parseAsString.withDefault("").parseServerSide(searchParams.q);
	if (search) {
		validatedParams.q = search;
	}

	const categoriesParam = searchParams.categories;
	if (categoriesParam) {
		const categories = categoriesParam.split(",").filter(Boolean);
		if (categories.length > 0) {
			validatedParams.categories = categories;
		}
	}

	const minRecords = parseAsString
		.withDefault(MIN_RECORDS.toString())
		.parseServerSide(searchParams.minRecords);
	const minRecordsNum = Number.parseInt(minRecords);
	if (!isNaN(minRecordsNum) && minRecordsNum >= MIN_RECORDS) {
		validatedParams.minRecords = minRecords;
	}
	const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);
	if (page > 0) {
		validatedParams.page = page;
	}

	// Validate maxRecords
	const maxRecords = parseAsString
		.withDefault(MAX_RECORDS.toString())
		.parseServerSide(searchParams.maxRecords);
	const maxRecordsNum = Number.parseInt(maxRecords);
	if (
		!isNaN(maxRecordsNum) &&
		maxRecordsNum <= MAX_RECORDS &&
		maxRecordsNum > minRecordsNum
	) {
		validatedParams.maxRecords = maxRecords;
	}

	const sort = parseAsString
		.withDefault("default")
		.parseServerSide(searchParams.sort);
	if (VALID_SORT_OPTIONS.includes(sort)) {
		validatedParams.sort = sort;
	}

	return {
		parsedParams: validatedParams,
		isValid: Object.keys(validatedParams).length > 0,
		originalParams: searchParams,
	};
};

export type IFilterParesedParams = ReturnType<typeof getParsedSearchParams>;
