import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		AUTH_SECRET: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_WEB_URL: z.string().min(1),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		AUTH_SECRET: process.env.AUTH_SECRET,
		NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
	},
});
