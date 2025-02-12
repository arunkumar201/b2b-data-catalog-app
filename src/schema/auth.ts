import { z } from "zod";
import { ZemailValidation, ZpasswordValidation } from ".";

const nameSchema = z
	.string()
	.min(2, {
		message: "Name must be at least 2 characters long",
	})
	.regex(/^[a-zA-Z\s]*$/, {
		message: "Name can only contain letters and spaces",
	});

export const loginSchema = z.object({
	email: ZemailValidation,
	password: ZpasswordValidation,
});

export const ZRegisterUser = z
	.object({
		firstName: nameSchema,
		lastName: nameSchema,
		email: ZemailValidation,
		password: ZpasswordValidation,
		confirmPassword: ZpasswordValidation,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type LoginFormData = z.infer<typeof loginSchema>;
export type TRegisterUser = z.infer<typeof ZRegisterUser>;
