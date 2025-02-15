import { db } from "@/lib/db";
import { ProductList } from "../../data/sample-products";

const seedProducts = async () => {
	try {
		await db.product.createMany({
			data: ProductList,
			skipDuplicates: true,
		});
		console.log("Products seeded successfully");
	} catch (error) {
		console.error("Error seeding products:", error);
	}
};

seedProducts().catch((error) => {
	console.error(error);
	process.exit(1);
});
